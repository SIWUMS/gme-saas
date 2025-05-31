"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { EstoqueForm } from "./estoque-form"
import { MovimentacaoForm } from "./movimentacao-form"

const estoqueData = [
  {
    id: 1,
    alimento: "Arroz Branco",
    categoria: "Cereais",
    quantidadeAtual: 150.5,
    quantidadeMinima: 50,
    unidade: "kg",
    valorUnitario: 5.5,
    valorTotal: 827.75,
    dataValidade: "2024-12-15",
    lote: "LT001",
    fornecedor: "Distribuidora ABC",
    status: "normal",
  },
  {
    id: 2,
    alimento: "Feijão Carioca",
    categoria: "Leguminosas",
    quantidadeAtual: 25,
    quantidadeMinima: 30,
    unidade: "kg",
    valorUnitario: 8.0,
    valorTotal: 200.0,
    dataValidade: "2024-11-30",
    lote: "LT002",
    fornecedor: "Grãos & Cia",
    status: "baixo",
  },
  {
    id: 3,
    alimento: "Óleo de Soja",
    categoria: "Óleos",
    quantidadeAtual: 12,
    quantidadeMinima: 15,
    unidade: "L",
    valorUnitario: 6.5,
    valorTotal: 78.0,
    dataValidade: "2024-08-20",
    lote: "LT003",
    fornecedor: "Óleos Premium",
    status: "vencendo",
  },
  {
    id: 4,
    alimento: "Frango Congelado",
    categoria: "Carnes",
    quantidadeAtual: 80,
    quantidadeMinima: 20,
    unidade: "kg",
    valorUnitario: 12.0,
    valorTotal: 960.0,
    dataValidade: "2024-09-10",
    lote: "LT004",
    fornecedor: "Frigorífico Sul",
    status: "normal",
  },
]

export function EstoqueModule() {
  const [activeTab, setActiveTab] = useState("lista")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800"
      case "baixo":
        return "bg-yellow-100 text-yellow-800"
      case "vencendo":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <Package className="h-4 w-4" />
      case "baixo":
        return <TrendingDown className="h-4 w-4" />
      case "vencendo":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredEstoque = estoqueData.filter(
    (item) =>
      item.alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setActiveTab("editar")
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este item do estoque?")) {
      // Implementar lógica de exclusão
      console.log("Excluindo item:", id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Controle de Estoque</h2>
          <p className="text-muted-foreground">Gerencie entrada, saída e alertas de estoque</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab("entrada")} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Entrada
          </Button>
          <Button onClick={() => setActiveTab("saida")} variant="outline">
            <TrendingDown className="h-4 w-4 mr-2" />
            Saída
          </Button>
          <Button onClick={() => setActiveTab("novo")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lista">Lista de Estoque</TabsTrigger>
          <TabsTrigger value="novo">Novo Item</TabsTrigger>
          <TabsTrigger value="editar">Editar Item</TabsTrigger>
          <TabsTrigger value="entrada">Entrada</TabsTrigger>
          <TabsTrigger value="saida">Saída</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por alimento, categoria ou fornecedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredEstoque.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.alimento}</CardTitle>
                      <CardDescription>
                        {item.categoria} • Lote: {item.lote} • {item.fornecedor}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">
                        {item.status === "normal" && "Normal"}
                        {item.status === "baixo" && "Estoque Baixo"}
                        {item.status === "vencendo" && "Vencendo"}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Quantidade:</span>
                      <p className="font-medium">
                        {item.quantidadeAtual} {item.unidade}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mínimo:</span>
                      <p className="font-medium">
                        {item.quantidadeMinima} {item.unidade}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor Unit.:</span>
                      <p className="font-medium">R$ {item.valorUnitario.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valor Total:</span>
                      <p className="font-medium">R$ {item.valorTotal.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Validade: {new Date(item.dataValidade).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="novo">
          <EstoqueForm />
        </TabsContent>

        <TabsContent value="editar">
          <EstoqueForm item={selectedItem} />
        </TabsContent>

        <TabsContent value="entrada">
          <MovimentacaoForm tipo="entrada" />
        </TabsContent>

        <TabsContent value="saida">
          <MovimentacaoForm tipo="saida" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
