"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, DollarSign, TrendingUp, Users, FileText } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const dadosFinanceiros = {
  resumoMensal: {
    custoTotal: 45000.0,
    custoPorAluno: 150.0,
    custoPorRefeicao: 7.5,
    totalAlunos: 300,
    totalRefeicoes: 6000,
    economiaGerada: 2500.0,
  },
  evolucaoMensal: [
    { mes: "Jan", custoTotal: 42000, custoPorAluno: 140, custoPorRefeicao: 7.0 },
    { mes: "Fev", custoTotal: 43500, custoPorAluno: 145, custoPorRefeicao: 7.25 },
    { mes: "Mar", custoTotal: 44200, custoPorAluno: 147, custoPorRefeicao: 7.37 },
    { mes: "Abr", custoTotal: 45000, custoPorAluno: 150, custoPorRefeicao: 7.5 },
    { mes: "Mai", custoTotal: 44800, custoPorAluno: 149, custoPorRefeicao: 7.47 },
    { mes: "Jun", custoTotal: 45000, custoPorAluno: 150, custoPorRefeicao: 7.5 },
  ],
  custoPorCategoria: [
    { categoria: "Café da Manhã", custo: 12000, porcentagem: 26.7 },
    { categoria: "Lanche", custo: 8000, porcentagem: 17.8 },
    { categoria: "Almoço", custo: 20000, porcentagem: 44.4 },
    { categoria: "Jantar", custo: 5000, porcentagem: 11.1 },
  ],
  comparativoAnual: [
    { periodo: "2023", custoMedio: 6.8, inflacao: 5.2 },
    { periodo: "2024", custoMedio: 7.5, inflacao: 4.8 },
  ],
}

export function RelatorioFinanceiro() {
  const [filtros, setFiltros] = useState({
    dataInicio: "2024-01-01",
    dataFim: "2024-06-30",
    faixaEtaria: "todas",
    tipoRelatorio: "completo",
  })

  const gerarRelatorio = () => {
    console.log("Gerando relatório financeiro:", filtros)
    // Implementar geração de relatório
  }

  const exportarDados = (formato: string) => {
    console.log("Exportando dados em formato:", formato)
    // Implementar exportação
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório Financeiro</CardTitle>
          <CardDescription>Análise completa dos custos por aluno e refeição</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="data-inicio">Data Início</Label>
              <Input
                id="data-inicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-fim">Data Fim</Label>
              <Input
                id="data-fim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faixa-etaria">Faixa Etária</Label>
              <Select
                value={filtros.faixaEtaria}
                onValueChange={(value) => setFiltros({ ...filtros, faixaEtaria: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="0-3">0-3 anos</SelectItem>
                  <SelectItem value="4-5">4-5 anos</SelectItem>
                  <SelectItem value="6-14">6-14 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo-relatorio">Tipo</Label>
              <Select
                value={filtros.tipoRelatorio}
                onValueChange={(value) => setFiltros({ ...filtros, tipoRelatorio: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completo">Completo</SelectItem>
                  <SelectItem value="resumido">Resumido</SelectItem>
                  <SelectItem value="comparativo">Comparativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={gerarRelatorio}>
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
            <Button variant="outline" onClick={() => exportarDados("pdf")}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => exportarDados("excel")}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Custo Total Mensal</p>
                <p className="text-2xl font-bold">R$ {dadosFinanceiros.resumoMensal.custoTotal.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Custo por Aluno</p>
                <p className="text-2xl font-bold">R$ {dadosFinanceiros.resumoMensal.custoPorAluno.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Custo por Refeição</p>
                <p className="text-2xl font-bold">R$ {dadosFinanceiros.resumoMensal.custoPorRefeicao.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Economia Gerada</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {dadosFinanceiros.resumoMensal.economiaGerada.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Custos</CardTitle>
            <CardDescription>Custo por aluno ao longo dos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosFinanceiros.evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Custo por Aluno"]} />
                <Line type="monotone" dataKey="custoPorAluno" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custo por Categoria</CardTitle>
            <CardDescription>Distribuição dos custos por tipo de refeição</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosFinanceiros.custoPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString()}`, "Custo"]} />
                <Bar dataKey="custo" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Categoria de Refeição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Categoria</th>
                  <th className="text-right p-3">Custo Total</th>
                  <th className="text-right p-3">% do Total</th>
                  <th className="text-right p-3">Custo/Aluno</th>
                  <th className="text-right p-3">Custo/Refeição</th>
                  <th className="text-center p-3">Eficiência</th>
                </tr>
              </thead>
              <tbody>
                {dadosFinanceiros.custoPorCategoria.map((categoria, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{categoria.categoria}</td>
                    <td className="text-right p-3">R$ {categoria.custo.toLocaleString()}</td>
                    <td className="text-right p-3">{categoria.porcentagem.toFixed(1)}%</td>
                    <td className="text-right p-3">
                      R$ {(categoria.custo / dadosFinanceiros.resumoMensal.totalAlunos).toFixed(2)}
                    </td>
                    <td className="text-right p-3">
                      R${" "}
                      {(
                        categoria.custo /
                        ((dadosFinanceiros.resumoMensal.totalRefeicoes * categoria.porcentagem) / 100)
                      ).toFixed(2)}
                    </td>
                    <td className="text-center p-3">
                      <Badge
                        variant={
                          categoria.porcentagem < 30
                            ? "default"
                            : categoria.porcentagem < 50
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {categoria.porcentagem < 30 ? "Ótima" : categoria.porcentagem < 50 ? "Boa" : "Atenção"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análise Comparativa */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Comparativa Anual</CardTitle>
          <CardDescription>Comparação com períodos anteriores e inflação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Evolução Anual</h4>
              <div className="space-y-3">
                {dadosFinanceiros.comparativoAnual.map((ano, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{ano.periodo}</span>
                    <div className="text-right">
                      <p className="font-medium">R$ {ano.custoMedio.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">Inflação: {ano.inflacao}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Indicadores de Performance</h4>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-800">Economia vs Terceirização</h5>
                  <p className="text-2xl font-bold text-green-800">32%</p>
                  <p className="text-sm text-green-600">R$ 2.500 economizados este mês</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-800">Eficiência Nutricional</h5>
                  <p className="text-2xl font-bold text-blue-800">95%</p>
                  <p className="text-sm text-blue-600">Atende padrões PNAE</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="font-medium text-purple-800">Satisfação vs Custo</h5>
                  <p className="text-2xl font-bold text-purple-800">Excelente</p>
                  <p className="text-sm text-purple-600">Alto valor nutricional por real investido</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
