"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Leaf, Wheat } from "lucide-react"
import { AlimentoForm } from "./alimento-form"

const alimentosData = [
  {
    id: 1,
    codigoTaco: "100",
    nome: "Arroz, integral, cozido",
    categoria: "Cereais e derivados",
    unidadeMedida: "g",
    energiaKcal: 124,
    proteinas: 2.6,
    lipidios: 1.0,
    carboidratos: 25.8,
    fibraAlimentar: 2.7,
    temGluten: false,
    temLactose: false,
    ehVegano: true,
    ehVegetariano: true,
    ativo: true,
  },
  {
    id: 2,
    codigoTaco: "200",
    nome: "Feijão, carioca, cozido",
    categoria: "Leguminosas",
    unidadeMedida: "g",
    energiaKcal: 76,
    proteinas: 4.8,
    lipidios: 0.5,
    carboidratos: 13.6,
    fibraAlimentar: 8.5,
    temGluten: false,
    temLactose: false,
    ehVegano: true,
    ehVegetariano: true,
    ativo: true,
  },
  {
    id: 3,
    codigoTaco: "300",
    nome: "Frango, peito, sem pele, grelhado",
    categoria: "Carnes e derivados",
    unidadeMedida: "g",
    energiaKcal: 159,
    proteinas: 32.0,
    lipidios: 3.0,
    carboidratos: 0.0,
    fibraAlimentar: 0.0,
    temGluten: false,
    temLactose: false,
    ehVegano: false,
    ehVegetariano: false,
    ativo: true,
  },
]

export function AlimentosModule() {
  const [activeTab, setActiveTab] = useState("lista")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAlimento, setSelectedAlimento] = useState(null)

  const filteredAlimentos = alimentosData.filter(
    (alimento) =>
      alimento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alimento.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alimento.codigoTaco.includes(searchTerm),
  )

  const handleEdit = (alimento: any) => {
    setSelectedAlimento(alimento)
    setActiveTab("editar")
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este alimento?")) {
      console.log("Excluindo alimento:", id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cadastro de Alimentos</h2>
          <p className="text-muted-foreground">Base de dados TACO integrada</p>
        </div>
        <Button onClick={() => setActiveTab("novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Alimento
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lista">Lista de Alimentos</TabsTrigger>
          <TabsTrigger value="novo">Novo Alimento</TabsTrigger>
          <TabsTrigger value="editar">Editar Alimento</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, categoria ou código TACO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredAlimentos.map((alimento) => (
              <Card key={alimento.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{alimento.nome}</CardTitle>
                      <CardDescription>
                        {alimento.categoria} • Código TACO: {alimento.codigoTaco}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {alimento.ehVegano && (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          <Leaf className="h-3 w-3 mr-1" />
                          Vegano
                        </Badge>
                      )}
                      {alimento.temGluten && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          <Wheat className="h-3 w-3 mr-1" />
                          Glúten
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Energia:</span>
                      <p className="font-medium">{alimento.energiaKcal} kcal</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Proteínas:</span>
                      <p className="font-medium">{alimento.proteinas}g</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Carboidratos:</span>
                      <p className="font-medium">{alimento.carboidratos}g</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lipídios:</span>
                      <p className="font-medium">{alimento.lipidios}g</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fibras:</span>
                      <p className="font-medium">{alimento.fibraAlimentar}g</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Unidade: {alimento.unidadeMedida} •{alimento.temLactose ? " Contém lactose" : " Sem lactose"}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(alimento)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(alimento.id)}>
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
          <AlimentoForm />
        </TabsContent>

        <TabsContent value="editar">
          <AlimentoForm alimento={selectedAlimento} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
