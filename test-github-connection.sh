#!/bin/bash

# Script para testar conectividade com o repositório GitHub
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
API_URL="https://api.github.com/repos/SIWUMS/gme-saas"

log() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

success() {
  echo -e "${GREEN}[OK]${NC} $1"
}

# Cabeçalho
clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║     ${GREEN}Teste de Conectividade - GitHub Repository${BLUE}                ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║     ${YELLOW}https://github.com/SIWUMS/gme-saas${BLUE}                      ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

log "Iniciando testes de conectividade..."
echo ""

# Teste 1: Ping para GitHub
echo -e "${BLUE}1. Testando conectividade com GitHub...${NC}"
if ping -c 3 github.com &>/dev/null; then
  success "Conectividade com GitHub OK"
else
  warn "Problemas de conectividade com GitHub"
fi

# Teste 2: Verificar se o repositório existe
echo -e "${BLUE}2. Verificando se o repositório existe...${NC}"
if command -v curl &> /dev/null; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
  if [ "$HTTP_CODE" = "200" ]; then
    success "Repositório encontrado e acessível"
    
    # Obter informações do repositório
    REPO_INFO=$(curl -s "$API_URL")
    if command -v jq &> /dev/null; then
      echo "  Nome: $(echo "$REPO_INFO" | jq -r '.full_name')"
      echo "  Descrição: $(echo "$REPO_INFO" | jq -r '.description // "Sem descrição"')"
      echo "  Último push: $(echo "$REPO_INFO" | jq -r '.pushed_at')"
      echo "  Tamanho: $(echo "$REPO_INFO" | jq -r '.size') KB"
    fi
  else
    warn "Repositório não encontrado ou inacessível (HTTP $HTTP_CODE)"
  fi
elif command -v wget &> /dev/null; then
  if wget -q --spider "$REPO_URL" 2>/dev/null; then
    success "Repositório acessível via wget"
  else
    warn "Repositório inacessível via wget"
  fi
else
  warn "Nem curl nem wget disponíveis para teste"
fi

# Teste 3: Testar clone do repositório
echo -e "${BLUE}3. Testando clone do repositório...${NC}"
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

if command -v git &> /dev/null; then
  if git clone --depth 1 "$REPO_URL.git" test-clone &>/dev/null; then
    success "Clone do repositório bem-sucedido"
    
    cd test-clone
    echo "  Arquivos principais encontrados:"
    [ -f "package.json" ] && echo "    ✅ package.json"
    [ -d "app" ] && echo "    ✅ app/"
    [ -d "components" ] && echo "    ✅ components/"
    [ -d "lib" ] && echo "    ✅ lib/"
    [ -f "install-emmvmfc-v31.sh" ] && echo "    ✅ install-emmvmfc-v31.sh"
    
    cd ..
  else
    warn "Falha no clone do repositório"
  fi
else
  warn "Git não está instalado"
fi

# Limpeza
cd /
rm -rf "$TEMP_DIR"

# Teste 4: Testar download de arquivo específico
echo -e "${BLUE}4. Testando download de arquivo específico...${NC}"
TEST_FILE="package.json"

if command -v wget &> /dev/null; then
  if wget -q -O /tmp/test-download "$RAW_URL/$TEST_FILE" 2>/dev/null; then
    success "Download de arquivo específico OK (wget)"
    rm -f /tmp/test-download
  else
    warn "Falha no download com wget"
  fi
elif command -v curl &> /dev/null; then
  if curl -s -o /tmp/test-download "$RAW_URL/$TEST_FILE" 2>/dev/null; then
    success "Download de arquivo específico OK (curl)"
    rm -f /tmp/test-download
  else
    warn "Falha no download com curl"
  fi
fi

# Teste 5: Verificar ferramentas necessárias
echo -e "${BLUE}5. Verificando ferramentas necessárias...${NC}"

TOOLS=("git" "wget" "curl" "unzip" "node" "npm")
MISSING_TOOLS=()

for tool in "${TOOLS[@]}"; do
  if command -v "$tool" &> /dev/null; then
    success "$tool está instalado"
  else
    warn "$tool NÃO está instalado"
    MISSING_TOOLS+=("$tool")
  fi
done

# Resumo final
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                        ${GREEN}RESUMO DOS TESTES${BLUE}                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"

if [ ${#MISSING_TOOLS[@]} -eq 0 ]; then
  success "✅ Todas as ferramentas necessárias estão instaladas"
  success "✅ Sistema pronto para instalação"
  echo ""
  echo -e "${GREEN}Você pode prosseguir com a instalação:${NC}"
  echo -e "${YELLOW}./install-emmvmfc-v31.sh${NC}"
else
  warn "⚠️  Ferramentas em falta: ${MISSING_TOOLS[*]}"
  echo ""
  echo -e "${YELLOW}Instale as ferramentas em falta:${NC}"
  echo -e "${YELLOW}sudo apt update && sudo apt install -y ${MISSING_TOOLS[*]}${NC}"
fi

echo ""
echo -e "${BLUE}Repositório testado: ${YELLOW}https://github.com/SIWUMS/gme-saas${NC}"
echo -e "${GREEN}Teste de conectividade concluído!${NC}"
