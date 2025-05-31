"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Target, Award, AlertTriangle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const dadosComparativos = {
  benchmarkMercado: {
    custoMedioMercado: 8.5,
    custoEscola: 7.5,
    economia: 11.8,
    posicaoRanking: 2,
    totalEscolas: 15,
  },
  evolucaoTrimestral: [
    { trimestre: "Q1 2024", escola: 7.2, mercado: 8.3, meta: 7.5 },
    { trimestre: "Q2 2024", escola: 7.5, mercado: 8.5, meta: 7.5 },
    { trimestre: "Q3 2024", escola: 7.4, mercado: 8.7, meta: 7.5 },
    { trimestre: "Q4 2024", escola: 7.6, mercado: 8.9, meta: 7.5 },
  ],
  indicadoresPerformance: [
    { indicador: "Custo", valor: 85, meta: 80, status: "atencao" },
    { indicador: "Qualidade", valor: 92, meta: 85, status: "excelente" },
    { indicador: "Eficiência", valor: 88, meta: 85, status: "bom" },
    { indicador: "Sustentabilidade", valor: 78, meta: 75, status: "bom" },
    { indicador: "Satisfação", valor: 94, meta: 90, status: "excelente" },
    { indicador: "Conformidade", valor: 96, meta: 95, status: "excelente" },
  ],
  comparacaoEscolas: [
    { nome: "Escola A", custoPorAluno: 6.8, qualidade: 88, eficiencia: 92 },
    { nome: "Nossa Escola", custoPorAluno: 7.5, qualidade: 92, eficiencia: 88 },
    { nome: "Escola C", custoPorAluno: 8.2, qualidade: 85, eficiencia: 82 },
    { nome: "Escola D", custoPorAluno: 9.1, qualidade: 78, eficiencia: 75 },
    { nome: "Escola E", custoPorAluno: 7.9, qualidade: 90, eficiencia: 85 },
  ],
}

export function AnaliseComparativa() {
  const [periodoComparacao, setPeriodoComparacao] = useState("trimestral")
  const [tipoAnalise, setTipoAnalise] = useState("custo")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excelente":
        return <Award className="h-4 w-4 text-green-500" />
      case "bom":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "atencao":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excelente":
        return "bg-green-100 text-green-800"
      case "bom":
        return "bg-blue-100 text-blue-800"
      case "atencao":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Comparativa</CardTitle>
          <CardDescription>Compare performance com mercado e estabeleça benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={periodoComparacao} onValueChange={setPeriodoComparacao}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoAnalise} onValueChange={setTipoAnalise}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custo">Análise de Custo</SelectItem>
                <SelectItem value="qualidade">Qualidade Nutricional</SelectItem>
                <SelectItem value="eficiencia">Eficiência Operacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark do Mercado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Posição no Ranking</p>
                <p className="text-2xl font-bold">
                  {dadosComparativos.benchmarkMercado.posicaoRanking}º de{" "}
                  {dadosComparativos.benchmarkMercado.totalEscolas}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Economia vs Mercado</p>
                <p className="text-2xl font-bold text-green-600">
                  {dadosComparativos.benchmarkMercado.economia.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Custo Mercado</p>
                <p className="text-2xl font-bold">
                  R$ {dadosComparativos.benchmarkMercado.custoMedioMercado.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Nosso Custo</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {dadosComparativos.benchmarkMercado.custoEscola.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução vs Mercado</CardTitle>
            <CardDescription>Comparação trimestral com média do mercado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosComparativos.evolucaoTrimestral}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trimestre" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, ""]} />
                <Line type="monotone" dataKey="escola" stroke="#10b981" strokeWidth={2} name="Nossa Escola" />
                <Line type="monotone" dataKey="mercado" stroke="#ef4444" strokeWidth={2} name="Média Mercado" />
                <Line
                  type="monotone"
                  dataKey="meta"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Meta"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Radar de Performance</CardTitle>
            <CardDescription>Indicadores vs metas estabelecidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={dadosComparativos.indicadoresPerformance}>
                <PolarGrid />
                <PolarAngleAxis dataKey="indicador" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Atual" dataKey="valor" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="Meta" dataKey="meta" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores de Performance</CardTitle>
          <CardDescription>Acompanhamento detalhado dos KPIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dadosComparativos.indicadoresPerformance.map((indicador, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{indicador.indicador}</span>
                    {getStatusIcon(indicador.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Atual: {indicador.valor}%</span>
                      <span>Meta: {indicador.meta}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(indicador.valor, 100)}%` }}
                      />
                    </div>
                    <Badge className={getStatusColor(indicador.status)}>
                      {indicador.status === "excelente" && "Excelente"}
                      {indicador.status === "bom" && "Bom"}
                      {indicador.status === "atencao" && "Atenção"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparação com Outras Escolas */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmark com Outras Instituições</CardTitle>
          <CardDescription>Comparação de custo, qualidade e eficiência</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Instituição</th>
                  <th className="text-right p-3">Custo/Aluno</th>
                  <th className="text-right p-3">Qualidade (%)</th>
                  <th className="text-right p-3">Eficiência (%)</th>
                  <th className="text-center p-3">Posição</th>
                </tr>
              </thead>
              <tbody>
                {dadosComparativos.comparacaoEscolas
                  .sort((a, b) => a.custoPorAluno - b.custoPorAluno)
                  .map((escola, index) => (
                    <tr
                      key={index}
                      className={`border-b hover:bg-muted/50 ${escola.nome === "Nossa Escola" ? "bg-blue-50" : ""}`}
                    >
                      <td className="p-3 font-medium">
                        {escola.nome}
                        {escola.nome === "Nossa Escola" && <Badge className="ml-2">Você</Badge>}
                      </td>
                      <td className="text-right p-3">R$ {escola.custoPorAluno.toFixed(2)}</td>
                      <td className="text-right p-3">{escola.qualidade}%</td>
                      <td className="text-right p-3">{escola.eficiencia}%</td>
                      <td className="text-center p-3">
                        <Badge variant={index < 2 ? "default" : index < 4 ? "secondary" : "destructive"}>
                          {index + 1}º
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações de Melhoria</CardTitle>
          <CardDescription>Sugestões baseadas na análise comparativa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Pontos Fortes</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Custo 11.8% abaixo da média do mercado</li>
                <li>• Excelente qualidade nutricional (92%)</li>
                <li>• Alta satisfação dos alunos (94%)</li>
                <li>• Conformidade exemplar (96%)</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Oportunidades</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Melhorar eficiência operacional (+3%)</li>
                <li>• Reduzir desperdício de alimentos</li>
                <li>• Otimizar compras em lote</li>
                <li>• Implementar mais práticas sustentáveis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
