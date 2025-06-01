#!/bin/bash

# Script para verificar atualizações do repositório
# Repositório: https://github.com/SIWUMS/gme-saas

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar se estamos em um repositório git
if [ ! -d ".git" ]; then
  error "Este diretório não é um repositório git. Execute o clone primeiro."
fi

log "Verificando atualizações do repositório..."

# Buscar atualizações
git fetch origin

# Verificar se há commits novos
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
  log "✅ Repositório está atualizado!"
else
  warn "📦 Há atualizações disponíveis!"
  
  echo ""
  echo -e "${BLUE}Commits novos:${NC}"
  git log --oneline $LOCAL..$REMOTE
  
  echo ""
  read -p "Deseja atualizar agora? (y/N): " -n 1 -r
  echo
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "Atualizando repositório..."
    
    # Fazer backup das alterações locais se houver
    if ! git diff --quiet; then
      warn "Há alterações locais. Fazendo stash..."
      git stash push -m "Backup antes da atualização - $(date)"
    fi
    
    # Atualizar
    git pull origin main
    
    log "✅ Repositório atualizado com sucesso!"
    
    # Verificar se há stash
    if git stash list | grep -q "Backup antes da atualização"; then
      warn "Suas alterações locais foram salvas no stash."
      echo "Para restaurá-las: git stash pop"
    fi
    
    # Verificar se package.json foi alterado
    if git diff HEAD~1 --name-only | grep -q "package.json"; then
      warn "package.json foi alterado. Execute: npm install"
    fi
  fi
fi

# Mostrar status do repositório
echo ""
echo -e "${BLUE}Status do repositório:${NC}"
echo -e "Branch atual: ${YELLOW}$(git branch --show-current)${NC}"
echo -e "Último commit: ${YELLOW}$(git log -1 --format='%h - %s (%cr)')${NC}"
echo -e "Origem: ${YELLOW}$(git remote get-url origin)${NC}"
