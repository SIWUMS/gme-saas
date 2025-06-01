#!/bin/bash

# ======================================================
# Sistema de Refeições Escolares - Instalador CORRIGIDO
# Para Ubuntu 22.04/24.04 LTS
# Domínio: gestor.emmvmfc.com.br
# ======================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Funções de log
log() {
  echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1" | tee -a /tmp/emmvmfc-install.log
}

warn() {
  echo -e "${YELLOW}[$(date '+%H:%M:%S')] WARN:${NC} $1" | tee -a /tmp/emmvmfc-install.log
}

error() {
  echo -e "${RED}[$(date '+%H:%M:%S')] ERROR:${NC} $1" | tee -a /tmp/emmvmfc-install.log
  exit 1
}

header() {
  echo -e "\n${BLUE}==== $1 ====${NC}\n" | tee -a /tmp/emmvmfc-install.log
}

# Detectar se é root CORRETAMENTE
if [[ $EUID -eq 0 ]]; then
  RUNNING_AS_ROOT=true
  SUDO_CMD=""
  log "✅ Executando como ROOT"
else
  RUNNING_AS_ROOT=false
  SUDO_CMD="sudo"
  log "✅ Executando com sudo"
fi

# Banner
echo -e "${CYAN}"
echo "  ____  _     _                          _        ____        __      _      _                "
echo " / ___|(_)___| |_ ___ _ __ ___   __ _   | |      / ___|  ___ / _| ___(_) ___(_) ___  ___ ___ "
echo " \___ \| / __| __/ _ \ '_ \` _ \ / _\` |  | |     | |  _  / _ \ |_ / __| |/ __| |/ _ \/ __/ __|"
echo "  ___) | \__ \ ||  __/ | | | | | (_| |  | |___  | |_| ||  __/  _| (__| | (__| |  __/\__ \__ \\"
echo " |____/|_|___/\__\___|_| |_| |_|\__,_|  |_____|  \____| \___|_|  \___|_|\___|_|\___||___/___/"
echo -e "${NC}"
echo -e "${YELLOW}Instalador CORRIGIDO - gestor.emmvmfc.com.br${NC}\n"

# Configurações
DOMAIN_NAME="gestor.emmvmfc.com.br"
APP_DIR="/var/www/sistema-refeicoes"
DB_NAME="sistema_refeicoes_emmvmfc"
DB_USER="emmvmfc_user"
NODE_VERSION="20"
POSTGRES_VERSION="16"

header "Configuração EMMVMFC"
echo -e "${CYAN}Domínio: ${YELLOW}$DOMAIN_NAME${NC}"
read -p "Email do administrador: " ADMIN_EMAIL
read -p "PostgreSQL local ou Neon? [local/neon]: " DB_CHOICE

if [[ "$DB_CHOICE" == "neon" ]]; then
  read -p "URL do Neon: " NEON_URL
  DB_CONNECTION_STRING="$NEON_URL"
  USE_NEON=true
else
  DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 24 | head -n 1)
  DB_CONNECTION_STRING="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
  USE_NEON=false
fi

log "✅ Configuração: Email=$ADMIN_EMAIL, DB=$DB_CHOICE"

header "Atualizando Sistema"
export DEBIAN_FRONTEND=noninteractive
$SUDO_CMD apt update
$SUDO_CMD apt upgrade -y -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold'

header "Instalando Dependências Básicas"
$SUDO_CMD apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release build-essential

header "Instalando Node.js $NODE_VERSION"
if ! command -v node &> /dev/null; then
  log "📦 Adicionando repositório Node.js..."
  
  # CORREÇÃO: Comando correto para instalar Node.js
  if [[ $RUNNING_AS_ROOT == true ]]; then
    curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash -
  else
    curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo -E bash -
  fi
  
  log "📦 Instalando Node.js..."
  $SUDO_CMD apt install -y nodejs
  
  log "📦 Instalando Yarn e PM2..."
  $SUDO_CMD npm install -g yarn pm2
else
  log "✅ Node.js já instalado: $(node --version)"
fi

if [[ "$USE_NEON" == false ]]; then
  header "Instalando PostgreSQL $POSTGRES_VERSION"
  
  if ! command -v psql &> /dev/null; then
    log "📦 Instalando PostgreSQL..."
    $SUDO_CMD apt install -y postgresql postgresql-contrib
    
    log "🔧 Configurando PostgreSQL..."
    $SUDO_CMD systemctl start postgresql
    $SUDO_CMD systemctl enable postgresql
    
    log "🗄️ Criando banco de dados..."
    $SUDO_CMD -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
\q
EOF
    log "✅ Banco criado: $DB_NAME"
  else
    log "✅ PostgreSQL já instalado"
  fi
else
  log "✅ Usando Neon - pulando instalação PostgreSQL local"
fi

header "Instalando Nginx"
if ! command -v nginx &> /dev/null; then
  $SUDO_CMD apt install -y nginx
else
  log "✅ Nginx já instalado"
fi

header "Configurando Firewall"
$SUDO_CMD ufw allow OpenSSH
$SUDO_CMD ufw allow 'Nginx Full'
$SUDO_CMD ufw --force enable

header "Instalando Aplicação"
if [ ! -d "$APP_DIR" ]; then
  log "📁 Criando diretório da aplicação..."
  $SUDO_CMD mkdir -p "$APP_DIR"
  
  log "📥 Clonando repositório..."
  git clone https://github.com/SIWUMS/gme-saas.git /tmp/sistema-temp
  $SUDO_CMD cp -r /tmp/sistema-temp/* "$APP_DIR/"
  rm -rf /tmp/sistema-temp
else
  log "✅ Diretório da aplicação já existe"
fi

cd "$APP_DIR"

# Configurar permissões
if [[ $RUNNING_AS_ROOT == true ]]; then
  chown -R root:root "$APP_DIR"
else
  $SUDO_CMD chown -R $USER:$USER "$APP_DIR"
fi

header "Instalando Dependências da Aplicação"
if [ ! -d "node_modules" ]; then
  log "📦 Instalando dependências com yarn..."
  yarn install
else
  log "✅ Dependências já instaladas"
fi

header "Configurando Variáveis de Ambiente"
if [ ! -f ".env" ]; then
  log "⚙️ Criando arquivo .env..."
  cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL="$DB_CONNECTION_STRING"
DATABASE_SSL=$([ "$USE_NEON" == true ] && echo "true" || echo "false")
NEXTAUTH_SECRET="$(openssl rand -base64 64)"
NEXTAUTH_URL="https://$DOMAIN_NAME"
UPLOAD_DIR="$APP_DIR/uploads"
APP_NAME="Sistema de Refeições Escolares - EMMVMFC"
APP_URL="https://$DOMAIN_NAME"
TIMEZONE="America/Sao_Paulo"
LOCALE="pt-BR"
CURRENCY="BRL"
ORGANIZATION_NAME="EMMVMFC"
EOF
else
  log "✅ Arquivo .env já existe"
fi

mkdir -p uploads
chmod 755 uploads

header "Compilando Aplicação"
if [ ! -d ".next" ]; then
  log "🔨 Fazendo build da aplicação..."
  yarn build
else
  log "✅ Build já existe"
fi

header "Configurando PM2"
# Criar configuração PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sistema-emmvmfc',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Parar PM2 se estiver rodando
pm2 delete sistema-emmvmfc 2>/dev/null || true

log "🚀 Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

header "Configurando Nginx"
$SUDO_CMD tee /etc/nginx/sites-available/emmvmfc << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    client_max_body_size 50M;
    server_tokens off;
}
EOF

$SUDO_CMD ln -sf /etc/nginx/sites-available/emmvmfc /etc/nginx/sites-enabled/
$SUDO_CMD rm -f /etc/nginx/sites-enabled/default

$SUDO_CMD nginx -t
$SUDO_CMD systemctl reload nginx

header "Configurando SSL"
if ! command -v certbot &> /dev/null; then
  $SUDO_CMD apt install -y certbot python3-certbot-nginx
fi

log "🔒 Obtendo certificado SSL..."
$SUDO_CMD certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos -m $ADMIN_EMAIL --redirect

# Finalização
header "🎉 INSTALAÇÃO CONCLUÍDA!"

echo -e "\n${GREEN}🎉 SISTEMA EMMVMFC INSTALADO COM SUCESSO!${NC}"
echo -e "${CYAN}Informações de Acesso:${NC}"
echo -e "- URL: ${YELLOW}https://$DOMAIN_NAME${NC}"
echo -e "- Admin: ${YELLOW}admin@emmvmfc.com.br${NC}"
echo -e "- Senha: ${YELLOW}admin123${NC}"

if [[ "$USE_NEON" == false ]]; then
  echo -e "\n${CYAN}Banco de Dados Local:${NC}"
  echo -e "- Banco: ${YELLOW}$DB_NAME${NC}"
  echo -e "- Usuário: ${YELLOW}$DB_USER${NC}"
  echo -e "- Senha: ${YELLOW}$DB_PASSWORD${NC}"
fi

echo -e "\n${CYAN}Comandos Úteis:${NC}"
echo -e "- ${YELLOW}pm2 status${NC} - Status da aplicação"
echo -e "- ${YELLOW}pm2 logs sistema-emmvmfc${NC} - Ver logs"
echo -e "- ${YELLOW}pm2 restart sistema-emmvmfc${NC} - Reiniciar"

# Salvar informações
cat > "$APP_DIR/EMMVMFC_INFO.txt" << EOF
=== SISTEMA EMMVMFC ===
Instalado em: $(date)
URL: https://$DOMAIN_NAME
Admin: admin@emmvmfc.com.br
Senha: admin123

$([ "$USE_NEON" == false ] && echo "Banco: $DB_NAME
Usuário: $DB_USER  
Senha: $DB_PASSWORD")

Log da instalação: /tmp/emmvmfc-install.log
EOF

log "✅ Instalação finalizada! Acesse: https://$DOMAIN_NAME"
log "📋 Informações salvas em: $APP_DIR/EMMVMFC_INFO.txt"
log "📝 Log completo em: /tmp/emmvmfc-install.log"
