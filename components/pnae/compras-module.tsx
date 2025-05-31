"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw, Package, Calculator, Calendar, CheckCircle, Plus, BarChart3 } from "lucide-react"

interface ItemCompra {
  id: string
  nome: string
  categoria: string
  unidade: string
  quantidadeNecessaria: number
  quantidadeEstoque: number
  quantidadeComprar: number
  precoEstimado: number
  totalEstimado: number
  fornecedorSugerido: string
  prioridade: "alta" | "media" | "baixa"
  origem: "cardapio" | "estoque_minimo" | "manual"
  cardapiosRelacionados: string[]
  dataLimite: string
}

interface ListaCompra {
  id: string
  nome: string
  periodo: string
  status: "rascunho" | "aprovada" | "enviada" | "recebida"
  totalItens: number
  valorTotal: number
  criadaEm: string
  aprovadaPor?: string
}

const itensCompra: ItemCompra[] = [
  {
    id: "1",
    nome: "Arroz Branco Tipo 1",
    categoria: "Cereais",
    unidade: "kg",
    quantidadeNecessaria: 500,
    quantidadeEstoque: 150,
    quantidadeComprar: 350,
    precoEstimado: 4.5,
    totalEstimado: 1575,
    fornecedorSugerido: "Distribuidora Alimentos Ltda",
    prioridade: "alta",
    origem: "cardapio",
    cardapiosRelacionados: ["Cardápio Fundamental - Semana 1", "Cardápio Creche - Integral"],
    dataLimite: "25/02/2024",
  },
  {
    id: "2",
    nome: "Feijão Preto",
    categoria: "Leguminosas",
    unidade: "kg",
    quantidadeNecessaria: 200,
    quantidadeEstoque: 50,
    quantidadeComprar: 150,
    precoEstimado: 6.8,
    totalEstimado: 1020,
    fornecedorSugerido: "Cooperativa Agricultura Familiar",
    prioridade: "alta",
    origem: "cardapio",
    cardapiosRelacionados: ["Cardápio Fundamental - Semana 1"],
    dataLimite: "25/02/2024",
  },
  {
    id: "3",
    nome: "Óleo de Soja",
    categoria: "Óleos",
    unidade: "litro",
    quantidadeNecessaria: 80,
    quantidadeEstoque: 20,
    quantidadeComprar: 60,
    precoEstimado: 5.2,
    totalEstimado: 312,
    fornecedorSugerido: "Distribuidora Regional",
    prioridade: "media",
    origem: "estoque_minimo",
    cardapiosRelacionados: [],
    dataLimite: "28/02/2024",
  },
  {
    id: "4",
    nome: "Leite Integral UHT",
    categoria: "Lácteos",
    unidade: "litro",
    quantidadeNecessaria: 300,
    quantidadeEstoque: 80,
    quantidadeComprar: 220,
    precoEstimado: 4.2,
    totalEstimado: 924,
    fornecedorSugerido: "Laticínios do Vale",
    prioridade: "alta",
    origem: "cardapio",
    cardapiosRelacionados: ["Cardápio Creche - Integral"],
    dataLimite: "23/02/2024",
  },
]

const listasCompra: ListaCompra[] = [
  {
    id: "1",
    nome: "Lista Fevereiro 2024 - Semana 1",
    periodo: "07/02 - 11/02/2024",
    status: "aprovada",
    totalItens: 15,
    valorTotal: 8450.5,
    criadaEm: "01/02/2024",
    aprovadaPor: "João Silva",
  },
  {
    id: "2",
    nome: "Lista Fevereiro 2024 - Semana 2",
    periodo: "14/02 - 18/02/2024",
    status: "rascunho",
    totalItens: 12,
    valorTotal: 6230.8,
    criadaEm: "08/02/2024",
  },
]

export function ComprasModule() {
  const [selectedLista, setSelectedLista] = useState<ListaCompra | null>(null)
  const [showNovaLista, setShowNovaLista] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants = {
      rascunho: "secondary",
      aprovada: "default",
      enviada: "outline",
      recebida: "default",
    } as const

    const labels = {
      rascunho: "Rascunho",
      aprovada: "Aprovada",
      enviada: "Enviada",
      recebida: "Recebida",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      alta: "destructive",
      media: "secondary",
      baixa: "outline",
    } as const

    const labels = {
      alta: "Alta",
      media: "Média",
      baixa: "Baixa",
    }

    return (
      <Badge variant={variants[prioridade as keyof typeof variants]}>{labels[prioridade as keyof typeof labels]}</Badge>
    )
  }

  const totalItens = itensCompra.length
  const totalValor = itensCompra.reduce((acc, item) => acc + item.totalEstimado, 0)
  const itensUrgentes = itensCompra.filter((item) => item.prioridade === "alta").length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lista de Compras PNAE</h2>
          <p className="text-muted-foreground">
            Geração automática baseada nos cardápios planejados e controle de estoque
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar do Cardápio
          </Button>
          <Button onClick={() => setShowNovaLista(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Lista
          </Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens na Lista</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItens}</div>
            <p className="text-xs text-muted-foreground">{itensUrgentes} itens urgentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValor.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">Estimativa baseada em preços médios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agricultura Familiar</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">R$ {(totalValor * 0.42).toLocaleString("pt-BR")} da AF</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23/02</div>
            <p className="text-xs text-muted-foreground">4 itens com prazo crítico</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="atual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="atual">Lista Atual</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
        </TabsList>

        <TabsContent value="atual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Itens para Compra</CardTitle>
              <CardDescription>
                Lista gerada automaticamente baseada nos cardápios aprovados e níveis de estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Necessário</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Comprar</TableHead>
                    <TableHead>Preço Unit.</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itensCompra.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.nome}</div>
                          <div className="text-sm text-muted-foreground">{item.categoria}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.quantidadeNecessaria} {item.unidade}
                      </TableCell>
                      <TableCell>
                        <span
                          className={item.quantidadeEstoque < item.quantidadeNecessaria * 0.3 ? "text-red-600" : ""}
                        >
                          {item.quantidadeEstoque} {item.unidade}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.quantidadeComprar} {item.unidade}
                      </TableCell>
                      <TableCell>R$ {item.precoEstimado.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">R$ {item.totalEstimado.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{getPrioridadeBadge(item.prioridade)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Total da Lista</p>
                  <p className="text-2xl font-bold">R$ {totalValor.toLocaleString("pt-BR")}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Lista
                  </Button>
                  <Button>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprovar Lista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Listas de Compra</CardTitle>
              <CardDescription>Acompanhe todas as listas criadas e seus status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lista</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listasCompra.map((lista) => (
                    <TableRow key={lista.id}>
                      <TableCell>
                        <div className="font-medium">{lista.nome}</div>
                      </TableCell>
                      <TableCell>{lista.periodo}</TableCell>
                      <TableCell>{lista.totalItens}</TableCell>
                      <TableCell>R$ {lista.valorTotal.toLocaleString("pt-BR")}</TableCell>
                      <TableCell>{getStatusBadge(lista.status)}</TableCell>
                      <TableCell>{lista.criadaEm}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          {lista.status === "rascunho" && <Button size="sm">Editar</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fornecedores" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fornecedores Cadastrados</CardTitle>
                <CardDescription>Gestão de fornecedores e preços</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Produtos</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Distribuidora Alimentos Ltda</TableCell>
                      <TableCell>
                        <Badge variant="outline">Convencional</Badge>
                      </TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cooperativa Agricultura Familiar</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          AF
                        </Badge>
                      </TableCell>
                      <TableCell>23</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Laticínios do Vale</TableCell>
                      <TableCell>
                        <Badge variant="outline">Convencional</Badge>
                      </TableCell>
                      <TableCell>12</TableCell>
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
                <CardTitle>Análise de Preços</CardTitle>
                <CardDescription>Comparação de preços entre fornecedores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Produto para Análise</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arroz">Arroz Branco Tipo 1</SelectItem>
                        <SelectItem value="feijao">Feijão Preto</SelectItem>
                        <SelectItem value="oleo">Óleo de Soja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Gerar Análise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Nova Lista */}
      <Dialog open={showNovaLista} onOpenChange={setShowNovaLista}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Lista de Compras</DialogTitle>
            <DialogDescription>Gere uma nova lista baseada nos cardápios planejados</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome da Lista</Label>
                <Input placeholder="Ex: Lista Março 2024 - Semana 1" />
              </div>
              <div className="space-y-2">
                <Label>Período</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem1">1ª Semana de Março</SelectItem>
                    <SelectItem value="sem2">2ª Semana de Março</SelectItem>
                    <SelectItem value="sem3">3ª Semana de Março</SelectItem>
                    <SelectItem value="sem4">4ª Semana de Março</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cardápios Base</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione os cardápios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Cardápios Aprovados</SelectItem>
                  <SelectItem value="fundamental">Apenas Fundamental</SelectItem>
                  <SelectItem value="creche">Apenas Creche</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="incluir-estoque" defaultChecked />
              <Label htmlFor="incluir-estoque">Incluir itens com estoque baixo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNovaLista(false)}>
              Cancelar
            </Button>
            <Button>
              <Calculator className="mr-2 h-4 w-4" />
              Gerar Lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
