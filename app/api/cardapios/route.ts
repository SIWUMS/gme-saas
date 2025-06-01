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
      SELECT 
        c.*,
        u.nome as criado_por_nome,
        COUNT(cr.id) as total_refeicoes
      FROM cardapios c
      LEFT JOIN usuarios u ON c.created_by = u.id
      LEFT JOIN cardapio_refeicoes cr ON c.id = cr.cardapio_id
      WHERE c.escola_id = $1 OR $1 IS NULL
      GROUP BY c.id, u.nome
      ORDER BY c.created_at DESC
    `,
      [session.user.tenantId],
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Cardapios fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const result = await query(
      `
      INSERT INTO cardapios (
        escola_id, nome, faixa_etaria, data_inicio, data_fim,
        observacoes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        session.user.tenantId,
        data.nome,
        data.faixa_etaria,
        data.data_inicio,
        data.data_fim,
        data.observacoes,
        session.user.id,
      ],
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Cardapios create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
