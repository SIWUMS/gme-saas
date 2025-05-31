"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Download, Calculator, Users } from "lucide-react"

const fichaTecnica = {
  nome: "Arroz com Feijão e Frango Grelhado",
  categoria: "Almoço",
  porcoes: 100,
  custoTotal: 450.0,
  custoPorcao: 4.5,
  tempoPreparacao: "45 min",
  ingredientes: [
    { nome: "Arroz branco", quantidade: 5, unidade: "kg", custo: 25.0 },
    { nome: "Feijão carioca", quantidade: 3, unidade: "kg", custo: 18.0 },
    { nome: "Peito de frango", quantidade: 8, unidade: "kg", custo: 120.0 },
    { nome: "Óleo de soja", quantidade: 500, unidade: "ml", custo: 8.0 },
    { nome: "Cebola", quantidade: 2, unidade: "kg", custo: 6.0 },
    { nome: "Alho", quantidade: 200, unidade: "g", custo: 4.0 },
    { nome: "Sal", quantidade: 100, unidade: "g", custo: 1.0 },
    { nome: "Temperos", quantidade: 50, unidade: "g", custo: 5.0 },
  ],
  informacoesNutricionais: {
    calorias: 420,
    carboidratos: 65.2,
    proteinas: 28.5,
    gorduras: 8.3,
    fibras: 6.8,
    sodio: 580,
    calcio: 45,
    ferro: 3.2,
  },
  modoPreparo: [
    "Lavar e deixar o feijão de molho por 8 horas",
    "Cozinhar o feijão em panela de pressão por 20 minutos",
    "Lavar o arroz e refogar com cebola e alho",
    "Adicionar água e cozinhar por 18 minutos",
    "Temperar o frango e grelhar por 15 minutos de cada lado",
    "Servir quente acompanhado de salada",
  ],
}

export function FichaTecnica() {
  const { informacoesNutricionais } = fichaTecnica

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ficha Técnica</h2>
          <p className="text-muted-foreground">Informações detalhadas da preparação</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Recalcular
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informações Gerais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{fichaTecnica.nome}</CardTitle>
            <CardDescription>
              <Badge variant="secondary">{fichaTecnica.categoria}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Porções:</span>
                <p className="font-medium">{fichaTecnica.porcoes}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Custo Total:</span>
                <p className="font-medium">R$ {fichaTecnica.custoTotal.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Custo/Porção:</span>
                <p className="font-medium">R$ {fichaTecnica.custoPorcao.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tempo:</span>
                <p className="font-medium">{fichaTecnica.tempoPreparacao}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Ingredientes</h4>
              <div className="space-y-2">
                {fichaTecnica.ingredientes.map((ingrediente, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="font-medium">{ingrediente.nome}</span>
                    <div className="text-sm text-muted-foreground">
                      {ingrediente.quantidade} {ingrediente.unidade} - R$ {ingrediente.custo.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Modo de Preparo</h4>
              <ol className="space-y-2">
                {fichaTecnica.modoPreparo.map((passo, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-sm">{passo}</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Informações Nutricionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Informações Nutricionais
            </CardTitle>
            <CardDescription>Por porção (100g)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{informacoesNutricionais.calorias}</div>
              <div className="text-sm text-muted-foreground">kcal</div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Carboidratos</span>
                  <span>{informacoesNutricionais.carboidratos}g</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Proteínas</span>
                  <span>{informacoesNutricionais.proteinas}g</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Gorduras</span>
                  <span>{informacoesNutricionais.gorduras}g</span>
                </div>
                <Progress value={8} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fibras</span>
                  <span>{informacoesNutricionais.fibras}g</span>
                </div>
                <Progress value={7} className="h-2" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sódio</span>
                <span>{informacoesNutricionais.sodio}mg</span>
              </div>
              <div className="flex justify-between">
                <span>Cálcio</span>
                <span>{informacoesNutricionais.calcio}mg</span>
              </div>
              <div className="flex justify-between">
                <span>Ferro</span>
                <span>{informacoesNutricionais.ferro}mg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
