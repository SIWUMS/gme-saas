#!/bin/bash

# Script para baixar os instaladores do Sistema de Refeições Escolares
# Repositório: https://github.com/SIWUMS/gme-saas

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URLs do repositório
REPO_URL="https://github.com/SIWUMS/gme-saas"
RAW_URL="https://raw.githubusercontent.com/SIWUMS/gme-saas/main"

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

# Cabeçalho
clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║     ${GREEN}Download dos Instaladores - Sistema de Refeições${BLUE}          ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║     ${YELLOW}Repositório: https://github.com/SIWUMS/gme-saas${BLUE}           ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Lista de arquivos para baixar
INSTALLERS=(
  "install-emmvmfc-v31.sh:Instalador principal completo"
  "install-quick.sh:Instalador rápido"
  "install-robust.sh:Instalador robusto"
  "install-root.sh:Instalador para execução como root"
  "clone-repo.sh:Script para clonar repositório"
  "check-updates.sh:Script para verificar atualizações"
)

# Função para baixar arquivo
download_file() {
  local filename="$1"
  local description="$2"
  
  log "Baixando: $filename ($description)"
  
  # Tentar com wget primeiro
  if command -v wget &> /dev/null; then
    if wget -q --show-progress -O "$filename" "$RAW_URL/$filename" 2>/dev/null; then
      chmod +x "$filename"
      log "✅ $filename baixado com sucesso!"
      return 0
    fi
  fi
  
  # Tentar com curl
  if command -v curl &> /dev/null; then
    if curl -L -o "$filename" "$RAW_URL/$filename" 2>/dev/null; then
      chmod +x "$filename"
      log "✅ $filename baixado com sucesso!"
      return 0
    fi
  fi
  
  warn "❌ Falha ao baixar $filename"
  return 1
}

# Menu de seleção
echo -e "${BLUE}Selecione os instaladores para baixar:${NC}"
echo ""

for i in "${!INSTALLERS[@]}"; do
  IFS=':' read -r filename description <<< "${INSTALLERS[$i]}"
  echo -e "${YELLOW}$((i+1)).${NC} $filename - $description"
done

echo -e "${YELLOW}0.${NC} Baixar todos"
echo ""

read -p "Digite sua escolha (0-${#INSTALLERS[@]}): " choice

case $choice in
  0)
    log "Baixando todos os instaladores..."
    for installer in "${INSTALLERS[@]}"; do
      IFS=':' read -r filename description <<< "$installer"
      download_file "$filename" "$description"
    done
    ;;
  [1-9])
    if [ "$choice" -le "${#INSTALLERS[@]}" ]; then
      IFS=':' read -r filename description <<< "${INSTALLERS[$((choice-1))]}"
      download_file "$filename" "$description"
    else
      error "Opção inválida!"
    fi
    ;;
  *)
    error "Opção inválida!"
    ;;
esac

echo ""
log "✅ Download concluído!"
echo ""
echo -e "${BLUE}Arquivos baixados:${NC}"
ls -la *.sh 2>/dev/null || echo "Nenhum arquivo .sh encontrado"

echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "1. ${YELLOW}chmod +x *.sh${NC} (dar permissão de execução)"
echo -e "2. ${YELLOW}./install-emmvmfc-v31.sh${NC} (executar instalador principal)"
echo ""
echo -e "${GREEN}🎉 Pronto para instalar o sistema!${NC}"
