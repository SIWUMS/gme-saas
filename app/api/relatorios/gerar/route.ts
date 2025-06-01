import { NextResponse } from "next/server"
import { query } from "@/lib/database"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tipo, nome, parametros, formato } = await request.json()

    // Inserir relatório na fila de geração
    const result = await query(
      `
      INSERT INTO relatorios (
        escola_id, tipo_relatorio, nome, parametros, formato, gerado_por
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [session.user.tenantId, tipo, nome, JSON.stringify(parametros), formato, session.user.id],
    )

    // Simular geração do relatório (em produção seria um job em background)
    setTimeout(async () => {
      try {
        const arquivo_path = `/relatorios/${result.rows[0].id}.${formato}`
        await query("UPDATE relatorios SET status = 'concluido', arquivo_path = $1 WHERE id = $2", [
          arquivo_path,
          result.rows[0].id,
        ])
      } catch (error) {
        console.error("Erro ao finalizar relatório:", error)
        await query("UPDATE relatorios SET status = 'erro' WHERE id = $1", [result.rows[0].id])
      }
    }, 3000) // Simula 3 segundos de processamento

    return NextResponse.json({
      success: true,
      relatorio: result.rows[0],
      message: "Relatório adicionado à fila de geração",
    })
  } catch (error) {
    console.error("Gerar relatório error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
