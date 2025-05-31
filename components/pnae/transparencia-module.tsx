"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  CheckCircle,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Info,
  Search,
  Share2,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function TransparenciaModule() {
  const [ano, setAno] = useState("2024")
  const [searchTerm, setSearchTerm] = useState("")

  const documentos = [
    {
      id: 1,
      nome: "Relatório Anual PNAE 2023",
      tipo: "PDF",
      tamanho: "2.4 MB",
      data: "15/12/2023",
      categoria: "Prestação de Contas",
    },
    {
      id: 2,
      nome: "Chamada Pública Agricultura Familiar nº 003/2024",
      tipo: "PDF",
      tamanho: "1.8 MB",
      data: "10/02/2024",
      categoria: "Licitação",
    },
    {
      id: 3,
      nome: "Cardápios Escolares - 1º Semestre 2024",
      tipo: "PDF",
      tamanho: "3.5 MB",
      data: "20/01/2024",
      categoria: "Cardápio",
    },
    {
      id: 4,
      nome: "Planilha de Distribuição de Recursos por Escola",
      tipo: "XLSX",
      tamanho: "1.2 MB",
      data: "05/01/2024",
      categoria: "Recursos",
    },
    {
      id: 5,
      nome: "Termo de Referência - Pregão 012/2024",
      tipo: "PDF",
      tamanho: "2.1 MB",
      data: "25/02/2024",
      categoria: "Licitação",
    },
    {
      id: 6,
      nome: "Análise Nutricional - Refeições Escolares",
      tipo: "PDF",
      tamanho: "1.6 MB",
      data: "12/03/2024",
      categoria: "Nutrição",
    },
    {
      id: 7,
      nome: "Contratos Agricultura Familiar - 2024",
      tipo: "ZIP",
      tamanho: "4.2 MB",
      data: "01/03/2024",
      categoria: "Agricultura Familiar",
    },
    {
      id: 8,
      nome: "Ata Conselho de Alimentação Escolar - Março/2024",
      tipo: "PDF",
      tamanho: "0.8 MB",
      data: "20/03/2024",
      categoria: "CAE",
    },
  ]

  const licitacoes = [
    {
      id: 1,
      numero: "PP-012/2024",
      modalidade: "Pregão Presencial",
      objeto: "Aquisição de Alimentos Não-Perecíveis",
      valor: "R$ 1.250.846,32",
      data: "10/03/2024",
      status: "Em andamento",
    },
    {
      id: 2,
      numero: "CP-003/2024",
      modalidade: "Chamada Pública",
      objeto: "Aquisição de produtos da Agricultura Familiar",
      valor: "R$ 428.650,00",
      data: "15/02/2024",
      status: "Concluída",
    },
    {
      id: 3,
      numero: "PE-015/2024",
      modalidade: "Pregão Eletrônico",
      objeto: "Aquisição de Carnes e Derivados",
      valor: "R$ 876.432,10",
      data: "05/04/2024",
      status: "Em andamento",
    },
    {
      id: 4,
      numero: "CP-002/2024",
      modalidade: "Chamada Pública",
      objeto: "Aquisição de Hortifruti da Agricultura Familiar",
      valor: "R$ 356.780,00",
      data: "20/01/2024",
      status: "Concluída",
    },
    {
      id: 5,
      numero: "PE-008/2024",
      modalidade: "Pregão Eletrônico",
      objeto: "Aquisição de Utensílios de Cozinha",
      valor: "R$ 125.430,85",
      data: "12/02/2024",
      status: "Concluída",
    },
  ]

  const filteredDocumentos = documentos.filter(
    (doc) =>
      doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header com título e filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700">Portal de Transparência PNAE</h2>
          <p className="text-muted-foreground mt-1">
            Informações públicas sobre a execução do Programa Nacional de Alimentação Escolar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={ano} onValueChange={setAno}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1">
            <Download size={16} />
            Exportar Dados
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Share2 size={16} className="mr-1" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Card de conformidade */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-700">Conformidade com Legislação PNAE</CardTitle>
            <Badge className="bg-green-600">100% Conforme</Badge>
          </div>
          <CardDescription>Dados verificados pelo Conselho de Alimentação Escolar (CAE) e FNDE</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Agricultura Familiar</span>
                <span>35,2% (min. 30%)</span>
              </div>
              <Progress
                value={35.2 / 0.3}
                className="h-2 bg-blue-200"
                // Para o valor acima de 100%, fixar em 100%
                style={{ background: "rgb(219 234 254)", "--progress": `${Math.min(35.2 / 0.3, 100)}%` }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Prestação de Contas</span>
                <span>100% em dia</span>
              </div>
              <Progress value={100} className="h-2 bg-blue-200" style={{ background: "rgb(219 234 254)" }} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Nutricionistas RT</span>
                <span>6/6 Contratados</span>
              </div>
              <Progress value={100} className="h-2 bg-blue-200" style={{ background: "rgb(219 234 254)" }} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Nutrientes Mínimos</span>
                <span>100% Atendido</span>
              </div>
              <Progress value={100} className="h-2 bg-blue-200" style={{ background: "rgb(219 234 254)" }} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck size={16} className="text-green-600" />
              <span>Dados verificados e certificados pelo CAE em 15/04/2024</span>
            </div>
            <Button variant="link" size="sm" className="text-blue-700">
              Ver documentação completa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs com diferentes visualizações */}
      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="licitacoes">Licitações</TabsTrigger>
          <TabsTrigger value="agricultura">Agricultura Familiar</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        {/* Conteúdo da Tab Resumo */}
        <TabsContent value="resumo" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recursos PNAE {ano}</CardTitle>
                <CardDescription>Total e distribuição por modalidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-blue-700">R$ 2.847.650,00</span>
                    <Badge className="bg-yellow-500 text-white">Total</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Creche</span>
                      <span>R$ 886.423,00</span>
                    </div>
                    <Progress value={31.2} className="h-2 bg-blue-200" style={{ background: "rgb(219 234 254)" }} />

                    <div className="flex justify-between text-sm">
                      <span>Pré-escola</span>
                      <span>R$ 743.671,00</span>
                    </div>
                    <Progress value={26.1} className="h-2 bg-blue-200" style={{ background: "rgb(219 234 254)" }} />

                    <div className="flex justify-between text-sm">
                      <span>Fundamental</span>
                      <span>R$ 1.026.792,00</span>
                    </div>
                    <Progress value={36.1} className="h-2 bg-blue-200" style={{ background: "rgb(219 234 254)" }} />

                    <div className="flex justify-between text-sm">
                      <span>EJA</span>
                      <span>R$ 190.764,00</span>
                    </div>
                    <Progress value={6.6} className="h-2 bg-blue-200" style={{ background: "rgb(219 234 254)" }} />
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart size={14} className="mr-1" />
                    Ver detalhamento
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alunos Beneficiados</CardTitle>
                <CardDescription>Por modalidade de ensino</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-blue-700">18.450</span>
                    <Badge className="bg-blue-600 text-white">Total</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold text-blue-700">4.230</div>
                      <div className="text-xs text-muted-foreground">Creche</div>
                    </div>

                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold text-blue-700">3.860</div>
                      <div className="text-xs text-muted-foreground">Pré-escola</div>
                    </div>

                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold text-blue-700">9.120</div>
                      <div className="text-xs text-muted-foreground">Fundamental</div>
                    </div>

                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold text-blue-700">1.240</div>
                      <div className="text-xs text-muted-foreground">EJA</div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Info size={14} className="mr-1" />
                    Dados por escola
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agricultura Familiar</CardTitle>
                <CardDescription>Aquisições diretas da agricultura familiar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1">Percentual de compras</div>
                      <div className="text-2xl font-bold text-blue-700">35,2%</div>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold">
                      35%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex flex-col">
                      <div className="text-xs text-muted-foreground">Valor</div>
                      <div className="font-medium">R$ 1.002.373,00</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs text-muted-foreground">Contratos</div>
                      <div className="font-medium">23 Cooperativas</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Conforme exigência</div>
                      <p className="text-xs text-muted-foreground">Mínimo exigido de 30% alcançado</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink size={14} className="mr-1" />
                    Ver fornecedores
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visão Geral da Execução PNAE {ano}</CardTitle>
              <CardDescription>Dados consolidados do exercício</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Repasses Federais</div>
                  <div className="text-xl font-bold text-blue-700">R$ 2.847.650,00</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-600">100%</span> recebido
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Complementação Municipal</div>
                  <div className="text-xl font-bold text-blue-700">R$ 1.542.360,00</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-blue-600">+54%</span> do repasse federal
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Despesas Executadas</div>
                  <div className="text-xl font-bold text-blue-700">R$ 4.120.430,00</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-orange-600">93.8%</span> do orçamento total
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Custo Por Aluno/Dia</div>
                  <div className="text-xl font-bold text-blue-700">R$ 4,87</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-600">+15%</span> que o ano anterior
                  </div>
                </div>
              </div>

              <div className="border-t mt-6 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-medium">Prestação de Contas - Situação</div>
                  <Badge className="bg-green-600">Aprovada</Badge>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead>Documento</TableHead>
                      <TableHead>Data de Envio</TableHead>
                      <TableHead>Status CAE</TableHead>
                      <TableHead>Status FNDE</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Relatório Anual PNAE 2023</TableCell>
                      <TableCell>15/01/2024</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Aprovado
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Aprovado
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Demonstrativo Sintético Anual</TableCell>
                      <TableCell>20/01/2024</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Aprovado
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Aprovado
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Parecer do CAE</TableCell>
                      <TableCell>15/02/2024</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Emitido
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Recebido
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Recursos */}
        <TabsContent value="recursos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Recursos PNAE {ano}</CardTitle>
              <CardDescription>Detalhamento da distribuição por escola e modalidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar escola..."
                      className="w-full"
                      prefix={<Search className="h-4 w-4 text-gray-500" />}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter size={14} className="mr-1" />
                      Filtrar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download size={14} />
                      Exportar
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead>Unidade Escolar</TableHead>
                      <TableHead>Total Alunos</TableHead>
                      <TableHead>Valor Recebido</TableHead>
                      <TableHead>Valor por Aluno</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">EMEF Paulo Freire</TableCell>
                      <TableCell>650</TableCell>
                      <TableCell>R$ 123.456,00</TableCell>
                      <TableCell>R$ 189,93</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Executando
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" size="sm" className="text-blue-600">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">EMEI Anísio Teixeira</TableCell>
                      <TableCell>320</TableCell>
                      <TableCell>R$ 87.432,00</TableCell>
                      <TableCell>R$ 273,23</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Executando
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" size="sm" className="text-blue-600">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">EMEF Darcy Ribeiro</TableCell>
                      <TableCell>540</TableCell>
                      <TableCell>R$ 102.870,00</TableCell>
                      <TableCell>R$ 190,50</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Executando
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" size="sm" className="text-blue-600">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">CEMEI Maria da Penha</TableCell>
                      <TableCell>280</TableCell>
                      <TableCell>R$ 78.960,00</TableCell>
                      <TableCell>R$ 282,00</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Executando
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" size="sm" className="text-blue-600">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">EMEF Milton Santos</TableCell>
                      <TableCell>580</TableCell>
                      <TableCell>R$ 110.780,00</TableCell>
                      <TableCell>R$ 191,00</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                          Parcial
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" size="sm" className="text-blue-600">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Mostrando 5 de 47 escolas</div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm">
                      Próxima
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Repasses por Modalidade</CardTitle>
                <CardDescription>Valores per capita por modalidade de ensino</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Valor Diário</TableHead>
                      <TableHead>Dias Letivos</TableHead>
                      <TableHead>Total Anual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Creche</TableCell>
                      <TableCell>R$ 1,07</TableCell>
                      <TableCell>200</TableCell>
                      <TableCell>R$ 214,00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Pré-escola</TableCell>
                      <TableCell>R$ 0,53</TableCell>
                      <TableCell>200</TableCell>
                      <TableCell>R$ 106,00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fundamental</TableCell>
                      <TableCell>R$ 0,36</TableCell>
                      <TableCell>200</TableCell>
                      <TableCell>R$ 72,00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">EJA</TableCell>
                      <TableCell>R$ 0,32</TableCell>
                      <TableCell>200</TableCell>
                      <TableCell>R$ 64,00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">AEE</TableCell>
                      <TableCell>R$ 0,53</TableCell>
                      <TableCell>200</TableCell>
                      <TableCell>R$ 106,00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Info size={14} />
                          <span>Valores de referência</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Valores per capita diários conforme estabelecido pela Resolução FNDE nº 06/2020 e suas
                          atualizações.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cronograma de Repasses {ano}</CardTitle>
                <CardDescription>Datas de transferências financeiras do FNDE</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead>Parcela</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data Prevista</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">1ª Parcela</TableCell>
                      <TableCell>R$ 711.912,50</TableCell>
                      <TableCell>28/02/2024</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Recebido
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2ª Parcela</TableCell>
                      <TableCell>R$ 711.912,50</TableCell>
                      <TableCell>30/04/2024</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Recebido
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">3ª Parcela</TableCell>
                      <TableCell>R$ 711.912,50</TableCell>
                      <TableCell>30/06/2024</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                          Previsto
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">4ª Parcela</TableCell>
                      <TableCell>R$ 711.912,50</TableCell>
                      <TableCell>31/08/2024</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                          Pendente
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium mb-1">Repasse Adicional</div>
                  <p className="text-sm text-muted-foreground">
                    O município aplicou recursos próprios adicionais no valor de R$ 1.542.360,00 para complementar a
                    alimentação escolar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Licitações */}
        <TabsContent value="licitacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Licitações e Contratos {ano}</CardTitle>
                  <CardDescription>Processos licitatórios para aquisição de alimentos e insumos</CardDescription>
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Info size={14} className="mr-1" />
                        Normativas
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Normativas de Licitações PNAE</AlertDialogTitle>
                        <AlertDialogDescription>
                          <ul className="list-disc pl-4 space-y-2 text-sm">
                            <li>Lei nº 14.133/2021 - Lei de Licitações e Contratos Administrativos</li>
                            <li>Lei nº 11.947/2009 - Lei do PNAE</li>
                            <li>Resolução CD/FNDE nº 06/2020 - Diretrizes da Alimentação Escolar</li>
                            <li>Resolução CD/FNDE nº 20/2020 - Aquisição de alimentos da agricultura familiar</li>
                            <li>Lei nº 8.666/1993 (em transição)</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Fechar</AlertDialogCancel>
                        <AlertDialogAction>
                          <a href="https://www.fnde.gov.br/programas/pnae" target="_blank" rel="noopener noreferrer">
                            Visitar Portal FNDE
                          </a>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button variant="outline" size="sm" className="gap-1">
                    <Download size={14} />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por número, objeto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="andamento">Em andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead>Número</TableHead>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Objeto</TableHead>
                      <TableHead>Valor Estimado</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licitacoes.map((licitacao) => (
                      <TableRow key={licitacao.id}>
                        <TableCell className="font-medium">{licitacao.numero}</TableCell>
                        <TableCell>{licitacao.modalidade}</TableCell>
                        <TableCell>{licitacao.objeto}</TableCell>
                        <TableCell>{licitacao.valor}</TableCell>
                        <TableCell>{licitacao.data}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border-${licitacao.status === "Concluída" ? "green" : "yellow"}-600 text-${licitacao.status === "Concluída" ? "green" : "yellow"}-600`}
                          >
                            {licitacao.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <FileText size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Card Informativo */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info size={24} className="text-blue-700 mt-0.5" />
                      <div>
                        <div className="font-medium mb-1">
                          Integração com o Portal Nacional de Contratações Públicas
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Todas as licitações e contratos são divulgados automaticamente no Portal Nacional de
                          Contratações Públicas (PNCP), conforme a Lei nº 14.133/2021, garantindo total transparência
                          nos processos.
                        </p>
                        <div className="mt-2">
                          <Button variant="link" className="h-auto p-0 text-blue-700">
                            Acessar PNCP
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Agricultura Familiar */}
        <TabsContent value="agricultura" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aquisições da Agricultura Familiar</CardTitle>
              <CardDescription>
                Monitoramento da aquisição mínima de 30% dos recursos do PNAE da agricultura familiar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-bold">
                          35%
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">35,2%</div>
                          <div className="text-sm text-muted-foreground">Acima do mínimo exigido de 30%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">Valor Total</div>
                      <div className="text-lg font-bold">R$ 1.002.373,00</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600">+8,5%</span> em relação ao ano anterior
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">Cooperativas e Associações</div>
                      <div className="text-lg font-bold">23</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Representando 458 agricultores familiares
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Chamadas Públicas de Aquisição da Agricultura Familiar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50">
                          <TableHead>Chamada</TableHead>
                          <TableHead>Objeto</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Edital</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">CP-003/2024</TableCell>
                          <TableCell>Aquisição de Hortifruti</TableCell>
                          <TableCell>R$ 428.650,00</TableCell>
                          <TableCell>15/02/2024</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              Concluída
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">CP-002/2024</TableCell>
                          <TableCell>Aquisição de Panificados</TableCell>
                          <TableCell>R$ 356.780,00</TableCell>
                          <TableCell>20/01/2024</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              Concluída
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">CP-001/2024</TableCell>
                          <TableCell>Aquisição de Lácteos</TableCell>
                          <TableCell>R$ 216.943,00</TableCell>
                          <TableCell>10/01/2024</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              Concluída
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Produtos mais adquiridos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-blue-50">
                            <TableHead>Produto</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Banana Prata</TableCell>
                            <TableCell>48.500 kg</TableCell>
                            <TableCell>R$ 194.000,00</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Leite Pasteurizado</TableCell>
                            <TableCell>85.000 litros</TableCell>
                            <TableCell>R$ 187.000,00</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Alface</TableCell>
                            <TableCell>32.600 unid.</TableCell>
                            <TableCell>R$ 97.800,00</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Pão Caseiro</TableCell>
                            <TableCell>28.450 kg</TableCell>
                            <TableCell>R$ 256.050,00</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Mandioca</TableCell>
                            <TableCell>22.800 kg</TableCell>
                            <TableCell>R$ 91.200,00</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Principais fornecedores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-blue-50">
                            <TableHead>Cooperativa/Associação</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Agricultores</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Coop. Regional Norte</TableCell>
                            <TableCell>R$ 342.560,00</TableCell>
                            <TableCell>126</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Assoc. Agricultores Vale Verde</TableCell>
                            <TableCell>R$ 218.430,00</TableCell>
                            <TableCell>87</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Coop. Laticínios Serra Alta</TableCell>
                            <TableCell>R$ 187.000,00</TableCell>
                            <TableCell>64</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Assoc. Panificadores Rurais</TableCell>
                            <TableCell>R$ 165.320,00</TableCell>
                            <TableCell>32</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Coop. Agroecológica</TableCell>
                            <TableCell>R$ 89.063,00</TableCell>
                            <TableCell>49</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Documentos */}
        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documentos Públicos</CardTitle>
                  <CardDescription>Acesse os documentos públicos relacionados ao PNAE</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-1" />
                  Baixar Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar documentos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas Categorias</SelectItem>
                      <SelectItem value="prestacao">Prestação de Contas</SelectItem>
                      <SelectItem value="licitacao">Licitação</SelectItem>
                      <SelectItem value="cardapio">Cardápios</SelectItem>
                      <SelectItem value="relatorios">Relatórios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead>Nome do Documento</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Formato</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocumentos.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.nome}</TableCell>
                        <TableCell>{doc.categoria}</TableCell>
                        <TableCell>{doc.tipo}</TableCell>
                        <TableCell>{doc.tamanho}</TableCell>
                        <TableCell>{doc.data}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredDocumentos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhum documento encontrado para "{searchTerm}"
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info size={24} className="text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Lei de Acesso à Informação</div>
                      <p className="text-sm text-muted-foreground">
                        Todos os documentos estão disponíveis em conformidade com a Lei nº 12.527/2011 (Lei de Acesso à
                        Informação). Para solicitar documentos adicionais, utilize o canal oficial de solicitação.
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-600">
                          Solicitar Informações
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legislação PNAE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="font-medium mb-1">Lei nº 11.947/2009</div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Dispõe sobre o atendimento da alimentação escolar e do Programa Dinheiro Direto na Escola aos
                      alunos da educação básica.
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-blue-700">
                      <ExternalLink size={14} className="mr-1" />
                      Acessar lei
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="font-medium mb-1">Resolução CD/FNDE nº 06/2020</div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Dispõe sobre o atendimento da alimentação escolar aos alunos da educação básica no âmbito do PNAE.
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-blue-700">
                      <ExternalLink size={14} className="mr-1" />
                      Acessar resolução
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="font-medium mb-1">Resolução CD/FNDE nº 20/2020</div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Altera a Resolução/CD/FNDE nº 6, de 8 de maio de 2020, sobre a agricultura familiar.
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-blue-700">
                      <ExternalLink size={14} className="mr-1" />
                      Acessar resolução
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="font-medium mb-1">Lei nº 14.133/2021</div>
                    <p className="text-sm text-muted-foreground mb-2">Lei de Licitações e Contratos Administrativos.</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-blue-700">
                      <ExternalLink size={14} className="mr-1" />
                      Acessar lei
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
