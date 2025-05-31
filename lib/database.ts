import { Pool } from "pg"

// Configuração do banco de dados PostgreSQL/Neon
export const dbConfig = {
  connectionString: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20, // máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

// Pool de conexões
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(dbConfig)

    pool.on("error", (err) => {
      console.error("Erro no pool de conexões:", err)
    })
  }

  return pool
}

// Função para executar queries
export async function query(text: string, params?: any[]) {
  const client = await getPool().connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Função para transações
export async function transaction(callback: (client: any) => Promise<any>) {
  const client = await getPool().connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// Função para verificar conexão
export async function checkConnection(): Promise<boolean> {
  try {
    const result = await query("SELECT 1")
    return result.rows.length > 0
  } catch (error) {
    console.error("Erro ao verificar conexão:", error)
    return false
  }
}

// Função para obter estatísticas do banco
export async function getDatabaseStats() {
  try {
    const sizeQuery = `
      SELECT 
        pg_size_pretty(pg_database_size(current_database())) as total_size,
        (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as tables_count,
        (SELECT sum(n_tup_ins + n_tup_upd + n_tup_del) FROM pg_stat_user_tables) as total_operations
    `
    const result = await query(sizeQuery)
    return result.rows[0]
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error)
    return null
  }
}
