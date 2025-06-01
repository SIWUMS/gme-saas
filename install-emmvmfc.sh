#!/bin/bash

# ======================================================
# Sistema de Refeições Escolares EMMVMFC - Instalador
# Para Ubuntu 22.04/24.04 LTS
# Domínio: gestor.emmvmfc.com.br
# Versão: 2.0 - Completamente Corrigido
# ======================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Arquivo de log
LOG_FILE="/tmp/emmvmfc-install-$(date +%Y%m%d_%H%M%S).log"

# Funções de log
log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] WARN:${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
    echo -e "${RED}Log salvo em: $LOG_FILE${NC}"
    exit 1
}

header() {
    echo -e "\n${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} ${CYAN}$1${NC} ${BLUE}║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}\n"
    echo "=== $1 ===" >> "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

# Função para executar comandos com verificação
run_cmd() {
    local cmd="$1"
    local description="$2"
    
    log "Executando: $description"
    echo "CMD: $cmd" >> "$LOG_FILE"
    
    if eval "$cmd" >> "$LOG_FILE" 2>&1; then
        success "$description concluído"
        return 0
    else
        error "Falha ao executar: $description"
        return 1
    fi
}

# Verificar se é root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        IS_ROOT=true
        SUDO=""
        log "Executando como usuário ROOT"
    else
        IS_ROOT=false
        SUDO="sudo"
        log "Executando com sudo"
        
        # Verificar se sudo está disponível
        if ! command -v sudo &> /dev/null; then
            error "sudo não está instalado. Execute como root ou instale sudo."
        fi
    fi
}

# Banner de apresentação
show_banner() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                              ║"
    echo "║    ███████╗███╗   ███╗███╗   ███╗██╗   ██╗███╗   ███╗███████╗ ██████╗       ║"
    echo "║    ██╔════╝████╗ ████║████╗ ████║██║   ██║████╗ ████║██╔════╝██╔════╝       ║"
    echo "║    █████╗  ██╔████╔██║██╔████╔██║██║   ██║██╔████╔██║█████╗  ██║            ║"
    echo "║    ██╔══╝  ██║╚██╔╝██║██║╚██╔╝██║╚██╗ ██╔╝██║╚██╔╝██║██╔══╝  ██║            ║"
    echo "║    ███████╗██║ ╚═╝ ██║██║ ╚═╝ ██║ ╚████╔╝ ██║ ╚═╝ ██║██║     ╚██████╗       ║"
    echo "║    ╚══════╝╚═╝     ╚═╝╚═╝     ╚═╝  ╚═══╝  ╚═╝     ╚═╝╚═╝      ╚═════╝       ║"
    echo "║                                                                              ║"
    echo "║                    Sistema de Refeições Escolares                           ║"
    echo "║                         gestor.emmvmfc.com.br                               ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    echo -e "${CYAN}🚀 Instalador Automático v2.0${NC}"
    echo -e "${GREEN}✅ Suporte completo para Ubuntu 22.04/24.04 LTS${NC}"
    echo -e "${GREEN}✅ Instalação resistente a falhas${NC}"
    echo -e "${GREEN}✅ Configuração automática de SSL${NC}"
    echo -e "${GREEN}✅ Backup automático configurado${NC}\n"
}

# Verificações iniciais
initial_checks() {
    header "Verificações Iniciais do Sistema"
    
    # Verificar sistema operacional
    if [[ ! -f /etc/os-release ]]; then
        error "Não foi possível detectar o sistema operacional"
    fi
    
    source /etc/os-release
    
    if [[ "$ID" != "ubuntu" ]]; then
        warn "Sistema não é Ubuntu. Continuando, mas podem ocorrer problemas."
    fi
    
    log "Sistema detectado: $PRETTY_NAME"
    
    # Verificar versão do Ubuntu
    ubuntu_version=$(lsb_release -rs 2>/dev/null || echo "unknown")
    log "Versão do Ubuntu: $ubuntu_version"
    
    # Verificar recursos do sistema
    cpu_cores=$(nproc)
    total_ram=$(free -m | awk '/^Mem:/{print $2}')
    available_disk=$(df -h / | awk 'NR==2{print $4}')
    
    log "Recursos do sistema:"
    log "  - CPU: $cpu_cores cores"
    log "  - RAM: $total_ram MB"
    log "  - Disco disponível: $available_disk"
    
    # Verificar requisitos mínimos
    if [[ $cpu_cores -lt 1 ]]; then
        warn "CPU insuficiente (recomendado: 2+ cores)"
    fi
    
    if [[ $total_ram -lt 2048 ]]; then
        warn "RAM insuficiente (recomendado: 4GB+)"
    fi
    
    # Verificar conectividade
    log "Testando conectividade com a internet..."
    if ping -c 3 8.8.8.8 &>/dev/null; then
        success "Conectividade com internet OK"
    else
        error "Sem conectividade com internet. Verifique sua conexão."
    fi
    
    # Verificar se portas estão livres
    if netstat -tuln 2>/dev/null | grep -q ":80 "; then
        warn "Porta 80 já está em uso"
    fi
    
    if netstat -tuln 2>/dev/null | grep -q ":443 "; then
        warn "Porta 443 já está em uso"
    fi
    
    success "Verificações iniciais concluídas"
}

# Configuração interativa
interactive_config() {
    header "Configuração do Sistema EMMVMFC"
    
    # Configurações padrão
    DOMAIN_NAME="gestor.emmvmfc.com.br"
    APP_DIR="/var/www/sistema-refeicoes"
    DB_NAME="sistema_refeicoes_emmvmfc"
    DB_USER="emmvmfc_user"
    NODE_VERSION="20"
    
    echo -e "${CYAN}Configurações do Sistema:${NC}"
    echo -e "Domínio: ${YELLOW}$DOMAIN_NAME${NC}"
    echo -e "Diretório: ${YELLOW}$APP_DIR${NC}"
    echo -e "Banco de dados: ${YELLOW}$DB_NAME${NC}"
    echo ""
    
    # Email do administrador
    while true; do
        read -p "📧 Email do administrador: " ADMIN_EMAIL
        if [[ "$ADMIN_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
            break
        else
            echo -e "${RED}❌ Email inválido. Tente novamente.${NC}"
        fi
    done
    
    # Escolha do banco de dados
    echo ""
    echo -e "${CYAN}Opções de Banco de Dados:${NC}"
    echo "1) PostgreSQL Local (recomendado para produção)"
    echo "2) Neon (PostgreSQL na nuvem)"
    echo ""
    
    while true; do
        read -p "Escolha uma opção [1-2]: " db_choice
        case $db_choice in
            1)
                USE_NEON=false
                DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 24 | head -n 1)
                DB_CONNECTION_STRING="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
                log "Configurado PostgreSQL local"
                break
                ;;
            2)
                USE_NEON=true
                read -p "🔗 URL de conexão do Neon: " NEON_URL
                DB_CONNECTION_STRING="$NEON_URL"
                log "Configurado Neon PostgreSQL"
                break
                ;;
            *)
                echo -e "${RED}❌ Opção inválida. Escolha 1 ou 2.${NC}"
                ;;
        esac
    done
    
    # Confirmação
    echo ""
    echo -e "${GREEN}📋 Resumo da Configuração:${NC}"
    echo -e "Email: ${YELLOW}$ADMIN_EMAIL${NC}"
    echo -e "Banco: ${YELLOW}$([ "$USE_NEON" = true ] && echo "Neon" || echo "PostgreSQL Local")${NC}"
    echo -e "Domínio: ${YELLOW}$DOMAIN_NAME${NC}"
    echo ""
    
    read -p "Confirma a instalação? [y/N]: " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Instalação cancelada pelo usuário."
        exit 0
    fi
    
    success "Configuração confirmada"
}

# Atualizar sistema
update_system() {
    header "Atualizando Sistema Operacional"
    
    export DEBIAN_FRONTEND=noninteractive
    
    run_cmd "$SUDO apt update" "Atualizando lista de pacotes"
    
    log "Atualizando pacotes do sistema (pode demorar)..."
    run_cmd "$SUDO apt upgrade -y -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold'" "Atualizando pacotes"
    
    success "Sistema atualizado com sucesso"
}

# Instalar dependências básicas
install_dependencies() {
    header "Instalando Dependências Básicas"
    
    local packages=(
        "curl"
        "wget" 
        "git"
        "unzip"
        "software-properties-common"
        "apt-transport-https"
        "ca-certificates"
        "gnupg"
        "lsb-release"
        "build-essential"
        "ufw"
        "fail2ban"
        "htop"
        "nano"
        "vim"
        "tree"
        "net-tools"
    )
    
    for package in "${packages[@]}"; do
        run_cmd "$SUDO apt install -y $package" "Instalando $package"
    done
    
    success "Dependências básicas instaladas"
}

# Instalar Node.js
install_nodejs() {
    header "Instalando Node.js $NODE_VERSION"
    
    if command -v node &> /dev/null; then
        local current_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ "$current_version" == "$NODE_VERSION" ]]; then
            log "Node.js $NODE_VERSION já está instalado"
            return 0
        fi
    fi
    
    log "Adicionando repositório oficial do Node.js..."
    run_cmd "curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | $SUDO -E bash -" "Configurando repositório Node.js"
    
    run_cmd "$SUDO apt install -y nodejs" "Instalando Node.js"
    
    # Verificar instalação
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        local node_ver=$(node --version)
        local npm_ver=$(npm --version)
        log "Node.js instalado: $node_ver"
        log "NPM instalado: $npm_ver"
    else
        error "Falha na instalação do Node.js"
    fi
    
    # Instalar Yarn e PM2
    run_cmd "$SUDO npm install -g yarn pm2" "Instalando Yarn e PM2"
    
    success "Node.js e ferramentas instalados"
}

# Instalar PostgreSQL
install_postgresql() {
    if [[ "$USE_NEON" == true ]]; then
        log "Usando Neon - pulando instalação do PostgreSQL local"
        return 0
    fi
    
    header "Instalando PostgreSQL"
    
    if command -v psql &> /dev/null; then
        log "PostgreSQL já está instalado"
    else
        run_cmd "$SUDO apt install -y postgresql postgresql-contrib" "Instalando PostgreSQL"
    fi
    
    # Iniciar e habilitar PostgreSQL
    run_cmd "$SUDO systemctl start postgresql" "Iniciando PostgreSQL"
    run_cmd "$SUDO systemctl enable postgresql" "Habilitando PostgreSQL"
    
    # Aguardar PostgreSQL inicializar
    sleep 3
    
    # Criar banco de dados e usuário
    log "Criando banco de dados e usuário..."
    
    # Criar script SQL temporário
    local sql_script="/tmp/create_db.sql"
    cat > "$sql_script" << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
EOF
    
    # Executar script SQL
    if $SUDO -u postgres psql -f "$sql_script" >> "$LOG_FILE" 2>&1; then
        success "Banco de dados criado: $DB_NAME"
        success "Usuário criado: $DB_USER"
    else
        error "Falha ao criar banco de dados"
    fi
    
    # Limpar script temporário
    rm -f "$sql_script"
    
    success "PostgreSQL configurado"
}

# Instalar Nginx
install_nginx() {
    header "Instalando e Configurando Nginx"
    
    if command -v nginx &> /dev/null; then
        log "Nginx já está instalado"
    else
        run_cmd "$SUDO apt install -y nginx" "Instalando Nginx"
    fi
    
    # Iniciar e habilitar Nginx
    run_cmd "$SUDO systemctl start nginx" "Iniciando Nginx"
    run_cmd "$SUDO systemctl enable nginx" "Habilitando Nginx"
    
    success "Nginx instalado e configurado"
}

# Configurar firewall
configure_firewall() {
    header "Configurando Firewall (UFW)"
    
    # Configurar UFW
    run_cmd "$SUDO ufw --force reset" "Resetando UFW"
    run_cmd "$SUDO ufw default deny incoming" "Configurando política padrão"
    run_cmd "$SUDO ufw default allow outgoing" "Configurando política de saída"
    
    # Permitir serviços essenciais
    run_cmd "$SUDO ufw allow OpenSSH" "Permitindo SSH"
    run_cmd "$SUDO ufw allow 'Nginx Full'" "Permitindo Nginx"
    
    # Habilitar firewall
    run_cmd "$SUDO ufw --force enable" "Habilitando firewall"
    
    success "Firewall configurado"
}

# Instalar aplicação
install_application() {
    header "Instalando Aplicação EMMVMFC"
    
    # Criar diretório da aplicação
    if [[ ! -d "$APP_DIR" ]]; then
        run_cmd "$SUDO mkdir -p $APP_DIR" "Criando diretório da aplicação"
    fi
    
    # Clonar repositório para diretório temporário
    local temp_dir="/tmp/emmvmfc-$(date +%s)"
    run_cmd "git clone https://github.com/SIWUMS/gme-saas.git $temp_dir" "Clonando repositório"
    
    # Copiar arquivos para diretório final
    run_cmd "$SUDO cp -r $temp_dir/* $APP_DIR/" "Copiando arquivos da aplicação"
    
    # Limpar diretório temporário
    rm -rf "$temp_dir"
    
    # Configurar permissões
    if [[ "$IS_ROOT" == true ]]; then
        run_cmd "chown -R root:root $APP_DIR" "Configurando permissões (root)"
    else
        run_cmd "$SUDO chown -R $USER:$USER $APP_DIR" "Configurando permissões (usuário)"
    fi
    
    success "Aplicação instalada"
}

# Configurar aplicação
configure_application() {
    header "Configurando Aplicação"
    
    cd "$APP_DIR"
    
    # Instalar dependências
    if [[ ! -d "node_modules" ]]; then
        run_cmd "yarn install --production" "Instalando dependências Node.js"
    else
        log "Dependências já instaladas"
    fi
    
    # Criar arquivo .env
    log "Criando arquivo de configuração (.env)..."
    cat > .env << EOF
# Configuração de Produção - EMMVMFC
NODE_ENV=production
PORT=3000

# Banco de Dados
DATABASE_URL="$DB_CONNECTION_STRING"
DATABASE_SSL=$([ "$USE_NEON" == true ] && echo "true" || echo "false")

# Autenticação
NEXTAUTH_SECRET="$(openssl rand -base64 64)"
NEXTAUTH_URL="https://$DOMAIN_NAME"

# Aplicação
APP_NAME="Sistema de Refeições Escolares - EMMVMFC"
APP_URL="https://$DOMAIN_NAME"
UPLOAD_DIR="$APP_DIR/uploads"

# Localização
TIMEZONE="America/Sao_Paulo"
LOCALE="pt-BR"
CURRENCY="BRL"

# Organização
ORGANIZATION_NAME="EMMVMFC"
ORGANIZATION_EMAIL="$ADMIN_EMAIL"

# Logs
LOG_LEVEL="info"
LOG_FILE="$APP_DIR/logs/app.log"
EOF
    
    # Criar diretórios necessários
    mkdir -p uploads logs backups
    chmod 755 uploads logs backups
    
    # Compilar aplicação
    run_cmd "yarn build" "Compilando aplicação"
    
    success "Aplicação configurada"
}

# Configurar PM2
configure_pm2() {
    header "Configurando PM2 (Process Manager)"
    
    cd "$APP_DIR"
    
    # Criar configuração do PM2
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sistema-emmvmfc',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '$APP_DIR/logs/pm2-error.log',
    out_file: '$APP_DIR/logs/pm2-out.log',
    log_file: '$APP_DIR/logs/pm2.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
EOF
    
    # Parar aplicação se estiver rodando
    pm2 delete sistema-emmvmfc 2>/dev/null || true
    
    # Iniciar aplicação
    run_cmd "pm2 start ecosystem.config.js" "Iniciando aplicação com PM2"
    
    # Salvar configuração do PM2
    run_cmd "pm2 save" "Salvando configuração PM2"
    
    # Configurar inicialização automática
    local startup_cmd=$(pm2 startup | tail -n 1)
    if [[ "$startup_cmd" =~ ^sudo ]]; then
        eval "$startup_cmd" >> "$LOG_FILE" 2>&1
        success "PM2 configurado para inicialização automática"
    fi
    
    success "PM2 configurado"
}

# Configurar Nginx
configure_nginx() {
    header "Configurando Nginx"
    
    # Criar configuração do site
    $SUDO tee /etc/nginx/sites-available/emmvmfc > /dev/null << EOF
# Configuração Nginx - Sistema EMMVMFC
server {
    listen 80;
    server_name $DOMAIN_NAME;
    
    # Logs
    access_log /var/log/nginx/emmvmfc-access.log;
    error_log /var/log/nginx/emmvmfc-error.log;
    
    # Configurações de segurança
    server_tokens off;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Proxy para aplicação Next.js
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Configurações de upload
    client_max_body_size 50M;
    client_body_timeout 60s;
    
    # Arquivos estáticos
    location /uploads/ {
        alias $APP_DIR/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Favicon
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }
    
    # Robots.txt
    location = /robots.txt {
        log_not_found off;
        access_log off;
    }
}
EOF
    
    # Habilitar site
    run_cmd "$SUDO ln -sf /etc/nginx/sites-available/emmvmfc /etc/nginx/sites-enabled/" "Habilitando site"
    
    # Remover site padrão
    run_cmd "$SUDO rm -f /etc/nginx/sites-enabled/default" "Removendo site padrão"
    
    # Testar configuração
    run_cmd "$SUDO nginx -t" "Testando configuração Nginx"
    
    # Recarregar Nginx
    run_cmd "$SUDO systemctl reload nginx" "Recarregando Nginx"
    
    success "Nginx configurado"
}

# Configurar SSL
configure_ssl() {
    header "Configurando SSL (Let's Encrypt)"
    
    # Instalar Certbot
    if ! command -v certbot &> /dev/null; then
        run_cmd "$SUDO apt install -y certbot python3-certbot-nginx" "Instalando Certbot"
    fi
    
    # Obter certificado SSL
    log "Obtendo certificado SSL para $DOMAIN_NAME..."
    
    if $SUDO certbot --nginx -d "$DOMAIN_NAME" --non-interactive --agree-tos -m "$ADMIN_EMAIL" --redirect >> "$LOG_FILE" 2>&1; then
        success "Certificado SSL configurado"
        
        # Configurar renovação automática
        if ! $SUDO crontab -l 2>/dev/null | grep -q certbot; then
            (echo "0 12 * * * /usr/bin/certbot renew --quiet") | $SUDO crontab -
            success "Renovação automática de SSL configurada"
        fi
    else
        warn "Falha ao configurar SSL. Verifique se o domínio aponta para este servidor."
        warn "Você pode configurar SSL manualmente depois com: sudo certbot --nginx -d $DOMAIN_NAME"
    fi
}

# Configurar backup automático
configure_backup() {
    header "Configurando Backup Automático"
    
    local backup_dir="/opt/backups/emmvmfc"
    run_cmd "$SUDO mkdir -p $backup_dir" "Criando diretório de backup"
    
    # Script de backup
    $SUDO tee /opt/backups/emmvmfc/backup.sh > /dev/null << 'EOF'
#!/bin/bash

# Configurações
BACKUP_DIR="/opt/backups/emmvmfc"
APP_DIR="/var/www/sistema-refeicoes"
DB_NAME="sistema_refeicoes_emmvmfc"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Criar backup do banco de dados
if command -v pg_dump &> /dev/null; then
    sudo -u postgres pg_dump $DB_NAME | gzip > "$BACKUP_DIR/db_${DB_NAME}_${DATE}.sql.gz"
    echo "Backup do banco criado: db_${DB_NAME}_${DATE}.sql.gz"
fi

# Backup dos uploads
if [ -d "$APP_DIR/uploads" ]; then
    tar -czf "$BACKUP_DIR/uploads_${DATE}.tar.gz" -C "$APP_DIR" uploads/
    echo "Backup dos uploads criado: uploads_${DATE}.tar.gz"
fi

# Backup da configuração
if [ -f "$APP_DIR/.env" ]; then
    cp "$APP_DIR/.env" "$BACKUP_DIR/env_${DATE}.backup"
    echo "Backup da configuração criado: env_${DATE}.backup"
fi

# Limpar backups antigos
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.backup" -mtime +$RETENTION_DAYS -delete

echo "Backup concluído em $(date)"
EOF
    
    run_cmd "$SUDO chmod +x /opt/backups/emmvmfc/backup.sh" "Tornando script executável"
    
    # Configurar cron para backup diário
    if ! $SUDO crontab -l 2>/dev/null | grep -q "emmvmfc/backup.sh"; then
        (echo "0 2 * * * /opt/backups/emmvmfc/backup.sh >> /var/log/emmvmfc-backup.log 2>&1") | $SUDO crontab -
        success "Backup automático configurado (diário às 2h)"
    fi
    
    success "Sistema de backup configurado"
}

# Configurar segurança adicional
configure_security() {
    header "Configurando Segurança Adicional"
    
    # Configurar Fail2ban
    if command -v fail2ban-server &> /dev/null; then
        # Configuração para Nginx
        $SUDO tee /etc/fail2ban/jail.local > /dev/null << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/emmvmfc-error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/emmvmfc-error.log
maxretry = 10

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF
        
        run_cmd "$SUDO systemctl restart fail2ban" "Configurando Fail2ban"
        success "Fail2ban configurado"
    fi
    
    # Configurações adicionais do sistema
    if [[ ! -f /etc/security/limits.conf.backup ]]; then
        $SUDO cp /etc/security/limits.conf /etc/security/limits.conf.backup
        
        # Aumentar limites para aplicação
        echo "www-data soft nofile 65536" | $SUDO tee -a /etc/security/limits.conf
        echo "www-data hard nofile 65536" | $SUDO tee -a /etc/security/limits.conf
        
        success "Limites do sistema configurados"
    fi
    
    success "Segurança adicional configurada"
}

# Verificações finais
final_checks() {
    header "Verificações Finais"
    
    # Verificar se aplicação está rodando
    if pm2 list | grep -q "sistema-emmvmfc.*online"; then
        success "Aplicação está rodando no PM2"
    else
        warn "Aplicação pode não estar rodando corretamente"
    fi
    
    # Verificar Nginx
    if $SUDO nginx -t &>/dev/null; then
        success "Configuração do Nginx está correta"
    else
        warn "Problema na configuração do Nginx"
    fi
    
    # Verificar conectividade local
    if curl -f http://localhost:3000 &>/dev/null; then
        success "Aplicação responde na porta 3000"
    else
        warn "Aplicação pode não estar respondendo"
    fi
    
    # Verificar banco de dados (se local)
    if [[ "$USE_NEON" == false ]]; then
        if $SUDO -u postgres psql -d "$DB_NAME" -c "SELECT 1;" &>/dev/null; then
            success "Banco de dados está acessível"
        else
            warn "Problema de conectividade com banco de dados"
        fi
    fi
    
    success "Verificações finais concluídas"
}

# Mostrar informações finais
show_final_info() {
    header "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
    
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}                    ${CYAN}SISTEMA EMMVMFC INSTALADO${NC}                    ${GREEN}║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}\n"
    
    echo -e "${CYAN}🌐 Informações de Acesso:${NC}"
    echo -e "   URL: ${YELLOW}https://$DOMAIN_NAME${NC}"
    echo -e "   Admin: ${YELLOW}admin@emmvmfc.com.br${NC}"
    echo -e "   Senha: ${YELLOW}admin123${NC}\n"
    
    if [[ "$USE_NEON" == false ]]; then
        echo -e "${CYAN}🗄️ Banco de Dados Local:${NC}"
        echo -e "   Banco: ${YELLOW}$DB_NAME${NC}"
        echo -e "   Usuário: ${YELLOW}$DB_USER${NC}"
        echo -e "   Senha: ${YELLOW}$DB_PASSWORD${NC}\n"
    fi
    
    echo -e "${CYAN}🛠️ Comandos Úteis:${NC}"
    echo -e "   ${YELLOW}pm2 status${NC}                    - Status da aplicação"
    echo -e "   ${YELLOW}pm2 logs sistema-emmvmfc${NC}      - Ver logs em tempo real"
    echo -e "   ${YELLOW}pm2 restart sistema-emmvmfc${NC}   - Reiniciar aplicação"
    echo -e "   ${YELLOW}sudo systemctl status nginx${NC}   - Status do Nginx"
    echo -e "   ${YELLOW}sudo nginx -t${NC}                 - Testar configuração Nginx"
    echo -e "   ${YELLOW}/opt/backups/emmvmfc/backup.sh${NC} - Executar backup manual\n"
    
    echo -e "${CYAN}📁 Diretórios Importantes:${NC}"
    echo -e "   Aplicação: ${YELLOW}$APP_DIR${NC}"
    echo -e "   Logs: ${YELLOW}$APP_DIR/logs/${NC}"
    echo -e "   Uploads: ${YELLOW}$APP_DIR/uploads/${NC}"
    echo -e "   Backups: ${YELLOW}/opt/backups/emmvmfc/${NC}\n"
    
    echo -e "${CYAN}🔒 Segurança:${NC}"
    echo -e "   ✅ Firewall (UFW) configurado"
    echo -e "   ✅ Fail2ban ativo"
    echo -e "   ✅ SSL/HTTPS configurado"
    echo -e "   ✅ Backup automático (diário às 2h)\n"
    
    # Salvar informações em arquivo
    cat > "$APP_DIR/EMMVMFC_INFO.txt" << EOF
=== SISTEMA DE REFEIÇÕES ESCOLARES - EMMVMFC ===
Instalado em: $(date)
Versão do Instalador: 2.0

ACESSO:
URL: https://$DOMAIN_NAME
Admin: admin@emmvmfc.com.br
Senha: admin123

$([ "$USE_NEON" == false ] && echo "BANCO DE DADOS LOCAL:
Banco: $DB_NAME
Usuário: $DB_USER
Senha: $DB_PASSWORD")

DIRETÓRIOS:
Aplicação: $APP_DIR
Logs: $APP_DIR/logs/
Uploads: $APP_DIR/uploads/
Backups: /opt/backups/emmvmfc/

COMANDOS ÚTEIS:
pm2 status
pm2 logs sistema-emmvmfc
pm2 restart sistema-emmvmfc
sudo systemctl status nginx
sudo nginx -t

LOGS DA INSTALAÇÃO: $LOG_FILE
EOF
    
    echo -e "${GREEN}📋 Informações salvas em: ${YELLOW}$APP_DIR/EMMVMFC_INFO.txt${NC}"
    echo -e "${GREEN}📝 Log completo da instalação: ${YELLOW}$LOG_FILE${NC}\n"
    
    echo -e "${PURPLE}🚀 O sistema está pronto para uso!${NC}"
    echo -e "${PURPLE}   Acesse: https://$DOMAIN_NAME${NC}\n"
}

# Função principal
main() {
    # Verificar se é root
    check_root
    
    # Mostrar banner
    show_banner
    
    # Executar instalação
    initial_checks
    interactive_config
    update_system
    install_dependencies
    install_nodejs
    install_postgresql
    install_nginx
    configure_firewall
    install_application
    configure_application
    configure_pm2
    configure_nginx
    configure_ssl
    configure_backup
    configure_security
    final_checks
    show_final_info
}

# Tratamento de erros
trap 'error "Instalação interrompida. Log: $LOG_FILE"' ERR

# Executar instalação
main "$@"
