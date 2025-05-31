"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Calculator } from "lucide-react"

const alimentosTACO = [
  {
    id: 1,
    codigo: "C0001",
    nome: "Arroz, integral, cozido",
    categoria: "Cereais e derivados",
    energia: 124, // kcal/100g
    proteina: 2.6, // g/100g
    lipidios: 1.0, // g/100g
    carboidrato: 25.8, // g/100g
    fibra: 2.7, // g/100g
    calcio: 5, // mg/100g
    ferro: 0.3, // mg/100g
    sodio: 1, // mg/100g
    vitaminaA: 0, // μg/100g
    vitaminaC: 0, // mg/100g
  },
  {
    id: 2,
    codigo: "C0002",
    nome: "Feijão, carioca, cozido",
    categoria: "Leguminosas",
    energia: 76,
    proteina: 4.8,
    lipidios: 0.5,
    carboidrato: 13.6,
    fibra: 8.5,
    calcio: 27,
    ferro: 1.3,
    sodio: 2,
    vitaminaA: 0,
    vitaminaC: 1.2,
  },
  {
    id: 3,
    codigo: "V0001",
    nome: "Alface, crespa, crua",
    categoria: "Hortaliças",
    energia: 15,
    proteina: 1.4,
    lipidios: 0.2,
    carboidrato: 2.9,
    fibra: 2.0,
    calcio: 40,
    ferro: 0.4,
    sodio: 7,
    vitaminaA: 175,
    vitaminaC: 15.0,
  },
  {
    id: 4,
    codigo: "V0002",
    nome: "Tomate, comum, cru",
    categoria: "Hortaliças",
    energia: 15,
    proteina: 1.1,
    lipidios: 0.2,
    carboidrato: 3.1,
    fibra: 1.2,
    calcio: 9,
    ferro: 0.3,
    sodio: 4,
    vitaminaA: 35,
    vitaminaC: 21.2,
  },
  {
    id: 5,
    codigo: "F0001",
    nome: "Banana, nanica, crua",
    categoria: "Frutas",
    energia: 92,
    proteina: 1.3,
    lipidios: 0.1,
    carboidrato: 23.8,
    fibra: 2.0,
    calcio: 8,
    ferro: 0.4,
    sodio: 2,
    vitaminaA: 18,
    vitaminaC: 5.9,
  },
  {
    id: 6,
    codigo: "L0001",
    nome: "Leite, vaca, integral",
    categoria: "Leite e derivados",
    energia: 61,
    proteina: 2.9,
    lipidios: 3.2,
    carboidrato: 4.3,
    fibra: 0,
    calcio: 113,
    ferro: 0.1,
    sodio: 4,
    vitaminaA: 28,
    vitaminaC: 0.9,
  },
  {
    id: 7,
    codigo: "C0003",
    nome: "Frango, peito, sem pele, cozido",
    categoria: "Carnes e derivados",
    energia: 159,
    proteina: 32.0,
    lipidios: 3.0,
    carboidrato: 0,
    fibra: 0,
    calcio: 2,
    ferro: 0.4,
    sodio: 77,
    vitaminaA: 0,
    vitaminaC: 0,
  },
  {
    id: 8,
    codigo: "O0001",
    nome: "Ovo, galinha, inteiro, cozido",
    categoria: "Ovos",
    energia: 146,
    proteina: 13.3,
    lipidios: 9.5,
    carboidrato: 0.6,
    fibra: 0,
    calcio: 42,
    ferro: 1.2,
    sodio: 137,
    vitaminaA: 140,
    vitaminaC: 0,
  },
  {
    id: 9,
    codigo: "V0003",
    nome: "Cenoura, crua",
    categoria: "Hortaliças",
    energia: 34,
    proteina: 1.3,
    lipidios: 0.2,
    carboidrato: 7.7,
    fibra: 3.2,
    calcio: 27,
    ferro: 0.6,
    sodio: 65,
    vitaminaA: 1100,
    vitaminaC: 2.6,
  },
  {
    id: 10,
    codigo: "F0002",
    nome: "Maçã, fuji, com casca",
    categoria: "Frutas",
    energia: 56,
    proteina: 0.3,
    lipidios: 0.4,
    carboidrato: 14.8,
    fibra: 2.0,
    calcio: 3,
    ferro: 0.1,
    sodio: 0,
    vitaminaA: 2,
    vitaminaC: 2.4,
  },
]

const categorias = [
  "Todas",
  "Cereais e derivados",
  "Leguminosas",
  "Hortaliças",
  "Frutas",
  "Leite e derivados",
  "Carnes e derivados",
  "Ovos",
]

export function BaseTACO() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [selectedAlimentos, setSelectedAlimentos] = useState<number[]>([])

  const filteredAlimentos = alimentosTACO.filter((alimento) => {
    const matchesSearch =
      alimento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alimento.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todas" || alimento.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleAlimento = (id: number) => {
    setSelectedAlimentos((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const calcularNutrientes = () => {
    const selecionados = alimentosTACO.filter((alimento) => selectedAlimentos.includes(alimento.id))
    if (selecionados.length === 0) return null

    const total = selecionados.reduce(
      (acc, alimento) => ({
        energia: acc.energia + alimento.energia,
        proteina: acc.proteina + alimento.proteina,
        lipidios: acc.lipidios + alimento.lipidios,
        carboidrato: acc.carboidrato + alimento.carboidrato,
        fibra: acc.fibra + alimento.fibra,
        calcio: acc.calcio + alimento.calcio,
        ferro: acc.ferro + alimento.ferro,
        sodio: acc.sodio + alimento.sodio,
        vitaminaA: acc.vitaminaA + alimento.vitaminaA,
        vitaminaC: acc.vitaminaC + alimento.vitaminaC,
      }),
      {
        energia: 0,
        proteina: 0,
        lipidios: 0,
        carboidrato: 0,
        fibra: 0,
        calcio: 0,
        ferro: 0,
        sodio: 0,
        vitaminaA: 0,
        vitaminaC: 0,
      },
    )

    return {
      ...total,
      quantidade: selecionados.length,
    }
  }

  const nutrientesCalculados = calcularNutrientes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Base de Dados TACO</h3>
          <p className="text-muted-foreground">Tabela Brasileira de Composição de Alimentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar ao Cardápio
          </Button>
          {selectedAlimentos.length > 0 && (
            <Button>
              <Calculator className="h-4 w-4 mr-2" />
              Calcular ({selectedAlimentos.length})
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="busca" className="space-y-4">
        <TabsList>
          <TabsTrigger value="busca">Buscar Alimentos</TabsTrigger>
          <TabsTrigger value="calculadora">Calculadora Nutricional</TabsTrigger>
        </TabsList>

        <TabsContent value="busca" className="space-y-4">
          {/* Filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar alimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categorias.map((categoria) => (
                <Button
                  key={categoria}
                  variant={selectedCategory === categoria ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(categoria)}
                >
                  {categoria}
                </Button>
              ))}
            </div>
          </div>

          {/* Lista de Alimentos */}
          <div className="grid gap-4">
            {filteredAlimentos.map((alimento) => (
              <Card
                key={alimento.id}
                className={`cursor-pointer transition-all ${
                  selectedAlimentos.includes(alimento.id) ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                }`}
                onClick={() => toggleAlimento(alimento.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{alimento.nome}</h4>
                      <p className="text-sm text-muted-foreground">
                        {alimento.codigo} • {alimento.categoria}
                      </p>
                    </div>
                    <Badge variant="secondary">{alimento.energia} kcal/100g</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Proteína</p>
                      <p className="font-medium">{alimento.proteina}g</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Carboidrato</p>
                      <p className="font-medium">{alimento.carboidrato}g</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lipídios</p>
                      <p className="font-medium">{alimento.lipidios}g</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fibra</p>
                      <p className="font-medium">{alimento.fibra}g</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cálcio</p>
                      <p className="font-medium">{alimento.calcio}mg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculadora" className="space-y-4">
          {nutrientesCalculados ? (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise Nutricional</CardTitle>
                  <CardDescription>
                    Valores calculados para {nutrientesCalculados.quantidade} alimento(s) selecionado(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{nutrientesCalculados.energia.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">kcal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{nutrientesCalculados.proteina.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">g Proteína</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{nutrientesCalculados.carboidrato.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">g Carboidrato</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{nutrientesCalculados.lipidios.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">g Lipídios</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{nutrientesCalculados.fibra.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">g Fibra</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Micronutrientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <div className="text-center">
                      <p className="text-xl font-bold">{nutrientesCalculados.calcio.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">mg Cálcio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{nutrientesCalculados.ferro.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">mg Ferro</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{nutrientesCalculados.sodio.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">mg Sódio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{nutrientesCalculados.vitaminaA.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">μg Vit. A</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{nutrientesCalculados.vitaminaC.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">mg Vit. C</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedAlimentos([])}>
                  Limpar Seleção
                </Button>
                <Button>Salvar Análise</Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum alimento selecionado</h3>
                <p className="text-muted-foreground">
                  Selecione alimentos na aba "Buscar Alimentos" para calcular os valores nutricionais
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
