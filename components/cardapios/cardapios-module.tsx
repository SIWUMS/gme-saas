"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Eye, Edit, Download, CheckCircle } from "lucide-react"
import { CardapioForm } from "./cardapio-form"
import { FichaTecnica } from "./ficha-tecnica"
import { BaseTACO } from "./base-taco"

const cardapios = [
  {
    id: 1,
    nome: "Cardápio Creche - Semana 1",
    periodo: "01/06/2024 - 07/06/2024",
    faixaEtaria: "0-3 anos",
    status: "Aprovado",
    refeicoes: 5,
    custoMedio: 4.5,
  },
  {
    id: 2,
    nome: "Cardápio Fundamental - Semana 1",
    periodo: "01/06/2024 - 07/06/2024",
    faixaEtaria: "6-14 anos",
    status: "Pendente",
    refeicoes: 5,
    custoMedio: 5.2,
  },
]

export function CardapiosModule() {
  const [activeTab, setActiveTab] = useState("lista")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Rascunho":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Cardápios</h2>
          <p className="text-muted-foreground">Crie e gerencie cardápios semanais e mensais</p>
        </div>
        <Button onClick={() => setActiveTab("novo")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cardápio
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lista">Lista de Cardápios</TabsTrigger>
          <TabsTrigger value="novo">Novo Cardápio</TabsTrigger>
          <TabsTrigger value="ficha">Ficha Técnica</TabsTrigger>
          <TabsTrigger value="taco">Base TACO</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          {cardapios.map((cardapio) => (
            <Card key={cardapio.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{cardapio.nome}</CardTitle>
                    <CardDescription>
                      {cardapio.periodo} • {cardapio.faixaEtaria}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(cardapio.status)}>{cardapio.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Refeições:</span>
                      <span className="ml-2 font-medium">{cardapio.refeicoes}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Custo Médio:</span>
                      <span className="ml-2 font-medium">R$ {cardapio.custoMedio.toFixed(2)}</span>
                    </div>
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
                    {cardapio.status === "Pendente" && (
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="novo">
          <CardapioForm />
        </TabsContent>

        <TabsContent value="ficha">
          <FichaTecnica />
        </TabsContent>

        <TabsContent value="taco">
          <BaseTACO />
        </TabsContent>
      </Tabs>
    </div>
  )
}
