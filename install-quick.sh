#!/bin/bash

# ======================================================
# INSTALADOR RÁPIDO EMMVMFC - Versão Simplificada
# Para casos de conexão instável
# ======================================================

set -e

echo "🚀 INSTALADOR RÁPIDO EMMVMFC"
echo "Versão simplificada para conexões instáveis"
echo ""

# Configurações fixas
DOMAIN="gestor.emmvmfc.com.br"
APP_DIR="/var/www/sistema-refeicoes"

# Detectar sudo
if [[ $EUID -eq 0 ]]; then
  SUDO=""
else
  SUDO="sudo"
fi

echo "📧 Email para SSL:"
read -p "> " EMAIL

echo "💾 Banco de dados [local/neon]:"
read -p "> " DB_TYPE

if [[ "$DB_TYPE" == "neon" ]]; then
  echo "🔗 URL do Neon:"
  read -p "> " NEON_URL
  DB_URL="$NEON_URL"
else
  DB_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
  DB_URL="postgresql://emmvmfc_user:$DB_PASS@localhost:5432/emmvmfc_db"
fi

echo ""
echo "🔄 Iniciando instalação..."

# Atualizar sistema (sem interação)
echo "📦 Atualizando sistema..."
export DEBIAN_FRONTEND=noninteractive
$SUDO apt update -y
$SUDO apt upgrade -y -q

# Instalar essenciais
echo "📦 Instalando dependências..."
$SUDO apt install -y curl wget git nginx postgresql-16 nodejs npm

# Instalar yarn e PM2
$SUDO npm install -g yarn pm2

# PostgreSQL local
if [[ "$DB_TYPE" == "local" ]]; then
  echo "🗄️ Configurando PostgreSQL..."
  $SUDO systemctl start postgresql
  $SUDO systemctl enable postgresql
  
  $SUDO -u postgres psql << EOF
CREATE DATABASE emmvmfc_db;
CREATE USER emmvmfc_user WITH PASSWORD '$DB_PASS';
GRANT ALL ON DATABASE emmvmfc_db TO emmvmfc_user;
\q
EOF
fi

# Clonar aplicação
echo "📥 Clonando aplicação..."
$SUDO mkdir -p $APP_DIR
git clone https://github.com/SIWUMS/gme-saas.git $APP_DIR
cd $APP_DIR

# Instalar dependências
echo "📦 Instalando dependências da aplicação..."
yarn install

# Configurar .env
echo "⚙️ Configurando ambiente..."
cat > .env << EOF
NODE_ENV=production
PORT=3000
DATABASE_URL="$DB_URL"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://$DOMAIN"
APP_NAME="Sistema EMMVMFC"
EOF

# Build
echo "🔨 Compilando aplicação..."
yarn build

# PM2
echo "🚀 Configurando PM2..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'emmvmfc',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: { NODE_ENV: 'production', PORT: 3000 }
  }]
}
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Nginx
echo "🌐 Configurando Nginx..."
$SUDO tee /etc/nginx/sites-available/emmvmfc << EOF
server {
    listen 80;
    server_name $DOMAIN;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

$SUDO ln -sf /etc/nginx/sites-available/emmvmfc /etc/nginx/sites-enabled/
$SUDO rm -f /etc/nginx/sites-enabled/default
$SUDO systemctl reload nginx

# SSL
echo "🔒 Configurando SSL..."
$SUDO apt install -y certbot python3-certbot-nginx
$SUDO certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m $EMAIL

# Firewall
echo "🛡️ Configurando firewall..."
$SUDO ufw allow OpenSSH
$SUDO ufw allow 'Nginx Full'
$SUDO ufw --force enable

# Finalizar
echo ""
echo "🎉 INSTALAÇÃO CONCLUÍDA!"
echo "URL: https://$DOMAIN"
echo "Admin: admin@emmvmfc.com.br"
echo "Senha: admin123"

if [[ "$DB_TYPE" == "local" ]]; then
  echo "DB Senha: $DB_PASS"
fi

echo ""
echo "Comandos úteis:"
echo "pm2 status"
echo "pm2 logs emmvmfc"
echo "pm2 restart emmvmfc"
