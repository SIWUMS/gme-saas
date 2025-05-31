"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  Download,
  Upload,
  FileText,
  DollarSign,
  Users,
  Building,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface RepaseFnde {
  id: string
  modalidade: string
  valorPerCapita: number
  diasLetivos: number
  valorTotal: number
}

interface EscolaDistribuicao {
  id: string
  nome: string
  codigo: string
  modalidades: string[]
  alunos: {
    creche: number
    preEscola: number
    fundamental: number
    eja: number
    integral: number
  }
  repasses: {
    federal: number
    estadual: number
    municipal: number
    total: number
  }
  status: "calculado" | "pendente" | "aprovado" | "transferido"
  ultimaAtualizacao: string
}

const repassesFnde: RepaseFnde[] = [
  { id: "1", modalidade: "Creche", valorPerCapita: 1.07, diasLetivos: 200, valorTotal: 214 },
  { id: "2", modalidade: "Pré-escola", valorPerCapita: 0.53, diasLetivos: 200, valorTotal: 106 },
  { id: "3", modalidade: "Fundamental", valorPerCapita: 0.36, diasLetivos: 200, valorTotal: 72 },
  { id: "4", modalidade: "EJA", valorPerCapita: 0.32, diasLetivos: 200, valorTotal: 64 },
  { id: "5", modalidade: "Tempo Integral", valorPerCapita: 1.07, diasLetivos: 200, valorTotal: 214 },
]

const escolasDistribuicao: EscolaDistribuicao[] = [
  {
    id: "1",
    nome: "EM Prof. João Silva",
    codigo: "12345678",
    modalidades: ["Fundamental", "Integral"],
    alunos: { creche: 0, preEscola: 0, fundamental: 450, eja: 0, integral: 150 },
    repasses: { federal: 64800, estadual: 12000, municipal: 8000, total: 84800 },
    status: "aprovado",
    ultimaAtualizacao: "15/01/2024",
  },
  {
    id: "2",
    nome: "EMEI Jardim das Flores",
    codigo: "87654321",
    modalidades: ["Creche", "Pré-escola"],
    alunos: { creche: 120, preEscola: 180, eja: 0, fundamental: 0, integral: 0 },
    repasses: { federal: 44880, estadual: 8000, municipal: 5000, total: 57880 },
    status: "calculado",
    ultimaAtualizacao: "20/01/2024",
  },
  {
    id: "3",
    nome: "EM Centro Comunitário",
    codigo: "11223344",
    modalidades: ["EJA", "Fundamental"],
    alunos: { creche: 0, preEscola: 0, fundamental: 280, eja: 95, integral: 0 },
    repasses: { federal: 26240, estadual: 6000, municipal: 4000, total: 36240 },
    status: "pendente",
    ultimaAtualizacao: "18/01/2024",
  },
]

export function DistribuicaoRecursosModule() {
  const [selectedEscola, setSelectedEscola] = useState<EscolaDistribuicao | null>(null)
  const [showCalculadora, setShowCalculadora] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants = {
      calculado: "secondary",
      pendente: "destructive",
      aprovado: "default",
      transferido: "outline",
    } as const

    const labels = {
      calculado: "Calculado",
      pendente: "Pendente",
      aprovado: "Aprovado",
      transferido: "Transferido",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const totalRepasses = escolasDistribuicao.reduce((acc, escola) => acc + escola.repasses.total, 0)
  const totalAlunos = escolasDistribuicao.reduce(
    (acc, escola) => acc + Object.values(escola.alunos).reduce((sum, qtd) => sum + qtd, 0),
    0,
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Distribuição de Recursos PNAE</h2>
          <p className="text-muted-foreground">Gestão automática dos repasses financeiros baseados no Censo Escolar</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowCalculadora(true)}>
            <Calculator className="mr-2 h-4 w-4" />
            Calculadora
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Recalcular Todos
          </Button>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Recursos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRepasses.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">Distribuído para {escolasDistribuicao.length} escolas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Atendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlunos.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">Todas as modalidades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas Ativas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escolasDistribuicao.length}</div>
            <p className="text-xs text-muted-foreground">
              {escolasDistribuicao.filter((e) => e.status === "aprovado").length} com repasse aprovado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Per Capita Médio</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalRepasses / totalAlunos).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Por aluno/ano letivo</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="escolas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="escolas">Escolas</TabsTrigger>
          <TabsTrigger value="valores-fnde">Valores FNDE</TabsTrigger>
          <TabsTrigger value="censo">Censo Escolar</TabsTrigger>
        </TabsList>

        <TabsContent value="escolas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Escola</CardTitle>
              <CardDescription>
                Repasses calculados baseados no Censo Escolar e valores per capita do FNDE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escola</TableHead>
                    <TableHead>Modalidades</TableHead>
                    <TableHead>Total Alunos</TableHead>
                    <TableHead>Repasse Federal</TableHead>
                    <TableHead>Contrapartida</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escolasDistribuicao.map((escola) => {
                    const totalAlunosEscola = Object.values(escola.alunos).reduce((sum, qtd) => sum + qtd, 0)
                    return (
                      <TableRow key={escola.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{escola.nome}</div>
                            <div className="text-sm text-muted-foreground">Código: {escola.codigo}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {escola.modalidades.map((modalidade) => (
                              <Badge key={modalidade} variant="outline" className="text-xs">
                                {modalidade}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{totalAlunosEscola}</TableCell>
                        <TableCell>R$ {escola.repasses.federal.toLocaleString("pt-BR")}</TableCell>
                        <TableCell>
                          R$ {(escola.repasses.estadual + escola.repasses.municipal).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="font-medium">
                          R$ {escola.repasses.total.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>{getStatusBadge(escola.status)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedEscola(escola)}>
                                Detalhes
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Repasse - {escola.nome}</DialogTitle>
                                <DialogDescription>
                                  Cálculo detalhado dos recursos por modalidade de ensino
                                </DialogDescription>
                              </DialogHeader>

                              {selectedEscola && (
                                <div className="space-y-4">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Informações da Escola</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                          <span>Código INEP:</span>
                                          <span className="font-medium">{selectedEscola.codigo}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Total de Alunos:</span>
                                          <span className="font-medium">
                                            {Object.values(selectedEscola.alunos).reduce((sum, qtd) => sum + qtd, 0)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Última Atualização:</span>
                                          <span className="font-medium">{selectedEscola.ultimaAtualizacao}</span>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                          <span>Repasse Federal:</span>
                                          <span className="font-medium">
                                            R$ {selectedEscola.repasses.federal.toLocaleString("pt-BR")}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Contrapartida Estadual:</span>
                                          <span className="font-medium">
                                            R$ {selectedEscola.repasses.estadual.toLocaleString("pt-BR")}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Contrapartida Municipal:</span>
                                          <span className="font-medium">
                                            R$ {selectedEscola.repasses.municipal.toLocaleString("pt-BR")}
                                          </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                          <span className="font-medium">Total:</span>
                                          <span className="font-bold">
                                            R$ {selectedEscola.repasses.total.toLocaleString("pt-BR")}
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Cálculo por Modalidade</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Modalidade</TableHead>
                                            <TableHead>Alunos</TableHead>
                                            <TableHead>Valor per capita</TableHead>
                                            <TableHead>Dias letivos</TableHead>
                                            <TableHead>Total</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {Object.entries(selectedEscola.alunos).map(([modalidade, qtdAlunos]) => {
                                            if (qtdAlunos === 0) return null
                                            const valorPerCapita =
                                              repassesFnde.find((r) =>
                                                r.modalidade.toLowerCase().includes(modalidade.toLowerCase()),
                                              )?.valorPerCapita || 0.36
                                            const diasLetivos = 200
                                            const total = qtdAlunos * valorPerCapita * diasLetivos

                                            return (
                                              <TableRow key={modalidade}>
                                                <TableCell className="capitalize">{modalidade}</TableCell>
                                                <TableCell>{qtdAlunos}</TableCell>
                                                <TableCell>R$ {valorPerCapita.toFixed(2)}</TableCell>
                                                <TableCell>{diasLetivos}</TableCell>
                                                <TableCell className="font-medium">
                                                  R$ {total.toLocaleString("pt-BR")}
                                                </TableCell>
                                              </TableRow>
                                            )
                                          })}
                                        </TableBody>
                                      </Table>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}

                              <DialogFooter>
                                <Button variant="outline">
                                  <Download className="mr-2 h-4 w-4" />
                                  Exportar Relatório
                                </Button>
                                <Button>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Aprovar Repasse
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valores-fnde" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Valores de Referência FNDE 2024</CardTitle>
              <CardDescription>Valores per capita oficiais para cada modalidade de ensino</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Valor per capita/dia</TableHead>
                    <TableHead>Dias letivos</TableHead>
                    <TableHead>Valor anual por aluno</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repassesFnde.map((repasse) => (
                    <TableRow key={repasse.id}>
                      <TableCell className="font-medium">{repasse.modalidade}</TableCell>
                      <TableCell>R$ {repasse.valorPerCapita.toFixed(2)}</TableCell>
                      <TableCell>{repasse.diasLetivos}</TableCell>
                      <TableCell className="font-medium">R$ {repasse.valorTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="censo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importação do Censo Escolar</CardTitle>
              <CardDescription>
                Importe os dados do Censo Escolar para atualizar automaticamente os cálculos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="censo-file">Arquivo do Censo (.xlsx, .csv)</Label>
                  <Input id="censo-file" type="file" accept=".xlsx,.csv" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ano-censo">Ano de Referência</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Censo
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Manual de Importação
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-blue-600" />
                  Última Importação
                </h4>
                <p className="text-sm text-muted-foreground">
                  Censo Escolar 2024 importado em 15/01/2024 às 14:30
                  <br />
                  47 escolas atualizadas com sucesso
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Calculadora Modal */}
      <Dialog open={showCalculadora} onOpenChange={setShowCalculadora}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calculadora PNAE</DialogTitle>
            <DialogDescription>Calcule rapidamente o repasse para uma modalidade específica</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Modalidade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creche">Creche (R$ 1,07)</SelectItem>
                    <SelectItem value="pre">Pré-escola (R$ 0,53)</SelectItem>
                    <SelectItem value="fundamental">Fundamental (R$ 0,36)</SelectItem>
                    <SelectItem value="eja">EJA (R$ 0,32)</SelectItem>
                    <SelectItem value="integral">Tempo Integral (R$ 1,07)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Número de Alunos</Label>
                <Input type="number" placeholder="Ex: 150" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Dias Letivos</Label>
                <Input type="number" defaultValue="200" />
              </div>
              <div className="space-y-2">
                <Label>Valor Calculado</Label>
                <Input value="R$ 10.800,00" readOnly />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCalculadora(false)}>
              Fechar
            </Button>
            <Button>Aplicar à Escola</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
