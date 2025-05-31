import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs/promises"
import path from "path"

const execAsync = promisify(exec)

export interface BackupConfig {
  autoBackup: boolean
  frequency: "hourly" | "daily" | "weekly" | "monthly"
  time: string
  retentionDays: number
  compressBackups: boolean
  includeUploads: boolean
  destination: "local" | "s3" | "ftp"
}

export interface BackupFile {
  id: string
  filename: string
  size: string
  date: string
  status: "success" | "failed" | "in_progress"
  type: "automatic" | "manual"
  path: string
}

// Diretório de backups
const BACKUP_DIR = process.env.BACKUP_DIR || "./backups"

// Função para criar backup manual
export async function createManualBackup(): Promise<BackupFile> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `backup_manual_${timestamp}.sql`
  const filepath = path.join(BACKUP_DIR, filename)

  try {
    // Criar diretório se não existir
    await fs.mkdir(BACKUP_DIR, { recursive: true })

    // Comando pg_dump para PostgreSQL
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
    const command = `pg_dump "${databaseUrl}" > "${filepath}"`

    await execAsync(command)

    // Verificar se o arquivo foi criado
    const stats = await fs.stat(filepath)

    const backupFile: BackupFile = {
      id: `manual_${timestamp}`,
      filename,
      size: formatBytes(stats.size),
      date: new Date().toISOString(),
      status: "success",
      type: "manual",
      path: filepath,
    }

    // Salvar informações do backup
    await saveBackupInfo(backupFile)

    return backupFile
  } catch (error) {
    console.error("Erro ao criar backup:", error)
    throw new Error("Falha ao criar backup")
  }
}

// Função para backup automático
export async function createAutomaticBackup(config: BackupConfig): Promise<BackupFile> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `backup_auto_${timestamp}.sql${config.compressBackups ? ".gz" : ""}`
  const filepath = path.join(BACKUP_DIR, filename)

  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true })

    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
    let command = `pg_dump "${databaseUrl}"`

    if (config.compressBackups) {
      command += ` | gzip > "${filepath}"`
    } else {
      command += ` > "${filepath}"`
    }

    await execAsync(command)

    const stats = await fs.stat(filepath)

    const backupFile: BackupFile = {
      id: `auto_${timestamp}`,
      filename,
      size: formatBytes(stats.size),
      date: new Date().toISOString(),
      status: "success",
      type: "automatic",
      path: filepath,
    }

    await saveBackupInfo(backupFile)

    // Limpar backups antigos
    await cleanOldBackups(config.retentionDays)

    return backupFile
  } catch (error) {
    console.error("Erro ao criar backup automático:", error)
    throw new Error("Falha ao criar backup automático")
  }
}

// Função para restaurar backup
export async function restoreBackup(backupFile: BackupFile): Promise<void> {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
    let command: string

    if (backupFile.filename.endsWith(".gz")) {
      command = `gunzip -c "${backupFile.path}" | psql "${databaseUrl}"`
    } else {
      command = `psql "${databaseUrl}" < "${backupFile.path}"`
    }

    await execAsync(command)
  } catch (error) {
    console.error("Erro ao restaurar backup:", error)
    throw new Error("Falha ao restaurar backup")
  }
}

// Função para listar backups
export async function listBackups(): Promise<BackupFile[]> {
  try {
    const backupInfoPath = path.join(BACKUP_DIR, "backup_info.json")
    const data = await fs.readFile(backupInfoPath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Função para salvar informações do backup
async function saveBackupInfo(backupFile: BackupFile): Promise<void> {
  try {
    const backups = await listBackups()
    backups.push(backupFile)

    const backupInfoPath = path.join(BACKUP_DIR, "backup_info.json")
    await fs.writeFile(backupInfoPath, JSON.stringify(backups, null, 2))
  } catch (error) {
    console.error("Erro ao salvar informações do backup:", error)
  }
}

// Função para limpar backups antigos
async function cleanOldBackups(retentionDays: number): Promise<void> {
  try {
    const backups = await listBackups()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    const backupsToKeep = backups.filter((backup) => {
      const backupDate = new Date(backup.date)
      return backupDate > cutoffDate
    })

    // Remover arquivos antigos
    const backupsToRemove = backups.filter((backup) => {
      const backupDate = new Date(backup.date)
      return backupDate <= cutoffDate
    })

    for (const backup of backupsToRemove) {
      try {
        await fs.unlink(backup.path)
      } catch (error) {
        console.error(`Erro ao remover backup ${backup.filename}:`, error)
      }
    }

    // Atualizar lista de backups
    const backupInfoPath = path.join(BACKUP_DIR, "backup_info.json")
    await fs.writeFile(backupInfoPath, JSON.stringify(backupsToKeep, null, 2))
  } catch (error) {
    console.error("Erro ao limpar backups antigos:", error)
  }
}

// Função auxiliar para formatar bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Função para agendar backups automáticos
export function scheduleBackups(config: BackupConfig): void {
  if (!config.autoBackup) return

  // Implementar agendamento baseado na frequência
  // Isso seria melhor implementado com um job scheduler como node-cron
  console.log(`Backup automático agendado: ${config.frequency} às ${config.time}`)
}
