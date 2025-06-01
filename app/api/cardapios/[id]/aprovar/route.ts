import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verificar se usuário tem permissão para aprovar
    if (!["admin", "nutricionista", "super_admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Sem permissão para aprovar cardápios" }, { status: 403 })
    }

    const { observacoes } = await request.json()
    const cardapioId = params.id

    // Atualizar status do cardápio
    const result = await query(
      `
      UPDATE cardapios 
      SET status = 'aprovado', 
          aprovado_por = $1, 
          data_aprovacao = CURRENT_TIMESTAMP,
          observacoes = COALESCE($2, observacoes)
      WHERE id = $3
      RETURNING *
    `,
      [session.user.id, observacoes, cardapioId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Cardápio não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      cardapio: result.rows[0],
      message: "Cardápio aprovado com sucesso",
    })
  } catch (error) {
    console.error("Aprovar cardápio error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
