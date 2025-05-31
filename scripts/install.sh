#!/bin/bash

# Script de Instalação do Sistema de Refeições Escolares
# Para VPS com Ubuntu 20.04+ / Debian 11+

set -e

echo "🍽️  Instalando Sistema de Refeições Escolares"
echo "=============================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Verificar se é root
if [[ $EUID -eq 0 ]]; then
   error "Este script não deve ser executado como root"
fi

# Atualizar sistema
log "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
log "Instalando dependências básicas..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Instalar Node.js 20
log "Instalando Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar versões
node_version=$(node --version)
npm_version=$(npm --version)
log "Node.js instalado: $node_version"
log "NPM instalado: $npm_version"

# Instalar PostgreSQL 15
log "Instalando PostgreSQL 15..."
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-15 postgresql-client-15 postgresql-contrib-15

# Configurar PostgreSQL
log "Configurando PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar banco de dados
DB_NAME="refeicoes_escolares"
DB_USER="refeicoes_user"
DB_PASSWORD=$(openssl rand -base64 32)

sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
\q
EOF

log "Banco de dados criado: $DB_NAME"
log "Usuário criado: $DB_USER"
log "Senha gerada: $DB_PASSWORD"

# Instalar PM2 para gerenciamento de processos
log "Instalando PM2..."
sudo npm install -g pm2

# Instalar Nginx
log "Instalando Nginx..."
sudo apt install -y nginx

# Configurar firewall
log "Configurando firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Criar diretório da aplicação
APP_DIR="/var/www/refeicoes-escolares"
log "Criando diretório da aplicação: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clonar repositório (assumindo que existe)
cd $APP_DIR
log "Inicializando projeto Next.js..."

# Criar package.json
cat > package.json << EOF
{
  "name": "sistema-refeicoes-escolares",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^4.24.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "react-hook-form": "@hookform/resolvers",
    "recharts": "^2.8.0",
    "date-fns": "^2.30.0",
    "jspdf": "^2.5.1",
    "exceljs": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@radix-ui/react-slot": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "@types/bcryptjs": "^2.4.0"
  }
}
EOF

# Instalar dependências
log "Instalando dependências do projeto..."
npm install

# Criar arquivo de ambiente
log "Criando arquivo de configuração..."
cat > .env.local << EOF
# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# App
NODE_ENV="production"
PORT=3000

# Upload
UPLOAD_DIR="/var/www/refeicoes-escolares/uploads"

# Email (configurar conforme necessário)
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT=""
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM=""
EOF

# Criar diretório de uploads
mkdir -p uploads
chmod 755 uploads

# Configurar Prisma
log "Configurando Prisma..."
mkdir -p prisma

cat > prisma/schema.prisma << EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Escola {
  id           Int      @id @default(autoincrement())
  nome         String
  codigo       String   @unique
  endereco     String?
  telefone     String?
  email        String?
  diretor      String?
  totalAlunos  Int      @default(0) @map("total_alunos")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  usuarios     Usuario[]
  estoque      Estoque[]
  cardapios    Cardapio[]
      DateTime @updatedAt @map("updated_at")

  usuarios     Usuario[]
  estoque      Estoque[]
  cardapios    Cardapio[]
  turmas       Turma[]
  consumoDiario ConsumoDiario[]
  relatorios   Relatorio[]
  configuracoes Configuracao[]
  logsAuditoria LogAuditoria[]

  @@map("escolas")
}

model Usuario {
  id            Int       @id @default(autoincrement())
  nome          String
  email         String    @unique
  senhaHash     String    @map("senha_hash")
  tipoUsuario   String    @map("tipo_usuario")
  escolaId      Int?      @map("escola_id")
  ativo         Boolean   @default(true)
  ultimoAcesso  DateTime? @map("ultimo_acesso")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  escola        Escola?   @relation(fields: [escolaId], references: [id])
  cardapiosAprovados Cardapio[] @relation("CardapioAprovador")
  cardapiosCriados   Cardapio[] @relation("CardapioCriador")
  preparacoes   Preparacao[]
  movimentacoes MovimentacaoEstoque[]
  consumoRegistrado ConsumoDiario[]
  relatorios    Relatorio[]
  configuracoes Configuracao[]
  logsAuditoria LogAuditoria[]

  @@map("usuarios")
}

model Alimento {
  id              Int     @id @default(autoincrement())
  codigoTaco      String? @unique @map("codigo_taco")
  nome            String
  categoria       String?
  unidadeMedida   String  @map("unidade_medida")
  energiaKcal     Decimal? @map("energia_kcal") @db.Decimal(8,2)
  proteinas       Decimal? @db.Decimal(8,2)
  lipidios        Decimal? @db.Decimal(8,2)
  carboidratos    Decimal? @db.Decimal(8,2)
  fibraAlimentar  Decimal? @map("fibra_alimentar") @db.Decimal(8,2)
  calcio          Decimal? @db.Decimal(8,2)
  magnesio        Decimal? @db.Decimal(8,2)
  fosforo         Decimal? @db.Decimal(8,2)
  ferro           Decimal? @db.Decimal(8,2)
  sodio           Decimal? @db.Decimal(8,2)
  potassio        Decimal? @db.Decimal(8,2)
  zinco           Decimal? @db.Decimal(8,2)
  vitaminaC       Decimal? @map("vitamina_c") @db.Decimal(8,2)
  temGluten       Boolean  @default(false) @map("tem_gluten")
  temLactose      Boolean  @default(false) @map("tem_lactose")
  ehVegano        Boolean  @default(false) @map("eh_vegano")
  ehVegetariano   Boolean  @default(false) @map("eh_vegetariano")
  ativo           Boolean  @default(true)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  estoque         Estoque[]
  ingredientes    PreparacaoIngrediente[]

  @@map("alimentos")
}

model Estoque {
  id                 Int      @id @default(autoincrement())
  escolaId           Int      @map("escola_id")
  alimentoId         Int      @map("alimento_id")
  quantidadeAtual    Decimal  @default(0) @map("quantidade_atual") @db.Decimal(10,3)
  quantidadeMinima   Decimal  @default(0) @map("quantidade_minima") @db.Decimal(10,3)
  valorUnitario      Decimal? @map("valor_unitario") @db.Decimal(10,2)
  dataUltimaEntrada  DateTime? @map("data_ultima_entrada") @db.Date
  dataValidade       DateTime? @map("data_validade") @db.Date
  lote               String?
  fornecedor         String?
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  escola             Escola   @relation(fields: [escolaId], references: [id])
  alimento           Alimento @relation(fields: [alimentoId], references: [id])
  movimentacoes      MovimentacaoEstoque[]

  @@unique([escolaId, alimentoId, lote])
  @@map("estoque")
}

model MovimentacaoEstoque {
  id                Int      @id @default(autoincrement())
  estoqueId         Int      @map("estoque_id")
  tipoMovimentacao  String   @map("tipo_movimentacao")
  quantidade        Decimal  @db.Decimal(10,3)
  valorUnitario     Decimal? @map("valor_unitario") @db.Decimal(10,2)
  valorTotal        Decimal? @map("valor_total") @db.Decimal(10,2)
  motivo            String?
  documento         String?
  usuarioId         Int?     @map("usuario_id")
  dataMovimentacao  DateTime @default(now()) @map("data_movimentacao")

  estoque           Estoque  @relation(fields: [estoqueId], references: [id])
  usuario           Usuario? @relation(fields: [usuarioId], references: [id])

  @@map("movimentacoes_estoque")
}

model Cardapio {
  id             Int       @id @default(autoincrement())
  escolaId       Int       @map("escola_id")
  nome           String
  faixaEtaria    String    @map("faixa_etaria")
  dataInicio     DateTime  @map("data_inicio") @db.Date
  dataFim        DateTime  @map("data_fim") @db.Date
  status         String    @default("rascunho")
  observacoes    String?
  aprovadoPor    Int?      @map("aprovado_por")
  dataAprovacao  DateTime? @map("data_aprovacao")
  createdBy      Int?      @map("created_by")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  escola         Escola    @relation(fields: [escolaId], references: [id])
  aprovador      Usuario?  @relation("CardapioAprovador", fields: [aprovadoPor], references: [id])
  criador        Usuario?  @relation("CardapioCriador", fields: [createdBy], references: [id])
  refeicoes      CardapioRefeicao[]
  cardapioDiario CardapioDiario[]

  @@map("cardapios")
}

model CardapioRefeicao {
  id         Int     @id @default(autoincrement())
  cardapioId Int     @map("cardapio_id")
  nome       String
  horario    String  @db.Time
  ordem      Int
  ativo      Boolean @default(true)

  cardapio   Cardapio @relation(fields: [cardapioId], references: [id], onDelete: Cascade)
  cardapioDiario CardapioDiario[]

  @@map("cardapio_refeicoes")
}

model Preparacao {
  id              Int      @id @default(autoincrement())
  nome            String
  categoria       String?
  rendimentoPorcoes Int    @map("rendimento_porcoes")
  tempoPreparo    Int?     @map("tempo_preparo")
  modoPreparo     String?  @map("modo_preparo")
  observacoes     String?
  custoTotal      Decimal? @map("custo_total") @db.Decimal(10,2)
  custoPorcao     Decimal? @map("custo_porcao") @db.Decimal(10,2)
  createdBy       Int?     @map("created_by")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  criador         Usuario? @relation(fields: [createdBy], references: [id])
  ingredientes    PreparacaoIngrediente[]
  cardapioDiario  CardapioDiario[]

  @@map("preparacoes")
}

model PreparacaoIngrediente {
  id            Int      @id @default(autoincrement())
  preparacaoId  Int      @map("preparacao_id")
  alimentoId    Int      @map("alimento_id")
  quantidade    Decimal  @db.Decimal(10,3)
  unidade       String
  custoUnitario Decimal? @map("custo_unitario") @db.Decimal(10,2)
  custoTotal    Decimal? @map("custo_total") @db.Decimal(10,2)

  preparacao    Preparacao @relation(fields: [preparacaoId], references: [id], onDelete: Cascade)
  alimento      Alimento   @relation(fields: [alimentoId], references: [id])

  @@map("preparacao_ingredientes")
}

model CardapioDiario {
  id                 Int      @id @default(autoincrement())
  cardapioId         Int      @map("cardapio_id")
  refeicaoId         Int      @map("refeicao_id")
  dataRefeicao       DateTime @map("data_refeicao") @db.Date
  preparacaoId       Int      @map("preparacao_id")
  quantidadePlanejada Int     @map("quantidade_planejada")
  quantidadeServida  Int      @default(0) @map("quantidade_servida")
  observacoes        String?

  cardapio           Cardapio         @relation(fields: [cardapioId], references: [id])
  refeicao           CardapioRefeicao @relation(fields: [refeicaoId], references: [id])
  preparacao         Preparacao       @relation(fields: [preparacaoId], references: [id])
  consumoDiario      ConsumoDiario[]

  @@map("cardapio_diario")
}

model Turma {
  id           Int      @id @default(autoincrement())
  escolaId     Int      @map("escola_id")
  nome         String
  faixaEtaria  String   @map("faixa_etaria")
  totalAlunos  Int      @default(0) @map("total_alunos")
  turno        String
  ativo        Boolean  @default(true)
  createdAt    DateTime @default(now()) @map("created_at")

  escola       Escola   @relation(fields: [escolaId], references: [id])
  consumoDiario ConsumoDiario[]

  @@map("turmas")
}

model ConsumoDiario {
  id               Int      @id @default(autoincrement())
  escolaId         Int      @map("escola_id")
  turmaId          Int      @map("turma_id")
  cardapioDiarioId Int      @map("cardapio_diario_id")
  dataConsumo      DateTime @map("data_consumo") @db.Date
  quantidadeServida Int     @map("quantidade_servida")
  observacoes      String?
  registradoPor    Int?     @map("registrado_por")
  registradoEm     DateTime @default(now()) @map("registrado_em")

  escola           Escola         @relation(fields: [escolaId], references: [id])
  turma            Turma          @relation(fields: [turmaId], references: [id])
  cardapioDiario   CardapioDiario @relation(fields: [cardapioDiarioId], references: [id])
  registrador      Usuario?       @relation(fields: [registradoPor], references: [id])

  @@map("consumo_diario")
}

model Relatorio {
  id            Int      @id @default(autoincrement())
  escolaId      Int      @map("escola_id")
  tipoRelatorio String   @map("tipo_relatorio")
  parametros    Json?
  arquivoPath   String?  @map("arquivo_path")
  geradoPor     Int?     @map("gerado_por")
  geradoEm      DateTime @default(now()) @map("gerado_em")

  escola        Escola   @relation(fields: [escolaId], references: [id])
  gerador       Usuario? @relation(fields: [geradoPor], references: [id])

  @@map("relatorios")
}

model Configuracao {
  id          Int      @id @default(autoincrement())
  escolaId    Int      @map("escola_id")
  chave       String
  valor       String?
  descricao   String?
  updatedBy   Int?     @map("updated_by")
  updatedAt   DateTime @updatedAt @map("updated_at")

  escola      Escola   @relation(fields: [escolaId], references: [id])
  atualizador Usuario? @relation(fields: [updatedBy], references: [id])

  @@unique([escolaId, chave])
  @@map("configuracoes")
}

model LogAuditoria {
  id              Int      @id @default(autoincrement())
  usuarioId       Int?     @map("usuario_id")
  escolaId        Int?     @map("escola_id")
  tabela          String
  operacao        String
  registroId      Int?     @map("registro_id")
  dadosAnteriores Json?    @map("dados_anteriores")
  dadosNovos      Json?    @map("dados_novos")
  ipAddress       String?  @map("ip_address")
  userAgent       String?  @map("user_agent")
  createdAt       DateTime @default(now()) @map("created_at")

  usuario         Usuario? @relation(fields: [usuarioId], references: [id])
  escola          Escola?  @relation(fields: [escolaId], references: [id])

  @@map("logs_auditoria")
}
EOF

# Gerar cliente Prisma
log "Gerando cliente Prisma..."
npx prisma generate

# Aplicar migrações
log "Aplicando migrações do banco..."
npx prisma db push

# Criar seed do banco
log "Criando seed do banco..."
mkdir -p prisma
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar escola padrão
  const escola = await prisma.escola.create({
    data: {
      nome: 'Escola Municipal Exemplo',
      codigo: 'EM001',
      endereco: 'Rua das Flores, 123',
      telefone: '(11) 1234-5678',
      email: 'contato@escola.edu.br',
      diretor: 'João Silva',
      totalAlunos: 500,
    },
  })

  // Criar usuário administrador
  const senhaHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@escola.edu.br',
      senhaHash,
      tipoUsuario: 'administrador',
      escolaId: escola.id,
    },
  })

  // Criar nutricionista
  const nutricionista = await prisma.usuario.create({
    data: {
      nome: 'Maria Nutricionista',
      email: 'nutricionista@escola.edu.br',
      senhaHash: await bcrypt.hash('nutri123', 10),
      tipoUsuario: 'nutricionista',
      escolaId: escola.id,
    },
  })

  // Inserir alguns alimentos básicos da tabela TACO
  const alimentos = [
    {
      codigoTaco: '100',
      nome: 'Arroz, integral, cozido',
      categoria: 'Cereais e derivados',
      unidadeMedida: 'g',
      energiaKcal: 124,
      proteinas: 2.6,
      lipidios: 1.0,
      carboidratos: 25.8,
      fibraAlimentar: 2.7,
    },
    {
      codigoTaco: '200',
      nome: 'Feijão, carioca, cozido',
      categoria: 'Leguminosas',
      unidadeMedida: 'g',
      energiaKcal: 76,
      proteinas: 4.8,
      lipidios: 0.5,
      carboidratos: 13.6,
      fibraAlimentar: 8.5,
    },
    {
      codigoTaco: '300',
      nome: 'Frango, peito, sem pele, grelhado',
      categoria: 'Carnes e derivados',
      unidadeMedida: 'g',
      energiaKcal: 159,
      proteinas: 32.0,
      lipidios: 3.0,
      carboidratos: 0.0,
      fibraAlimentar: 0.0,
    },
  ]

  for (const alimento of alimentos) {
    await prisma.alimento.create({ data: alimento })
  }

  // Criar turmas
  const turmas = [
    { nome: 'Maternal I', faixaEtaria: '0-3', totalAlunos: 25, turno: 'integral' },
    { nome: 'Maternal II', faixaEtaria: '0-3', totalAlunos: 30, turno: 'integral' },
    { nome: '1º Ano A', faixaEtaria: '6-14', totalAlunos: 35, turno: 'matutino' },
    { nome: '1º Ano B', faixaEtaria: '6-14', totalAlunos: 35, turno: 'vespertino' },
  ]

  for (const turma of turmas) {
    await prisma.turma.create({
      data: {
        ...turma,
        escolaId: escola.id,
      },
    })
  }

  console.log('✅ Seed concluído com sucesso!')
  console.log(`📧 Admin: admin@escola.edu.br / admin123`)
  console.log(`📧 Nutricionista: nutricionista@escola.edu.br / nutri123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
EOF

# Executar seed
log "Executando seed..."
npx tsx prisma/seed.ts

# Build da aplicação
log "Fazendo build da aplicação..."
npm run build

# Configurar PM2
log "Configurando PM2..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'refeicoes-escolares',
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

# Criar diretório de logs
mkdir -p logs

# Configurar Nginx
log "Configurando Nginx..."
sudo tee /etc/nginx/sites-available/refeicoes-escolares << EOF
server {
    listen 80;
    server_name _;

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
    }

    location /uploads {
        alias $APP_DIR/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ativar site
sudo ln -sf /etc/nginx/sites-available/refeicoes-escolares /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Iniciar aplicação com PM2
log "Iniciando aplicação..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configurar backup automático
log "Configurando backup automático..."
sudo mkdir -p /opt/backups/refeicoes-escolares

cat > /opt/backups/refeicoes-escolares/backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/opt/backups/refeicoes-escolares"
DATE=\$(date +%Y%m%d_%H%M%S)
DB_NAME="$DB_NAME"
DB_USER="$DB_USER"

# Backup do banco
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > \$BACKUP_DIR/db_\$DATE.sql.gz

# Backup dos uploads
tar -czf \$BACKUP_DIR/uploads_\$DATE.tar.gz -C $APP_DIR uploads/

# Manter apenas os últimos 7 backups
find \$BACKUP_DIR -name "*.gz" -mtime +7 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /opt/backups/refeicoes-escolares/backup.sh

# Adicionar ao crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backups/refeicoes-escolares/backup.sh") | crontab -

# Criar script de atualização
cat > update.sh << 'EOF'
#!/bin/bash
echo "🔄 Atualizando Sistema de Refeições Escolares..."

# Parar aplicação
pm2 stop refeicoes-escolares

# Backup antes da atualização
/opt/backups/refeicoes-escolares/backup.sh

# Atualizar dependências
npm install

# Aplicar migrações
npx prisma db push
npx prisma generate

# Build
npm run build

# Reiniciar aplicação
pm2 restart refeicoes-escolares

echo "✅ Atualização concluída!"
EOF

chmod +x update.sh

# Configurar SSL com Let's Encrypt (opcional)
log "Instalando Certbot para SSL..."
sudo apt install -y certbot python3-certbot-nginx

# Mostrar informações finais
echo ""
echo "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "======================================"
echo ""
echo "📊 Sistema: http://$(curl -s ifconfig.me)"
echo "📧 Admin: admin@escola.edu.br / admin123"
echo "📧 Nutricionista: nutricionista@escola.edu.br / nutri123"
echo ""
echo "🔧 Comandos úteis:"
echo "  pm2 status                    - Status da aplicação"
echo "  pm2 logs refeicoes-escolares  - Ver logs"
echo "  pm2 restart refeicoes-escolares - Reiniciar"
echo "  ./update.sh                   - Atualizar sistema"
echo ""
echo "🔒 Para configurar SSL:"
echo "  sudo certbot --nginx -d seudominio.com"
echo ""
echo "💾 Backups automáticos configurados em:"
echo "  /opt/backups/refeicoes-escolares/"
echo ""
echo "📝 Configurações salvas em:"
echo "  Banco: $DB_NAME"
echo "  Usuário DB: $DB_USER"
echo "  Senha DB: $DB_PASSWORD"
echo ""

log "Sistema instalado e funcionando! 🚀"
