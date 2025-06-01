#!/bin/bash
# Script de atualização para o Sistema de Refeições Escolares

set -e

# Configurações
APP_DIR="/var/www/sistema-refeicoes"
BACKUP_DIR="/opt/backups/sistema-refeicoes"
LOG_FILE="/var/log/sistema-update.log"
DATE=$(date +%Y%m%d_%H%M%S)

# Função para log
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Verificar se está no diretório correto
if [ ! -d "$APP_DIR" ]; then
  log "Diretório da aplicação não encontrado: $APP_DIR"
  exit 1
fi

cd $APP_DIR

log "Iniciando atualização do Sistema de Refeições Escolares"

# Verificar se há alterações não commitadas
if [ -n "$(git status --porcelain)" ]; then
  log "AVISO: Existem alterações locais não commitadas"
  git status
  read -p "Deseja continuar mesmo assim? (s/N): " CONTINUE
  if [[ "$CONTINUE" != "s" && "$CONTINUE" != "S" ]]; then
    log "Atualização cancelada pelo usuário"
    exit 0
  fi
fi

# Fazer backup antes da atualização
log "Criando backup antes da atualização"
/opt/backups/sistema-refeicoes/backup.sh

# Verificar branch atual
CURRENT_BRANCH=$(git branch --show-current)
log "Branch atual: $CURRENT_BRANCH"

# Obter alterações do repositório
log "Obtendo atualizações do repositório"
git fetch origin

# Verificar se há atualizações disponíveis
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" = "$REMOTE" ]; then
  log "O sistema já está atualizado (versão $LOCAL)"
  echo "O sistema já está na versão mais recente."
  exit 0
fi

# Mostrar alterações que serão aplicadas
echo "Alterações que serão aplicadas:"
git log --oneline HEAD..@{u}

# Confirmar atualização
read -p "Deseja continuar com a atualização? (s/N): " CONFIRM
if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
  log "Atualização cancelada pelo usuário"
  exit 0
fi

# Aplicar atualizações
log "Aplicando atualizações"
git pull origin $CURRENT_BRANCH

# Atualizar dependências
log "Atualizando dependências"
yarn install

# Verificar se há migrações de banco de dados
if [ -f "$APP_DIR/prisma/schema.prisma" ]; then
  log "Verificando migrações do banco de dados"
  
  # Gerar cliente Prisma
  log "Gerando cliente Prisma"
  npx prisma generate
  
  # Aplicar migrações
  log "Aplicando migrações do banco de dados"
  npx prisma db push
fi

# Compilar aplicação
log "Compilando aplicação"
yarn build

# Reiniciar aplicação
log "Reiniciando aplicação"
pm2 restart sistema-refeicoes

# Verificar status da aplicação
sleep 5
PM2_STATUS=$(pm2 show sistema-refeicoes | grep status | awk '{print $4}')

if [ "$PM2_STATUS" = "online" ]; then
  log "Aplicação reiniciada com sucesso (status: online)"
else
  log "AVISO: A aplicação pode não ter iniciado corretamente (status: $PM2_STATUS)"
  log "Verificando logs para possíveis erros"
  tail -n 50 $APP_DIR/logs/err.log >> $LOG_FILE
fi

log "Atualização concluída com sucesso"
echo ""
echo "Sistema atualizado para a versão mais recente."
echo "Verifique os logs em $LOG_FILE para mais detalhes."
