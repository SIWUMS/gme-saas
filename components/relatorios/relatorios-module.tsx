"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, BarChart3, PieChart, Calendar, Users } from "lucide-react"

const relatoriosDisponiveis = [
  {
    id: "consumo-mensal",
    nome: "Consumo Mensal",
    descricao: "Relatório detalhado do consumo de refeições por mês",
    icon: BarChart3,
    categoria: "Consumo",
  },
  {
    id: "nutricional-semanal",
    nome: "Análise Nutricional Semanal",
    descricao: "Análise dos valores nutricionais por faixa etária",
    icon: PieChart,
    categoria: "Nutrição",
  },
  {
    id: "estoque-atual",
    nome: "Estoque Atual",
    descricao: "Situação atual do estoque com alertas",
    icon: FileText,
    categoria: "Estoque",
  },
  {
    id: "custo-aluno",
    nome: "Custo por Aluno",
    descricao: "Análise de custos por aluno e por refeição",
    icon: BarChart3,
    categoria: "Financeiro",
  },
  {
    id: "frequencia-turmas",
    nome: "Frequência por Turmas",
    descricao: "Relatório de frequência de consumo por turma",
    icon: Users,
    categoria: "Consumo",
  },
  {
    id: "cardapio-planejado",
    nome: "Cardápio vs Executado",
    descricao: "Comparativo entre cardápio planejado e executado",
    icon: Calendar,
    categoria: "Cardápio",
  },
]

const relatoriosGerados = [
  {
    id: 1,
    nome: "Consumo Mensal - Maio 2024",
    tipo: "consumo-mensal",
    dataGeracao: "2024-06-01",
    tamanho: "2.3 MB",
    formato: "PDF",
    geradoPor: "Maria Silva",
  },
  {
    id: 2,
    nome: "Análise Nutricional - Semana 22",
    tipo: "nutricional-semanal",
    dataGeracao: "2024-05-31",
    tamanho: "1.8 MB",
    formato: "Excel",
    geradoPor: "João Santos",
  },
  {
    id: 3,
    nome: "Estoque Atual - Junho 2024",
    tipo: "estoque-atual",
    dataGeracao: "2024-06-15",
    tamanho: "856 KB",
    formato: "PDF",
    geradoPor: "Ana Costa",
  },
]

export function RelatoriosModule() {
  const [activeTab, setActiveTab] = useState("gerar")
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [parametros, setParametros] = useState({
    dataInicio: "",
    dataFim: "",
    turmas: "",
    formato: "pdf",
  })

  const categorias = ["todos", ...new Set(relatoriosDisponiveis.map((r) => r.categoria))]

  const relatoriosFiltrados = relatoriosDisponiveis.filter(
    (relatorio) => filtroCategoria === "todos" || relatorio.categoria === filtroCategoria,
  )

  const gerarRelatorio = (tipoRelatorio: string) => {
    console.log("Gerando relatório:", tipoRelatorio, parametros)
    // Implementar lógica de geração
  }

  const downloadRelatorio = (id: number) => {
    console.log("Fazendo download do relatório:", id)
    // Implementar lógica de download
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios</h2>
          <p className="text-muted-foreground">Gere e gerencie relatórios do sistema</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="gerar">Gerar Relatórios</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="gerar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros Gerais</CardTitle>
              <CardDescription>Configure os parâmetros para geração dos relatórios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data-inicio">Data Início</Label>
                  <Input
                    id="data-inicio"
                    type="date"
                    value={parametros.dataInicio}
                    onChange={(e) => setParametros({ ...parametros, dataInicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-fim">Data Fim</Label>
                  <Input
                    id="data-fim"
                    type="date"
                    value={parametros.dataFim}
                    onChange={(e) => setParametros({ ...parametros, dataFim: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="turmas">Turmas</Label>
                  <Select
                    value={parametros.turmas}
                    onValueChange={(value) => setParametros({ ...parametros, turmas: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as turmas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as turmas</SelectItem>
                      <SelectItem value="creche">Apenas Creche</SelectItem>
                      <SelectItem value="fundamental">Apenas Fundamental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formato">Formato</Label>
                  <Select
                    value={parametros.formato}
                    onValueChange={(value) => setParametros({ ...parametros, formato: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4 mb-4">
            <Label htmlFor="categoria">Filtrar por categoria:</Label>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria === "todos" ? "Todas as categorias" : categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatoriosFiltrados.map((relatorio) => (
              <Card key={relatorio.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <relatorio.icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{relatorio.nome}</CardTitle>
                      <CardDescription className="text-sm">{relatorio.categoria}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{relatorio.descricao}</p>
                  <Button onClick={() => gerarRelatorio(relatorio.id)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <div className="grid gap-4">
            {relatoriosGerados.map((relatorio) => (
              <Card key={relatorio.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{relatorio.nome}</CardTitle>
                      <CardDescription>
                        Gerado em {new Date(relatorio.dataGeracao).toLocaleDateString("pt-BR")} por{" "}
                        {relatorio.geradoPor}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{relatorio.formato}</div>
                      <div className="text-sm text-muted-foreground">{relatorio.tamanho}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => downloadRelatorio(relatorio.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
