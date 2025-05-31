"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface AlimentoFormProps {
  alimento?: any
}

export function AlimentoForm({ alimento }: AlimentoFormProps) {
  const [formData, setFormData] = useState({
    codigoTaco: alimento?.codigoTaco || "",
    nome: alimento?.nome || "",
    categoria: alimento?.categoria || "",
    unidadeMedida: alimento?.unidadeMedida || "g",
    energiaKcal: alimento?.energiaKcal || "",
    proteinas: alimento?.proteinas || "",
    lipidios: alimento?.lipidios || "",
    carboidratos: alimento?.carboidratos || "",
    fibraAlimentar: alimento?.fibraAlimentar || "",
    calcio: alimento?.calcio || "",
    ferro: alimento?.ferro || "",
    sodio: alimento?.sodio || "",
    temGluten: alimento?.temGluten || false,
    temLactose: alimento?.temLactose || false,
    ehVegano: alimento?.ehVegano || false,
    ehVegetariano: alimento?.ehVegetariano || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Salvando alimento:", formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{alimento ? "Editar Alimento" : "Novo Alimento"}</CardTitle>
        <CardDescription>
          {alimento ? "Atualize as informações do alimento" : "Cadastre um novo alimento na base de dados"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo-taco">Código TACO</Label>
              <Input
                id="codigo-taco"
                value={formData.codigoTaco}
                onChange={(e) => setFormData({ ...formData, codigoTaco: e.target.value })}
                placeholder="Ex: 100"
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
                  <SelectItem value="Cereais e derivados">Cereais e derivados</SelectItem>
                  <SelectItem value="Leguminosas">Leguminosas</SelectItem>
                  <SelectItem value="Carnes e derivados">Carnes e derivados</SelectItem>
                  <SelectItem value="Leite e derivados">Leite e derivados</SelectItem>
                  <SelectItem value="Frutas">Frutas</SelectItem>
                  <SelectItem value="Hortaliças">Hortaliças</SelectItem>
                  <SelectItem value="Óleos e gorduras">Óleos e gorduras</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Alimento</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Arroz, integral, cozido"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidade-medida">Unidade de Medida</Label>
              <Select
                value={formData.unidadeMedida}
                onValueChange={(value) => setFormData({ ...formData, unidadeMedida: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">Gramas (g)</SelectItem>
                  <SelectItem value="ml">Mililitros (ml)</SelectItem>
                  <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                  <SelectItem value="L">Litros (L)</SelectItem>
                  <SelectItem value="unidade">Unidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4">Informações Nutricionais (por 100g/ml)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="energia">Energia (kcal)</Label>
                <Input
                  id="energia"
                  type="number"
                  step="0.1"
                  value={formData.energiaKcal}
                  onChange={(e) => setFormData({ ...formData, energiaKcal: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proteinas">Proteínas (g)</Label>
                <Input
                  id="proteinas"
                  type="number"
                  step="0.1"
                  value={formData.proteinas}
                  onChange={(e) => setFormData({ ...formData, proteinas: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carboidratos">Carboidratos (g)</Label>
                <Input
                  id="carboidratos"
                  type="number"
                  step="0.1"
                  value={formData.carboidratos}
                  onChange={(e) => setFormData({ ...formData, carboidratos: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lipidios">Lipídios (g)</Label>
                <Input
                  id="lipidios"
                  type="number"
                  step="0.1"
                  value={formData.lipidios}
                  onChange={(e) => setFormData({ ...formData, lipidios: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fibra">Fibra Alimentar (g)</Label>
                <Input
                  id="fibra"
                  type="number"
                  step="0.1"
                  value={formData.fibraAlimentar}
                  onChange={(e) => setFormData({ ...formData, fibraAlimentar: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calcio">Cálcio (mg)</Label>
                <Input
                  id="calcio"
                  type="number"
                  step="0.1"
                  value={formData.calcio}
                  onChange={(e) => setFormData({ ...formData, calcio: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ferro">Ferro (mg)</Label>
                <Input
                  id="ferro"
                  type="number"
                  step="0.1"
                  value={formData.ferro}
                  onChange={(e) => setFormData({ ...formData, ferro: e.target.value })}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sodio">Sódio (mg)</Label>
                <Input
                  id="sodio"
                  type="number"
                  step="0.1"
                  value={formData.sodio}
                  onChange={(e) => setFormData({ ...formData, sodio: e.target.value })}
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4">Restrições e Características</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tem-gluten"
                  checked={formData.temGluten}
                  onCheckedChange={(checked) => setFormData({ ...formData, temGluten: checked as boolean })}
                />
                <Label htmlFor="tem-gluten">Contém Glúten</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tem-lactose"
                  checked={formData.temLactose}
                  onCheckedChange={(checked) => setFormData({ ...formData, temLactose: checked as boolean })}
                />
                <Label htmlFor="tem-lactose">Contém Lactose</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eh-vegano"
                  checked={formData.ehVegano}
                  onCheckedChange={(checked) => setFormData({ ...formData, ehVegano: checked as boolean })}
                />
                <Label htmlFor="eh-vegano">Vegano</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eh-vegetariano"
                  checked={formData.ehVegetariano}
                  onCheckedChange={(checked) => setFormData({ ...formData, ehVegetariano: checked as boolean })}
                />
                <Label htmlFor="eh-vegetariano">Vegetariano</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">{alimento ? "Atualizar" : "Salvar"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
