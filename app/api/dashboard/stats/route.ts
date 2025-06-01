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

    // Estatísticas do dashboard
    const stats = await Promise.all([
      query("SELECT COUNT(*) as total FROM consumo_diario WHERE data_consumo = CURRENT_DATE"),
      query("SELECT COUNT(*) as total FROM estoque WHERE quantidade_atual > quantidade_minima"),
      query("SELECT COUNT(*) as total FROM estoque WHERE quantidade_atual <= quantidade_minima"),
      query("SELECT COUNT(*) as total FROM cardapios WHERE status = 'aprovado'"),
      query(`
        SELECT 
          EXTRACT(DOW FROM data_consumo) as dia_semana,
          SUM(quantidade_servida) as total_refeicoes
        FROM consumo_diario 
        WHERE data_consumo >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY EXTRACT(DOW FROM data_consumo)
        ORDER BY dia_semana
      `),
      query(`
        SELECT 
          EXTRACT(MONTH FROM data_consumo) as mes,
          AVG(quantidade_servida * 12.50) as custo_medio
        FROM consumo_diario 
        WHERE data_consumo >= CURRENT_DATE - INTERVAL '5 months'
        GROUP BY EXTRACT(MONTH FROM data_consumo)
        ORDER BY mes
      `),
    ])

    const dashboardData = {
      refeicoes_hoje: Number.parseInt(stats[0].rows[0]?.total || "0"),
      itens_estoque_ok: Number.parseInt(stats[1].rows[0]?.total || "0"),
      itens_estoque_baixo: Number.parseInt(stats[2].rows[0]?.total || "0"),
      cardapios_ativos: Number.parseInt(stats[3].rows[0]?.total || "0"),
      consumo_semanal: stats[4].rows.map((row) => ({
        dia: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][Number.parseInt(row.dia_semana)],
        refeicoes: Number.parseInt(row.total_refeicoes),
        planejado: 500,
      })),
      custo_mensal: stats[5].rows.map((row) => ({
        mes: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][
          Number.parseInt(row.mes) - 1
        ],
        custo: Number.parseFloat(row.custo_medio || "0"),
      })),
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
