import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await query(
      `
      SELECT * FROM configuracoes 
      WHERE escola_id = $1 OR escola_id IS NULL
      ORDER BY chave ASC
    `,
      [session.user.tenantId],
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Configurações fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { configuracoes } = await request.json()

    // Atualizar ou inserir configurações
    for (const config of configuracoes) {
      await query(
        `
        INSERT INTO configuracoes (escola_id, chave, valor, descricao, tipo, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (escola_id, chave) 
        DO UPDATE SET valor = $3, updated_by = $6, updated_at = CURRENT_TIMESTAMP
      `,
        [session.user.tenantId, config.chave, config.valor, config.descricao, config.tipo, session.user.id],
      )
    }

    return NextResponse.json({
      success: true,
      message: "Configurações salvas com sucesso",
    })
  } catch (error) {
    console.error("Configurações save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
