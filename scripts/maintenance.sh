#!/bin/bash
# Script de manutenção para o Sistema de Refeições Escolares

# Configurações
APP_DIR="/var/www/sistema-refeicoes"
LOG_FILE="/var/log/sistema-maintenance.log"

# Função para log
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Função para exibir cabeçalho
header() {
  echo ""
  echo "===== $1 ====="
  echo ""
}

# Verificar se está no diretório correto
if [ ! -d "$APP_DIR" ]; then
  log "Diretório da aplicação não encontrado: $APP_DIR"
  exit 1
fi

cd $APP_DIR

log "Iniciando manutenção do Sistema de Refeições Escolares"

# Verificar espaço em disco
header "Espaço em Disco"
df -h /

# Verificar uso de memória
header "Uso de Memória"
free -h

# Verificar carga do sistema
header "Carga do Sistema"
uptime

# Verificar serviços
header "Status dos Serviços"
echo "- Nginx:"
sudo systemctl status nginx --no-pager | grep Active
echo "- PostgreSQL:"
sudo systemctl status postgresql --no-pager | grep Active
echo "- PM2:"
pm2 status sistema-refeicoes

# Verificar logs recentes
header "Logs Recentes (erros)"
tail -n 50 $APP_DIR/logs/err.log

# Verificar certificados SSL
header "Certificados SSL"
sudo certbot certificates | grep -A 2 "Certificate Name"

# Verificar backups recentes
header "Backups Recentes"
ls -lh /opt/backups/sistema-refeicoes | grep -E 'db_|uploads_' | head -n 5

# Verificar conexão com banco de dados
header "Conexão com Banco de Dados"
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function testConnection() {
  try {
    await prisma.\$connect();
    console.log('✅ Conexão com banco de dados OK');
    
    // Verificar algumas estatísticas básicas
    const userCount = await prisma.usuario.count();
    console.log(\`- Usuários cadastrados: \${userCount}\`);
    
    const escolaCount = await prisma.escola.count();
    console.log(\`- Escolas cadastradas: \${escolaCount}\`);
    
    await prisma.\$disconnect();
  } catch (error) {
    console.error('❌ Erro na conexão com banco de dados:', error);
    process.exit(1);
  }
}
testConnection();
"

# Verificar atualizações disponíveis
header "Atualizações Disponíveis"
git fetch origin
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "✅ Sistema atualizado (versão atual)"
else
  echo "⚠️ Atualizações disponíveis:"
  git log --oneline HEAD..@{u} | head -n 5
fi

# Verificar integridade dos arquivos
header "Integridade dos Arquivos"
git status --porcelain

# Verificar tamanho do banco de dados
header "Tamanho do Banco de Dados"
if grep -q "NEON_DATABASE_URL" $APP_DIR/.env; then
  echo "Usando Neon - informações não disponíveis localmente"
else
  # Extrair nome do banco de dados do arquivo .env
  DB_NAME=$(grep DATABASE_URL $APP_DIR/.env | sed -E 's/.*\/([^?]+).*/\1/')
  if [ -n "$DB_NAME" ]; then
    sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME')) as db_size;"
  else
    echo "Não foi possível determinar o nome do banco de dados"
  fi
fi

# Verificar processos Node.js
header "Processos Node.js"
ps aux | grep node | grep -v grep

# Verificar portas em uso
header "Portas em Uso"
sudo netstat -tulpn | grep -E ':(80|443|3000|5432)' | grep LISTEN

log "Manutenção concluída com sucesso"
echo ""
echo "Manutenção concluída em $(date)"
echo "Verifique os logs em $LOG_FILE para mais detalhes."
