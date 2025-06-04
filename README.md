# Sistema de Refeições Escolares - EMMVMFC

## 📋 Sobre o Sistema

O Sistema de Refeições Escolares foi desenvolvido especificamente para a **Escola Municipal Militarizada de Vicentinópolis Manoel Fernandes da Cunha (EMMVMFC)**, oferecendo uma plataforma completa para gestão de alimentação escolar. O sistema permite o gerenciamento eficiente de cardápios, estoque de alimentos, controle nutricional, custos e conformidade com o Programa Nacional de Alimentação Escolar (PNAE).

### 🏫 Configuração EMMVMFC

- **Domínio**: [gestor.emmvmfc.com.br](https://gestor.emmvmfc.com.br)
- **Organização**: Escola Municipal Militarizada de Vicentinópolis Manoel Fernandes da Cunha
- **Localização**: Vicentinópolis, GO
- **Tema**: Azul e Branco (primário) / Amarelo (secundário)

### 🚀 Principais Funcionalidades

- **Dashboard Intuitivo**: Visão geral de indicadores e métricas importantes
- **Gestão de Cardápios**: Planejamento e controle de cardápios escolares
- **Base TACO**: Integração com a Tabela Brasileira de Composição de Alimentos
- **Controle de Estoque**: Gerenciamento completo de entrada e saída de alimentos
- **Gestão de Turmas**: Cadastro de turmas com turnos (Matutino, Vespertino, Noturno, Integral)
- **Módulo PNAE**: Conformidade com as diretrizes do programa nacional
- **Portal de Transparência**: Prestação de contas e transparência pública
- **Gestão de Custos**: Análise e controle de custos de alimentação
- **Relatórios Avançados**: Geração de relatórios personalizáveis
- **Gestão de Usuários**: Controle de acesso com diferentes níveis de permissão
- **Backup Automático**: Sistema de backup e recuperação de dados

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - Next.js 15
  - React 18
  - TypeScript
  - Tailwind CSS (tema azul/amarelo personalizado)
  - Shadcn/UI

- **Backend**:
  - Node.js 20
  - Next.js API Routes
  - Prisma ORM

- **Banco de Dados**:
  - PostgreSQL 16 / Neon (PostgreSQL serverless)

- **Infraestrutura**:
  - Ubuntu 24.04 LTS
  - Nginx (configurado para gestor.emmvmfc.com.br)
  - PM2 (gerenciamento de processos)
  - Let's Encrypt (SSL automático)
  - GitHub (repositório: SIWUMS/gme-saas)

- **Segurança**:
  - NextAuth.js
  - Autenticação de dois fatores (2FA)
  - Single Sign-On (SSO)
  - Fail2ban (proteção contra ataques)
  - UFW Firewall

## 📦 Requisitos de Sistema

- Ubuntu 22.04 LTS (recomendado)
- 6 vCPU Cores (mínimo 2)
- 12 GB RAM (mínimo 4GB)
- 20 GB de espaço em disco (mínimo)
- Conexão com a internet
- Domínio apontando para o servidor (gestor.emmvmfc.com.br)

## 🚀 Instalação para EMMVMFC

### Pré-requisitos

1. **Configurar DNS**: Certifique-se de que o domínio `gestor.emmvmfc.com.br` está apontando para o IP do seu servidor
2. **Acesso SSH**: Tenha acesso SSH ao servidor Ubuntu 22.04
3. **Usuário sudo**: Use um usuário com privilégios sudo (não root)

### Instalação Automatizada

1. **Baixe o script de instalação**:
   \`\`\`bash
   wget https://raw.githubusercontent.com/SIWUMS/gme-saas/main/(INSTALADOR).sh
   \`\`\`

2. **Torne o script executável**:
   \`\`\`bash
   chmod +x install.sh
   \`\`\`

3. **Execute o script de instalação**:
   \`\`\`bash
   ./install.sh
   \`\`\`

4. **Siga as instruções**:
   - Digite o email do administrador
   - Escolha entre PostgreSQL local
   - Aguarde a instalação completa

### O que o instalador faz automaticamente:

- ✅ Verifica se o domínio está apontando corretamente
- ✅ Instala Node.js 20, PostgreSQL 16, Nginx
- ✅ Clona o repositório do GitHub
- ✅ Configura banco de dados e usuários
- ✅ Compila e inicia a aplicação
- ✅ Configura SSL com Let's Encrypt
- ✅ Configura backup automático
- ✅ Configura monitoramento e segurança

## 🔧 Configuração Específica EMMVMFC

### Variáveis de Ambiente

O sistema é pré-configurado com as seguintes configurações para EMMVMFC:

\`\`\`env
# Sistema EMMVMFC
APP_NAME="Sistema de Refeições Escolares - EMMVMFC"
APP_URL="https://gestor.emmvmfc.com.br"
ORGANIZATION_NAME="EMMVMFC"
ORGANIZATION_FULL_NAME="Escola Municipal Manoel Vieira de Melo Filho Canguaretama"

# Tema EMMVMFC
THEME_PRIMARY_COLOR="#2563eb"    # Azul
THEME_SECONDARY_COLOR="#eab308"  # Amarelo
THEME_ACCENT_COLOR="#f8fafc"     # Branco

# Email
EMAIL_FROM="noreply@emmvmfc.com.br"
\`\`\`

### Banco de Dados

- **Nome**: `sistema_refeicoes_emmvmfc`
- **Usuário**: `emmvmfc_user`
- **Senha**: Gerada automaticamente durante a instalação

### Backup

- **Diretório**: `/opt/backups/sistema-refeicoes/`
- **Frequência**: Diário às 02:00
- **Retenção**: 7 dias
- **Log**: `/var/log/emmvmfc-backup.log`

## 👥 Usuários Padrão

Após a instalação, o sistema é configurado com:

- **Administrador EMMVMFC**
  - Email: admin@emmvmfc.com.br
  - Senha: admin123

**⚠️ IMPORTANTE**: Altere a senha após o primeiro acesso!

## 🔄 Atualização

Para atualizar o sistema:

\`\`\`bash
cd /var/www/sistema-refeicoes
./update.sh
\`\`\`

## 🛡️ Segurança EMMVMFC

O sistema implementa:

- **SSL/TLS**: Certificado Let's Encrypt para gestor.emmvmfc.com.br
- **Firewall**: UFW configurado para portas 80, 443 e SSH
- **Fail2ban**: Proteção contra ataques de força bruta
- **Headers de Segurança**: Configurados no Nginx
- **Backup Automático**: Proteção contra perda de dados

## 📊 Módulos Específicos EMMVMFC

### Dashboard EMMVMFC
- Indicadores específicos da escola
- Gráficos de consumo por turno
- Alertas de estoque baixo
- Estatísticas de atendimento

### Gestão de Turmas
- Cadastro por turno (Matutino, Vespertino, Noturno, Integral)
- Controle de quantidade de estudantes
- Vinculação com cardápios específicos

### PNAE EMMVMFC
- Conformidade com diretrizes municipais
- Prestação de contas automatizada
- Portal de transparência público
- Relatórios para secretaria de educação

### Portal de Transparência
- Acesso público via gestor.emmvmfc.com.br/pnae/transparencia
- Dados de execução do PNAE
- Informações sobre licitações
- Relatórios de agricultura familiar

📁 ESTRUTURA DO SISTEMA EMMVMFC
===============================

/var/www/sistema-refeicoes/
├── 📁 app/                                    # Aplicação Next.js 15
│   ├── 📁 (dashboard)/                        # Rotas do dashboard
│   │   ├── 📄 page.tsx                        # Dashboard principal
│   │   └── 📄 loading.tsx                     # Loading do dashboard
│   ├── 📁 cardapios/                          # Gestão de cardápios
│   │   ├── 📄 page.tsx                        # Lista de cardápios
│   │   ├── 📄 novo/page.tsx                   # Criar cardápio
│   │   └── 📄 [id]/page.tsx                   # Editar cardápio
│   ├── 📁 estoque/                            # Controle de estoque
│   │   ├── 📄 page.tsx                        # Gestão de estoque
│   │   └── 📁 movimentacao/                   # Movimentações
│   ├── 📁 alimentos/                          # Cadastro de alimentos
│   │   ├── 📄 page.tsx                        # Lista de alimentos
│   │   └── 📄 [id]/page.tsx                   # Detalhes do alimento
│   ├── 📁 turmas/                             # Gestão de turmas
│   │   ├── 📄 page.tsx                        # Lista de turmas
│   │   └── 📄 nova/page.tsx                   # Criar turma
│   ├── 📁 pnae/                               # Módulo PNAE
│   │   ├── 📄 page.tsx                        # Dashboard PNAE
│   │   ├── 📁 distribuicao/                   # Distribuição de recursos
│   │   ├── 📁 compras/                        # Gestão de compras
│   │   ├── 📁 licitacoes/                     # Licitações
│   │   ├── 📁 prestacao-contas/               # Prestação de contas
│   │   ├── 📁 agricultura-familiar/           # Agricultura familiar
│   │   └── 📁 transparencia/                  # Portal público
│   ├── 📁 custos/                             # Análise de custos
│   │   ├── 📄 page.tsx                        # Dashboard de custos
│   │   ├── 📁 preparacoes/                    # Custo por preparação
│   │   └── 📁 relatorios/                     # Relatórios financeiros
│   ├── 📁 relatorios/                         # Relatórios gerais
│   │   ├── 📄 page.tsx                        # Lista de relatórios
│   │   ├── 📁 consumo/                        # Relatórios de consumo
│   │   ├── 📁 nutricional/                    # Relatórios nutricionais
│   │   └── 📁 financeiro/                     # Relatórios financeiros
│   ├── 📁 usuarios/                           # Gestão de usuários
│   │   ├── 📄 page.tsx                        # Lista de usuários
│   │   └── 📄 novo/page.tsx                   # Criar usuário
│   ├── 📁 configuracoes/                      # Configurações da escola
│   │   ├── 📄 page.tsx                        # Configurações gerais
│   │   ├── 📁 escola/                         # Dados da escola
│   │   ├── 📁 funcionarios/                   # Gestão de funcionários
│   │   └── 📁 sistema/                        # Configurações do sistema
│   ├── 📁 perfil/                             # Perfil do usuário
│   │   └── 📄 page.tsx                        # Editar perfil
│   ├── 📁 api/                                # API Routes Next.js
│   │   ├── 📁 auth/                           # Autenticação
│   │   │   ├── 📄 [...nextauth]/route.ts      # NextAuth.js
│   │   │   ├── 📄 login/route.ts              # Login
│   │   │   └── 📄 logout/route.ts             # Logout
│   │   ├── 📁 dashboard/                      # APIs do dashboard
│   │   │   └── 📄 stats/route.ts              # Estatísticas
│   │   ├── 📁 cardapios/                      # APIs de cardápios
│   │   │   ├── 📄 route.ts                    # CRUD cardápios
│   │   │   └── 📄 [id]/route.ts               # Cardápio específico
│   │   ├── 📁 estoque/                        # APIs de estoque
│   │   │   ├── 📄 route.ts                    # CRUD estoque
│   │   │   └── 📄 movimentacao/route.ts       # Movimentações
│   │   ├── 📁 alimentos/                      # APIs de alimentos
│   │   │   ├── 📄 route.ts                    # CRUD alimentos
│   │   │   └── 📄 [id]/route.ts               # Alimento específico
│   │   ├── 📁 turmas/                         # APIs de turmas
│   │   ├── 📁 pnae/                           # APIs PNAE
│   │   ├── 📁 custos/                         # APIs de custos
│   │   ├── 📁 relatorios/                     # APIs de relatórios
│   │   ├── 📁 usuarios/                       # APIs de usuários
│   │   └── 📁 upload/                         # Upload de arquivos
│   ├── 📄 layout.tsx                          # Layout principal
│   ├── 📄 page.tsx                            # Página inicial
│   ├── 📄 loading.tsx                         # Loading global
│   ├── 📄 error.tsx                           # Página de erro
│   └── 📄 not-found.tsx                       # Página 404
│
├── 📁 components/                             # Componentes React
│   ├── 📁 ui/                                 # Componentes base (shadcn/ui)
│   │   ├── 📄 button.tsx                      # Botão
│   │   ├── 📄 card.tsx                        # Card
│   │   ├── 📄 input.tsx                       # Input
│   │   ├── 📄 select.tsx                      # Select
│   │   ├── 📄 table.tsx                       # Tabela
│   │   ├── 📄 dialog.tsx                      # Modal
│   │   ├── 📄 toast.tsx                       # Notificações
│   │   └── 📄 ...                             # Outros componentes UI
│   ├── 📁 dashboard/                          # Componentes do dashboard
│   │   ├── 📄 stats-cards.tsx                 # Cards de estatísticas
│   │   ├── 📄 charts.tsx                      # Gráficos
│   │   └── 📄 recent-activity.tsx             # Atividades recentes
│   ├── 📁 cardapios/                          # Componentes de cardápios
│   │   ├── 📄 cardapio-form.tsx               # Formulário de cardápio
│   │   ├── 📄 ficha-tecnica.tsx               # Ficha técnica
│   │   ├── 📄 base-taco.tsx                   # Integração TACO
│   │   └── 📄 cardapio-list.tsx               # Lista de cardápios
│   ├── 📁 estoque/                            # Componentes de estoque
│   │   ├── 📄 estoque-form.tsx                # Formulário de estoque
│   │   ├── 📄 movimentacao-form.tsx           # Movimentações
│   │   └── 📄 estoque-alerts.tsx              # Alertas de estoque
│   ├── 📁 alimentos/                          # Componentes de alimentos
│   │   ├── 📄 alimento-form.tsx               # Formulário de alimento
│   │   ├── 📄 alimentos-list.tsx              # Lista de alimentos
│   │   └── 📄 nutricional-info.tsx            # Info nutricional
│   ├── 📁 turmas/                             # Componentes de turmas
│   │   ├── 📄 turma-form.tsx                  # Formulário de turma
│   │   └── 📄 turmas-list.tsx                 # Lista de turmas
│   ├── 📁 pnae/                               # Componentes PNAE
│   │   ├── 📄 distribuicao-recursos.tsx       # Distribuição
│   │   ├── 📄 compras-module.tsx              # Compras
│   │   ├── 📄 licitacoes-module.tsx           # Licitações
│   │   ├── 📄 prestacao-contas.tsx            # Prestação de contas
│   │   └── 📄 transparencia-portal.tsx        # Portal público
│   ├── 📁 custos/                             # Componentes de custos
│   │   ├── 📄 custo-preparacoes.tsx           # Custos por preparação
│   │   ├── 📄 analise-comparativa.tsx         # Análise comparativa
│   │   └── 📄 relatorio-financeiro.tsx        # Relatório financeiro
│   ├── 📁 relatorios/                         # Componentes de relatórios
│   │   ├── 📄 relatorio-generator.tsx         # Gerador de relatórios
│   │   ├── 📄 charts-components.tsx           # Componentes de gráficos
│   │   └── 📄 export-options.tsx              # Opções de exportação
│   ├── 📁 usuarios/                           # Componentes de usuários
│   │   ├── 📄 usuario-form.tsx                # Formulário de usuário
│   │   └── 📄 usuarios-list.tsx               # Lista de usuários
│   ├── 📁 configuracoes/                      # Componentes de configurações
│   │   ├── 📄 dados-escola-form.tsx           # Dados da escola
│   │   ├── 📄 funcionarios-module.tsx         # Funcionários
│   │   └── 📄 configuracoes-gerais.tsx        # Configurações gerais
│   ├── 📁 layout/                             # Componentes de layout
│   │   ├── 📄 header.tsx                      # Cabeçalho
│   │   ├── 📄 sidebar.tsx                     # Barra lateral
│   │   ├── 📄 footer.tsx                      # Rodapé
│   │   └── 📄 navigation.tsx                  # Navegação
│   └── 📁 providers/                          # Providers React
│       ├── 📄 auth-provider.tsx               # Provider de autenticação
│       ├── 📄 theme-provider.tsx              # Provider de tema
│       └── 📄 toast-provider.tsx              # Provider de notificações
│
├── 📁 lib/                                    # Bibliotecas e utilitários
│   ├── 📄 database.ts                         # Conexão com PostgreSQL
│   ├── 📄 auth.ts                             # Configuração NextAuth
│   ├── 📄 utils.ts                            # Utilitários gerais
│   ├── 📄 validations.ts                      # Validações Zod
│   ├── 📄 permissions.ts                      # Sistema de permissões
│   ├── 📄 constants.ts                        # Constantes do sistema
│   ├── 📄 formatters.ts                       # Formatadores
│   └── 📄 api-client.ts                       # Cliente da API
│
├── 📁 database/                               # Scripts de banco de dados
│   ├── 📄 schema.sql                          # Esquema completo
│   ├── 📄 seed-data.sql                       # Dados iniciais
│   ├── 📄 migrations/                         # Migrações
│   │   ├── 📄 001_initial_schema.sql          # Migração inicial
│   │   ├── 📄 002_add_pnae_tables.sql         # Tabelas PNAE
│   │   └── 📄 003_add_custos_tables.sql       # Tabelas de custos
│   └── 📄 procedures/                         # Stored procedures
│       ├── 📄 calculate_costs.sql             # Cálculo de custos
│       └── 📄 generate_reports.sql            # Geração de relatórios
│
├── 📁 hooks/                                  # Custom React Hooks
│   ├── 📄 use-auth.ts                         # Hook de autenticação
│   ├── 📄 use-api.ts                          # Hook para API
│   ├── 📄 use-toast.ts                        # Hook de notificações
│   └── 📄 use-permissions.ts                  # Hook de permissões
│
├── 📁 public/                                 # Arquivos públicos
│   ├── 📄 favicon.ico                         # Favicon EMMVMFC
│   ├── 📄 logo-emmvmfc.png                    # Logo da escola
│   ├── 📄 robots.txt                          # SEO
│   ├── 📄 sitemap.xml                         # Sitemap
│   └── 📁 images/                             # Imagens do sistema
│       ├── 📄 dashboard-bg.jpg                # Background dashboard
│       ├── 📄 login-bg.jpg                    # Background login
│       └── 📄 emmvmfc-banner.png              # Banner da escola
│
├── 📁 scripts/                                # Scripts de manutenção
│   ├── 📄 backup.sh                           # Script de backup
│   ├── 📄 restore.sh                          # Script de restore
│   ├── 📄 update.sh                           # Script de atualização
│   ├── 📄 maintenance.sh                      # Manutenção do sistema
│   └── 📄 populate-database.sh                # Popular banco de dados
│
├── 📁 styles/                                 # Estilos CSS
│   ├── 📄 globals.css                         # Estilos globais
│   ├── 📄 emmvmfc-theme.css                   # Tema EMMVMFC
│   └── 📄 components.css                      # Estilos de componentes
│
├── 📁 uploads/                                # Arquivos enviados (criado em runtime)
│   ├── 📁 documentos/                         # Documentos PNAE
│   ├── 📁 imagens/                            # Imagens de alimentos
│   └── 📁 relatorios/                         # Relatórios gerados
│
├── 📁 logs/                                   # Logs da aplicação (criado em runtime)
│   ├── 📄 application.log                     # Log da aplicação
│   ├── 📄 error.log                           # Log de erros
│   └── 📄 access.log                          # Log de acesso
│
├── 📁 .next/                                  # Build Next.js (criado após npm run build)
│   ├── 📁 static/                             # Arquivos estáticos
│   ├── 📁 server/                             # Código do servidor
│   └── 📄 BUILD_ID                            # ID do build
│
├── 📁 node_modules/                           # Dependências npm (criado após npm install)
│
├── 📄 .env.local                              # Variáveis de ambiente EMMVMFC
├── 📄 .gitignore                              # Arquivos ignorados pelo Git
├── 📄 package.json                            # Dependências e scripts
├── 📄 package-lock.json                       # Lock das dependências
├── 📄 next.config.ts                          # Configuração Next.js
├── 📄 tailwind.config.ts                      # Configuração Tailwind
├── 📄 tsconfig.json                           # Configuração TypeScript
├── 📄 eslint.config.mjs                       # Configuração ESLint
├── 📄 postcss.config.mjs                      # Configuração PostCSS
├── 📄 README.md                               # Documentação do projeto
├── 📄 EMMVMFC_INFO.txt                        # Informações específicas EMMVMFC
└── 📄 components.json                         # Configuração shadcn/ui

📁 ARQUIVOS DE SISTEMA (fora do projeto)
=======================================

/etc/nginx/sites-available/
└── 📄 sistema-refeicoes-emmvmfc               # Configuração Nginx EMMVMFC

/etc/nginx/sites-enabled/
└── 📄 sistema-refeicoes-emmvmfc               # Link simbólico

/var/log/nginx/
├── 📄 emmvmfc-sistema-access.log              # Log de acesso Nginx
├── 📄 emmvmfc-sistema-error.log               # Log de erro Nginx
└── 📄 emmvmfc-detailed.log                    # Log detalhado

/opt/backups/sistema-refeicoes/
├── 📄 backup-YYYY-MM-DD.sql                   # Backups diários
└── 📄 backup-YYYY-MM-DD.tar.gz                # Backup completo

/etc/letsencrypt/live/gestor.emmvmfc.com.br/
├── 📄 fullchain.pem                           # Certificado SSL
├── 📄 privkey.pem                             # Chave privada SSL
└── 📄 cert.pem                                # Certificado

~/.pm2/
├── 📄 logs/                                   # Logs PM2
└── 📄 pids/                                   # PIDs dos processos

## 🔧 Manutenção

### Comandos Úteis

\`\`\`bash
# Verificar status da aplicação
pm2 status sistema-refeicoes-emmvmfc

# Ver logs em tempo real
pm2 logs sistema-refeicoes-emmvmfc

# Reiniciar aplicação
pm2 restart sistema-refeicoes-emmvmfc

# Executar manutenção
cd /var/www/sistema-refeicoes && ./maintenance.sh

# Verificar certificados SSL
sudo certbot certificates

# Verificar backup
tail -f /var/log/emmvmfc-backup.log
\`\`\`

### Logs Importantes

- **Aplicação**: `/var/www/sistema-refeicoes/logs/`
- **Nginx**: `/var/log/nginx/emmvmfc-sistema-*.log`
- **Backup**: `/var/log/emmvmfc-backup.log`
- **Sistema**: `/var/log/syslog`

## 🤝 Suporte EMMVMFC

Para suporte técnico:

- **GitHub**: [Issues](https://github.com/SIWUMS/gme-saas)
- **Email**: suporte@emmvmfc.com.br
- **Documentação**: Disponível no sistema após login

## 📄 Licença

Este sistema é distribuído sob a licença MIT. Desenvolvido especificamente para EMMVMFC.

---

**Desenvolvido por CB. Walison**

*Sistema de Refeições Escolares - Melhorando a gestão da alimentação escolar em Canguaretama, RN*
\`\`\`

```nginx file="nginx/emmvmfc.conf"
# Configuração Nginx para Sistema de Refeições Escolares - EMMVMFC
# Domínio: gestor.emmvmfc.com.br
# Coloque este arquivo em /etc/nginx/sites-available/sistema-refeicoes-emmvmfc

server {
    listen 80;
    server_name gestor.emmvmfc.com.br;
    
    # Redirecionar HTTP para HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
    
    # Permitir verificação do Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
}

server {
    listen 443 ssl http2;
    server_name gestor.emmvmfc.com.br;
    
    # Certificados SSL (serão configurados pelo Certbot)
    ssl_certificate /etc/letsencrypt/live/gestor.emmvmfc.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gestor.emmvmfc.com.br/privkey.pem;
    
    # Configurações SSL recomendadas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    
    # HSTS (ative após confirmar que tudo funciona)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Proxy para a aplicação Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        
        # Buffer settings para melhor performance
        proxy_buffering on;
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }
    
    # Servir arquivos de upload diretamente
    location /uploads {
        alias /var/www/sistema-refeicoes/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
        try_files $uri =404;
        
        # Limitar tipos de arquivo permitidos
        location ~* \.(jpg|jpeg|png|gif|ico|svg|pdf|doc|docx|xls|xlsx)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Servir arquivos estáticos com cache otimizado
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    location /static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Favicon
    location /favicon.ico {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Robots.txt
    location /robots.txt {
        proxy_pass http://localhost:3000;
        expires 1d;
    }
    
    # Configurações de segurança específicas para EMMVMFC
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self'";
    
    # Headers específicos para EMMVMFC
    add_header X-Powered-By "Sistema EMMVMFC";
    add_header X-Organization "Escola Municipal Manoel Vieira de Melo Filho Canguaretama";
    
    # Limitar tamanho de upload (50MB para documentos e imagens)
    client_max_body_size 50M;
    
    # Timeout settings
    client_body_timeout 60s;
    client_header_timeout 60s;
    
    # Desativar exibição da versão do Nginx
    server_tokens off;
    
    # Rate limiting para proteção contra DDoS
    limit_req_zone $binary_remote_addr zone=emmvmfc_login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=emmvmfc_api:10m rate=30r/m;
    
    location /api/auth/login {
        limit_req zone=emmvmfc_login burst=3 nodelay;
        proxy_pass http://localhost:3000;
    }
    
    location /api/ {
        limit_req zone=emmvmfc_api burst=10 nodelay;
        proxy_pass http://localhost:3000;
    }
    
    # Bloquear acesso a arquivos sensíveis
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    location ~ \.(env|log|sql|bak)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Logs específicos para EMMVMFC
    access_log /var/log/nginx/emmvmfc-sistema-access.log combined;
    error_log /var/log/nginx/emmvmfc-sistema-error.log warn;
    
    # Log personalizado para monitoramento
    log_format emmvmfc_custom '$remote_addr - $remote_user [$time_local] '
                              '"$request" $status $body_bytes_sent '
                              '"$http_referer" "$http_user_agent" '
                              '$request_time $upstream_response_time';
    
    access_log /var/log/nginx/emmvmfc-detailed.log emmvmfc_custom;
}

# Configuração adicional para subdomínios (se necessário)
server {
    listen 80;
    listen 443 ssl http2;
    server_name *.emmvmfc.com.br;
    
    # Redirecionar para o domínio principal
    return 301 https://gestor.emmvmfc.com.br$request_uri;
}
