"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ConsumoFormProps {
  consumo?: any
}

export function ConsumoForm({ consumo }: ConsumoFormProps) {
  const [formData, setFormData] = useState({
    data: consumo?.data || new Date().toISOString().split("T")[0],
    turmaId: consumo?.turmaId || "",
    refeicaoId: consumo?.refeicaoId || "",
    cardapioId: consumo?.cardapioId || "",
    quantidadePlanejada: consumo?.quantidadePlanejada || "",
    quantidadeServida: consumo?.quantidadeServida || "",
    observacoes: consumo?.observacoes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Salvando registro de consumo:", formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{consumo ? "Editar Registro de Consumo" : "Novo Registro de Consumo"}</CardTitle>
        <CardDescription>
          {consumo ? "Atualize as informações do registro" : "Registre o consumo diário de refeições"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="turma">Turma</Label>
              <Select value={formData.turmaId} onValueChange={(value) => setFormData({ ...formData, turmaId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Maternal I</SelectItem>
                  <SelectItem value="2">Maternal II</SelectItem>
                  <SelectItem value="3">1º Ano A</SelectItem>
                  <SelectItem value="4">1º Ano B</SelectItem>
                  <SelectItem value="5">2º Ano A</SelectItem>
                  <SelectItem value="6">2º Ano B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refeicao">Refeição</Label>
              <Select
                value={formData.refeicaoId}
                onValueChange={(value) => setFormData({ ...formData, refeicaoId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a refeição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Café da Manhã</SelectItem>
                  <SelectItem value="2">Lanche da Manhã</SelectItem>
                  <SelectItem value="3">Almoço</SelectItem>
                  <SelectItem value="4">Lanche da Tarde</SelectItem>
                  <SelectItem value="5">Jantar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardapio">Cardápio</Label>
              <Select
                value={formData.cardapioId}
                onValueChange={(value) => setFormData({ ...formData, cardapioId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cardápio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Arroz com Feijão e Frango</SelectItem>
                  <SelectItem value="2">Macarrão com Molho de Tomate</SelectItem>
                  <SelectItem value="3">Vitamina de Banana</SelectItem>
                  <SelectItem value="4">Pão com Leite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade-planejada">Quantidade Planejada</Label>
              <Input
                id="quantidade-planejada"
                type="number"
                value={formData.quantidadePlanejada}
                onChange={(e) => setFormData({ ...formData, quantidadePlanejada: e.target.value })}
                placeholder="Número de porções planejadas"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade-servida">Quantidade Servida</Label>
              <Input
                id="quantidade-servida"
                type="number"
                value={formData.quantidadeServida}
                onChange={(e) => setFormData({ ...formData, quantidadeServida: e.target.value })}
                placeholder="Número de porções servidas"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações sobre o consumo (faltas, sobras, etc.)"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">{consumo ? "Atualizar" : "Salvar"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
