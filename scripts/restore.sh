#!/bin/bash
# Script de restauração para o Sistema de Refeições Escolares

# Configurações
BACKUP_DIR="/opt/backups/sistema-refeicoes"
APP_DIR="/var/www/sistema-refeicoes"
LOG_FILE="/var/log/sistema-restore.log"

# Função para log
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Verificar se é root
if [[ $EUID -eq 0 ]]; then
  log "Este script não deve ser executado como root. Use um usuário com privilégios sudo."
  exit 1
fi

# Verificar se o diretório de backup existe
if [ ! -d "$BACKUP_DIR" ]; then
  log "Diretório de backup não encontrado: $BACKUP_DIR"
  exit 1
fi

# Listar backups disponíveis
echo "Backups disponíveis:"
echo "===================="
ls -lt $BACKUP_DIR | grep "db_" | awk '{print $9}' | sed 's/db_//g' | sed 's/.sql.gz//g' | nl

# Solicitar data do backup a ser restaurado
read -p "Digite o número do backup que deseja restaurar: " BACKUP_NUM
BACKUP_DATE=$(ls -lt $BACKUP_DIR | grep "db_" | awk '{print $9}' | sed 's/db_//g' | sed 's/.sql.gz//g' | sed -n "${BACKUP_NUM}p")

if [ -z "$BACKUP_DATE" ]; then
  log "Backup não encontrado"
  exit 1
fi

log "Iniciando restauração do backup de $BACKUP_DATE"

# Confirmar restauração
echo "ATENÇÃO: A restauração irá substituir todos os dados atuais!"
read -p "Tem certeza que deseja continuar? (s/N): " CONFIRM
if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
  log "Restauração cancelada pelo usuário"
  exit 0
fi

# Parar a aplicação
log "Parando a aplicação"
pm2 stop sistema-refeicoes

# Verificar se estamos usando PostgreSQL local ou Neon
if grep -q "NEON_DATABASE_URL" $APP_DIR/.env; then
  log "Detectado uso do Neon - restauração manual necessária"
  echo "Você está usando Neon como banco de dados."
  echo "Por favor, restaure o backup manualmente através do painel do Neon."
  read -p "Pressione Enter quando a restauração do banco estiver concluída..."
else
  # Extrair informações do banco de dados do arquivo .env
  DB_URL=$(grep DATABASE_URL $APP_DIR/.env | cut -d '"' -f 2)
  
  # Restaurar banco de dados
  log "Restaurando banco de dados"
  gunzip -c $BACKUP_DIR/db_$BACKUP_DATE.sql.gz | psql "$DB_URL"
  
  if [ $? -eq 0 ]; then
    log "Restauração do banco de dados concluída com sucesso"
  else
    log "ERRO: Falha na restauração do banco de dados"
    exit 1
  fi
fi

# Restaurar arquivos de upload
if [ -f "$BACKUP_DIR/uploads_$BACKUP_DATE.tar.gz" ]; then
  log "Restaurando arquivos de upload"
  rm -rf $APP_DIR/uploads/*
  tar -xzf $BACKUP_DIR/uploads_$BACKUP_DATE.tar.gz -C $APP_DIR
  
  if [ $? -eq 0 ]; then
    log "Restauração dos uploads concluída com sucesso"
  else
    log "ERRO: Falha na restauração dos uploads"
  fi
else
  log "Arquivo de backup de uploads não encontrado, pulando"
fi

# Restaurar configurações
if [ -f "$BACKUP_DIR/env_$BACKUP_DATE.backup" ]; then
  log "Restaurando configurações"
  cp $BACKUP_DIR/env_$BACKUP_DATE.backup $APP_DIR/.env.restore
  echo "Arquivo .env restaurado como .env.restore"
  echo "Revise o arquivo antes de substituir o atual"
else
  log "Arquivo de backup de configurações não encontrado, pulando"
fi

# Reiniciar a aplicação
log "Reiniciando a aplicação"
pm2 restart sistema-refeicoes

log "Restauração concluída com sucesso"
echo ""
echo "IMPORTANTE: Verifique se a aplicação está funcionando corretamente."
echo "Se necessário, compare o arquivo .env.restore com o .env atual."
echo "Restauração concluída em $(date)"
