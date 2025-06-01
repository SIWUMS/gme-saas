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

    const { tipo, quantidade, motivo, documento, valor_unitario } = await request.json()
    const estoqueId = params.id

    // Buscar estoque atual
    const estoqueResult = await query("SELECT * FROM estoque WHERE id = $1", [estoqueId])
    if (estoqueResult.rows.length === 0) {
      return NextResponse.json({ error: "Item de estoque não encontrado" }, { status: 404 })
    }

    const estoque = estoqueResult.rows[0]
    let novaQuantidade = Number.parseFloat(estoque.quantidade_atual)

    // Calcular nova quantidade baseada no tipo de movimentação
    if (tipo === "entrada") {
      novaQuantidade += Number.parseFloat(quantidade)
    } else if (tipo === "saida") {
      if (novaQuantidade < Number.parseFloat(quantidade)) {
        return NextResponse.json({ error: "Quantidade insuficiente em estoque" }, { status: 400 })
      }
      novaQuantidade -= Number.parseFloat(quantidade)
    } else if (tipo === "ajuste") {
      novaQuantidade = Number.parseFloat(quantidade)
    }

    // Inserir movimentação
    const movimentacaoResult = await query(
      `
      INSERT INTO movimentacoes_estoque (
        estoque_id, tipo_movimentacao, quantidade, valor_unitario, 
        valor_total, motivo, documento, usuario_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        estoqueId,
        tipo,
        quantidade,
        valor_unitario || estoque.valor_unitario,
        (Number.parseFloat(quantidade) * (valor_unitario || estoque.valor_unitario)).toFixed(2),
        motivo,
        documento,
        session.user.id,
      ],
    )

    // Atualizar quantidade no estoque
    await query(
      "UPDATE estoque SET quantidade_atual = $1, data_ultima_entrada = CASE WHEN $2 = 'entrada' THEN CURRENT_DATE ELSE data_ultima_entrada END WHERE id = $3",
      [novaQuantidade, tipo, estoqueId],
    )

    return NextResponse.json({
      success: true,
      movimentacao: movimentacaoResult.rows[0],
      nova_quantidade: novaQuantidade,
    })
  } catch (error) {
    console.error("Movimentação estoque error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
