#!/bin/bash

# Instalador do Sistema de Refeições Escolares - Versão 31
# Criado para EMMVMFC
# Data: 01/06/2025

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis globais
DOMAIN="gestor.emmvmfc.com.br"
APP_DIR="/var/www/sistema-refeicoes"
BACKUP_DIR="/opt/backups/sistema-refeicoes"
LOG_FILE="/tmp/install-emmvmfc-v31.log"
PROGRESS_FILE="/tmp/install-progress.txt"
INSTALL_STEPS=10
CURRENT_STEP=0

# Função para log
log() {
  echo -e "${GREEN}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
  exit 1
}

# Função para atualizar progresso
update_progress() {
  CURRENT_STEP=$1
  echo "$CURRENT_STEP" > "$PROGRESS_FILE"
  PERCENT=$((CURRENT_STEP * 100 / INSTALL_STEPS))
  
  # Barra de progresso
  printf "${BLUE}[%-50s] %d%%${NC}\r" $(printf "%0.s#" $(seq 1 $((PERCENT / 2)))) $PERCENT
}

# Função para executar comando com retry
run_with_retry() {
  local cmd="$1"
  local max_attempts=${2:-3}
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    echo "Executando: $cmd (tentativa $attempt de $max_attempts)" >> "$LOG_FILE"
    
    if eval "$cmd" >> "$LOG_FILE" 2>&1; then
      return 0
    else
      echo "Comando falhou. Tentando novamente em 5 segundos..." >> "$LOG_FILE"
      sleep 5
      attempt=$((attempt + 1))
    fi
  done
  
  echo "Comando falhou após $max_attempts tentativas: $cmd" >> "$LOG_FILE"
  return 1
}

# Verificar se o script já foi executado parcialmente
if [ -f "$PROGRESS_FILE" ]; then
  CURRENT_STEP=$(cat "$PROGRESS_FILE")
  log "Retomando instalação a partir da etapa $CURRENT_STEP"
else
  echo "0" > "$PROGRESS_FILE"
fi

# Cabeçalho
clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║     ${GREEN}Sistema de Refeições Escolares - Instalador v31${BLUE}            ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║     ${YELLOW}EMMVMFC - Escola Municipal Maria Vitória Fernandes Campos${BLUE} ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar permissões
if [[ $EUID -eq 0 ]]; then
  SUDO=""
  log "Executando como root"
else
  SUDO="sudo"
  log "Executando com sudo"
fi

# Etapa 1: Verificar e instalar dependências básicas
if [ $CURRENT_STEP -lt 1 ]; then
  log "Etapa 1/$INSTALL_STEPS: Verificando e instalando dependências básicas..."
  
  # Verificar espaço em disco
  DISK_SPACE=$(df -h / | awk 'NR==2 {print $4}')
  log "Espaço em disco disponível: $DISK_SPACE"
  
  # Limpar cache do apt para liberar espaço
  run_with_retry "$SUDO apt clean" 2
  run_with_retry "$SUDO apt autoclean" 2
  run_with_retry "$SUDO apt autoremove -y" 2
  
  # Atualizar sistema
  log "Atualizando sistema..."
  run_with_retry "$SUDO apt update" 3
  
  # Instalar dependências básicas
  log "Instalando dependências básicas..."
  run_with_retry "$SUDO apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release" 3
  
  update_progress 1
fi

# Etapa 2: Instalar Node.js
if [ $CURRENT_STEP -lt 2 ]; then
  log "Etapa 2/$INSTALL_STEPS: Instalando Node.js..."
  
  if ! command -v node &> /dev/null; then
    log "Node.js não encontrado, instalando..."
    
    # Método 1: Usar NodeSource
    if ! run_with_retry "curl -fsSL https://deb.nodesource.com/setup_18.x | $SUDO -E bash -" 2; then
      warn "Falha ao adicionar repositório NodeSource. Tentando método alternativo..."
      
      # Método 2: Baixar e instalar diretamente
      log "Baixando Node.js 18.x diretamente..."
      if ! run_with_retry "wget -O /tmp/node-setup.tar.gz https://nodejs.org/dist/v18.18.0/node-v18.18.0-linux-x64.tar.gz" 3; then
        error "Falha ao baixar Node.js. Verifique sua conexão com a internet."
      fi
      
      log "Extraindo Node.js..."
      run_with_retry "tar -xzf /tmp/node-setup.tar.gz -C /tmp" 2
      
      log "Instalando Node.js..."
      run_with_retry "$SUDO mkdir -p /usr/local/lib/nodejs" 2
      run_with_retry "$SUDO cp -R /tmp/node-v18.18.0-linux-x64/* /usr/local/lib/nodejs" 2
      
      # Adicionar ao PATH
      if ! grep -q "nodejs" /etc/profile; then
        echo 'export PATH=/usr/local/lib/nodejs/bin:$PATH' | $SUDO tee -a /etc/profile
        source /etc/profile
      fi
      
      # Criar links simbólicos
      run_with_retry "$SUDO ln -sf /usr/local/lib/nodejs/bin/node /usr/bin/node" 2
      run_with_retry "$SUDO ln -sf /usr/local/lib/nodejs/bin/npm /usr/bin/npm" 2
      run_with_retry "$SUDO ln -sf /usr/local/lib/nodejs/bin/npx /usr/bin/npx" 2
    else
      # Instalar Node.js via apt
      run_with_retry "$SUDO apt install -y nodejs" 3
    fi
  else
    log "Node.js já está instalado."
  fi
  
  # Verificar versões
  NODE_VERSION=$(node --version || echo "não instalado")
  NPM_VERSION=$(npm --version || echo "não instalado")
  log "Node.js: $NODE_VERSION"
  log "NPM: $NPM_VERSION"
  
  update_progress 2
fi

# Etapa 3: Instalar PostgreSQL
if [ $CURRENT_STEP -lt 3 ]; then
  log "Etapa 3/$INSTALL_STEPS: Instalando PostgreSQL..."
  
  # Verificar se PostgreSQL já está instalado
  if ! command -v psql &> /dev/null; then
    log "PostgreSQL não encontrado, instalando..."
    
    # Adicionar repositório PostgreSQL
    if ! run_with_retry "$SUDO sh -c 'echo \"deb http://apt.postgresql.org/pub/repos/apt \$(lsb_release -cs)-pgdg main\" > /etc/apt/sources.list.d/pgdg.list'" 2; then
      warn "Falha ao adicionar repositório PostgreSQL. Tentando método alternativo..."
    fi
    
    # Importar chave
    if ! run_with_retry "wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | $SUDO apt-key add -" 2; then
      warn "Falha ao importar chave PostgreSQL. Tentando método alternativo..."
    fi
    
    # Atualizar e instalar
    run_with_retry "$SUDO apt update" 2
    if ! run_with_retry "$SUDO apt install -y postgresql postgresql-contrib" 3; then
      error "Falha ao instalar PostgreSQL. Verifique os logs para mais detalhes."
    fi
  else
    log "PostgreSQL já está instalado."
  fi
  
  # Iniciar e habilitar PostgreSQL
  log "Iniciando PostgreSQL..."
  run_with_retry "$SUDO systemctl start postgresql" 2
  run_with_retry "$SUDO systemctl enable postgresql" 2
  
  # Aguardar PostgreSQL inicializar
  log "Aguardando PostgreSQL inicializar..."
  sleep 5
  
  update_progress 3
fi

# Etapa 4: Configurar banco de dados
if [ $CURRENT_STEP -lt 4 ]; then
  log "Etapa 4/$INSTALL_STEPS: Configurando banco de dados..."
  
  # Gerar senha segura
  DB_NAME="emmvmfc_sistema"
  DB_USER="emmvmfc_user"
  DB_PASSWORD=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9')
  
  # Criar banco e usuário
  if [[ $EUID -eq 0 ]]; then
    # Executando como root
    su - postgres -c "psql -c \"SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'\" | grep -q 1 || psql -c \"CREATE DATABASE $DB_NAME;\"" || warn "Erro ao criar banco de dados"
    su - postgres -c "psql -c \"SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'\" | grep -q 1 || psql -c \"CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';\"" || warn "Erro ao criar usuário"
    su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;\"" || warn "Erro ao conceder privilégios"
    su - postgres -c "psql -c \"ALTER USER $DB_USER CREATEDB;\"" || warn "Erro ao alterar usuário"
  else
    # Executando com sudo
    $SUDO -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || $SUDO -u postgres psql -c "CREATE DATABASE $DB_NAME;" || warn "Erro ao criar banco de dados"
    $SUDO -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || $SUDO -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" || warn "Erro ao criar usuário"
    $SUDO -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" || warn "Erro ao conceder privilégios"
    $SUDO -u postgres psql -c "ALTER USER $DB_USER CREATEDB;" || warn "Erro ao alterar usuário"
  fi
  
  log "Banco de dados configurado:"
  log "  Nome: $DB_NAME"
  log "  Usuário: $DB_USER"
  log "  Senha: $DB_PASSWORD"
  
  # Salvar informações do banco
  mkdir -p ~/.emmvmfc
  echo "DB_NAME=$DB_NAME" > ~/.emmvmfc/db_config
  echo "DB_USER=$DB_USER" >> ~/.emmvmfc/db_config
  echo "DB_PASSWORD=$DB_PASSWORD" >> ~/.emmvmfc/db_config
  chmod 600 ~/.emmvmfc/db_config
  
  update_progress 4
fi

# Etapa 5: Instalar PM2 e Nginx
if [ $CURRENT_STEP -lt 5 ]; then
  log "Etapa 5/$INSTALL_STEPS: Instalando PM2 e Nginx..."
  
  # Instalar PM2
  if ! command -v pm2 &> /dev/null; then
    log "Instalando PM2..."
    run_with_retry "$SUDO npm install -g pm2" 3
  else
    log "PM2 já está instalado."
  fi
  
  # Instalar Nginx
  if ! command -v nginx &> /dev/null; then
    log "Instalando Nginx..."
    run_with_retry "$SUDO apt install -y nginx" 3
  else
    log "Nginx já está instalado."
  fi
  
  # Iniciar e habilitar Nginx
  log "Iniciando Nginx..."
  run_with_retry "$SUDO systemctl start nginx" 2
  run_with_retry "$SUDO systemctl enable nginx" 2
  
  # Configurar firewall se estiver ativo
  if command -v ufw &> /dev/null && $SUDO ufw status | grep -q "Status: active"; then
    log "Configurando firewall..."
    run_with_retry "$SUDO ufw allow OpenSSH" 2
    run_with_retry "$SUDO ufw allow 'Nginx Full'" 2
    run_with_retry "$SUDO ufw --force enable" 2
  fi
  
  update_progress 5
fi

# Etapa 6: Preparar diretório da aplicação
if [ $CURRENT_STEP -lt 6 ]; then
  log "Etapa 6/$INSTALL_STEPS: Preparando diretório da aplicação..."
  
  # Criar diretório da aplicação
  if [[ $EUID -eq 0 ]]; then
    mkdir -p $APP_DIR
    chown -R www-data:www-data $APP_DIR
  else
    $SUDO mkdir -p $APP_DIR
    $SUDO chown -R $USER:$USER $APP_DIR
  fi
  
  # Criar diretório de uploads
  mkdir -p $APP_DIR/uploads
  chmod 755 $APP_DIR/uploads
  
  # Criar diretório de logs
  mkdir -p $APP_DIR/logs
  
  # Criar diretório de backups
  if [[ $EUID -eq 0 ]]; then
    mkdir -p $BACKUP_DIR
  else
    $SUDO mkdir -p $BACKUP_DIR
    $SUDO chown -R $USER:$USER $BACKUP_DIR
  fi
  
  update_progress 6
fi

# Etapa 7: Clonar código da aplicação do GitHub
if [ $CURRENT_STEP -lt 7 ]; then
  log "Etapa 7/$INSTALL_STEPS: Clonando código da aplicação do GitHub..."
  
  # Navegar para o diretório da aplicação
  cd $APP_DIR
  
  # Limpar diretório se não estiver vazio
  if [ "$(ls -A $APP_DIR)" ]; then
    log "Diretório não está vazio. Fazendo backup..."
    BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
    mkdir -p $BACKUP_DIR/$BACKUP_TIME
    cp -r $APP_DIR/* $BACKUP_DIR/$BACKUP_TIME/ 2>/dev/null || true
    rm -rf $APP_DIR/*
  fi
  
  # Tentar clonar do repositório oficial
  log "Clonando repositório https://github.com/SIWUMS/gme-saas-api..."
  
  if run_with_retry "git clone https://github.com/SIWUMS/gme-saas-api.git ." 3; then
    log "✅ Repositório clonado com sucesso!"
    
    # Verificar se os arquivos principais existem
    if [ ! -f "package.json" ]; then
      warn "package.json não encontrado. Verificando estrutura..."
      ls -la
    fi
    
    # Se o repositório foi clonado mas está em uma subpasta
    if [ -d "gme-saas" ] && [ ! -f "package.json" ]; then
      log "Movendo arquivos da subpasta..."
      mv gme-saas/* . 2>/dev/null || true
      mv gme-saas/.* . 2>/dev/null || true
      rmdir gme-saas 2>/dev/null || true
    fi
    
  else
    warn "❌ Falha ao clonar do repositório principal. Tentando métodos alternativos..."
    
    # Método alternativo 1: Download direto do ZIP
    log "Tentando download direto do arquivo ZIP..."
    if run_with_retry "wget -O repo.zip https://github.com/SIWUMS/gme-saas-api/archive/refs/heads/main.zip" 2; then
      if run_with_retry "unzip -q repo.zip" 2; then
        log "Movendo arquivos extraídos..."
        mv gme-saas-main/* . 2>/dev/null || true
        mv gme-saas-main/.* . 2>/dev/null || true
        rm -rf gme-saas-main repo.zip
        log "✅ Código baixado via ZIP com sucesso!"
      else
        warn "Falha ao extrair arquivo ZIP"
      fi
    else
      warn "Falha ao baixar arquivo ZIP"
    fi
    
    # Método alternativo 2: Usar curl
    if [ ! -f "package.json" ]; then
      log "Tentando download com curl..."
      if run_with_retry "curl -L -o repo.zip https://github.com/SIWUMS/gme-saas-api/archive/refs/heads/main.zip" 2; then
        if run_with_retry "unzip -q repo.zip" 2; then
          log "Movendo arquivos extraídos..."
          mv gme-saas-main/* . 2>/dev/null || true
          mv gme-saas-main/.* . 2>/dev/null || true
          rm -rf gme-saas-main repo.zip
          log "✅ Código baixado via curl com sucesso!"
        fi
      fi
    fi
    
    # Fallback: Criar estrutura básica se tudo falhar
    if [ ! -f "package.json" ]; then
      warn "❌ Todos os métodos de download falharam. Criando estrutura básica..."
      
      # Criar estrutura básica de diretórios
      mkdir -p app/{alimentos,cardapios,configuracoes,configuracoes-sistema,consumo,custos,estoque,login,perfil,pnae/{agricultura-familiar,cardapios,compras,distribuicao,licitacoes,prestacao-contas,transparencia},relatorios,sistema/{configuracoes,escolas},usuarios}
      mkdir -p components/{alimentos,cardapios,configuracoes,configuracoes-sistema,consumo,custos,estoque,perfil,pnae,providers,relatorios,sistema,ui,usuarios}
      mkdir -p lib hooks database scripts nginx public/images styles
      
      # Criar package.json básico
      cat > package.json << 'EOF'
{
  "name": "sistema-refeicoes-escolares",
  "version": "1.0.0",
  "private": true,
  "description": "Sistema completo de gestão de refeições escolares - EMMVMFC",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.1.6",
    "@types/node": "^20.5.0",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0",
    "bcryptjs": "^2.4.3",
    "@types/bcryptjs": "^2.4.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "recharts": "^2.8.0",
    "date-fns": "^2.30.0",
    "jspdf": "^2.5.1",
    "exceljs": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.263.1",
    "react-day-picker": "^8.9.0",
    "jose": "^4.14.4",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-button": "^1.0.4",
    "@radix-ui/react-card": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-form": "^0.0.3",
    "@radix-ui/react-input": "^1.0.4",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-sheet": "^1.0.4",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-table": "^1.0.4",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-textarea": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

      log "⚠️  Estrutura básica criada. Recomenda-se baixar o código completo manualmente."
    fi
  fi
  
  # Verificar se temos os arquivos essenciais
  log "Verificando arquivos essenciais..."
  
  MISSING_FILES=()
  
  if [ ! -f "package.json" ]; then
    MISSING_FILES+=("package.json")
  fi
  
  if [ ! -f "next.config.js" ] && [ ! -f "next.config.mjs" ]; then
    log "Criando next.config.js..."
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  }
}

module.exports = nextConfig
EOF
  fi
  
  if [ ! -f "tsconfig.json" ]; then
    log "Criando tsconfig.json..."
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
  fi
  
  if [ ! -f "tailwind.config.js" ] && [ ! -f "tailwind.config.ts" ]; then
    log "Criando tailwind.config.js..."
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
EOF
  fi
  
  # Verificar estrutura final
  log "Estrutura do projeto:"
  ls -la
  
  if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    warn "Arquivos em falta: ${MISSING_FILES[*]}"
    warn "Recomenda-se verificar o repositório manualmente"
  else
    log "✅ Todos os arquivos essenciais estão presentes"
  fi
  
  update_progress 7
fi

# Etapa 8: Configurar arquivo .env
if [ $CURRENT_STEP -lt 8 ]; then
  log "Etapa 8/$INSTALL_STEPS: Configurando arquivo .env..."
  
  # Carregar informações do banco
  if [ -f ~/.emmvmfc/db_config ]; then
    source ~/.emmvmfc/db_config
  fi
  
  # Criar arquivo .env
  cat > $APP_DIR/.env.local << EOF
# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://$DOMAIN"

# App
NODE_ENV="production"
PORT=3000

# Upload
UPLOAD_DIR="$APP_DIR/uploads"

# Backup
BACKUP_DIR="$BACKUP_DIR"

# Domain
DOMAIN="$DOMAIN"
EOF
  
  # Criar arquivo .env para produção
  cp $APP_DIR/.env.local $APP_DIR/.env
  
  update_progress 8
fi

# Etapa 9: Configurar Nginx
if [ $CURRENT_STEP -lt 9 ]; then
  log "Etapa 9/$INSTALL_STEPS: Configurando Nginx..."
  
  # Criar configuração do Nginx
  if [[ $EUID -eq 0 ]]; then
    cat > /etc/nginx/sites-available/emmvmfc << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
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
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    location /uploads {
        alias $APP_DIR/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    client_max_body_size 50M;
}
EOF
  else
    $SUDO tee /etc/nginx/sites-available/emmvmfc > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
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
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    location /uploads {
        alias $APP_DIR/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    client_max_body_size 50M;
}
EOF
  fi
  
  # Ativar site
  run_with_retry "$SUDO ln -sf /etc/nginx/sites-available/emmvmfc /etc/nginx/sites-enabled/" 2
  run_with_retry "$SUDO rm -f /etc/nginx/sites-enabled/default" 2
  
  # Verificar configuração do Nginx
  if ! run_with_retry "$SUDO nginx -t" 2; then
    warn "Configuração do Nginx inválida. Verifique o arquivo de configuração."
  else
    run_with_retry "$SUDO systemctl reload nginx" 2
  fi
  
  update_progress 9
fi

# Etapa 10: Instalar dependências, fazer build e iniciar aplicação
if [ $CURRENT_STEP -lt 10 ]; then
  log "Etapa 10/$INSTALL_STEPS: Instalando dependências, fazendo build e iniciando aplicação..."
  
  # Navegar para o diretório da aplicação
  cd $APP_DIR
  
  # Instalar dependências
  log "Instalando dependências..."
  if ! run_with_retry "npm install --legacy-peer-deps" 3; then
    warn "Falha ao instalar dependências. Tentando com --force..."
    run_with_retry "npm install --force" 2
  fi
  
  # Gerar cliente Prisma
  log "Gerando cliente Prisma..."
  run_with_retry "npx prisma generate" 3
  
  # Aplicar migrações
  log "Aplicando migrações do banco..."
  run_with_retry "npx prisma db push" 3
  
  # Executar seed
  log "Executando seed do banco..."
  run_with_retry "npx tsx prisma/seed.ts" 2
  
  # Fazer build
  log "Fazendo build da aplicação..."
  if ! run_with_retry "npm run build" 3; then
    error "Falha ao fazer build da aplicação. Verifique os logs para mais detalhes."
  fi
  
  # Configurar PM2
  log "Configurando PM2..."
  cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'emmvmfc-v31',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '$APP_DIR/logs/err.log',
    out_file: '$APP_DIR/logs/out.log',
    log_file: '$APP_DIR/logs/combined.log',
    time: true
  }]
}
EOF
  
  # Iniciar aplicação com PM2
  log "Iniciando aplicação..."
  run_with_retry "pm2 delete emmvmfc-v31 2>/dev/null || true" 1
  run_with_retry "pm2 start ecosystem.config.js" 3
  run_with_retry "pm2 save" 2
  
  # Configurar PM2 para iniciar no boot
  if [[ $EUID -eq 0 ]]; then
    run_with_retry "pm2 startup systemd -u root --hp /root" 2
  else
    run_with_retry "pm2 startup" 2 | grep "sudo env" | head -1 | bash
  fi
  
  # Criar script de backup
  log "Configurando backup automático..."
  mkdir -p $BACKUP_DIR
  
  cat > $APP_DIR/scripts/backup.sh << EOF
#!/bin/bash
BACKUP_DIR="$BACKUP_DIR"
DATE=\$(date +%Y%m%d_%H%M%S)
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"

# Criar diretório de backup
mkdir -p \$BACKUP_DIR

# Backup do banco
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > \$BACKUP_DIR/db_\$DATE.sql.gz

# Backup dos uploads
tar -czf \$BACKUP_DIR/uploads_\$DATE.tar.gz -C $APP_DIR uploads/

# Manter apenas os últimos 7 backups
find \$BACKUP_DIR -name "db_*.gz" -mtime +7 -delete
find \$BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete

echo "Backup concluído em \$(date)"
EOF
  
  chmod +x $APP_DIR/scripts/backup.sh
  
  # Adicionar ao crontab
  (crontab -l 2>/dev/null | grep -v "$APP_DIR/scripts/backup.sh"; echo "0 2 * * * $APP_DIR/scripts/backup.sh") | crontab -
  
  update_progress 10
fi

# Finalização
log "Instalação concluída com sucesso!"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║     ${GREEN}Sistema de Refeições Escolares - Instalação Concluída${BLUE}     ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Sistema instalado e funcionando!${NC}"
echo ""
echo -e "📊 Acesse o sistema: ${YELLOW}http://$DOMAIN${NC}"
echo -e "📧 Admin: ${YELLOW}admin@escola.edu.br${NC} / ${YELLOW}admin123${NC}"
echo -e "📧 Nutricionista: ${YELLOW}nutricionista@escola.edu.br${NC} / ${YELLOW}nutri123${NC}"
echo ""
echo -e "🔧 Comandos úteis:"
echo -e "  ${YELLOW}pm2 status${NC}                    - Status da aplicação"
echo -e "  ${YELLOW}pm2 logs emmvmfc-v31${NC}          - Ver logs"
echo -e "  ${YELLOW}pm2 restart emmvmfc-v31${NC}       - Reiniciar"
echo ""
echo -e "🔒 Para configurar SSL:"
echo -e "  ${YELLOW}sudo certbot --nginx -d $DOMAIN${NC}"
echo ""
echo -e "💾 Backups automáticos configurados em:"
echo -e "  ${YELLOW}$BACKUP_DIR${NC}"
echo ""
echo -e "📝 Configurações salvas em:"
echo -e "  Banco: ${YELLOW}$DB_NAME${NC}"
echo -e "  Usuário DB: ${YELLOW}$DB_USER${NC}"
echo -e "  Senha DB: ${YELLOW}$DB_PASSWORD${NC}"
echo ""
echo -e "${GREEN}Obrigado por usar o instalador do Sistema de Refeições Escolares v31!${NC}"
