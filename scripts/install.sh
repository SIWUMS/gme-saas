#!/bin/bash

# Script de Instalação - Sistema de Refeições Escolares EMMVMFC
# Escola Municipal Militarizada de Vicentinópolis Manoel Fernandes da Cunha
# Domínio: gestor.emmvmfc.com.br
# Versão: 3.1.0
# Localização: /scripts/install-emmvmfc.sh

set -e  # Parar em caso de erro

echo "🏫 Instalando Sistema de Refeições Escolares - EMMVMFC"
echo "======================================================"
echo "Escola Municipal Militarizada de Vicentinópolis"
echo "Manoel Fernandes da Cunha"
echo "Domínio: gestor.emmvmfc.com.br"
echo "======================================================"

# Verificar se está sendo executado como root (necessário para instalação)
if [ "$EUID" -ne 0 ]; then
    echo "[INFO] Executando como usuário normal. Algumas operações podem precisar de sudo."
    SUDO="sudo"
else
    echo "[INFO] Executando como root. Prosseguindo com instalação completa."
    SUDO=""
fi

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar sistema operacional
if [[ ! -f /etc/os-release ]]; then
    error "Sistema operacional não suportado"
fi

source /etc/os-release
if [[ "$ID" != "ubuntu" ]]; then
    error "Este script é específico para Ubuntu. Sistema detectado: $ID"
fi

if [[ "$VERSION_ID" != "22.04" && "$VERSION_ID" != "20.04" ]]; then
    warning "Versão do Ubuntu não testada: $VERSION_ID. Recomendado: 22.04"
fi

log "Sistema operacional: $PRETTY_NAME"

# Configurações específicas EMMVMFC
DOMAIN="gestor.emmvmfc.com.br"
APP_NAME="emmvmfc-sistema"
APP_DIR="/var/www/emmvmfc"
DB_NAME="emmvmfc_db"
DB_USER="emmvmfc_user"
DB_PASS=$(openssl rand -base64 32)
ADMIN_EMAIL="admin@emmvmfc.com.br"
ADMIN_PASS="emmvmfc2024"

# Verificar se o domínio está apontando para este servidor
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

if [[ "$SERVER_IP" != "$DOMAIN_IP" ]]; then
    warning "O domínio $DOMAIN não está apontando para este servidor"
    warning "IP do servidor: $SERVER_IP"
    warning "IP do domínio: $DOMAIN_IP"
    warning "Configure o DNS antes de continuar para SSL funcionar"
fi

log "Iniciando instalação para EMMVMFC..."

# Atualizar sistema
log "Atualizando sistema..."
$SUDO apt update && $SUDO apt upgrade -y

# Instalar dependências básicas
log "Instalando dependências básicas..."
$SUDO apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Instalar Node.js 20
log "Instalando Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO -E bash -
$SUDO apt install -y nodejs

# Verificar instalação do Node.js
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
log "Node.js instalado: $NODE_VERSION"
log "NPM instalado: $NPM_VERSION"

# Instalar PostgreSQL 16
log "Instalando PostgreSQL 16..."
$SUDO sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | $SUDO apt-key add -
$SUDO apt update
$SUDO apt install -y postgresql-16 postgresql-client-16 postgresql-contrib-16

# Configurar PostgreSQL
log "Configurando PostgreSQL..."
$SUDO systemctl start postgresql
$SUDO systemctl enable postgresql

# Criar banco de dados e usuário
log "Criando banco de dados EMMVMFC..."
$SUDO -u postgres psql -c "CREATE DATABASE $DB_NAME;"
$SUDO -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';"
$SUDO -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
$SUDO -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

# Instalar Nginx
log "Instalando Nginx..."
$SUDO apt install -y nginx

# Instalar PM2 globalmente
log "Instalando PM2..."
$SUDO npm install -g pm2

# Criar diretório da aplicação
log "Criando diretório da aplicação..."
$SUDO mkdir -p $APP_DIR
$SUDO chown -R $USER:$USER $APP_DIR

# Clonar repositório
log "Clonando repositório SIWUMS/gme-saas..."
cd $APP_DIR
git clone https://github.com/SIWUMS/gme-saas.git .

# Instalar dependências do projeto
log "Instalando dependências do projeto..."
npm install

# Configurar variáveis de ambiente
log "Configurando variáveis de ambiente..."
cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public"

# NextAuth
NEXTAUTH_URL="https://$DOMAIN"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# EMMVMFC Configuration
SCHOOL_NAME="Escola Municipal Militarizada de Vicentinópolis Manoel Fernandes da Cunha"
SCHOOL_ACRONYM="EMMVMFC"
SCHOOL_DOMAIN="$DOMAIN"
SCHOOL_CITY="Vicentinópolis"
SCHOOL_STATE="GO"
SCHOOL_THEME_PRIMARY="#1e40af"
SCHOOL_THEME_SECONDARY="#fbbf24"

# Email Configuration (configure conforme necessário)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="sistema@emmvmfc.com.br"
SMTP_PASS="sua_senha_aqui"

# File Upload
UPLOAD_DIR="/var/www/emmvmfc/uploads"
MAX_FILE_SIZE="10485760"

# Backup Configuration
BACKUP_DIR="/var/backups/emmvmfc"
BACKUP_RETENTION_DAYS="30"
EOF

# Configurar Prisma
log "Configurando banco de dados com Prisma..."
npx prisma generate
npx prisma db push

# Executar seeds (dados iniciais)
log "Inserindo dados iniciais..."
npx prisma db seed

# Build da aplicação
log "Fazendo build da aplicação..."
npm run build

# Configurar PM2
log "Configurando PM2..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/$APP_NAME-error.log',
    out_file: '/var/log/pm2/$APP_NAME-out.log',
    log_file: '/var/log/pm2/$APP_NAME.log',
    time: true
  }]
}
EOF

# Criar diretório de logs
$SUDO mkdir -p /var/log/pm2
$SUDO chown -R $USER:$USER /var/log/pm2

# Iniciar aplicação com PM2
log "Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configurar Nginx
log "Configurando Nginx..."
$SUDO tee /etc/nginx/sites-available/$DOMAIN << EOF
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
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    
    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;
    
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
    
    # Rate limit login attempts
    location /api/auth {
        limit_req zone=login burst=5 nodelay;
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
    
    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Uploads
    location /uploads {
        alias /var/www/emmvmfc/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ativar site
$SUDO ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
$SUDO rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
$SUDO nginx -t

# Instalar Certbot para SSL
log "Instalando Certbot para SSL..."
$SUDO apt install -y certbot python3-certbot-nginx

# Configurar SSL (apenas se o domínio estiver apontando corretamente)
if [[ "$SERVER_IP" == "$DOMAIN_IP" ]]; then
    log "Configurando SSL com Let's Encrypt..."
    $SUDO certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@emmvmfc.com.br
else
    warning "Pulando configuração SSL - configure o DNS primeiro"
    # Configuração temporária sem SSL
    $SUDO tee /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
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
}
EOF
fi

# Reiniciar Nginx
$SUDO systemctl restart nginx
$SUDO systemctl enable nginx

# Configurar Firewall
log "Configurando Firewall..."
$SUDO ufw --force enable
$SUDO ufw allow ssh
$SUDO ufw allow 'Nginx Full'
$SUDO ufw allow 5432  # PostgreSQL (apenas local)

# Instalar e configurar Fail2ban
log "Instalando Fail2ban..."
$SUDO apt install -y fail2ban

$SUDO tee /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
action = iptables-multiport[name=ReqLimit, port="http,https", protocol=tcp]
logpath = /var/log/nginx/*error.log
findtime = 600
bantime = 7200
maxretry = 10
EOF

$SUDO systemctl restart fail2ban
$SUDO systemctl enable fail2ban

# Configurar backup automático
log "Configurando backup automático..."
$SUDO mkdir -p /var/backups/emmvmfc

$SUDO tee /usr/local/bin/backup-emmvmfc.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/emmvmfc"
DATE=\$(date +%Y%m%d_%H%M%S)
DB_BACKUP="\$BACKUP_DIR/db_\$DATE.sql"
FILES_BACKUP="\$BACKUP_DIR/files_\$DATE.tar.gz"

# Backup do banco de dados
pg_dump -h localhost -U $DB_USER -d $DB_NAME > \$DB_BACKUP

# Backup dos arquivos
tar -czf \$FILES_BACKUP -C /var/www emmvmfc

# Remover backups antigos (mais de 30 dias)
find \$BACKUP_DIR -name "*.sql" -mtime +30 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup concluído: \$DATE"
EOF

$SUDO chmod +x /usr/local/bin/backup-emmvmfc.sh

# Configurar cron para backup diário às 2h
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-emmvmfc.sh >> /var/log/backup-emmvmfc.log 2>&1") | crontab -

# Criar aliases úteis
log "Criando aliases úteis..."
cat >> ~/.bashrc << EOF

# EMMVMFC System Aliases
alias emmvmfc-status='pm2 status $APP_NAME'
alias emmvmfc-logs='pm2 logs $APP_NAME'
alias emmvmfc-restart='pm2 restart $APP_NAME'
alias emmvmfc-stop='pm2 stop $APP_NAME'
alias emmvmfc-start='pm2 start $APP_NAME'
alias emmvmfc-backup='/usr/local/bin/backup-emmvmfc.sh'
alias emmvmfc-update='cd $APP_DIR && git pull && npm install && npm run build && pm2 restart $APP_NAME'
alias emmvmfc-db='psql -h localhost -U $DB_USER -d $DB_NAME'
alias emmvmfc-nginx='sudo nginx -t && sudo systemctl reload nginx'
alias emmvmfc-ssl='sudo certbot renew --dry-run'
EOF

# Criar script de monitoramento
$SUDO tee /usr/local/bin/emmvmfc-health.sh << EOF
#!/bin/bash
echo "🏫 EMMVMFC - Status do Sistema"
echo "=============================="
echo "Data: \$(date)"
echo ""

# Status dos serviços
echo "📊 Status dos Serviços:"
echo "- PostgreSQL: \$(systemctl is-active postgresql)"
echo "- Nginx: \$(systemctl is-active nginx)"
echo "- PM2: \$(pm2 list | grep -c online) processos online"
echo ""

# Status do disco
echo "💾 Uso do Disco:"
df -h / | tail -1 | awk '{print "- Usado: " \$3 " / " \$2 " (" \$5 ")"}'
echo ""

# Status da memória
echo "🧠 Uso da Memória:"
free -h | grep Mem | awk '{print "- Usado: " \$3 " / " \$2}'
echo ""

# Status da aplicação
echo "🌐 Status da Aplicação:"
if curl -s http://localhost:3000 > /dev/null; then
    echo "- Aplicação: ✅ Online"
else
    echo "- Aplicação: ❌ Offline"
fi

# Último backup
echo ""
echo "💾 Último Backup:"
ls -la /var/backups/emmvmfc/*.sql 2>/dev/null | tail -1 | awk '{print "- " \$9 " (" \$6 " " \$7 " " \$8 ")"}'
EOF

$SUDO chmod +x /usr/local/bin/emmvmfc-health.sh

# Criar usuários padrão do sistema
log "Criando usuários padrão..."
cat > /tmp/create-users.js << EOF
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUsers() {
  const users = [
    {
      email: 'admin@emmvmfc.com.br',
      password: 'emmvmfc2024',
      name: 'Administrador EMMVMFC',
      role: 'ADMIN'
    },
    {
      email: 'nutricionista@emmvmfc.com.br',
      password: 'nutri2024',
      name: 'Nutricionista EMMVMFC',
      role: 'NUTRICIONISTA'
    },
    {
      email: 'estoque@emmvmfc.com.br',
      password: 'estoque2024',
      name: 'Responsável Estoque',
      role: 'ESTOQUE'
    },
    {
      email: 'servidor@emmvmfc.com.br',
      password: 'servidor2024',
      name: 'Servidor EMMVMFC',
      role: 'SERVIDOR'
    }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: user.role,
        active: true
      }
    });
    
    console.log(\`Usuário criado: \${user.email}\`);
  }
}

createUsers()
  .catch(console.error)
  .finally(() => prisma.\$disconnect());
EOF

cd $APP_DIR
node /tmp/create-users.js
rm /tmp/create-users.js

# Configurar logs
log "Configurando logs..."
$SUDO mkdir -p /var/log/emmvmfc
$SUDO chown -R $USER:$USER /var/log/emmvmfc

# Configurar logrotate
$SUDO tee /etc/logrotate.d/emmvmfc << EOF
/var/log/emmvmfc/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}

/var/log/pm2/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF

# Salvar informações importantes
log "Salvando informações da instalação..."
cat > /root/emmvmfc-install-info.txt << EOF
🏫 EMMVMFC - Informações da Instalação
=====================================
Data da Instalação: $(date)
Domínio: $DOMAIN
Diretório: $APP_DIR

📊 Banco de Dados:
- Nome: $DB_NAME
- Usuário: $DB_USER
- Senha: $DB_PASS

👥 Usuários Padrão:
- admin@emmvmfc.com.br / emmvmfc2024
- nutricionista@emmvmfc.com.br / nutri2024
- estoque@emmvmfc.com.br / estoque2024
- servidor@emmvmfc.com.br / servidor2024

🔧 Comandos Úteis:
- emmvmfc-status: Status da aplicação
- emmvmfc-logs: Ver logs
- emmvmfc-restart: Reiniciar aplicação
- emmvmfc-backup: Fazer backup
- emmvmfc-health: Status do sistema
- emmvmfc-update: Atualizar sistema

📁 Diretórios Importantes:
- Aplicação: $APP_DIR
- Backups: /var/backups/emmvmfc
- Logs: /var/log/emmvmfc
- Uploads: $APP_DIR/uploads

🌐 URLs:
- Sistema: http://$SERVER_IP (ou https://$DOMAIN se SSL configurado)
- Logs PM2: /var/log/pm2/
EOF

# Recarregar bashrc
source ~/.bashrc

log "✅ Instalação concluída com sucesso!"
echo ""
echo "🏫 Sistema de Refeições Escolares EMMVMFC"
echo "=========================================="
echo "🌐 Acesso: http://$SERVER_IP"
if [[ "$SERVER_IP" == "$DOMAIN_IP" ]]; then
    echo "🔒 HTTPS: https://$DOMAIN"
fi
echo ""
echo "👥 Usuários padrão criados:"
echo "   - admin@emmvmfc.com.br / emmvmfc2024"
echo "   - nutricionista@emmvmfc.com.br / nutri2024"
echo "   - estoque@emmvmfc.com.br / estoque2024"
echo "   - servidor@emmvmfc.com.br / servidor2024"
echo ""
echo "📋 Informações salvas em: /root/emmvmfc-install-info.txt"
echo ""
echo "🔧 Comandos úteis disponíveis:"
echo "   - emmvmfc-status"
echo "   - emmvmfc-logs"
echo "   - emmvmfc-health"
echo "   - emmvmfc-backup"
echo ""
echo "🎓 Sistema pronto para uso na EMMVMFC!"
