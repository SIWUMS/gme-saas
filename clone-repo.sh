#!/bin/bash

# Script para clonar o repositório do Sistema de Refeições Escolares
# Repositório: https://github.com/SIWUMS/gme-frontend

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
  error "Git não está instalado. Instale com: sudo apt install git"
fi

# Definir diretório de destino
DEST_DIR="${1:-./sistema-refeicoes}"

log "Clonando repositório do Sistema de Refeições Escolares..."
log "Repositório: https://github.com/SIWUMS/gme-frontend"
log "Destino: $DEST_DIR"

# Criar diretório se não existir
mkdir -p "$DEST_DIR"
cd "$DEST_DIR"

# Limpar diretório se não estiver vazio
if [ "$(ls -A .)" ]; then
  warn "Diretório não está vazio. Fazendo backup..."
  BACKUP_DIR="../backup-$(date +%Y%m%d_%H%M%S)"
  mkdir -p "$BACKUP_DIR"
  cp -r ./* "$BACKUP_DIR/" 2>/dev/null || true
  rm -rf ./* ./.* 2>/dev/null || true
  log "Backup salvo em: $BACKUP_DIR"
fi

# Método 1: Clone direto com git
log "Tentativa 1: Clone direto com git..."
if git clone https://github.com/SIWUMS/gme-frontend.git . 2>/dev/null; then
  log "✅ Repositório clonado com sucesso via git!"
else
  warn "❌ Falha no clone direto. Tentando métodos alternativos..."
  
  # Método 2: Download do ZIP
  log "Tentativa 2: Download do arquivo ZIP..."
  if command -v wget &> /dev/null; then
    if wget -O repo.zip https://github.com/SIWUMS/gme-frontend/archive/refs/heads/main.zip 2>/dev/null; then
      if command -v unzip &> /dev/null; then
        unzip -q repo.zip
        mv gme-frontend-main/* . 2>/dev/null || true
        mv gme-frontend-main/.* . 2>/dev/null || true
        rm -rf gme-frontend-main repo.zip
        log "✅ Código baixado via wget com sucesso!"
      else
        error "unzip não está instalado. Instale com: sudo apt install unzip"
      fi
    else
      warn "❌ Falha no download com wget"
    fi
  elif command -v curl &> /dev/null; then
    log "Tentativa 3: Download com curl..."
    if curl -L -o repo.zip https://github.com/SIWUMS/gme-frontend/archive/refs/heads/main.zip 2>/dev/null; then
      if command -v unzip &> /dev/null; then
        unzip -q repo.zip
        mv gme-frontend-main/* . 2>/dev/null || true
        mv gme-frontend-main/.* . 2>/dev/null || true
        rm -rf gme-frontend-main repo.zip
        log "✅ Código baixado via curl com sucesso!"
      else
        error "unzip não está instalado. Instale com: sudo apt install unzip"
      fi
    else
      error "❌ Falha no download com curl"
    fi
  else
    error "Nem wget nem curl estão disponíveis. Instale um deles."
  fi
fi

# Verificar se o download foi bem-sucedido
if [ ! -f "package.json" ]; then
  error "❌ Falha ao baixar o código. Verifique sua conexão com a internet."
fi

log "✅ Código baixado com sucesso!"
log "📁 Arquivos no diretório:"
ls -la

# Verificar arquivos principais
REQUIRED_FILES=("package.json" "app" "components" "lib")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -e "$file" ]; then
    MISSING_FILES+=("$file")
  fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
  warn "⚠️  Arquivos/diretórios em falta: ${MISSING_FILES[*]}"
  warn "Verifique se o download foi completo"
else
  log "✅ Todos os arquivos principais estão presentes"
fi

# Mostrar próximos passos
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "1. ${YELLOW}cd $DEST_DIR${NC}"
echo -e "2. ${YELLOW}npm install${NC}"
echo -e "3. ${YELLOW}cp .env.example .env.local${NC}"
echo -e "4. ${YELLOW}npm run dev${NC}"
echo ""
echo -e "${GREEN}🎉 Repositório clonado com sucesso!${NC}"
