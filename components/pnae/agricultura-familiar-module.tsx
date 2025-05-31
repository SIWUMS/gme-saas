"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, DollarSign, Percent, Plus, Eye, Edit, FileText, MapPin, Phone, Mail } from "lucide-react"

const fornecedoresAF = [
  {
    id: 1,
    nome: "Cooperativa Agricultura Familiar Central",
    tipo: "Cooperativa",
    dap: "DAP-12345678",
    cnpj: "12.345.678/0001-90",
    endereco: "Zona Rural, Município ABC",
    telefone: "(11) 99999-9999",
    email: "contato@coopaf.com.br",
    produtos: ["Frutas", "Verduras", "Legumes"],
    valorContratado: 25000,
    valorExecutado: 18500,
    status: "Ativo",
    ultimaEntrega: "2024-03-15",
  },
  {
    id: 2,
    nome: "Associação Produtores Rurais",
    tipo: "Associação",
    dap: "DAP-87654321",
    cnpj: "98.765.432/0001-10",
    endereco: "Assentamento Rural XYZ",
    telefone: "(11) 88888-8888",
    email: "apr@email.com",
    produtos: ["Hortaliças", "Temperos"],
    valorContratado: 15000,
    valorExecutado: 14200,
    status: "Ativo",
    ultimaEntrega: "2024-03-12",
  },
  {
    id: 3,
    nome: "João Silva - Produtor Individual",
    tipo: "Individual",
    dap: "DAP-11223344",
    cpf: "123.456.789-00",
    endereco: "Sítio Boa Vista, Zona Rural",
    telefone: "(11) 77777-7777",
    email: "joao.silva@email.com",
    produtos: ["Ovos", "Leite"],
    valorContratado: 8000,
    valorExecutado: 7500,
    status: "Ativo",
    ultimaEntrega: "2024-03-10",
  },
]

const chamadasPublicas = [
  {
    id: 1,
    numero: "CP-001/2024",
    objeto: "Aquisição de frutas e verduras da agricultura familiar",
    valor: 50000,
    status: "Aberta",
    dataAbertura: "2024-03-01",
    dataLimite: "2024-03-30",
    participantes: 8,
  },
  {
    id: 2,
    numero: "CP-002/2024",
    objeto: "Aquisição de produtos lácteos da agricultura familiar",
    valor: 20000,
    status: "Em análise",
    dataAbertura: "2024-02-15",
    dataLimite: "2024-03-15",
    participantes: 5,
  },
]

export function AgriculturaFamiliarModule() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
      case "Aberta":
        return "bg-green-100 text-green-800"
      case "Em análise":
        return "bg-blue-100 text-blue-800"
      case "Inativo":
        return "bg-gray-100 text-gray-800"
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

  const totalContratado = fornecedoresAF.reduce((acc, fornecedor) => acc + fornecedor.valorContratado, 0)
  const totalExecutado = fornecedoresAF.reduce((acc, fornecedor) => acc + fornecedor.valorExecutado, 0)
  const percentualAF = 32.5 // Exemplo: 32.5% do total de compras

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agricultura Familiar</h2>
          <p className="text-muted-foreground">Gestão de fornecedores e cumprimento dos 30% mínimos</p>
        </div>
        <Button onClick={() => setActiveTab("novo-fornecedor")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor AF
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Percent className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">% Agricultura Familiar</p>
                <p className="text-2xl font-bold">{percentualAF}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Fornecedores AF</p>
                <p className="text-2xl font-bold">{fornecedoresAF.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valor Contratado</p>
                <p className="text-2xl font-bold">{formatarMoeda(totalContratado)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valor Executado</p>
                <p className="text-2xl font-bold">{formatarMoeda(totalExecutado)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
          <TabsTrigger value="chamadas">Chamadas Públicas</TabsTrigger>
          <TabsTrigger value="novo-fornecedor">Novo Fornecedor</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cumprimento da Meta 30%</CardTitle>
                <CardDescription>Acompanhamento do percentual mínimo de agricultura familiar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Meta PNAE</span>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Atual</span>
                    <span className="font-semibold text-green-600">{percentualAF}%</span>
                  </div>
                  <Progress value={percentualAF} className="h-3" />
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800">
                      Meta cumprida! +{(percentualAF - 30).toFixed(1)}% acima do mínimo
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Execução por Fornecedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fornecedoresAF.map((fornecedor) => {
                    const percentual = (fornecedor.valorExecutado / fornecedor.valorContratado) * 100
                    return (
                      <div key={fornecedor.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{fornecedor.nome}</span>
                          <span className="text-sm text-muted-foreground">{percentual.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentual} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fornecedores" className="space-y-4">
          {fornecedoresAF.map((fornecedor) => (
            <Card key={fornecedor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                    <CardDescription>
                      {fornecedor.tipo} • {fornecedor.dap || fornecedor.cpf}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(fornecedor.status)}>{fornecedor.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{fornecedor.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{fornecedor.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{fornecedor.email}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Produtos:</p>
                      <div className="flex flex-wrap gap-1">
                        {fornecedor.produtos.map((produto, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {produto}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Contratado</p>
                        <p className="font-semibold">{formatarMoeda(fornecedor.valorContratado)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Executado</p>
                        <p className="font-semibold">{formatarMoeda(fornecedor.valorExecutado)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Execução</p>
                      <Progress
                        value={(fornecedor.valorExecutado / fornecedor.valorContratado) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Última Entrega</p>
                      <p className="font-semibold">{formatarData(fornecedor.ultimaEntrega)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="chamadas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Chamadas Públicas</h3>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nova Chamada Pública
            </Button>
          </div>
          {chamadasPublicas.map((chamada) => (
            <Card key={chamada.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{chamada.numero}</CardTitle>
                    <CardDescription>{chamada.objeto}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(chamada.status)}>{chamada.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-semibold">{formatarMoeda(chamada.valor)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Abertura</p>
                    <p className="font-semibold">{formatarData(chamada.dataAbertura)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prazo Limite</p>
                    <p className="font-semibold">{formatarData(chamada.dataLimite)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participantes</p>
                    <p className="font-semibold">{chamada.participantes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="novo-fornecedor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Fornecedor da Agricultura Familiar</CardTitle>
              <CardDescription>Preencha os dados do novo fornecedor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Fornecedor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Produtor Individual</SelectItem>
                      <SelectItem value="cooperativa">Cooperativa</SelectItem>
                      <SelectItem value="associacao">Associação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome/Razão Social</Label>
                  <Input id="nome" placeholder="Nome do fornecedor" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dap">DAP/CNPJ</Label>
                  <Input id="dap" placeholder="Número da DAP ou CNPJ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(11) 99999-9999" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco" placeholder="Endereço completo" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="produtos">Produtos Oferecidos</Label>
                <Input id="produtos" placeholder="Ex: Frutas, Verduras, Legumes (separados por vírgula)" />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">Cancelar</Button>
                <Button>Cadastrar Fornecedor</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
