"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Calculator, Edit, Eye, DollarSign } from "lucide-react"
import { CustoPreparacaoForm } from "./custo-preparacao-form"
import { CustoPreparacaoDetalhes } from "./custo-preparacao-detalhes"

const preparacoesData = [
  {
    id: 1,
    nome: "Arroz com Feijão e Frango Grelhado",
    categoria: "Almoço",
    rendimento: 100,
    custoTotal: 450.0,
    custoPorcao: 4.5,
    margemLucro: 15,
    precoVenda: 5.18,
    ingredientes: [
      { nome: "Arroz branco", quantidade: 5, unidade: "kg", custoUnitario: 5.0, custoTotal: 25.0 },
      { nome: "Feijão carioca", quantidade: 3, unidade: "kg", custoUnitario: 6.0, custoTotal: 18.0 },
      { nome: "Peito de frango", quantidade: 8, unidade: "kg", custoUnitario: 15.0, custoTotal: 120.0 },
      { nome: "Óleo de soja", quantidade: 0.5, unidade: "L", custoUnitario: 8.0, custoTotal: 4.0 },
      { nome: "Temperos diversos", quantidade: 1, unidade: "kg", custoUnitario: 10.0, custoTotal: 10.0 },
    ],
    custoMaoObra: 50.0,
    custoEnergia: 15.0,
    outrosCustos: 8.0,
    dataAtualizacao: "2024-06-15",
  },
  {
    id: 2,
    nome: "Macarrão com Molho de Tomate",
    categoria: "Almoço",
    rendimento: 80,
    custoTotal: 240.0,
    custoPorcao: 3.0,
    margemLucro: 20,
    precoVenda: 3.6,
    ingredientes: [
      { nome: "Macarrão", quantidade: 4, unidade: "kg", custoUnitario: 8.0, custoTotal: 32.0 },
      { nome: "Molho de tomate", quantidade: 2, unidade: "kg", custoUnitario: 12.0, custoTotal: 24.0 },
      { nome: "Carne moída", quantidade: 3, unidade: "kg", custoUnitario: 18.0, custoTotal: 54.0 },
      { nome: "Queijo ralado", quantidade: 0.5, unidade: "kg", custoUnitario: 25.0, custoTotal: 12.5 },
    ],
    custoMaoObra: 30.0,
    custoEnergia: 12.0,
    outrosCustos: 5.5,
    dataAtualizacao: "2024-06-14",
  },
  {
    id: 3,
    nome: "Vitamina de Banana",
    categoria: "Lanche",
    rendimento: 50,
    custoTotal: 75.0,
    custoPorcao: 1.5,
    margemLucro: 25,
    precoVenda: 1.88,
    ingredientes: [
      { nome: "Banana", quantidade: 3, unidade: "kg", custoUnitario: 4.0, custoTotal: 12.0 },
      { nome: "Leite", quantidade: 5, unidade: "L", custoUnitario: 4.5, custoTotal: 22.5 },
      { nome: "Açúcar", quantidade: 0.5, unidade: "kg", custoUnitario: 3.0, custoTotal: 1.5 },
    ],
    custoMaoObra: 8.0,
    custoEnergia: 3.0,
    outrosCustos: 2.0,
    dataAtualizacao: "2024-06-13",
  },
]

export function CustoPreparacoes() {
  const [showForm, setShowForm] = useState(false)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [selectedPreparacao, setSelectedPreparacao] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPreparacoes = preparacoesData.filter(
    (prep) =>
      prep.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prep.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (preparacao: any) => {
    setSelectedPreparacao(preparacao)
    setShowForm(true)
  }

  const handleView = (preparacao: any) => {
    setSelectedPreparacao(preparacao)
    setShowDetalhes(true)
  }

  const handleNew = () => {
    setSelectedPreparacao(null)
    setShowForm(true)
  }

  const calcularCusto = (id: number) => {
    console.log("Recalculando custos para preparação:", id)
    // Implementar lógica de recálculo automático
  }

  if (showForm) {
    return (
      <CustoPreparacaoForm
        preparacao={selectedPreparacao}
        onCancel={() => setShowForm(false)}
        onSave={() => setShowForm(false)}
      />
    )
  }

  if (showDetalhes) {
    return (
      <CustoPreparacaoDetalhes
        preparacao={selectedPreparacao}
        onClose={() => setShowDetalhes(false)}
        onEdit={() => {
          setShowDetalhes(false)
          setShowForm(true)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Custo de Preparações</CardTitle>
              <CardDescription>Calcule e gerencie os custos de cada receita</CardDescription>
            </div>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Preparação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar preparação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredPreparacoes.map((preparacao) => (
              <Card key={preparacao.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{preparacao.nome}</CardTitle>
                      <CardDescription>
                        {preparacao.categoria} • Rendimento: {preparacao.rendimento} porções
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      Margem: {preparacao.margemLucro}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Custo Total:</span>
                        <p className="font-medium text-lg">R$ {preparacao.custoTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Custo/Porção:</span>
                      <p className="font-medium">R$ {preparacao.custoPorcao.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Preço Venda:</span>
                      <p className="font-medium">R$ {preparacao.precoVenda.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lucro/Porção:</span>
                      <p className="font-medium text-green-600">
                        R$ {(preparacao.precoVenda - preparacao.custoPorcao).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Atualizado:</span>
                      <p className="font-medium">{new Date(preparacao.dataAtualizacao).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Ingredientes: {preparacao.ingredientes.length} • Mão de obra: R${" "}
                      {preparacao.custoMaoObra.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => calcularCusto(preparacao.id)}>
                        <Calculator className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleView(preparacao)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(preparacao)}>
                        <Edit className="h-4 w-4" />
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
