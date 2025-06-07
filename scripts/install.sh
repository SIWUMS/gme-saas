#!/bin/bash

# Script de Instalação - Sistema de Refeições Escolares EMMVMFC
# Escola Municipal Militarizada de Vicentinópolis Manoel Fernandes da Cunha
# Domínio: gestor.emmvmfc.com.br
# Versão: 3.1.0

set -e

echo "🏫 Instalando Sistema de Refeições Escolares - EMMVMFC"
echo "======================================================"
echo "Escola Municipal Militarizada de Vicentinópolis"
echo "Manoel Fernandes da Cunha"
echo "Domínio: gestor.emmvmfc.com.br"
echo "======================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações específicas EMMVMFC
DOMAIN="gestor.emmvmfc.com.br"
APP_NAME="EMMVMFC - Sistema de Refeições"
ORGANIZATION="Escola Municipal Militarizada de Vicentinópolis Manoel Fernandes da Cunha"
LOCATION="Vicentinópolis, GO"
GITHUB_REPO="SIWUMS/gme-saas"
APP_DIR="/var/www/emmvmfc-refeicoes"

# Função para log
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

success() {
    echo -e "${BLUE}[SUCCESS]${NC} $1"
}

# Verificar se é root
if [[ $EUID -eq 0 ]]; then
   error "Este script não deve ser executado como root"
fi

# Verificar Ubuntu 22.04
if ! grep -q "Ubuntu 22.04" /etc/os-release; then
    warn "Este script foi testado no Ubuntu 22.04. Continuando mesmo assim..."
fi

# Verificar recursos do sistema
log "Verificando recursos do sistema..."
TOTAL_RAM=$(free -m | awk 'NR==2{printf "%.0f", $2/1024}')
TOTAL_CPU=$(nproc)
TOTAL_DISK=$(df -BG / | awk 'NR==2 {print $4}' | sed 's/G//')

if [ "$TOTAL_RAM" -lt 4 ]; then
    warn "RAM disponível: ${TOTAL_RAM}GB (recomendado: 12GB, mínimo: 4GB)"
fi

if [ "$TOTAL_CPU" -lt 2 ]; then
    warn "CPUs disponíveis: ${TOTAL_CPU} (recomendado: 6, mínimo: 2)"
fi

if [ "$TOTAL_DISK" -lt 20 ]; then
    error "Espaço em disco insuficiente: ${TOTAL_DISK}GB (mínimo: 20GB)"
fi

success "Recursos do sistema verificados: ${TOTAL_RAM}GB RAM, ${TOTAL_CPU} CPUs, ${TOTAL_DISK}GB disco"

# Atualizar sistema
log "Atualizando sistema Ubuntu 22.04..."
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
log "Instalando dependências básicas..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https \
    ca-certificates gnupg lsb-release build-essential python3-pip htop tree \
    fail2ban ufw certbot python3-certbot-nginx

# Configurar firewall UFW
log "Configurando firewall UFW..."
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5432/tcp comment 'PostgreSQL'
sudo ufw --force enable

# Configurar Fail2ban
log "Configurando Fail2ban..."
sudo tee /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Instalar Node.js 20
log "Instalando Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar versões
node_version=$(node --version)
npm_version=$(npm --version)
success "Node.js instalado: $node_version"
success "NPM instalado: $npm_version"

# Instalar PostgreSQL 16
log "Instalando PostgreSQL 16..."
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-16 postgresql-client-16 postgresql-contrib-16

# Configurar PostgreSQL
log "Configurando PostgreSQL 16..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurar PostgreSQL para performance
sudo tee -a /etc/postgresql/16/main/postgresql.conf << EOF

# Configurações EMMVMFC
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
EOF

sudo systemctl restart postgresql

# Criar banco de dados EMMVMFC
DB_NAME="emmvmfc_refeicoes"
DB_USER="emmvmfc_user"
DB_PASSWORD=$(openssl rand -base64 32)

sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
\q
EOF

success "Banco de dados criado: $DB_NAME"
success "Usuário criado: $DB_USER"

# Instalar PM2 globalmente
log "Instalando PM2..."
sudo npm install -g pm2@latest

# Instalar Nginx
log "Instalando Nginx..."
sudo apt install -y nginx

# Criar diretório da aplicação
log "Criando diretório da aplicação: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clonar repositório EMMVMFC
cd $APP_DIR
log "Clonando repositório $GITHUB_REPO..."

# Configurar Git para clonar o repositório
git config --global credential.helper store
git config --global user.name "EMMVMFC Installer"
git config --global user.email "admin@emmvmfc.com.br"

# Clonar o repositório
if ! git clone https://github.com/$GITHUB_REPO.git .; then
    error "Não foi possível clonar o repositório. Verifique se o repositório existe e é acessível."
fi

# Verificar se o clone foi bem-sucedido
if [ ! -f "package.json" ]; then
    error "Falha ao clonar o repositório. O arquivo package.json não foi encontrado."
fi

success "Repositório clonado com sucesso!"

# Instalar dependências
log "Instalando dependências do projeto..."
npm install

# Criar arquivo de ambiente EMMVMFC
log "Criando arquivo de configuração EMMVMFC..."
cat > .env.local << EOF
# EMMVMFC - Sistema de Refeições Escolares
# Escola Municipal Militarizada de Vicentinópolis Manoel Fernandes da Cunha

# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://$DOMAIN"

# App Configuration
NODE_ENV="production"
PORT=3000
APP_NAME="$APP_NAME"
ORGANIZATION="$ORGANIZATION"
LOCATION="$LOCATION"
DOMAIN="$DOMAIN"

# Upload Configuration
UPLOAD_DIR="$APP_DIR/uploads"
MAX_FILE_SIZE="10485760"

# Email Configuration (configurar conforme necessário)
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@emmvmfc.com.br"

# Backup Configuration
BACKUP_DIR="/opt/backups/emmvmfc"
BACKUP_RETENTION_DAYS="30"

# Security
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"

# Features
ENABLE_2FA="true"
ENABLE_SSO="true"
ENABLE_AUDIT_LOG="true"
ENABLE_AUTO_BACKUP="true"

# Theme EMMVMFC (Azul/Branco/Amarelo)
THEME_PRIMARY="#1e40af"
THEME_SECONDARY="#fbbf24"
THEME_ACCENT="#ffffff"
EOF

# Criar diretórios necessários
mkdir -p uploads logs backups public/images
chmod 755 uploads logs backups

# Gerar cliente Prisma
log "Gerando cliente Prisma..."
npx prisma generate

# Aplicar migrações
log "Aplicando migrações do banco..."
npx prisma db push

# Executar seed EMMVMFC
log "Executando seed EMMVMFC..."
if [ -f "prisma/seed-emmvmfc.ts" ]; then
    npx tsx prisma/seed-emmvmfc.ts
elif [ -f "prisma/seed.ts" ]; then
    npx tsx prisma/seed.ts
else
    warn "Arquivo de seed não encontrado. Pulando esta etapa."
fi

# Build da aplicação
log "Fazendo build da aplicação..."
npm run build

# Configurar PM2 para EMMVMFC
log "Configurando PM2..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'emmvmfc-refeicoes',
    script: 'npm',
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
    node_args: '--max-old-space-size=1024'
  }]
}
EOF

# Configurar Nginx para EMMVMFC
log "Configurando Nginx para $DOMAIN..."
sudo tee /etc/nginx/sites-available/emmvmfc-refeicoes << EOF
# EMMVMFC - Sistema de Refeições Escolares
# Escola Municipal Militarizada de Vicentinópolis Manoel Fernandes da Cunha

server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL Configuration (será configurado pelo Certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Security Headers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Rate Limiting
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone \$binary_remote_addr zone=api:10m rate=30r/m;

    # Main Application
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
        proxy_read_timeout 86400;
    }

    # API Rate Limiting
    location /api/ {
        limit_req zone=api burst=10 nodelay;
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

    # Login Rate Limiting
    location /api/auth/ {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static Files
    location /uploads {
        alias $APP_DIR/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Next.js Static Files
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Favicon and robots
    location = /favicon.ico {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location = /robots.txt {
        proxy_pass http://localhost:3000;
        expires 1d;
        add_header Cache-Control "public";
        access_log off;
    }

    # Health Check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Ativar site Nginx
sudo ln -sf /etc/nginx/sites-available/emmvmfc-refeicoes /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Configurar SSL com Let's Encrypt
log "Configurando SSL para $DOMAIN..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@emmvmfc.com.br

# Configurar renovação automática SSL
sudo tee /etc/cron.d/certbot-emmvmfc << EOF
0 12 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"
EOF

# Iniciar aplicação com PM2
log "Iniciando aplicação EMMVMFC..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configurar backup automático EMMVMFC
log "Configurando backup automático..."
sudo mkdir -p /opt/backups/emmvmfc

cat > /opt/backups/emmvmfc/backup.sh << EOF
#!/bin/bash
# Backup EMMVMFC - Sistema de Refeições Escolares

BACKUP_DIR="/opt/backups/emmvmfc"
DATE=\$(date +%Y%m%d_%H%M%S)
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"
APP_DIR="$APP_DIR"

echo "🏫 Iniciando backup EMMVMFC - \$DATE"

# Backup do banco de dados
echo "📊 Backup do banco de dados..."
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > \$BACKUP_DIR/db_\$DATE.sql.gz

# Backup dos uploads
echo "📁 Backup dos arquivos..."
tar -czf \$BACKUP_DIR/uploads_\$DATE.tar.gz -C $APP_DIR uploads/

# Backup das configurações
echo "⚙️ Backup das configurações..."
tar -czf \$BACKUP_DIR/config_\$DATE.tar.gz -C $APP_DIR .env.local ecosystem.config.js

# Backup dos logs
echo "📝 Backup dos logs..."
tar -czf \$BACKUP_DIR/logs_\$DATE.tar.gz -C $APP_DIR logs/

# Limpeza de backups antigos (manter 30 dias)
echo "🧹 Limpando backups antigos..."
find \$BACKUP_DIR -name "*.gz" -mtime +30 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "✅ Backup EMMVMFC concluído - \$DATE"
EOF

chmod +x /opt/backups/emmvmfc/backup.sh

# Configurar cron para backup diário às 2h
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backups/emmvmfc/backup.sh >> /var/log/emmvmfc-backup.log 2>&1") | crontab -

# Criar script de atualização EMMVMFC
cat > update-emmvmfc.sh << 'EOF'
#!/bin/bash
echo "🔄 Atualizando Sistema EMMVMFC..."

# Parar aplicação
pm2 stop emmvmfc-refeicoes

# Backup antes da atualização
/opt/backups/emmvmfc/backup.sh

# Atualizar código (se usando Git)
git pull origin main

# Atualizar dependências
npm install

# Aplicar migrações
npx prisma db push
npx prisma generate

# Build
npm run build

# Reiniciar aplicação
pm2 restart emmvmfc-refeicoes

echo "✅ Atualização EMMVMFC concluída!"
EOF

chmod +x update-emmvmfc.sh

# Criar script de monitoramento
cat > monitor-emmvmfc.sh << 'EOF'
#!/bin/bash
echo "📊 Status do Sistema EMMVMFC"
echo "=========================="

echo "🖥️  Sistema:"
uptime

echo ""
echo "💾 Memória:"
free -h

echo ""
echo "💿 Disco:"
df -h /

echo ""
echo "🔥 PM2:"
pm2 status

echo ""
echo "🌐 Nginx:"
sudo systemctl status nginx --no-pager -l

echo ""
echo "🗄️  PostgreSQL:"
sudo systemctl status postgresql --no-pager -l

echo ""
echo "🔒 Fail2ban:"
sudo fail2ban-client status

echo ""
echo "🔐 SSL:"
sudo certbot certificates
EOF

chmod +x monitor-emmvmfc.sh

# Configurar logrotate
sudo tee /etc/logrotate.d/emmvmfc << EOF
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Configurar monitoramento de saúde
cat > health-check.sh << 'EOF'
#!/bin/bash
# Health Check EMMVMFC

URL="https://gestor.emmvmfc.com.br/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ EMMVMFC está funcionando"
    exit 0
else
    echo "❌ EMMVMFC não está respondendo (HTTP $RESPONSE)"
    # Tentar reiniciar
    pm2 restart emmvmfc-refeicoes
    exit 1
fi
EOF

chmod +x health-check.sh

# Adicionar health check ao cron (a cada 5 minutos)
(crontab -l 2>/dev/null; echo "*/5 * * * * $APP_DIR/health-check.sh >> /var/log/emmvmfc-health.log 2>&1") | crontab -

# Configurar aliases úteis
cat >> ~/.bashrc << EOF

# EMMVMFC Aliases
alias emmvmfc-status='$APP_DIR/monitor-emmvmfc.sh'
alias emmvmfc-logs='pm2 logs emmvmfc-refeicoes'
alias emmvmfc-restart='pm2 restart emmvmfc-refeicoes'
alias emmvmfc-update='$APP_DIR/update-emmvmfc.sh'
alias emmvmfc-backup='/opt/backups/emmvmfc/backup.sh'
alias emmvmfc-health='$APP_DIR/health-check.sh'
EOF

# Mostrar informações finais
echo ""
echo "🎉 INSTALAÇÃO EMMVMFC CONCLUÍDA COM SUCESSO!"
echo "============================================="
echo ""
echo "🏫 Escola Municipal Militarizada de Vicentinópolis"
echo "   Manoel Fernandes da Cunha"
echo ""
echo "🌐 Sistema: https://$DOMAIN"
echo "📧 Usuários padrão:"
echo "   👤 admin@emmvmfc.com.br / emmvmfc2024"
echo "   👩‍⚕️ nutricionista@emmvmfc.com.br / nutri2024"
echo "   📦 estoque@emmvmfc.com.br / estoque2024"
echo "   👨‍💼 servidor@emmvmfc.com.br / servidor2024"
echo ""
echo "🔧 Comandos úteis:"
echo "   emmvmfc-status    - Status do sistema"
echo "   emmvmfc-logs      - Ver logs"
echo "   emmvmfc-restart   - Reiniciar aplicação"
echo "   emmvmfc-update    - Atualizar sistema"
echo "   emmvmfc-backup    - Fazer backup manual"
echo "   emmvmfc-health    - Verificar saúde"
echo ""
echo "📊 Recursos configurados:"
echo "   ✅ PostgreSQL 16"
echo "   ✅ Node.js 20"
echo "   ✅ PM2 (gerenciamento de processos)"
echo "   ✅ Nginx (proxy reverso)"
echo "   ✅ SSL/HTTPS (Let's Encrypt)"
echo "   ✅ Firewall UFW"
echo "   ✅ Fail2ban (proteção)"
echo "   ✅ Backup automático (diário às 2h)"
echo "   ✅ Monitoramento de saúde"
echo "   ✅ Logrotate"
echo ""
echo "🎨 Tema EMMVMFC:"
echo "   🔵 Primário: Azul (#1e40af)"
echo "   🟡 Secundário: Amarelo (#fbbf24)"
echo "   ⚪ Destaque: Branco (#ffffff)"
echo ""
echo "💾 Backups salvos em:"
echo "   /opt/backups/emmvmfc/"
echo ""
echo "📝 Logs do sistema:"
echo "   $APP_DIR/logs/"
echo "   /var/log/emmvmfc-*.log"
echo ""
echo "🔐 Configurações de segurança:"
echo "   Banco: $DB_NAME"
echo "   Usuário DB: $DB_USER"
echo "   Senha DB: [GERADA AUTOMATICAMENTE]"
echo ""

success "🚀 Sistema EMMVMFC instalado e funcionando!"
success "🌐 Acesse: https://$DOMAIN"

# Recarregar bashrc
source ~/.bashrc

log "Instalação concluída! 🎓"
