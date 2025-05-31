"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface EstoqueFormProps {
  item?: any
}

export function EstoqueForm({ item }: EstoqueFormProps) {
  const [formData, setFormData] = useState({
    alimentoId: item?.alimentoId || "",
    quantidadeAtual: item?.quantidadeAtual || "",
    quantidadeMinima: item?.quantidadeMinima || "",
    valorUnitario: item?.valorUnitario || "",
    dataValidade: item?.dataValidade || "",
    lote: item?.lote || "",
    fornecedor: item?.fornecedor || "",
    observacoes: item?.observacoes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Salvando item de estoque:", formData)
    // Implementar lógica de salvamento
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item ? "Editar Item de Estoque" : "Novo Item de Estoque"}</CardTitle>
        <CardDescription>
          {item ? "Atualize as informações do item" : "Adicione um novo item ao estoque"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alimento">Alimento</Label>
              <Select
                value={formData.alimentoId}
                onValueChange={(value) => setFormData({ ...formData, alimentoId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o alimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Arroz Branco</SelectItem>
                  <SelectItem value="2">Feijão Carioca</SelectItem>
                  <SelectItem value="3">Óleo de Soja</SelectItem>
                  <SelectItem value="4">Frango Congelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                value={formData.fornecedor}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                placeholder="Nome do fornecedor"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade-atual">Quantidade Atual</Label>
              <Input
                id="quantidade-atual"
                type="number"
                step="0.001"
                value={formData.quantidadeAtual}
                onChange={(e) => setFormData({ ...formData, quantidadeAtual: e.target.value })}
                placeholder="0.000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade-minima">Quantidade Mínima</Label>
              <Input
                id="quantidade-minima"
                type="number"
                step="0.001"
                value={formData.quantidadeMinima}
                onChange={(e) => setFormData({ ...formData, quantidadeMinima: e.target.value })}
                placeholder="0.000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor-unitario">Valor Unitário (R$)</Label>
              <Input
                id="valor-unitario"
                type="number"
                step="0.01"
                value={formData.valorUnitario}
                onChange={(e) => setFormData({ ...formData, valorUnitario: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data-validade">Data de Validade</Label>
              <Input
                id="data-validade"
                type="date"
                value={formData.dataValidade}
                onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lote">Lote</Label>
              <Input
                id="lote"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                placeholder="Número do lote"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">{item ? "Atualizar" : "Salvar"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
