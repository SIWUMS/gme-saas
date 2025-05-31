"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Calculator, Calendar, DollarSign, Users } from "lucide-react"
import { CustoCardapioDetalhes } from "./custo-cardapio-detalhes"

const cardapiosData = [
  {
    id: 1,
    nome: "Cardápio Creche - Semana 1",
    periodo: "01/06/2024 - 07/06/2024",
    faixaEtaria: "0-3 anos",
    totalAlunos: 150,
    diasLetivos: 5,
    refeicoesDia: 3,
    custoTotal: 2250.0,
    custoPorAluno: 15.0,
    custoPorRefeicao: 5.0,
    preparacoes: [
      { nome: "Vitamina de Banana", quantidade: 150, custoPorcao: 1.5, custoTotal: 225.0 },
      { nome: "Arroz com Feijão", quantidade: 150, custoPorcao: 3.0, custoTotal: 450.0 },
      { nome: "Frango Grelhado", quantidade: 150, custoPorcao: 4.5, custoTotal: 675.0 },
      { nome: "Sopa de Legumes", quantidade: 150, custoPorcao: 2.0, custoTotal: 300.0 },
      { nome: "Pão com Leite", quantidade: 150, custoPorcao: 1.0, custoTotal: 150.0 },
    ],
    status: "ativo",
  },
  {
    id: 2,
    nome: "Cardápio Fundamental - Semana 1",
    periodo: "01/06/2024 - 07/06/2024",
    faixaEtaria: "6-14 anos",
    totalAlunos: 300,
    diasLetivos: 5,
    refeicoesDia: 2,
    custoTotal: 4500.0,
    custoPorAluno: 15.0,
    custoPorRefeicao: 7.5,
    preparacoes: [
      { nome: "Macarrão com Molho", quantidade: 300, custoPorcao: 3.0, custoTotal: 900.0 },
      { nome: "Arroz com Feijão e Frango", quantidade: 300, custoPorcao: 4.5, custoTotal: 1350.0 },
      { nome: "Salada Verde", quantidade: 300, custoPorcao: 1.5, custoTotal: 450.0 },
      { nome: "Suco Natural", quantidade: 300, custoPorcao: 2.0, custoTotal: 600.0 },
    ],
    status: "ativo",
  },
  {
    id: 3,
    nome: "Cardápio Especial - Festa Junina",
    periodo: "24/06/2024 - 24/06/2024",
    faixaEtaria: "Todas",
    totalAlunos: 450,
    diasLetivos: 1,
    refeicoesDia: 2,
    custoTotal: 1350.0,
    custoPorAluno: 3.0,
    custoPorRefeicao: 1.5,
    preparacoes: [
      { nome: "Canjica", quantidade: 450, custoPorcao: 2.0, custoTotal: 900.0 },
      { nome: "Quentão (sem álcool)", quantidade: 450, custoPorcao: 1.0, custoTotal: 450.0 },
    ],
    status: "planejado",
  },
]

export function CustoCardapios() {
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [selectedCardapio, setSelectedCardapio] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCardapios = cardapiosData.filter(
    (cardapio) =>
      cardapio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cardapio.faixaEtaria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleView = (cardapio: any) => {
    setSelectedCardapio(cardapio)
    setShowDetalhes(true)
  }

  const calcularCustoCardapio = (id: number) => {
    console.log("Recalculando custos do cardápio:", id)
    // Implementar lógica de recálculo
  }

  if (showDetalhes) {
    return <CustoCardapioDetalhes cardapio={selectedCardapio} onClose={() => setShowDetalhes(false)} />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custo de Cardápios</CardTitle>
              <CardDescription>Análise financeira completa dos cardápios</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar cardápio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredCardapios.map((cardapio) => (
              <Card key={cardapio.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{cardapio.nome}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {cardapio.periodo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {cardapio.totalAlunos} alunos
                        </span>
                        <span>{cardapio.faixaEtaria}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={cardapio.status === "ativo" ? "default" : "secondary"}>
                      {cardapio.status === "ativo" ? "Ativo" : "Planejado"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Custo Total:</span>
                        <p className="font-medium text-lg">R$ {cardapio.custoTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Custo/Aluno:</span>
                      <p className="font-medium">R$ {cardapio.custoPorAluno.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Custo/Refeição:</span>
                      <p className="font-medium">R$ {cardapio.custoPorRefeicao.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dias Letivos:</span>
                      <p className="font-medium">{cardapio.diasLetivos}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Refeições/Dia:</span>
                      <p className="font-medium">{cardapio.refeicoesDia}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">Preparações principais:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {cardapio.preparacoes.slice(0, 3).map((prep, index) => (
                        <Badge key={index} variant="outline">
                          {prep.nome} (R$ {prep.custoPorcao.toFixed(2)})
                        </Badge>
                      ))}
                      {cardapio.preparacoes.length > 3 && (
                        <Badge variant="outline">+{cardapio.preparacoes.length - 3} mais</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Total de preparações: {cardapio.preparacoes.length}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => calcularCustoCardapio(cardapio.id)}>
                        <Calculator className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleView(cardapio)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
