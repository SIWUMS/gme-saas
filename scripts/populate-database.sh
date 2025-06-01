#!/bin/bash
# Script para popular o banco de dados com dados iniciais

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

log "Populando banco de dados com dados iniciais..."

# Verificar se PostgreSQL está rodando
if ! sudo systemctl is-active --quiet postgresql; then
    log "Iniciando PostgreSQL..."
    sudo systemctl start postgresql
fi

# Verificar se banco existe
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='emmvmfc_sistema'")
if [ "$DB_EXISTS" != "1" ]; then
    error "Banco de dados emmvmfc_sistema não encontrado. Execute o instalador primeiro."
fi

# Executar schema se necessário
log "Verificando schema do banco..."
TABLES_COUNT=$(sudo -u postgres psql -d emmvmfc_sistema -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'")
if [ "$TABLES_COUNT" -lt "10" ]; then
    log "Criando schema do banco..."
    sudo -u postgres psql -d emmvmfc_sistema -f /var/www/sistema-refeicoes/database/schema.sql
fi

# Popular com dados iniciais
log "Inserindo dados iniciais..."
sudo -u postgres psql -d emmvmfc_sistema -f /var/www/sistema-refeicoes/database/seed-data.sql

# Instalar bcryptjs para senhas
log "Instalando dependência para senhas..."
cd /var/www/sistema-refeicoes
npm install bcryptjs @types/bcryptjs

# Verificar dados inseridos
log "Verificando dados inseridos..."
USERS_COUNT=$(sudo -u postgres psql -d emmvmfc_sistema -tAc "SELECT COUNT(*) FROM usuarios")
ALIMENTOS_COUNT=$(sudo -u postgres psql -d emmvmfc_sistema -tAc "SELECT COUNT(*) FROM alimentos")
ESCOLAS_COUNT=$(sudo -u postgres psql -d emmvmfc_sistema -tAc "SELECT COUNT(*) FROM escolas")

log "Dados inseridos com sucesso:"
log "  - Escolas: $ESCOLAS_COUNT"
log "  - Usuários: $USERS_COUNT"
log "  - Alimentos: $ALIMENTOS_COUNT"

# Reiniciar aplicação
log "Reiniciando aplicação..."
pm2 restart emmvmfc-v31

log "✅ Banco de dados populado com sucesso!"
echo ""
echo "Usuários disponíveis:"
echo "  - superadmin@sistema.com (Super Admin)"
echo "  - admin@escola1.com (Admin Escola)"
echo "  - nutricionista@escola1.com (Nutricionista)"
echo "  - estoquista@escola1.com (Estoquista)"
echo "  - servidor@escola1.com (Servidor)"
echo ""
echo "Senha padrão para todos: 123456"
