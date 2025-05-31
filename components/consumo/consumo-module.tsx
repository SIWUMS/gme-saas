"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Users, Calendar, Clock } from "lucide-react"
import { ConsumoForm } from "./consumo-form"

const consumoData = [
  {
    id: 1,
    data: "2024-06-15",
    turma: "1º Ano A",
    refeicao: "Almoço",
    cardapio: "Arroz com Feijão e Frango",
    quantidadePlanejada: 35,
    quantidadeServida: 32,
    observacoes: "3 alunos faltaram",
    registradoPor: "Maria Silva",
    registradoEm: "2024-06-15 12:30",
  },
  {
    id: 2,
    data: "2024-06-15",
    turma: "Maternal I",
    refeicao: "Lanche da Tarde",
    cardapio: "Vitamina de Banana",
    quantidadePlanejada: 25,
    quantidadeServida: 25,
    observacoes: "",
    registradoPor: "João Santos",
    registradoEm: "2024-06-15 15:00",
  },
  {
    id: 3,
    data: "2024-06-14",
    turma: "2º Ano B",
    refeicao: "Café da Manhã",
    cardapio: "Pão com Leite",
    quantidadePlanejada: 30,
    quantidadeServida: 28,
    observacoes: "Sobrou um pouco",
    registradoPor: "Ana Costa",
    registradoEm: "2024-06-14 08:00",
  },
]

export function ConsumoModule() {
  const [activeTab, setActiveTab] = useState("lista")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConsumo, setSelectedConsumo] = useState(null)

  const filteredConsumo = consumoData.filter(
    (item) =>
      item.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.refeicao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cardapio.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (item: any) => {
    setSelectedConsumo(item)
    setActiveTab("editar")
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este registro de consumo?")) {
      console.log("Excluindo registro:", id)
    }
  }

  const getStatusColor = (planejada: number, servida: number) => {
    const percentual = (servida / planejada) * 100
    if (percentual >= 95) return "bg-green-100 text-green-800"
    if (percentual >= 80) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Registro de Consumo</h2>
          <p className="text-muted-foreground">Controle diário de refeições por turma</p>
        </div>
        <Button onClick={() => setActiveTab("novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lista">Registros de Consumo</TabsTrigger>
          <TabsTrigger value="novo">Novo Registro</TabsTrigger>
          <TabsTrigger value="editar">Editar Registro</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por turma, refeição ou cardápio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredConsumo.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {item.turma} - {item.refeicao}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.data).toLocaleDateString("pt-BR")}
                        </span>
                        <span>{item.cardapio}</span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(item.quantidadePlanejada, item.quantidadeServida)}>
                      {Math.round((item.quantidadeServida / item.quantidadePlanejada) * 100)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Planejado:</span>
                      <p className="font-medium">{item.quantidadePlanejada} porções</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Servido:</span>
                      <p className="font-medium">{item.quantidadeServida} porções</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Diferença:</span>
                      <p className="font-medium">
                        {item.quantidadeServida - item.quantidadePlanejada > 0 ? "+" : ""}
                        {item.quantidadeServida - item.quantidadePlanejada} porções
                      </p>
                    </div>
                  </div>

                  {item.observacoes && (
                    <div className="mb-4">
                      <span className="text-muted-foreground text-sm">Observações:</span>
                      <p className="text-sm">{item.observacoes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Registrado por {item.registradoPor} em {new Date(item.registradoEm).toLocaleString("pt-BR")}
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
          <ConsumoForm />
        </TabsContent>

        <TabsContent value="editar">
          <ConsumoForm consumo={selectedConsumo} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
