"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, Plus, Download, Eye, Settings, Target, BarChart3 } from "lucide-react"

interface CardapioPnae {
  id: string
  nome: string
  periodo: string
  modalidade: string[]
  faixaEtaria: string
  status: "conforme" | "nao_conforme" | "revisao"
  conformidadeNutricional: {
    energia: { valor: number; meta: number; status: "ok" | "baixo" | "alto" }
    proteina: { valor: number; meta: number; status: "ok" | "baixo" | "alto" }
    carboidrato: { valor: number; meta: number; status: "ok" | "baixo" | "alto" }
    lipidio: { valor: number; meta: number; status: "ok" | "baixo" | "alto" }
    fibra: { valor: number; meta: number; status: "ok" | "baixo" | "alto" }
    sodio: { valor: number; meta: number; status: "ok" | "baixo" | "alto" }
  }
  refeicoes: {
    cafeManha: boolean
    almoco: boolean
    lanche: boolean
    jantar: boolean
    ceia: boolean
  }
  custoPorPorcao: number
  aprovadoPor: string
  dataAprovacao: string
}

const cardapiosPnae: CardapioPnae[] = [
  {
    id: "1",
    nome: "Cardápio Fundamental - Semana 1",
    periodo: "07/02/2024 - 11/02/2024",
    modalidade: ["Fundamental"],
    faixaEtaria: "6-10 anos",
    status: "conforme",
    conformidadeNutricional: {
      energia: { valor: 315, meta: 300, status: "ok" },
      proteina: { valor: 14.2, meta: 15, status: "baixo" },
      carboidrato: { valor: 45.8, meta: 45, status: "ok" },
      lipidio: { valor: 8.9, meta: 10, status: "ok" },
      fibra: { valor: 5.2, meta: 5, status: "ok" },
      sodio: { valor: 380, meta: 400, status: "ok" },
    },
    refeicoes: { cafeManha: true, almoco: true, lanche: true, jantar: false, ceia: false },
    custoPorPorcao: 3.45,
    aprovadoPor: "Dra. Maria Santos",
    dataAprovacao: "05/02/2024",
  },
  {
    id: "2",
    nome: "Cardápio Creche - Integral",
    periodo: "07/02/2024 - 11/02/2024",
    modalidade: ["Creche"],
    faixaEtaria: "6 meses - 3 anos",
    status: "revisao",
    conformidadeNutricional: {
      energia: { valor: 280, meta: 300, status: "baixo" },
      proteina: { valor: 16.8, meta: 18, status: "baixo" },
      carboidrato: { valor: 42.1, meta: 45, status: "baixo" },
      lipidio: { valor: 12.3, meta: 12, status: "ok" },
      fibra: { valor: 4.1, meta: 5, status: "baixo" },
      sodio: { valor: 420, meta: 400, status: "alto" },
    },
    refeicoes: { cafeManha: true, almoco: true, lanche: true, jantar: true, ceia: true },
    custoPorPorcao: 4.2,
    aprovadoPor: "Em análise",
    dataAprovacao: "-",
  },
]

export function CardapiosPnaeModule() {
  const [selectedCardapio, setSelectedCardapio] = useState<CardapioPnae | null>(null)

  const getStatusBadge = (status: string) => {
    const variants = {
      conforme: "default",
      nao_conforme: "destructive",
      revisao: "secondary",
    } as const

    const labels = {
      conforme: "Conforme",
      nao_conforme: "Não Conforme",
      revisao: "Em Revisão",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getNutritionalStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "baixo":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "alto":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planejamento de Cardápio PNAE</h2>
          <p className="text-muted-foreground">Cardápios automatizados conforme normas nutricionais do PNAE</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Parâmetros PNAE
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cardápio
          </Button>
        </div>
      </div>

      {/* Resumo de Conformidade */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cardápios Conformes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">85% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Aguardando ajustes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Médio/Porção</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3,85</div>
            <p className="text-xs text-muted-foreground">Dentro do orçamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformidade Geral</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Meta: 95%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cardapios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cardapios">Cardápios</TabsTrigger>
          <TabsTrigger value="parametros">Parâmetros PNAE</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="cardapios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cardápios por Modalidade</CardTitle>
              <CardDescription>Gestão de cardápios conforme diretrizes nutricionais do PNAE</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cardápio</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Conformidade</TableHead>
                    <TableHead>Custo/Porção</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardapiosPnae.map((cardapio) => (
                    <TableRow key={cardapio.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{cardapio.nome}</div>
                          <div className="text-sm text-muted-foreground">{cardapio.faixaEtaria}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cardapio.modalidade.map((mod) => (
                            <Badge key={mod} variant="outline" className="text-xs">
                              {mod}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{cardapio.periodo}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {Object.entries(cardapio.conformidadeNutricional)
                            .slice(0, 3)
                            .map(([nutriente, data]) => (
                              <div key={nutriente} className="flex items-center gap-1 text-xs">
                                {getNutritionalStatusIcon(data.status)}
                                <span className="capitalize">{nutriente}</span>
                              </div>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell>R$ {cardapio.custoPorPorcao.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(cardapio.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-1 h-3 w-3" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametros" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros Nutricionais por Faixa Etária</CardTitle>
                <CardDescription>Valores de referência conforme PNAE</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faixa Etária</TableHead>
                      <TableHead>Energia (kcal)</TableHead>
                      <TableHead>Proteína (g)</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>6 meses - 1 ano</TableCell>
                      <TableCell>150</TableCell>
                      <TableCell>9</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>1-3 anos</TableCell>
                      <TableCell>300</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>4-5 anos</TableCell>
                      <TableCell>300</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>6-10 anos</TableCell>
                      <TableCell>300</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Conformidade</CardTitle>
                <CardDescription>Tolerâncias e limites para aprovação automática</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tolerância de Energia (%)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">±</span>
                    <input className="w-20 px-2 py-1 border rounded" defaultValue="10" />
                    <span className="text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tolerância de Proteína (%)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">±</span>
                    <input className="w-20 px-2 py-1 border rounded" defaultValue="15" />
                    <span className="text-sm">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Limite de Sódio (mg)</label>
                  <input className="w-32 px-2 py-1 border rounded" defaultValue="400" />
                </div>
                <Button className="w-full">Salvar Configurações</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Relatório de Conformidade</CardTitle>
                <CardDescription>Análise detalhada da conformidade nutricional</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análise de Custos</CardTitle>
                <CardDescription>Evolução dos custos por modalidade</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prestação de Contas</CardTitle>
                <CardDescription>Relatório para envio ao FNDE</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
