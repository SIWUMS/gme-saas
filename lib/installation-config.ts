// Configurações para instalação do sistema

export interface InstallationConfig {
  database: {
    provider: "postgresql" | "neon"
    host?: string
    port?: number
    database: string
    username: string
    password: string
    ssl: boolean
    connectionString?: string
  }

  backup: {
    enabled: boolean
    frequency: "hourly" | "daily" | "weekly" | "monthly"
    time: string
    retentionDays: number
    destination: "local" | "s3" | "ftp"
    compress: boolean
    includeUploads: boolean
  }

  security: {
    jwtSecret: string
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSymbols: boolean
      expirationDays: number
    }
    twoFactorAuth: {
      enabled: boolean
      required: boolean
    }
    sso: {
      enabled: boolean
      providers: Array<{
        name: "google" | "microsoft" | "saml"
        clientId: string
        clientSecret: string
        enabled: boolean
      }>
    }
    sessionTimeout: number
    maxLoginAttempts: number
    lockoutDuration: number
  }

  integrations: {
    taco: {
      enabled: boolean
      apiKey: string
      baseUrl: string
    }
    whatsapp: {
      enabled: boolean
      apiKey: string
      phoneNumberId: string
    }
    sms: {
      enabled: boolean
      provider: "twilio" | "nexmo" | "custom"
      apiKey: string
      fromNumber: string
    }
    analytics: {
      enabled: boolean
      provider: "google" | "custom"
      trackingId: string
    }
  }

  email: {
    provider: "smtp" | "sendgrid" | "mailgun" | "ses"
    host?: string
    port?: number
    username?: string
    password?: string
    apiKey?: string
    fromEmail: string
    fromName: string
  }

  storage: {
    provider: "local" | "s3" | "cloudinary"
    bucket?: string
    region?: string
    accessKey?: string
    secretKey?: string
    maxFileSize: number
    allowedTypes: string[]
  }

  system: {
    appName: string
    appUrl: string
    timezone: string
    locale: string
    currency: string
    theme: {
      primaryColor: string
      secondaryColor: string
      accentColor: string
    }
    features: {
      multiTenant: boolean
      pnaeModule: boolean
      costModule: boolean
      reportModule: boolean
      mobileApp: boolean
    }
  }
}

// Configuração padrão para instalação
export const defaultInstallationConfig: InstallationConfig = {
  database: {
    provider: "postgresql",
    database: "sistema_refeicoes",
    username: "postgres",
    password: "",
    ssl: false,
  },

  backup: {
    enabled: true,
    frequency: "daily",
    time: "02:00",
    retentionDays: 30,
    destination: "local",
    compress: true,
    includeUploads: true,
  },

  security: {
    jwtSecret: "",
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      expirationDays: 90,
    },
    twoFactorAuth: {
      enabled: true,
      required: false,
    },
    sso: {
      enabled: false,
      providers: [],
    },
    sessionTimeout: 480,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
  },

  integrations: {
    taco: {
      enabled: true,
      apiKey: "",
      baseUrl: "https://api.taco.gov.br/v1",
    },
    whatsapp: {
      enabled: false,
      apiKey: "",
      phoneNumberId: "",
    },
    sms: {
      enabled: false,
      provider: "twilio",
      apiKey: "",
      fromNumber: "",
    },
    analytics: {
      enabled: false,
      provider: "google",
      trackingId: "",
    },
  },

  email: {
    provider: "smtp",
    fromEmail: "noreply@sistema.com",
    fromName: "Sistema de Refeições Escolares",
  },

  storage: {
    provider: "local",
    maxFileSize: 10485760, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  },

  system: {
    appName: "Sistema de Refeições Escolares",
    appUrl: "http://localhost:3000",
    timezone: "America/Sao_Paulo",
    locale: "pt-BR",
    currency: "BRL",
    theme: {
      primaryColor: "#2563eb", // Azul
      secondaryColor: "#eab308", // Amarelo
      accentColor: "#f8fafc", // Branco suave
    },
    features: {
      multiTenant: true,
      pnaeModule: true,
      costModule: true,
      reportModule: true,
      mobileApp: false,
    },
  },
}

// Função para validar configuração de instalação
export function validateInstallationConfig(config: Partial<InstallationConfig>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validar banco de dados
  if (!config.database?.database) {
    errors.push("Nome do banco de dados é obrigatório")
  }

  if (!config.database?.username) {
    errors.push("Usuário do banco de dados é obrigatório")
  }

  // Validar segurança
  if (!config.security?.jwtSecret || config.security.jwtSecret.length < 32) {
    errors.push("JWT Secret deve ter pelo menos 32 caracteres")
  }

  // Validar sistema
  if (!config.system?.appName) {
    errors.push("Nome da aplicação é obrigatório")
  }

  if (!config.system?.appUrl) {
    errors.push("URL da aplicação é obrigatória")
  }

  // Validar email
  if (!config.email?.fromEmail) {
    errors.push("Email remetente é obrigatório")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Função para gerar arquivo de configuração
export function generateConfigFile(config: InstallationConfig): string {
  return `# Configuração do Sistema de Refeições Escolares
# Gerado automaticamente em ${new Date().toISOString()}

# Banco de Dados
DATABASE_URL="${config.database.connectionString || `postgresql://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}`}"
DATABASE_SSL=${config.database.ssl}

# Segurança
NEXTAUTH_SECRET="${config.security.jwtSecret}"
NEXTAUTH_URL="${config.system.appUrl}"

# Backup
BACKUP_ENABLED=${config.backup.enabled}
BACKUP_FREQUENCY="${config.backup.frequency}"
BACKUP_TIME="${config.backup.time}"
BACKUP_RETENTION_DAYS=${config.backup.retentionDays}

# Integrações
TACO_API_KEY="${config.integrations.taco.apiKey}"
WHATSAPP_API_KEY="${config.integrations.whatsapp.apiKey}"
SMS_API_KEY="${config.integrations.sms.apiKey}"
GOOGLE_ANALYTICS_ID="${config.integrations.analytics.trackingId}"

# Email
EMAIL_PROVIDER="${config.email.provider}"
EMAIL_HOST="${config.email.host || ""}"
EMAIL_PORT=${config.email.port || 587}
EMAIL_USERNAME="${config.email.username || ""}"
EMAIL_PASSWORD="${config.email.password || ""}"
EMAIL_FROM="${config.email.fromEmail}"

# Sistema
APP_NAME="${config.system.appName}"
APP_URL="${config.system.appUrl}"
TIMEZONE="${config.system.timezone}"
LOCALE="${config.system.locale}"
CURRENCY="${config.system.currency}"

# Tema
THEME_PRIMARY_COLOR="${config.system.theme.primaryColor}"
THEME_SECONDARY_COLOR="${config.system.theme.secondaryColor}"
THEME_ACCENT_COLOR="${config.system.theme.accentColor}"

# Features
FEATURE_MULTI_TENANT=${config.system.features.multiTenant}
FEATURE_PNAE_MODULE=${config.system.features.pnaeModule}
FEATURE_COST_MODULE=${config.system.features.costModule}
FEATURE_REPORT_MODULE=${config.system.features.reportModule}
FEATURE_MOBILE_APP=${config.system.features.mobileApp}
`
}

// Função para gerar script SQL de instalação
export function generateInstallationSQL(config: InstallationConfig): string {
  return `-- Script de instalação do Sistema de Refeições Escolares
-- Gerado automaticamente em ${new Date().toISOString()}

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar schema principal
CREATE SCHEMA IF NOT EXISTS public;

-- Tabelas principais já definidas no schema.sql

-- Inserir configurações do sistema
INSERT INTO system_config (key, value, description) VALUES
('app_name', '${config.system.appName}', 'Nome da aplicação'),
('app_url', '${config.system.appUrl}', 'URL da aplicação'),
('timezone', '${config.system.timezone}', 'Fuso horário'),
('locale', '${config.system.locale}', 'Localização'),
('currency', '${config.system.currency}', 'Moeda'),
('theme_primary', '${config.system.theme.primaryColor}', 'Cor primária'),
('theme_secondary', '${config.system.theme.secondaryColor}', 'Cor secundária'),
('backup_enabled', '${config.backup.enabled}', 'Backup habilitado'),
('backup_frequency', '${config.backup.frequency}', 'Frequência do backup'),
('2fa_enabled', '${config.security.twoFactorAuth.enabled}', '2FA habilitado')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Criar usuário super admin padrão
INSERT INTO users (id, email, password, name, role, tenant_id, created_at) VALUES
('super-admin-001', 'superadmin@sistema.com', crypt('123456', gen_salt('bf')), 'Super Administrador', 'super_admin', NULL, NOW())
ON CONFLICT (email) DO NOTHING;

-- Configurar permissões padrão
-- (Permissões já definidas no sistema)

COMMIT;
`
}
