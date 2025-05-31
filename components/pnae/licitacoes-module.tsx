"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, FileText, CalendarIcon, Download, Eye, Edit, Clock, Users, DollarSign } from "lucide-react"

const licitacoes = [
  {
    id: 1,
    numero: "001/2024",
    tipo: "Pregão Eletrônico",
    objeto: "Aquisição de gêneros alimentícios para merenda escolar",
    valor: 150000,
    status: "Em andamento",
    dataAbertura: "2024-06-15",
    dataLimite: "2024-06-30",
    participantes: 8,
    fase: "Recebimento de propostas",
  },
  {
    id: 2,
    numero: "002/2024",
    tipo: "Chamada Pública",
    objeto: "Aquisição de produtos da agricultura familiar",
    valor: 45000,
    status: "Concluída",
    dataAbertura: "2024-05-01",
    dataLimite: "2024-05-20",
    participantes: 12,
    fase: "Homologada",
  },
  {
    id: 3,
    numero: "003/2024",
    tipo: "Dispensa",
    objeto: "Aquisição emergencial de leite",
    valor: 8000,
    status: "Planejamento",
    dataAbertura: "2024-07-01",
    dataLimite: "2024-07-05",
    participantes: 0,
    fase: "Elaboração do edital",
  },
]

const fornecedores = [
  {
    id: 1,
    nome: "Distribuidora Alimentos Ltda",
    cnpj: "12.345.678/0001-90",
    categoria: "Pessoa Jurídica",
    especialidade: "Gêneros alimentícios",
    status: "Ativo",
    ultimaParticipacao: "001/2024",
  },
  {
    id: 2,
    nome: "Cooperativa Agricultura Familiar",
    cnpj: "98.765.432/0001-10",
    categoria: "Agricultura Familiar",
    especialidade: "Frutas e verduras",
    status: "Ativo",
    ultimaParticipacao: "002/2024",
  },
]

export function LicitacoesModule() {
  const [activeTab, setActiveTab] = useState("processos")
  const [dataAbertura, setDataAbertura] = useState<Date>()
  const [dataLimite, setDataLimite] = useState<Date>()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800"
      case "Em andamento":
        return "bg-blue-100 text-blue-800"
      case "Planejamento":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Licitações</h2>
          <p className="text-muted-foreground">Gerencie processos licitatórios do PNAE</p>
        </div>
        <Button onClick={() => setActiveTab("novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Licitação
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Processos Ativos</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">R$ 203k</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Fornecedores</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Prazo Médio</p>
                <p className="text-2xl font-bold">15 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="processos">Processos</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
          <TabsTrigger value="novo">Nova Licitação</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="processos" className="space-y-4">
          {licitacoes.map((licitacao) => (
            <Card key={licitacao.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {licitacao.tipo} nº {licitacao.numero}
                    </CardTitle>
                    <CardDescription>{licitacao.objeto}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(licitacao.status)}>{licitacao.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Estimado</p>
                    <p className="font-semibold">{formatarMoeda(licitacao.valor)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Abertura</p>
                    <p className="font-semibold">{formatarData(licitacao.dataAbertura)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prazo Limite</p>
                    <p className="font-semibold">{formatarData(licitacao.dataLimite)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participantes</p>
                    <p className="font-semibold">{licitacao.participantes}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{licitacao.fase}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
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

        <TabsContent value="fornecedores" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Fornecedores Cadastrados</h3>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Novo Fornecedor
            </Button>
          </div>
          {fornecedores.map((fornecedor) => (
            <Card key={fornecedor.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{fornecedor.nome}</h4>
                    <p className="text-sm text-muted-foreground">CNPJ: {fornecedor.cnpj}</p>
                    <p className="text-sm text-muted-foreground">{fornecedor.especialidade}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={fornecedor.categoria === "Agricultura Familiar" ? "default" : "secondary"}>
                      {fornecedor.categoria}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Última: {fornecedor.ultimaParticipacao}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="novo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nova Licitação</CardTitle>
              <CardDescription>Criar novo processo licitatório</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Licitação</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pregao">Pregão Eletrônico</SelectItem>
                      <SelectItem value="chamada">Chamada Pública</SelectItem>
                      <SelectItem value="dispensa">Dispensa de Licitação</SelectItem>
                      <SelectItem value="inexigibilidade">Inexigibilidade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número do Processo</Label>
                  <Input id="numero" placeholder="Ex: 004/2024" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objeto">Objeto da Licitação</Label>
                <Textarea id="objeto" placeholder="Descreva o objeto da licitação..." rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor Estimado (R$)</Label>
                  <Input id="valor" type="number" placeholder="0,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modalidade">Modalidade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menor-preco">Menor Preço</SelectItem>
                      <SelectItem value="melhor-tecnica">Melhor Técnica</SelectItem>
                      <SelectItem value="tecnica-preco">Técnica e Preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Abertura</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataAbertura ? dataAbertura.toLocaleDateString("pt-BR") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dataAbertura} onSelect={setDataAbertura} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Prazo Limite</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataLimite ? dataLimite.toLocaleDateString("pt-BR") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dataLimite} onSelect={setDataLimite} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Cancelar</Button>
                <Button>Criar Licitação</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Edital Padrão</h3>
                <p className="text-sm text-muted-foreground mb-4">Template para editais de licitação</p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold mb-2">Termo de Referência</h3>
                <p className="text-sm text-muted-foreground mb-4">Modelo para termo de referência</p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">Ata de Registro</h3>
                <p className="text-sm text-muted-foreground mb-4">Template para ata de registro de preços</p>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
