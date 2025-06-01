#!/bin/bash

# ======================================================
# Sistema de Refeições Escolares - Instalador ROBUSTO
# Para Ubuntu 22.04/24.04 LTS
# Domínio: gestor.emmvmfc.com.br
# Resistente a desconexões SSH
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

# Função para executar comandos com retry
run_with_retry() {
  local cmd="$1"
  local max_attempts=3
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    log "Tentativa $attempt de $max_attempts: $cmd"
    if eval "$cmd"; then
      log "✅ Comando executado com sucesso"
      return 0
    else
      warn "❌ Falha na tentativa $attempt"
      if [ $attempt -eq $max_attempts ]; then
        error "Comando falhou após $max_attempts tentativas: $cmd"
      fi
      sleep 5
      ((attempt++))
    fi
  done
}

# Verificar se é continuação de instalação
INSTALL_STATE_FILE="/tmp/emmvmfc-install-state"
if [ -f "$INSTALL_STATE_FILE" ]; then
  CURRENT_STEP=$(cat "$INSTALL_STATE_FILE")
  log "🔄 Continuando instalação a partir do passo: $CURRENT_STEP"
else
  CURRENT_STEP=0
  log "🚀 Iniciando nova instalação"
fi

# Função para marcar progresso
mark_step() {
  echo "$1" > "$INSTALL_STATE_FILE"
  log "📍 Passo $1 concluído"
}

# Banner
if [ $CURRENT_STEP -eq 0 ]; then
  echo -e "${CYAN}"
  echo "  ____  _     _                          _        ____        __      _      _                "
  echo " / ___|(_)___| |_ ___ _ __ ___   __ _   | |      / ___|  ___ / _| ___(_) ___(_) ___  ___ ___ "
  echo " \___ \| / __| __/ _ \ '_ \` _ \ / _\` |  | |     | |  _  / _ \ |_ / __| |/ __| |/ _ \/ __/ __|"
  echo "  ___) | \__ \ ||  __/ | | | | | (_| |  | |___  | |_| ||  __/  _| (__| | (__| |  __/\__ \__ \\"
  echo " |____/|_|___/\__\___|_| |_| |_|\__,_|  |_____|  \____| \___|_|  \___|_|\___|_|\___||___/___/"
  echo -e "${NC}"
  echo -e "${YELLOW}Instalador ROBUSTO - gestor.emmvmfc.com.br${NC}"
  echo -e "${GREEN}Resistente a desconexões SSH${NC}\n"
fi

# Configurações
DOMAIN_NAME="gestor.emmvmfc.com.br"
APP_DIR="/var/www/sistema-refeicoes"
DB_NAME="sistema_refeicoes_emmvmfc"
DB_USER="emmvmfc_user"
NODE_VERSION="20"
POSTGRES_VERSION="16"

# Detectar se é root
if [[ $EUID -eq 0 ]]; then
  RUNNING_AS_ROOT=true
  USE_SUDO=""
  SUDO_CMD=""
  log "✅ Executando como ROOT"
else
  RUNNING_AS_ROOT=false
  USE_SUDO="sudo"
  SUDO_CMD="sudo"
  log "✅ Executando com sudo"
fi

# Passo 1: Verificações iniciais
if [ $CURRENT_STEP -lt 1 ]; then
  header "Verificações Iniciais"
  
  # Verificar Ubuntu
  if [[ "$(lsb_release -is)" != "Ubuntu" ]]; then
    warn "Sistema não é Ubuntu, podem ocorrer problemas"
  fi
  
  ubuntu_version=$(lsb_release -rs)
  log "Ubuntu $ubuntu_version detectado"
  
  # Verificar recursos
  cpu_cores=$(nproc)
  total_ram=$(free -m | awk '/^Mem:/{print $2}')
  log "CPU: $cpu_cores cores, RAM: $total_ram MB"
  
  # Verificar conectividade
  if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
    log "✅ Conectividade com internet OK"
  else
    error "❌ Sem conectividade com internet"
  fi
  
  mark_step 1
fi

# Passo 2: Configuração (só pergunta se não foi configurado antes)
CONFIG_FILE="/tmp/emmvmfc-config"
if [ $CURRENT_STEP -lt 2 ]; then
  header "Configuração EMMVMFC"
  
  if [ ! -f "$CONFIG_FILE" ]; then
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
    
    # Salvar configuração
    cat > "$CONFIG_FILE" << EOF
ADMIN_EMAIL="$ADMIN_EMAIL"
DB_CHOICE="$DB_CHOICE"
DB_CONNECTION_STRING="$DB_CONNECTION_STRING"
USE_NEON=$USE_NEON
DB_PASSWORD="$DB_PASSWORD"
EOF
  else
    log "📋 Carregando configuração salva..."
    source "$CONFIG_FILE"
  fi
  
  log "✅ Configuração: Email=$ADMIN_EMAIL, DB=$DB_CHOICE"
  mark_step 2
fi

# Carregar configuração se continuando
if [ $CURRENT_STEP -ge 2 ] && [ -f "$CONFIG_FILE" ]; then
  source "$CONFIG_FILE"
fi

# Passo 3: Atualização do sistema (com timeout)
if [ $CURRENT_STEP -lt 3 ]; then
  header "Atualizando Sistema (pode demorar)"
  
  log "🔄 Atualizando lista de pacotes..."
  run_with_retry "$SUDO_CMD apt update"
  
  log "🔄 Atualizando pacotes (PODE DEMORAR - não feche o terminal)..."
  log "⏰ Esta etapa pode levar 10-30 minutos dependendo da conexão"
  
  # Usar timeout e noninteractive para evitar travamento
  export DEBIAN_FRONTEND=noninteractive
  run_with_retry "$SUDO_CMD apt upgrade -y -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold'"
  
  log "✅ Sistema atualizado com sucesso"
  mark_step 3
fi

# Passo 4: Dependências básicas
if [ $CURRENT_STEP -lt 4 ]; then
  header "Instalando Dependências Básicas"
  
  export DEBIAN_FRONTEND=noninteractive
  run_with_retry "$SUDO_CMD apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release build-essential"
  
  mark_step 4
fi

# Passo 5: Node.js
if [ $CURRENT_STEP -lt 5 ]; then
  header "Instalando Node.js $NODE_VERSION"
  
  if ! command -v node &> /dev/null; then
    log "📦 Adicionando repositório Node.js..."
    if [[ $RUNNING_AS_ROOT == true ]]; then
      run_with_retry "curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash -"
    else
      run_with_retry "curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo -E bash -"
    fi
    
    log "📦 Instalando Node.js..."
    run_with_retry "$SUDO_CMD apt install -y nodejs"
    
    log "📦 Instalando Yarn e PM2..."
    run_with_retry "$SUDO_CMD npm install -g yarn pm2"
  else
    log "✅ Node.js já instalado: $(node --version)"
  fi
  
  mark_step 5
fi

# Passo 6: PostgreSQL (se local)
if [ $CURRENT_STEP -lt 6 ]; then
  if [[ "$USE_NEON" == false ]]; then
    header "Instalando PostgreSQL $POSTGRES_VERSION"
    
    if ! command -v psql &> /dev/null; then
      log "📦 Adicionando repositório PostgreSQL..."
      if [[ "$(lsb_release -rs)" == "22.04" ]]; then
        run_with_retry "$SUDO_CMD sh -c \"echo 'deb https://apt.postgresql.org/pub/repos/apt jammy-pgdg main' > /etc/apt/sources.list.d/pgdg.list\""
      else
        run_with_retry "$SUDO_CMD sh -c \"echo 'deb https://apt.postgresql.org/pub/repos/apt \$(lsb_release -cs)-pgdg main' > /etc/apt/sources.list.d/pgdg.list\""
      fi
      
      run_with_retry "wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | $SUDO_CMD apt-key add -"
      run_with_retry "$SUDO_CMD apt update"
      run_with_retry "$SUDO_CMD apt install -y postgresql-$POSTGRES_VERSION postgresql-client-$POSTGRES_VERSION"
      
      log "🔧 Configurando PostgreSQL..."
      run_with_retry "$SUDO_CMD systemctl start postgresql"
      run_with_retry "$SUDO_CMD systemctl enable postgresql"
      
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
  
  mark_step 6
fi

# Passo 7: Nginx
if [ $CURRENT_STEP -lt 7 ]; then
  header "Instalando Nginx"
  
  if ! command -v nginx &> /dev/null; then
    run_with_retry "$SUDO_CMD apt install -y nginx"
  else
    log "✅ Nginx já instalado"
  fi
  
  mark_step 7
fi

# Passo 8: Firewall
if [ $CURRENT_STEP -lt 8 ]; then
  header "Configurando Firewall"
  
  run_with_retry "$SUDO_CMD ufw allow OpenSSH"
  run_with_retry "$SUDO_CMD ufw allow 'Nginx Full'"
  run_with_retry "$SUDO_CMD ufw --force enable"
  
  mark_step 8
fi

# Passo 9: Aplicação
if [ $CURRENT_STEP -lt 9 ]; then
  header "Instalando Aplicação"
  
  if [ ! -d "$APP_DIR" ]; then
    log "📁 Criando diretório da aplicação..."
    $SUDO_CMD mkdir -p "$APP_DIR"
    
    log "📥 Clonando repositório..."
    run_with_retry "git clone https://github.com/SIWUMS/gme-saas.git $APP_DIR"
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
  
  mark_step 9
fi

# Passo 10: Dependências da aplicação
if [ $CURRENT_STEP -lt 10 ]; then
  header "Instalando Dependências da Aplicação"
  
  cd "$APP_DIR"
  
  if [ ! -d "node_modules" ]; then
    log "📦 Instalando dependências com yarn..."
    run_with_retry "yarn install"
  else
    log "✅ Dependências já instaladas"
  fi
  
  mark_step 10
fi

# Passo 11: Configuração .env
if [ $CURRENT_STEP -lt 11 ]; then
  header "Configurando Variáveis de Ambiente"
  
  cd "$APP_DIR"
  
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
  
  mark_step 11
fi

# Passo 12: Build da aplicação
if [ $CURRENT_STEP -lt 12 ]; then
  header "Compilando Aplicação"
  
  cd "$APP_DIR"
  
  if [ ! -d ".next" ]; then
    log "🔨 Fazendo build da aplicação..."
    run_with_retry "yarn build"
  else
    log "✅ Build já existe"
  fi
  
  mark_step 12
fi

# Passo 13: PM2
if [ $CURRENT_STEP -lt 13 ]; then
  header "Configurando PM2"
  
  cd "$APP_DIR"
  
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
  
  mark_step 13
fi

# Passo 14: Nginx
if [ $CURRENT_STEP -lt 14 ]; then
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
  
  run_with_retry "$SUDO_CMD nginx -t"
  run_with_retry "$SUDO_CMD systemctl reload nginx"
  
  mark_step 14
fi

# Passo 15: SSL
if [ $CURRENT_STEP -lt 15 ]; then
  header "Configurando SSL"
  
  if ! command -v certbot &> /dev/null; then
    run_with_retry "$SUDO_CMD apt install -y certbot python3-certbot-nginx"
  fi
  
  log "🔒 Obtendo certificado SSL..."
  run_with_retry "$SUDO_CMD certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos -m $ADMIN_EMAIL --redirect"
  
  mark_step 15
fi

# Finalização
header "🎉 INSTALAÇÃO CONCLUÍDA!"

# Verificar se tudo está funcionando
log "🔍 Verificando instalação..."

if curl -f http://localhost:3000 > /dev/null 2>&1; then
  log "✅ Aplicação rodando na porta 3000"
else
  warn "⚠️ Aplicação pode não estar rodando"
fi

if $SUDO_CMD nginx -t > /dev/null 2>&1; then
  log "✅ Nginx configurado corretamente"
else
  warn "⚠️ Problema na configuração do Nginx"
fi

# Informações finais
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

# Limpar arquivos temporários
rm -f "$INSTALL_STATE_FILE" "$CONFIG_FILE"

log "✅ Instalação finalizada! Acesse: https://$DOMAIN_NAME"
log "📋 Informações salvas em: $APP_DIR/EMMVMFC_INFO.txt"
log "📝 Log completo em: /tmp/emmvmfc-install.log"
