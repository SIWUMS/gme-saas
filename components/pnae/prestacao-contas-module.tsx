"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Eye,
  TrendingUp,
  PieChart,
} from "lucide-react"

const repasses = [
  {
    id: 1,
    periodo: "Janeiro 2024",
    valor: 45000,
    dataRepasse: "2024-01-15",
    status: "Recebido",
    valorExecutado: 42500,
    percentualExecutado: 94.4,
    documentos: 15,
  },
  {
    id: 2,
    periodo: "Fevereiro 2024",
    valor: 48000,
    dataRepasse: "2024-02-15",
    status: "Recebido",
    valorExecutado: 47800,
    percentualExecutado: 99.6,
    documentos: 18,
  },
  {
    id: 3,
    periodo: "Março 2024",
    valor: 52000,
    dataRepasse: "2024-03-15",
    status: "Em execução",
    valorExecutado: 35000,
    percentualExecutado: 67.3,
    documentos: 12,
  },
]

const documentos = [
  {
    id: 1,
    tipo: "Nota Fiscal",
    numero: "001234",
    fornecedor: "Distribuidora Alimentos Ltda",
    valor: 2500,
    data: "2024-03-10",
    status: "Aprovado",
  },
  {
    id: 2,
    tipo: "Recibo",
    numero: "REC-001",
    fornecedor: "Cooperativa AF",
    valor: 1800,
    data: "2024-03-08",
    status: "Pendente",
  },
  {
    id: 3,
    tipo: "Nota Fiscal",
    numero: "001235",
    fornecedor: "Hortifruti Central",
    valor: 3200,
    data: "2024-03-05",
    status: "Aprovado",
  },
]

const relatorios = [
  {
    id: 1,
    nome: "Relatório Mensal - Março 2024",
    tipo: "Execução Financeira",
    periodo: "Março 2024",
    status: "Concluído",
    dataGeracao: "2024-03-31",
  },
  {
    id: 2,
    nome: "Demonstrativo Agricultura Familiar",
    tipo: "Agricultura Familiar",
    periodo: "1º Trimestre 2024",
    status: "Em elaboração",
    dataGeracao: "2024-03-30",
  },
]

export function PrestacaoContasModule() {
  const [activeTab, setActiveTab] = useState("resumo")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recebido":
      case "Aprovado":
      case "Concluído":
        return "bg-green-100 text-green-800"
      case "Em execução":
      case "Em elaboração":
        return "bg-blue-100 text-blue-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Atrasado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const totalRecebido = repasses.reduce((acc, repasse) => acc + repasse.valor, 0)
  const totalExecutado = repasses.reduce((acc, repasse) => acc + repasse.valorExecutado, 0)
  const percentualGeral = (totalExecutado / totalRecebido) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prestação de Contas</h2>
          <p className="text-muted-foreground">Acompanhamento e relatórios para o FNDE</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar Documentos
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Recebido</p>
                <p className="text-2xl font-bold">{formatarMoeda(totalRecebido)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Executado</p>
                <p className="text-2xl font-bold">{formatarMoeda(totalExecutado)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">% Execução</p>
                <p className="text-2xl font-bold">{percentualGeral.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Documentos</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="repasses">Repasses</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execução Financeira por Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repasses.map((repasse) => (
                    <div key={repasse.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{repasse.periodo}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatarMoeda(repasse.valorExecutado)} / {formatarMoeda(repasse.valor)}
                        </span>
                      </div>
                      <Progress value={repasse.percentualExecutado} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{repasse.percentualExecutado.toFixed(1)}% executado</span>
                        <Badge className={getStatusColor(repasse.status)} variant="secondary">
                          {repasse.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conformidade PNAE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Agricultura Familiar (30%)</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">32.5%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Cardápios Nutricionais</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Conforme</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span>Documentação Pendente</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">3 itens</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Prestação de Contas</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Em dia</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="repasses" className="space-y-4">
          {repasses.map((repasse) => (
            <Card key={repasse.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{repasse.periodo}</CardTitle>
                    <CardDescription>Repasse recebido em {formatarData(repasse.dataRepasse)}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(repasse.status)}>{repasse.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Recebido</p>
                    <p className="font-semibold text-lg">{formatarMoeda(repasse.valor)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Executado</p>
                    <p className="font-semibold text-lg">{formatarMoeda(repasse.valorExecutado)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">% Execução</p>
                    <p className="font-semibold text-lg">{repasse.percentualExecutado.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Documentos</p>
                    <p className="font-semibold text-lg">{repasse.documentos}</p>
                  </div>
                </div>
                <Progress value={repasse.percentualExecutado} className="mb-4" />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Documentos Comprobatórios</h3>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Documento
            </Button>
          </div>
          {documentos.map((documento) => (
            <Card key={documento.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">
                      {documento.tipo} - {documento.numero}
                    </h4>
                    <p className="text-sm text-muted-foreground">{documento.fornecedor}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatarData(documento.data)} • {formatarMoeda(documento.valor)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(documento.status)}>{documento.status}</Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Relatórios FNDE</h3>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Novo Relatório
            </Button>
          </div>
          {relatorios.map((relatorio) => (
            <Card key={relatorio.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{relatorio.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {relatorio.tipo} • {relatorio.periodo}
                    </p>
                    <p className="text-sm text-muted-foreground">Gerado em {formatarData(relatorio.dataGeracao)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(relatorio.status)}>{relatorio.status}</Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
