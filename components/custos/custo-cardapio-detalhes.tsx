"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, DollarSign, Users, Calendar, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface CustoCardapioDetalhesProps {
  cardapio: any
  onClose: () => void
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function CustoCardapioDetalhes({ cardapio, onClose }: CustoCardapioDetalhesProps) {
  const custoMedio = cardapio.custoTotal / (cardapio.totalAlunos * cardapio.diasLetivos * cardapio.refeicoesDia)

  const dadosGrafico = cardapio.preparacoes.map((prep: any) => ({
    nome: prep.nome,
    custo: prep.custoTotal,
    porcentagem: (prep.custoTotal / cardapio.custoTotal) * 100,
  }))

  const dadosPizza = cardapio.preparacoes.map((prep: any, index: number) => ({
    name: prep.nome,
    value: prep.custoTotal,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-xl">{cardapio.nome}</CardTitle>
                <CardDescription>
                  {cardapio.periodo} • {cardapio.faixaEtaria} • {cardapio.totalAlunos} alunos
                </CardDescription>
              </div>
            </div>
            <Badge variant={cardapio.status === "ativo" ? "default" : "secondary"}>
              {cardapio.status === "ativo" ? "Ativo" : "Planejado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Custo Total</p>
                    <p className="text-xl font-bold">R$ {cardapio.custoTotal.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Custo/Aluno</p>
                    <p className="text-xl font-bold">R$ {cardapio.custoPorAluno.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Custo/Refeição</p>
                    <p className="text-xl font-bold">R$ {cardapio.custoPorRefeicao.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Custo Médio</p>
                    <p className="text-xl font-bold">R$ {custoMedio.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição de Custos por Preparação</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Custo"]} />
                    <Bar dataKey="custo" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proporção de Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosPizza}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosPizza.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Custo"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Detalhamento por Preparação */}
          <div>
            <h4 className="font-medium mb-4">Detalhamento por Preparação</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Preparação</th>
                    <th className="text-right p-3">Quantidade</th>
                    <th className="text-right p-3">Custo/Porção</th>
                    <th className="text-right p-3">Custo Total</th>
                    <th className="text-right p-3">% do Cardápio</th>
                    <th className="text-right p-3">Custo/Aluno</th>
                  </tr>
                </thead>
                <tbody>
                  {cardapio.preparacoes.map((prep: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{prep.nome}</td>
                      <td className="text-right p-3">{prep.quantidade}</td>
                      <td className="text-right p-3">R$ {prep.custoPorcao.toFixed(2)}</td>
                      <td className="text-right p-3">R$ {prep.custoTotal.toFixed(2)}</td>
                      <td className="text-right p-3">{((prep.custoTotal / cardapio.custoTotal) * 100).toFixed(1)}%</td>
                      <td className="text-right p-3">R$ {(prep.custoTotal / cardapio.totalAlunos).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t font-medium bg-muted/50">
                    <td className="p-3">Total</td>
                    <td className="text-right p-3">-</td>
                    <td className="text-right p-3">-</td>
                    <td className="text-right p-3">R$ {cardapio.custoTotal.toFixed(2)}</td>
                    <td className="text-right p-3">100%</td>
                    <td className="text-right p-3">R$ {cardapio.custoPorAluno.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Análise de Eficiência */}
          <div>
            <h4 className="font-medium mb-4">Análise de Eficiência</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">Custo por Dia Letivo</h5>
                <p className="text-2xl font-bold text-blue-800">
                  R$ {(cardapio.custoTotal / cardapio.diasLetivos).toFixed(2)}
                </p>
                <p className="text-sm text-blue-600">Para {cardapio.totalAlunos} alunos</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-2">Eficiência Nutricional</h5>
                <p className="text-2xl font-bold text-green-800">{cardapio.refeicoesDia} ref/dia</p>
                <p className="text-sm text-green-600">R$ {cardapio.custoPorRefeicao.toFixed(2)} por refeição</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h5 className="font-medium text-purple-800 mb-2">Preparação Mais Cara</h5>
                <p className="text-lg font-bold text-purple-800">
                  {
                    cardapio.preparacoes.reduce((max: any, prep: any) =>
                      prep.custoPorcao > max.custoPorcao ? prep : max,
                    ).nome
                  }
                </p>
                <p className="text-sm text-purple-600">
                  R${" "}
                  {cardapio.preparacoes
                    .reduce((max: any, prep: any) => (prep.custoPorcao > max.custoPorcao ? prep : max))
                    .custoPorcao.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
