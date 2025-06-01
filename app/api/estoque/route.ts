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
        e.*,
        a.nome as alimento_nome,
        a.categoria,
        a.unidade_medida,
        CASE 
          WHEN e.quantidade_atual <= e.quantidade_minima THEN 'baixo'
          WHEN e.data_validade <= CURRENT_DATE + INTERVAL '30 days' THEN 'vencendo'
          ELSE 'normal'
        END as status
      FROM estoque e
      JOIN alimentos a ON e.alimento_id = a.id
      WHERE e.escola_id = $1 OR $1 IS NULL
      ORDER BY a.nome ASC
    `,
      [session.user.tenantId],
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Estoque fetch error:", error)
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
      INSERT INTO estoque (
        escola_id, alimento_id, quantidade_atual, quantidade_minima,
        valor_unitario, data_validade, lote, fornecedor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        session.user.tenantId,
        data.alimento_id,
        data.quantidade_atual,
        data.quantidade_minima,
        data.valor_unitario,
        data.data_validade,
        data.lote,
        data.fornecedor,
      ],
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Estoque create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
