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
        f.*,
        COUNT(lp.id) as total_licitacoes
      FROM fornecedores f
      LEFT JOIN licitacao_participantes lp ON f.id = lp.fornecedor_id
      WHERE f.ativo = true
      GROUP BY f.id
      ORDER BY f.nome ASC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Fornecedores fetch error:", error)
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
      INSERT INTO fornecedores (
        nome, cnpj_cpf, tipo, endereco, telefone, email,
        contato_responsavel, especialidade, agricultura_familiar
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        data.nome,
        data.cnpj_cpf,
        data.tipo,
        data.endereco,
        data.telefone,
        data.email,
        data.contato_responsavel,
        data.especialidade,
        data.agricultura_familiar || false,
      ],
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Fornecedores create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
