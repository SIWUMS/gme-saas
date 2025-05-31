"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface MovimentacaoFormProps {
  tipo: "entrada" | "saida"
}

export function MovimentacaoForm({ tipo }: MovimentacaoFormProps) {
  const [formData, setFormData] = useState({
    alimentoId: "",
    quantidade: "",
    valorUnitario: "",
    motivo: "",
    documento: "",
    observacoes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Registrando ${tipo}:`, formData)
    // Implementar lógica de movimentação
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tipo === "entrada" ? "Entrada de Estoque" : "Saída de Estoque"}</CardTitle>
        <CardDescription>
          {tipo === "entrada" ? "Registre a entrada de produtos no estoque" : "Registre a saída de produtos do estoque"}
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
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                step="0.001"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                placeholder="0.000"
                required
              />
            </div>
          </div>

          {tipo === "entrada" && (
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
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo</Label>
              <Select value={formData.motivo} onValueChange={(value) => setFormData({ ...formData, motivo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  {tipo === "entrada" ? (
                    <>
                      <SelectItem value="compra">Compra</SelectItem>
                      <SelectItem value="doacao">Doação</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                      <SelectItem value="ajuste">Ajuste de Inventário</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="consumo">Consumo</SelectItem>
                      <SelectItem value="vencimento">Vencimento</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                      <SelectItem value="perda">Perda/Avaria</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="documento">Documento</Label>
              <Input
                id="documento"
                value={formData.documento}
                onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                placeholder="Número da nota fiscal, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações sobre a movimentação..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">{tipo === "entrada" ? "Registrar Entrada" : "Registrar Saída"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
