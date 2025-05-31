"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Calculator } from "lucide-react"

interface CustoPreparacaoFormProps {
  preparacao?: any
  onCancel: () => void
  onSave: () => void
}

export function CustoPreparacaoForm({ preparacao, onCancel, onSave }: CustoPreparacaoFormProps) {
  const [formData, setFormData] = useState({
    nome: preparacao?.nome || "",
    categoria: preparacao?.categoria || "",
    rendimento: preparacao?.rendimento || "",
    margemLucro: preparacao?.margemLucro || 15,
    custoMaoObra: preparacao?.custoMaoObra || "",
    custoEnergia: preparacao?.custoEnergia || "",
    outrosCustos: preparacao?.outrosCustos || "",
    ingredientes: preparacao?.ingredientes || [
      { nome: "", quantidade: "", unidade: "kg", custoUnitario: "", custoTotal: 0 },
    ],
  })

  const [custoCalculado, setCustoCalculado] = useState({
    custoIngredientes: 0,
    custoTotal: 0,
    custoPorcao: 0,
    precoVenda: 0,
  })

  const adicionarIngrediente = () => {
    setFormData({
      ...formData,
      ingredientes: [
        ...formData.ingredientes,
        { nome: "", quantidade: "", unidade: "kg", custoUnitario: "", custoTotal: 0 },
      ],
    })
  }

  const removerIngrediente = (index: number) => {
    const novosIngredientes = formData.ingredientes.filter((_, i) => i !== index)
    setFormData({ ...formData, ingredientes: novosIngredientes })
  }

  const atualizarIngrediente = (index: number, campo: string, valor: any) => {
    const novosIngredientes = [...formData.ingredientes]
    novosIngredientes[index] = { ...novosIngredientes[index], [campo]: valor }

    // Calcular custo total do ingrediente
    if (campo === "quantidade" || campo === "custoUnitario") {
      const quantidade = Number.parseFloat(novosIngredientes[index].quantidade) || 0
      const custoUnitario = Number.parseFloat(novosIngredientes[index].custoUnitario) || 0
      novosIngredientes[index].custoTotal = quantidade * custoUnitario
    }

    setFormData({ ...formData, ingredientes: novosIngredientes })
  }

  const calcularCustos = () => {
    const custoIngredientes = formData.ingredientes.reduce((total, ing) => total + (ing.custoTotal || 0), 0)
    const custoMaoObra = Number.parseFloat(formData.custoMaoObra) || 0
    const custoEnergia = Number.parseFloat(formData.custoEnergia) || 0
    const outrosCustos = Number.parseFloat(formData.outrosCustos) || 0
    const rendimento = Number.parseFloat(formData.rendimento) || 1

    const custoTotal = custoIngredientes + custoMaoObra + custoEnergia + outrosCustos
    const custoPorcao = custoTotal / rendimento
    const margemDecimal = formData.margemLucro / 100
    const precoVenda = custoPorcao * (1 + margemDecimal)

    setCustoCalculado({
      custoIngredientes,
      custoTotal,
      custoPorcao,
      precoVenda,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Salvando preparação:", formData, custoCalculado)
    onSave()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{preparacao ? "Editar Custo de Preparação" : "Nova Preparação"}</CardTitle>
        <CardDescription>
          {preparacao ? "Atualize os custos da preparação" : "Calcule os custos de uma nova preparação"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <div>
            <h4 className="font-medium mb-4">Informações Básicas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Preparação</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Café da Manhã">Café da Manhã</SelectItem>
                    <SelectItem value="Lanche">Lanche</SelectItem>
                    <SelectItem value="Almoço">Almoço</SelectItem>
                    <SelectItem value="Jantar">Jantar</SelectItem>
                    <SelectItem value="Sobremesa">Sobremesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="rendimento">Rendimento (porções)</Label>
                <Input
                  id="rendimento"
                  type="number"
                  value={formData.rendimento}
                  onChange={(e) => setFormData({ ...formData, rendimento: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="margem">Margem de Lucro (%)</Label>
                <Input
                  id="margem"
                  type="number"
                  value={formData.margemLucro}
                  onChange={(e) => setFormData({ ...formData, margemLucro: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Ingredientes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Ingredientes</h4>
              <Button type="button" variant="outline" onClick={adicionarIngrediente}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-3">
              {formData.ingredientes.map((ingrediente, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-end">
                  <div className="col-span-2">
                    <Label>Ingrediente</Label>
                    <Input
                      value={ingrediente.nome}
                      onChange={(e) => atualizarIngrediente(index, "nome", e.target.value)}
                      placeholder="Nome do ingrediente"
                    />
                  </div>
                  <div>
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={ingrediente.quantidade}
                      onChange={(e) => atualizarIngrediente(index, "quantidade", e.target.value)}
                      placeholder="0.000"
                    />
                  </div>
                  <div>
                    <Label>Unidade</Label>
                    <Select
                      value={ingrediente.unidade}
                      onValueChange={(value) => atualizarIngrediente(index, "unidade", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="unidade">unidade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Custo Unit. (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={ingrediente.custoUnitario}
                      onChange={(e) => atualizarIngrediente(index, "custoUnitario", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">R$ {ingrediente.custoTotal?.toFixed(2) || "0.00"}</div>
                    <Button type="button" variant="outline" size="sm" onClick={() => removerIngrediente(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Outros Custos */}
          <div>
            <h4 className="font-medium mb-4">Outros Custos</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mao-obra">Mão de Obra (R$)</Label>
                <Input
                  id="mao-obra"
                  type="number"
                  step="0.01"
                  value={formData.custoMaoObra}
                  onChange={(e) => setFormData({ ...formData, custoMaoObra: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="energia">Energia/Gás (R$)</Label>
                <Input
                  id="energia"
                  type="number"
                  step="0.01"
                  value={formData.custoEnergia}
                  onChange={(e) => setFormData({ ...formData, custoEnergia: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outros">Outros Custos (R$)</Label>
                <Input
                  id="outros"
                  type="number"
                  step="0.01"
                  value={formData.outrosCustos}
                  onChange={(e) => setFormData({ ...formData, outrosCustos: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Cálculo de Custos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Resumo de Custos</h4>
              <Button type="button" variant="outline" onClick={calcularCustos}>
                <Calculator className="h-4 w-4 mr-2" />
                Calcular
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Ingredientes:</span>
                <p className="font-medium">R$ {custoCalculado.custoIngredientes.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Custo Total:</span>
                <p className="font-medium">R$ {custoCalculado.custoTotal.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Custo/Porção:</span>
                <p className="font-medium">R$ {custoCalculado.custoPorcao.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Preço Venda:</span>
                <p className="font-medium text-green-600">R$ {custoCalculado.precoVenda.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">{preparacao ? "Atualizar" : "Salvar"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
