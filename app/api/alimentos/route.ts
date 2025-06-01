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
      SELECT * FROM alimentos 
      WHERE ativo = true 
      ORDER BY nome ASC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Alimentos fetch error:", error)
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
      INSERT INTO alimentos (
        codigo_taco, nome, categoria, unidade_medida,
        energia_kcal, proteinas, lipidios, carboidratos, fibra_alimentar,
        calcio, ferro, sodio, tem_gluten, tem_lactose, eh_vegano, eh_vegetariano
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `,
      [
        data.codigo_taco,
        data.nome,
        data.categoria,
        data.unidade_medida,
        data.energia_kcal,
        data.proteinas,
        data.lipidios,
        data.carboidratos,
        data.fibra_alimentar,
        data.calcio,
        data.ferro,
        data.sodio,
        data.tem_gluten,
        data.tem_lactose,
        data.eh_vegano,
        data.eh_vegetariano,
      ],
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Alimentos create error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
