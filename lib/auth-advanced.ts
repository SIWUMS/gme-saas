import { randomBytes, createHash, timingSafeEqual } from "crypto"
import { query } from "./database"

// Interfaces para autenticação avançada
export interface TwoFactorAuth {
  userId: string
  secret: string
  backupCodes: string[]
  enabled: boolean
  lastUsed?: Date
}

export interface SSOConfig {
  provider: "google" | "microsoft" | "saml"
  clientId: string
  clientSecret: string
  redirectUri: string
  enabled: boolean
}

export interface SecurityPolicy {
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireLowercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSymbols: boolean
  passwordExpirationDays: number
  maxLoginAttempts: number
  lockoutDurationMinutes: number
  sessionTimeoutMinutes: number
  require2FA: boolean
  allowedIpRanges?: string[]
}

// Configuração padrão de segurança
export const defaultSecurityPolicy: SecurityPolicy = {
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSymbols: true,
  passwordExpirationDays: 90,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 30,
  sessionTimeoutMinutes: 480, // 8 horas
  require2FA: false,
}

// Classe para gerenciar 2FA
export class TwoFactorAuthManager {
  // Gerar secret para 2FA
  static generateSecret(): string {
    return randomBytes(32).toString("base64")
  }

  // Gerar códigos de backup
  static generateBackupCodes(count = 10): string[] {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
      codes.push(randomBytes(4).toString("hex").toUpperCase())
    }
    return codes
  }

  // Gerar código TOTP (Time-based One-Time Password)
  static generateTOTP(secret: string, window = 0): string {
    const time = Math.floor(Date.now() / 1000 / 30) + window
    const timeBuffer = Buffer.alloc(8)
    timeBuffer.writeUInt32BE(time, 4)

    const hmac = createHash("sha1")
    hmac.update(Buffer.from(secret, "base64"))
    hmac.update(timeBuffer)
    const hash = hmac.digest()

    const offset = hash[hash.length - 1] & 0xf
    const code =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)

    return (code % 1000000).toString().padStart(6, "0")
  }

  // Verificar código TOTP
  static verifyTOTP(secret: string, token: string): boolean {
    // Verificar janela de tempo atual e adjacentes
    for (let window = -1; window <= 1; window++) {
      const expectedToken = this.generateTOTP(secret, window)
      if (timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken))) {
        return true
      }
    }
    return false
  }

  // Habilitar 2FA para usuário
  static async enable2FA(userId: string, secret: string): Promise<TwoFactorAuth> {
    const backupCodes = this.generateBackupCodes()

    const twoFA: TwoFactorAuth = {
      userId,
      secret,
      backupCodes,
      enabled: true,
    }

    await query(
      `INSERT INTO user_2fa (user_id, secret, backup_codes, enabled, created_at) 
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id) 
       UPDATE SET secret = $2, backup_codes = $3, enabled = $4, updated_at = NOW()`,
      [userId, secret, JSON.stringify(backupCodes), true],
    )

    return twoFA
  }

  // Desabilitar 2FA
  static async disable2FA(userId: string): Promise<void> {
    await query("UPDATE user_2fa SET enabled = false, updated_at = NOW() WHERE user_id = $1", [userId])
  }

  // Verificar se usuário tem 2FA habilitado
  static async is2FAEnabled(userId: string): Promise<boolean> {
    const result = await query("SELECT enabled FROM user_2fa WHERE user_id = $1", [userId])
    return result.rows.length > 0 && result.rows[0].enabled
  }
}

// Classe para gerenciar SSO
export class SSOManager {
  private config: SSOConfig

  constructor(config: SSOConfig) {
    this.config = config
  }

  // Gerar URL de autorização para Google
  generateGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  // Gerar URL de autorização para Microsoft
  generateMicrosoftAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: "openid email profile",
      response_mode: "query",
    })

    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`
  }

  // Trocar código por token (Google)
  async exchangeGoogleCode(code: string): Promise<any> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.config.redirectUri,
      }),
    })

    return await response.json()
  }

  // Obter informações do usuário (Google)
  async getGoogleUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
    return await response.json()
  }
}

// Classe para gerenciar políticas de segurança
export class SecurityPolicyManager {
  // Validar senha conforme política
  static validatePassword(password: string, policy: SecurityPolicy): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < policy.passwordMinLength) {
      errors.push(`Senha deve ter pelo menos ${policy.passwordMinLength} caracteres`)
    }

    if (policy.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      errors.push("Senha deve conter pelo menos uma letra maiúscula")
    }

    if (policy.passwordRequireLowercase && !/[a-z]/.test(password)) {
      errors.push("Senha deve conter pelo menos uma letra minúscula")
    }

    if (policy.passwordRequireNumbers && !/\d/.test(password)) {
      errors.push("Senha deve conter pelo menos um número")
    }

    if (policy.passwordRequireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Senha deve conter pelo menos um símbolo especial")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // Verificar se IP está na lista permitida
  static isIpAllowed(ip: string, policy: SecurityPolicy): boolean {
    if (!policy.allowedIpRanges || policy.allowedIpRanges.length === 0) {
      return true // Se não há restrições, permite todos
    }

    // Implementar verificação de ranges de IP
    // Por simplicidade, verificamos IPs exatos
    return policy.allowedIpRanges.includes(ip)
  }

  // Registrar tentativa de login
  static async recordLoginAttempt(userId: string, success: boolean, ip: string): Promise<void> {
    await query(
      `INSERT INTO login_attempts (user_id, success, ip_address, attempted_at) 
       VALUES ($1, $2, $3, NOW())`,
      [userId, success, ip],
    )
  }

  // Verificar se usuário está bloqueado
  static async isUserLocked(userId: string, policy: SecurityPolicy): Promise<boolean> {
    const cutoffTime = new Date()
    cutoffTime.setMinutes(cutoffTime.getMinutes() - policy.lockoutDurationMinutes)

    const result = await query(
      `SELECT COUNT(*) as failed_attempts 
       FROM login_attempts 
       WHERE user_id = $1 
         AND success = false 
         AND attempted_at > $2`,
      [userId, cutoffTime.toISOString()],
    )

    const failedAttempts = Number.parseInt(result.rows[0].failed_attempts)
    return failedAttempts >= policy.maxLoginAttempts
  }
}

// Função para inicializar tabelas de segurança
export async function initializeSecurityTables(): Promise<void> {
  // Tabela para 2FA
  await query(`
    CREATE TABLE IF NOT EXISTS user_2fa (
      user_id VARCHAR(255) PRIMARY KEY,
      secret TEXT NOT NULL,
      backup_codes JSONB NOT NULL,
      enabled BOOLEAN DEFAULT false,
      last_used TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Tabela para tentativas de login
  await query(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255),
      success BOOLEAN NOT NULL,
      ip_address INET,
      user_agent TEXT,
      attempted_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Tabela para configurações SSO
  await query(`
    CREATE TABLE IF NOT EXISTS sso_configs (
      id SERIAL PRIMARY KEY,
      provider VARCHAR(50) NOT NULL,
      client_id TEXT NOT NULL,
      client_secret TEXT NOT NULL,
      redirect_uri TEXT NOT NULL,
      enabled BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Índices para performance
  await query("CREATE INDEX IF NOT EXISTS idx_login_attempts_user_id ON login_attempts(user_id)")
  await query("CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at)")
}
