#!/bin/bash

# ======================================================
# Sistema de Refeições Escolares - Script de Instalação
# VERSÃO PARA EXECUÇÃO COMO ROOT
# Para Ubuntu 22.04/24.04 LTS
# Domínio: gestor.emmvmfc.com.br
# ======================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Funções de log
log() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

header() {
  echo -e "\n${BLUE}==== $1 ====${NC}\n"
}

# Banner de boas-vindas
echo -e "${CYAN}"
echo "  ____  _     _                          _        ____        __      _      _                "
echo " / ___|(_)___| |_ ___ _ __ ___   __ _   | |      / ___|  ___ / _| ___(_) ___(_) ___  ___ ___ "
echo " \___ \| / __| __/ _ \ '_ \` _ \ / _\` |  | |     | |  _  / _ \ |_ / __| |/ __| |/ _ \/ __/ __|"
echo "  ___) | \__ \ ||  __/ | | | | | (_| |  | |___  | |_| ||  __/  _| (__| | (__| |  __/\__ \__ \\"
echo " |____/|_|___/\__\___|_| |_| |_|\__,_|  |_____|  \____| \___|_|  \___|_|\___|_|\___||___/___/"
echo -e "${NC}"
echo -e "${MAGENTA}Instalador ROOT - v1.0.0${NC}"
echo -e "${YELLOW}Domínio: gestor.emmvmfc.com.br${NC}"
echo -e "${YELLOW}Para VPS Ubuntu 22.04/24.04 LTS${NC}\n"

# Verificar se é root e configurar usuário dedicado
if [[ $EUID -eq 0 ]]; then
  warn "⚠️  Executando como root - configurando segurança..."
  
  # Criar usuário dedicado para EMMVMFC
  SYSTEM_USER="emmvmfc-system"
  
  # Verificar se usuário já existe
  if ! id "$SYSTEM_USER" &>/dev/null; then
    log "Criando usuário dedicado: $SYSTEM_USER"
    useradd -m -s /bin/bash -G sudo "$SYSTEM_USER"
    echo "$SYSTEM_USER:emmvmfc2024!" | chpasswd
    log "✅ Usuário $SYSTEM_USER criado com sucesso"
  else
    log "✅ Usuário $SYSTEM_USER já existe"
  fi
  
  # Configurar sudoers para não pedir senha
  echo "$SYSTEM_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$SYSTEM_USER
  chmod 440 /etc/sudoers.d/$SYSTEM_USER
  
  RUNNING_AS_ROOT=true
  log "✅ Usuário dedicado configurado para segurança"
else
  RUNNING_AS_ROOT=false
  SYSTEM_USER=$USER
  log "✅ Executando com usuário não-root: $USER"
fi

# Verificar sistema operacional
if [[ "$(lsb_release -is)" != "Ubuntu" ]]; then
  warn "Este script foi projetado para Ubuntu. Outras distribuições podem não funcionar corretamente."
fi

# Verificar versão do Ubuntu
ubuntu_version=$(lsb_release -rs)
if [[ "$ubuntu_version" != "24.04" && "$ubuntu_version" != "22.04" ]]; then
  warn "Este script foi testado no Ubuntu 22.04 e 24.04. Você está usando $ubuntu_version, podem ocorrer problemas."
else
  log "✅ Ubuntu $ubuntu_version detectado - versão suportada"
fi

# Verificar recursos do sistema
cpu_cores=$(nproc)
total_ram=$(free -m | awk '/^Mem:/{print $2}')
free_disk=$(df -h / | awk 'NR==2 {print $4}')

log "Recursos do sistema:"
log "- Ubuntu: $ubuntu_version LTS"
log "- CPU: $cpu_cores cores"
log "- RAM: $total_ram MB"
log "- Espaço livre em disco: $free_disk"
log "- Usuário do sistema: $SYSTEM_USER"

if [[ $cpu_cores -lt 2 ]]; then
  warn "Recomendado pelo menos 2 cores de CPU para melhor desempenho."
fi

if [[ $total_ram -lt 4096 ]]; then
  warn "Recomendado pelo menos 4GB de RAM para melhor desempenho."
fi

# Configurações fixas para o domínio específico
REPO_URL="https://github.com/SIWUMS/gme-saas.git"
APP_DIR="/var/www/sistema-refeicoes"
DB_NAME="sistema_refeicoes_emmvmfc"
DB_USER="emmvmfc_user"
DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 24 | head -n 1)
ADMIN_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 12 | head -n 1)
DOMAIN_NAME="gestor.emmvmfc.com.br"
NODE_VERSION="20"
POSTGRES_VERSION="16"

# Perguntar informações ao usuário
header "Configuração para EMMVMFC"

echo -e "${CYAN}Domínio configurado: ${YELLOW}$DOMAIN_NAME${NC}"
read -p "Digite o email do administrador (para certificados SSL e notificações): " ADMIN_EMAIL

# Validar email
if [[ ! "$ADMIN_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
  error "Email inválido. Por favor, digite um email válido."
fi

read -p "Deseja usar PostgreSQL local ou Neon? [local/neon]: " DB_CHOICE

if [[ "$DB_CHOICE" == "neon" ]]; then
  read -p "Digite a URL de conexão do Neon: " NEON_URL
  DB_CONNECTION_STRING="$NEON_URL"
  USE_NEON=true
else
  DB_CONNECTION_STRING="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"
  USE_NEON=false
fi

# Verificar se o domínio está apontando para este servidor
header "Verificando DNS"
log "Verificando se o domínio $DOMAIN_NAME está apontando para este servidor..."

SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN_NAME | tail -n1)

if [[ "$SERVER_IP" == "$DOMAIN_IP" ]]; then
  log "✅ DNS configurado corretamente: $DOMAIN_NAME -> $SERVER_IP"
else
  warn "⚠️  DNS pode não estar configurado corretamente:"
  warn "   Servidor: $SERVER_IP"
  warn "   Domínio:  $DOMAIN_IP"
  warn "   Certifique-se de que o domínio está apontando para este servidor."
  
  read -p "Continuar mesmo assim? [s/N]: " CONTINUE_DNS
  if [[ "$CONTINUE_DNS" != "s" && "$CONTINUE_DNS" != "S" ]]; then
    error "Configure o DNS antes de continuar a instalação."
  fi
fi

# Confirmar instalação
echo -e "\n${YELLOW}Resumo da instalação para EMMVMFC:${NC}"
echo -e "- Domínio: ${CYAN}$DOMAIN_NAME${NC}"
echo -e "- Email Admin: ${CYAN}$ADMIN_EMAIL${NC}"
echo -e "- Usuário do sistema: ${CYAN}$SYSTEM_USER${NC}"
echo -e "- Diretório de instalação: ${CYAN}$APP_DIR${NC}"
echo -e "- Banco de dados: ${CYAN}$([ "$USE_NEON" == true ] && echo "Neon (externo)" || echo "PostgreSQL (local)")${NC}"
echo -e "- Node.js: ${CYAN}v$NODE_VERSION${NC}"
echo -e "- PostgreSQL: ${CYAN}$([ "$USE_NEON" == true ] && echo "N/A (usando Neon)" || echo "v$POSTGRES_VERSION")${NC}"
echo -e "- IP do servidor: ${CYAN}$SERVER_IP${NC}"

read -p "Continuar com a instalação? [s/N]: " CONFIRM
if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
  error "Instalação cancelada pelo usuário."
fi

# Atualizar sistema
header "Atualizando Sistema"
log "Atualizando lista de pacotes..."
apt update
log "Atualizando pacotes instalados..."
apt upgrade -y

# Instalar dependências básicas
header "Instalando Dependências Básicas"
log "Instalando pacotes essenciais..."
apt install -y curl wget git unzip software-properties-common apt-transport-https \
  ca-certificates gnupg lsb-release build-essential libssl-dev zlib1g-dev \
  libbz2-dev libreadline-dev libsqlite3-dev libncursesw5-dev xz-utils \
  tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev \
  python3-pip python3-venv fail2ban ufw dnsutils

# Instalar Node.js
header "Instalando Node.js $NODE_VERSION"
log "Adicionando repositório Node.js..."
curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash -
log "Instalando Node.js..."
apt install -y nodejs
log "Instalando yarn..."
npm install -g yarn

# Verificar versões
node_version=$(node --version)
npm_version=$(npm --version)
yarn_version=$(yarn --version)
log "Node.js instalado: $node_version"
log "NPM instalado: $npm_version"
log "Yarn instalado: $yarn_version"

# Instalar PM2
log "Instalando PM2..."
npm install -g pm2

# Instalar PostgreSQL (se não estiver usando Neon)
if [[ "$USE_NEON" == false ]]; then
  header "Instalando PostgreSQL $POSTGRES_VERSION"
  log "Adicionando repositório PostgreSQL..."
  
  # Detectar versão do Ubuntu para configuração correta
  if [[ "$ubuntu_version" == "22.04" ]]; then
    sh -c "echo 'deb https://apt.postgresql.org/pub/repos/apt jammy-pgdg main' > /etc/apt/sources.list.d/pgdg.list"
  else
    sh -c "echo 'deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main' > /etc/apt/sources.list.d/pgdg.list"
  fi
  
  wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
  apt update
  log "Instalando PostgreSQL..."
  apt install -y postgresql-$POSTGRES_VERSION postgresql-client-$POSTGRES_VERSION postgresql-contrib-$POSTGRES_VERSION

  # Configurar PostgreSQL
  log "Configurando PostgreSQL..."
  systemctl start postgresql
  systemctl enable postgresql

  # Configurar PostgreSQL para aceitar conexões
  -u postgres psql -c "ALTER SYSTEM SET listen_addresses = 'localhost';"
  systemctl restart postgresql

  # Criar banco de dados
  log "Criando banco de dados e usuário..."
  -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
\q
EOF

  log "Banco de dados criado: $DB_NAME"
  log "Usuário criado: $DB_USER"
fi

# Instalar Nginx
header "Instalando e Configurando Nginx"
log "Instalando Nginx..."
apt install -y nginx

# Configurar firewall
log "Configurando firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Criar diretório da aplicação
log "Criando diretório da aplicação: $APP_DIR"
mkdir -p $APP_DIR

if [[ "$RUNNING_AS_ROOT" == true ]]; then
  chown -R $SYSTEM_USER:$SYSTEM_USER $APP_DIR
  log "✅ Permissões configuradas para usuário $SYSTEM_USER"
fi

# Clonar repositório
header "Clonando Repositório"
log "Clonando repositório de $REPO_URL..."

if [[ "$RUNNING_AS_ROOT" == true ]]; then
  -u $SYSTEM_USER git clone $REPO_URL $APP_DIR
else
  git clone $REPO_URL $APP_DIR
fi

# Instalar dependências
header "Instalando Dependências do Projeto"
log "Instalando dependências com yarn..."

if [[ "$RUNNING_AS_ROOT" == true ]]; then
  # Executar como usuário dedicado
  -u $SYSTEM_USER bash -c "cd $APP_DIR && yarn install"
else
  cd $APP_DIR && yarn install
fi

# Criar arquivo de ambiente
header "Configurando Variáveis de Ambiente"
log "Criando arquivo .env..."
cat > $APP_DIR/.env << EOF
# Ambiente
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL="$DB_CONNECTION_STRING"
DATABASE_SSL=$([ "$USE_NEON" == true ] && echo "true" || echo "false")

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 64)"
NEXTAUTH_URL="https://$DOMAIN_NAME"

# Upload
UPLOAD_DIR="$APP_DIR/uploads"

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@emmvmfc.com.br"

# Backup
BACKUP_DIR="/opt/backups/sistema-refeicoes"
BACKUP_ENABLED=true
BACKUP_FREQUENCY="daily"
BACKUP_TIME="02:00"
BACKUP_RETENTION_DAYS=30

# Tema EMMVMFC
THEME_PRIMARY_COLOR="#2563eb"
THEME_SECONDARY_COLOR="#eab308"
THEME_ACCENT_COLOR="#f8fafc"

# Sistema EMMVMFC
APP_NAME="Sistema de Refeições Escolares - EMMVMFC"
APP_URL="https://$DOMAIN_NAME"
TIMEZONE="America/Sao_Paulo"
LOCALE="pt-BR"
CURRENCY="BRL"
ORGANIZATION_NAME="EMMVMFC"
ORGANIZATION_FULL_NAME="Escola Municipal Manoel Vieira de Melo Filho Canguaretama"

# Features
FEATURE_MULTI_TENANT=true
FEATURE_PNAE_MODULE=true
FEATURE_COST_MODULE=true
FEATURE_REPORT_MODULE=true
FEATURE_MOBILE_APP=false

# Integrações
TACO_API_KEY=""
WHATSAPP_API_KEY=""
SMS_API_KEY=""
GOOGLE_ANALYTICS_ID=""
SMS_FROM_NUMBER=""
GOOGLE_ANALYTICS_VIEW_ID=""

# Segurança
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
SESSION_TIMEOUT=3600000
EOF

# Ajustar permissões do .env
if [[ "$RUNNING_AS_ROOT" == true ]]; then
  chown $SYSTEM_USER:$SYSTEM_USER $APP_DIR/.env
  chmod 600 $APP_DIR/.env
fi

# Criar diretório de uploads
log "Criando diretório de uploads..."
mkdir -p $APP_DIR/uploads
chmod 755 $APP_DIR/uploads

if [[ "$RUNNING_AS_ROOT" == true ]]; then
  chown -R $SYSTEM_USER:$SYSTEM_USER $APP_DIR/uploads
fi

# Build da aplicação
header "Compilando Aplicação"
log "Fazendo build da aplicação..."

if [[ "$RUNNING_AS_ROOT" == true ]]; then
  -u $SYSTEM_USER bash -c "cd $APP_DIR && yarn build"
else
  cd $APP_DIR && yarn build
fi

# Configurar PM2
header "Configurando PM2"
log "Criando configuração do PM2..."
cat > $APP_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sistema-refeicoes-emmvmfc',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '$APP_DIR/logs/err.log',
    out_file: '$APP_DIR/logs/out.log',
    log_file: '$APP_DIR/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    wait_ready: true,
    kill_timeout: 5000,
    listen_timeout: 10000,
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Criar diretório de logs
mkdir -p $APP_DIR/logs

if [[ "$RUNNING_AS_ROOT" == true ]]; then
  chown -R $SYSTEM_USER:$SYSTEM_USER $APP_DIR/logs
fi

# Configurar Nginx
header "Configurando Nginx"
log "Criando configuração do Nginx para $DOMAIN_NAME..."
tee /etc/nginx/sites-available/sistema-refeicoes-emmvmfc << EOF
# Configuração Nginx para Sistema de Refeições Escolares - EMMVMFC
# Domínio: $DOMAIN_NAME

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
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
    }

    location /uploads {
        alias $APP_DIR/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Configurações de segurança
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    
    # Limitar tamanho de upload
    client_max_body_size 50M;
    
    # Desativar exibição da versão do Nginx
    server_tokens off;

    access_log /var/log/nginx/emmvmfc-sistema-access.log;
    error_log /var/log/nginx/emmvmfc-sistema-error.log;
}
EOF

# Ativar site
log "Ativando site no Nginx..."
ln -sf /etc/nginx/sites-available/sistema-refeicoes-emmvmfc /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Iniciar aplicação com PM2
header "Iniciando Aplicação"
log "Iniciando aplicação com PM2..."

if [[ "$RUNNING_AS_ROOT" == true ]]; then
  # Configurar PM2 para usuário dedicado
  -u $SYSTEM_USER bash -c "cd $APP_DIR && pm2 start ecosystem.config.js"
  -u $SYSTEM_USER bash -c "pm2 save"
  
  # Configurar PM2 para iniciar no boot
  env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $SYSTEM_USER --hp /home/$SYSTEM_USER
else
  cd $APP_DIR
  pm2 start ecosystem.config.js
  pm2 save
  pm2 startup | tail -n 1 | bash
fi

# Aguardar aplicação inicializar
log "Aguardando aplicação inicializar..."
sleep 15

# Verificar se a aplicação está rodando
if curl -f http://localhost:3000 > /dev/null 2>&1; then
  log "✅ Aplicação está rodando na porta 3000"
else
  warn "⚠️  Aplicação pode não estar rodando corretamente"
  log "Verificando logs do PM2..."
  if [[ "$RUNNING_AS_ROOT" == true ]]; then
    -u $SYSTEM_USER bash -c "pm2 logs sistema-refeicoes-emmvmfc --lines 20"
  else
    pm2 logs sistema-refeicoes-emmvmfc --lines 20
  fi
fi

# Configurar SSL com Certbot
header "Configurando SSL com Let's Encrypt"
log "Instalando Certbot..."
apt install -y certbot python3-certbot-nginx

log "Obtendo certificado SSL para $DOMAIN_NAME..."
certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos -m $ADMIN_EMAIL --redirect

# Verificar se o certificado foi obtido com sucesso
if certbot certificates | grep -q $DOMAIN_NAME; then
  log "✅ Certificado SSL configurado com sucesso"
else
  warn "⚠️  Problema na configuração do SSL. Verifique se o domínio está apontando corretamente."
fi

# Configurar renovação automática do certificado
log "Configurando renovação automática do certificado..."
echo "0 3 * * * root certbot renew --quiet" >> /etc/crontab

# Configurar backup automático
header "Configurando Backup Automático"
log "Configurando backup automático..."
mkdir -p /opt/backups/sistema-refeicoes

cat > /opt/backups/sistema-refeicoes/backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/opt/backups/sistema-refeicoes"
DATE=\$(date +%Y%m%d_%H%M%S)
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"
DB_PASSWORD="$DB_PASSWORD"
APP_DIR="$APP_DIR"
LOG_FILE="/var/log/emmvmfc-backup.log"
SYSTEM_USER="$SYSTEM_USER"

# Função para log
log() {
  echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1" | tee -a \$LOG_FILE
}

# Criar diretório se não existir
mkdir -p \$BACKUP_DIR

log "Iniciando backup do Sistema EMMVMFC"

# Backup do banco
if [[ "$USE_NEON" == true ]]; then
  log "Usando Neon - backup gerenciado pela plataforma"
else
  log "Fazendo backup do PostgreSQL local..."
  PGPASSWORD="\$DB_PASSWORD" pg_dump -U \$DB_USER -h localhost \$DB_NAME | gzip > \$BACKUP_DIR/db_emmvmfc_\$DATE.sql.gz
  if [ \$? -eq 0 ]; then
    log "Backup do banco concluído com sucesso"
  else
    log "ERRO: Falha no backup do banco"
  fi
fi

# Backup dos uploads
log "Fazendo backup dos uploads..."
if [ -d "\$APP_DIR/uploads" ]; then
  tar -czf \$BACKUP_DIR/uploads_emmvmfc_\$DATE.tar.gz -C \$APP_DIR uploads/
  if [ \$? -eq 0 ]; then
    log "Backup dos uploads concluído"
  else
    log "ERRO: Falha no backup dos uploads"
  fi
fi

# Backup das configurações
log "Fazendo backup das configurações..."
cp \$APP_DIR/.env \$BACKUP_DIR/env_emmvmfc_\$DATE.backup

# Backup do PM2
if [[ "$RUNNING_AS_ROOT" == true ]]; then
  -u \$SYSTEM_USER bash -c "pm2 save"
  cp -f /home/\$SYSTEM_USER/.pm2/dump.pm2 \$BACKUP_DIR/pm2_emmvmfc_\$DATE.dump 2>/dev/null || true
else
  pm2 save
  cp -f \$HOME/.pm2/dump.pm2 \$BACKUP_DIR/pm2_emmvmfc_\$DATE.dump 2>/dev/null || true
fi

# Manter apenas os últimos 7 backups
log "Limpando backups antigos..."
find \$BACKUP_DIR -name "*emmvmfc*.gz" -mtime +7 -delete
find \$BACKUP_DIR -name "*emmvmfc*.tar.gz" -mtime +7 -delete
find \$BACKUP_DIR -name "*emmvmfc*.backup" -mtime +7 -delete
find \$BACKUP_DIR -name "*emmvmfc*.dump" -mtime +7 -delete

log "Backup EMMVMFC concluído em \$(date)"
EOF

chmod +x /opt/backups/sistema-refeicoes/backup.sh

# Adicionar ao crontab
log "Configurando cron para backups diários..."
echo "0 2 * * * root /opt/backups/sistema-refeicoes/backup.sh" >> /etc/crontab

# Criar scripts de manutenção
header "Criando Scripts de Manutenção"

# Script de atualização
cat > $APP_DIR/update.sh << 'EOF'
#!/bin/bash
set -e

echo "🔄 Atualizando Sistema de Refeições Escolares - EMMVMFC..."

# Detectar se está rodando como root
if [[ $EUID -eq 0 ]]; then
  SYSTEM_USER="emmvmfc-system"
  RUNNING_AS_ROOT=true
else
  SYSTEM_USER=$USER
  RUNNING_AS_ROOT=false
fi

# Diretório da aplicação
APP_DIR=$(dirname "$(readlink -f "$0")")
cd $APP_DIR

# Backup antes da atualização
/opt/backups/sistema-refeicoes/backup.sh

# Obter alterações do repositório
echo "Obtendo atualizações do repositório..."
if [[ "$RUNNING_AS_ROOT" == true ]]; then
  -u $SYSTEM_USER bash -c "cd $APP_DIR && git pull"
else
  git pull
fi

# Atualizar dependências
echo "Atualizando dependências..."
if [[ "$RUNNING_AS_ROOT" == true ]]; then
  -u $SYSTEM_USER bash -c "cd $APP_DIR && yarn install"
else
  yarn install
fi

# Build
echo "Compilando aplicação..."
if [[ "$RUNNING_AS_ROOT" == true ]]; then
  -u $SYSTEM_USER bash -c "cd $APP_DIR && yarn build"
else
  yarn build
fi

# Reiniciar aplicação
echo "Reiniciando aplicação..."
if [[ "$RUNNING_AS_ROOT" == true ]]; then
  -u $SYSTEM_USER bash -c "pm2 restart sistema-refeicoes-emmvmfc"
else
  pm2 restart sistema-refeicoes-emmvmfc
fi

echo "✅ Atualização EMMVMFC concluída!"
EOF

chmod +x $APP_DIR/update.sh

# Script de manutenção
cat > $APP_DIR/maintenance.sh << 'EOF'
#!/bin/bash
set -e

echo "🔧 Manutenção do Sistema de Refeições Escolares - EMMVMFC"

# Detectar se está rodando como root
if [[ $EUID -eq 0 ]]; then
  SYSTEM_USER="emmvmfc-system"
  RUNNING_AS_ROOT=true
else
  SYSTEM_USER=$USER
  RUNNING_AS_ROOT=false
fi

# Diretório da aplicação
APP_DIR=$(dirname "$(readlink -f "$0")")
cd $APP_DIR

# Verificar espaço em disco
echo "Verificando espaço em disco..."
df -h /

# Verificar logs recentes
echo "Verificando logs recentes..."
echo "=== Logs de erro ==="
tail -n 20 $APP_DIR/logs/err.log 2>/dev/null || echo "Nenhum log de erro encontrado"
echo "=== Logs do Nginx ==="
tail -n 20 /var/log/nginx/emmvmfc-sistema-error.log 2>/dev/null || echo "Nenhum log do Nginx encontrado"

# Verificar status do serviço
echo "Verificando status do serviço..."
if [[ "$RUNNING_AS_ROOT" == true ]]; then
  -u $SYSTEM_USER bash -c "pm2 status sistema-refeicoes-emmvmfc"
else
  pm2 status sistema-refeicoes-emmvmfc
fi

# Verificar certificados SSL
echo "Verificando certificados SSL..."
certbot certificates

# Verificar status do Nginx
echo "Verificando status do Nginx..."
nginx -t
systemctl status nginx --no-pager

# Verificar fail2ban
echo "Verificando fail2ban..."
fail2ban-client status

echo "✅ Manutenção EMMVMFC concluída!"
EOF

chmod +x $APP_DIR/maintenance.sh

# Ajustar permissões finais
if [[ "$RUNNING_AS_ROOT" == true ]]; then
  chown -R $SYSTEM_USER:$SYSTEM_USER $APP_DIR
  log "✅ Permissões finais ajustadas para $SYSTEM_USER"
fi

# Configurar monitoramento e segurança
header "Configurando Monitoramento e Segurança"
log "Instalando ferramentas de monitoramento..."
apt install -y htop iotop nload

# Configurar fail2ban
log "Configurando fail2ban..."
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Configuração específica para Nginx
tee /etc/fail2ban/jail.d/nginx-emmvmfc.conf << EOF
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/emmvmfc-sistema-error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/emmvmfc-sistema-access.log

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/emmvmfc-sistema-access.log

[nginx-noproxy]
enabled = true
port = http,https
logpath = /var/log/nginx/emmvmfc-sistema-access.log
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# Configurar logrotate
log "Configurando logrotate..."
tee /etc/logrotate.d/sistema-refeicoes-emmvmfc << EOF
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 $SYSTEM_USER $SYSTEM_USER
    sharedscripts
    postrotate
        if [[ "$RUNNING_AS_ROOT" == true ]]; then
            -u $SYSTEM_USER bash -c "pm2 reloadLogs"
        else
            pm2 reloadLogs
        fi
    endscript
}

/var/log/nginx/emmvmfc-sistema-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
EOF

# Criar arquivo de informações do sistema
cat > $APP_DIR/EMMVMFC_INFO.txt << EOF
=================================================
SISTEMA DE REFEIÇÕES ESCOLARES - EMMVMFC
INSTALAÇÃO COMO ROOT
=================================================

Instalação concluída em: $(date)
Domínio: $DOMAIN_NAME
Servidor: $SERVER_IP

INFORMAÇÕES DE ACESSO:
- URL: https://$DOMAIN_NAME
- Admin: admin@emmvmfc.com.br
- Senha: admin123 (ALTERE APÓS PRIMEIRO ACESSO)

USUÁRIO DO SISTEMA:
- Usuário: $SYSTEM_USER
- Senha: emmvmfc2024!
- Home: /home/$SYSTEM_USER

BANCO DE DADOS:
$([ "$USE_NEON" == true ] && echo "- Tipo: Neon (PostgreSQL Serverless)" || echo "- Tipo: PostgreSQL Local")
$([ "$USE_NEON" == false ] && echo "- Nome: $DB_NAME" || echo "")
$([ "$USE_NEON" == false ] && echo "- Usuário: $DB_USER" || echo "")
$([ "$USE_NEON" == false ] && echo "- Senha: $DB_PASSWORD" || echo "")

COMANDOS ÚTEIS (COMO ROOT):
- cd $APP_DIR
- -u $SYSTEM_USER bash -c "pm2 status"
- -u $SYSTEM_USER bash -c "pm2 logs sistema-refeicoes-emmvmfc"
- ./update.sh
- ./maintenance.sh

COMANDOS ÚTEIS (COMO USUÁRIO):
- su - $SYSTEM_USER
- pm2 status
- pm2 logs sistema-refeicoes-emmvmfc

BACKUPS:
- Diretório: /opt/backups/sistema-refeicoes/
- Frequência: Diário às 02:00
- Retenção: 7 dias

LOGS:
- Aplicação: $APP_DIR/logs/
- Nginx: /var/log/nginx/emmvmfc-sistema-*.log
- Backup: /var/log/emmvmfc-backup.log

SEGURANÇA:
- SSL: Let's Encrypt
- Firewall: UFW ativo
- Fail2ban: Configurado
- Renovação SSL: Automática
- Usuário dedicado: $SYSTEM_USER

=================================================
EOF

# Salvar informações importantes
echo "Senha do banco: $DB_PASSWORD" >> $APP_DIR/EMMVMFC_INFO.txt
echo "Senha admin gerada: admin123" >> $APP_DIR/EMMVMFC_INFO.txt
echo "Senha do usuário sistema: emmvmfc2024!" >> $APP_DIR/EMMVMFC_INFO.txt
echo "NextAuth Secret: $(grep NEXTAUTH_SECRET $APP_DIR/.env)" >> $APP_DIR/EMMVMFC_INFO.txt

# Verificação final
header "Verificação Final"
log "Executando verificações finais..."

# Verificar se o site está acessível
if curl -f -k https://$DOMAIN_NAME > /dev/null 2>&1; then
  log "✅ Site acessível via HTTPS"
elif curl -f http://$DOMAIN_NAME > /dev/null 2>&1; then
  log "✅ Site acessível via HTTP"
  warn "⚠️  HTTPS pode não estar funcionando ainda"
else
  warn "⚠️  Site pode não estar acessível externamente"
fi

# Verificar PM2
if [[ "$RUNNING_AS_ROOT" == true ]]; then
  if -u $SYSTEM_USER bash -c "pm2 list" | grep -q "sistema-refeicoes-emmvmfc"; then
    log "✅ PM2 configurado e rodando"
  else
    warn "⚠️  Problema com PM2"
  fi
else
  if pm2 list | grep -q "sistema-refeicoes-emmvmfc"; then
    log "✅ PM2 configurado e rodando"
  else
    warn "⚠️  Problema com PM2"
  fi
fi

# Verificar Nginx
if nginx -t > /dev/null 2>&1; then
  log "✅ Nginx configurado corretamente"
else
  warn "⚠️  Problema na configuração do Nginx"
fi

# Mostrar informações finais
header "🎉 INSTALAÇÃO EMMVMFC CONCLUÍDA COM SUCESSO!"
echo -e "${GREEN}O Sistema de Refeições Escolares foi instalado como ROOT para EMMVMFC!${NC}\n"

echo -e "${CYAN}Informações de Acesso EMMVMFC:${NC}"
echo -e "- URL do Sistema: ${YELLOW}https://$DOMAIN_NAME${NC}"
echo -e "- Admin: ${YELLOW}admin@emmvmfc.com.br${NC}"
echo -e "- Senha: ${YELLOW}admin123${NC} (${RED}ALTERE APÓS O PRIMEIRO ACESSO${NC})\n"

echo -e "${CYAN}Usuário do Sistema Criado:${NC}"
echo -e "- Usuário: ${YELLOW}$SYSTEM_USER${NC}"
echo -e "- Senha: ${YELLOW}emmvmfc2024!${NC}"
echo -e "- Home: ${YELLOW}/home/$SYSTEM_USER${NC}\n"

if [[ "$USE_NEON" == false ]]; then
  echo -e "${CYAN}Informações do Banco de Dados:${NC}"
  echo -e "- Banco: ${YELLOW}$DB_NAME${NC}"
  echo -e "- Usuário: ${YELLOW}$DB_USER${NC}"
  echo -e "- Senha: ${YELLOW}$DB_PASSWORD${NC}\n"
fi

echo -e "${CYAN}Comandos Úteis (como root):${NC}"
echo -e "- ${YELLOW}cd $APP_DIR${NC} - Acessar diretório da aplicação"
echo -e "- ${YELLOW}-u $SYSTEM_USER bash -c 'pm2 status'${NC} - Status da aplicação"
echo -e "- ${YELLOW}-u $SYSTEM_USER bash -c 'pm2 logs sistema-refeicoes-emmvmfc'${NC} - Ver logs"
echo -e "- ${YELLOW}./update.sh${NC} - Atualizar o sistema"
echo -e "- ${YELLOW}./maintenance.sh${NC} - Manutenção do sistema\n"

echo -e "${CYAN}Comandos Úteis (como usuário):${NC}"
echo -e "- ${YELLOW}- $SYSTEM_USER${NC} - Trocar para usuário do sistema"
echo -e "- ${YELLOW}pm2 status${NC} - Status da aplicação"
echo -e "- ${YELLOW}pm2 logs sistema-refeicoes-emmvmfc${NC} - Ver logs\n"

echo -e "${CYAN}Arquivos Importantes:${NC}"
echo -e "- ${YELLOW}$APP_DIR/EMMVMFC_INFO.txt${NC} - Informações completas do sistema"
echo -e "- ${YELLOW}/opt/backups/sistema-refeicoes/${NC} - Diretório de backups"
echo -e "- ${YELLOW}/var/log/emmvmfc-backup.log${NC} - Log dos backups\n"

echo -e "${CYAN}Segurança:${NC}"
echo -e "- Firewall: ${YELLOW}Ativo${NC}"
echo -e "- SSL: ${YELLOW}Configurado para $DOMAIN_NAME${NC}"
echo -e "- Fail2ban: ${YELLOW}Ativo${NC}"
echo -e "- Backups: ${YELLOW}Diários às 02:00${NC}"
echo -e "- Usuário dedicado: ${YELLOW}$SYSTEM_USER${NC}\n"

echo -e "${RED}IMPORTANTE PARA EMMVMFC:${NC}"
echo -e "${YELLOW}1. Altere a senha do administrador após o primeiro acesso${NC}"
echo -e "${YELLOW}2. Altere a senha do usuário $SYSTEM_USER se necessário${NC}"
echo -e "${YELLOW}3. Configure o email SMTP nas configurações do sistema${NC}"
echo -e "${YELLOW}4. Verifique se o domínio $DOMAIN_NAME está apontando corretamente${NC}"
echo -e "${YELLOW}5. Guarde todas as informações de acesso em local seguro${NC}\n"

log "Instalação EMMVMFC como ROOT concluída em $(date)"
log "Arquivo de informações salvo em: $APP_DIR/EMMVMFC_INFO.txt"

echo -e "${GREEN}✅ Sistema pronto para uso em https://$DOMAIN_NAME${NC}"
