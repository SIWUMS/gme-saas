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

    const result = await query(`
      SELECT 
        l.*,
        u.nome as criado_por_nome,
        COUNT(lp.id) as total_participantes
      FROM licitacoes l
      LEFT JOIN usuarios u ON l.created_by = u.id
      LEFT JOIN licitacao_participantes lp ON l.id = lp.licitacao_id
      GROUP BY l.id, u.nome
      ORDER BY l.created_at DESC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Licitações fetch error:", error)
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
      INSERT INTO licitacoes (
        numero, tipo, objeto, valor_estimado, data_abertura,
        data_limite, modalidade, observacoes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        data.numero,
        data.tipo,
        data.objeto,
        data.valor_estimado,
        data.data_abertura,
        data.data_limite,
        data.modalidade,
        data.observacoes,
        session.user.id,
      ],
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Licitações create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
