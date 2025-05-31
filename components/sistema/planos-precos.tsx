"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Check } from "lucide-react"

const planosData = [
  {
    id: 1,
    nome: "Basic",
    preco: 149.9,
    limiteAlunos: 200,
    limiteUsuarios: 5,
    recursos: ["Gestão de cardápios", "Controle de estoque básico", "Relatórios básicos", "Suporte por email"],
    ativo: true,
  },
  {
    id: 2,
    nome: "Premium",
    preco: 299.9,
    limiteAlunos: 500,
    limiteUsuarios: 15,
    recursos: [
      "Todos os recursos do Basic",
      "Análise nutricional avançada",
      "Relatórios avançados",
      "Integração com fornecedores",
      "Suporte prioritário",
    ],
    ativo: true,
  },
  {
    id: 3,
    nome: "Enterprise",
    preco: 599.9,
    limiteAlunos: 2000,
    limiteUsuarios: 50,
    recursos: [
      "Todos os recursos do Premium",
      "Multi-unidades",
      "API personalizada",
      "Relatórios customizados",
      "Suporte 24/7",
      "Treinamento incluso",
    ],
    ativo: true,
  },
]

export function PlanosPrecos() {
  const [showForm, setShowForm] = useState(false)
  const [selectedPlano, setSelectedPlano] = useState(null)

  const handleEdit = (plano: any) => {
    setSelectedPlano(plano)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este plano?")) {
      console.log("Excluindo plano:", id)
    }
  }

  const handleNew = () => {
    setSelectedPlano(null)
    setShowForm(true)
  }

  if (showForm) {
    return <PlanoForm plano={selectedPlano} onCancel={() => setShowForm(false)} />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Planos e Preços</CardTitle>
              <CardDescription>Gerencie os planos de assinatura do sistema</CardDescription>
            </div>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {planosData.map((plano) => (
              <Card key={plano.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{plano.nome}</CardTitle>
                    <Badge variant={plano.ativo ? "default" : "secondary"}>{plano.ativo ? "Ativo" : "Inativo"}</Badge>
                  </div>
                  <div className="text-3xl font-bold">
                    R$ {plano.preco.toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Até {plano.limiteAlunos} alunos</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Até {plano.limiteUsuarios} usuários</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recursos inclusos:</h4>
                    <ul className="space-y-1">
                      {plano.recursos.map((recurso, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          {recurso}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(plano)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(plano.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

function PlanoForm({ plano, onCancel }: { plano?: any; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    nome: plano?.nome || "",
    preco: plano?.preco || "",
    limiteAlunos: plano?.limiteAlunos || "",
    limiteUsuarios: plano?.limiteUsuarios || "",
    recursos: plano?.recursos?.join("\n") || "",
    ativo: plano?.ativo ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Salvando plano:", formData)
    onCancel()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plano ? "Editar Plano" : "Novo Plano"}</CardTitle>
        <CardDescription>
          {plano ? "Atualize as informações do plano" : "Crie um novo plano de assinatura"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Plano</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço Mensal (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limite-alunos">Limite de Alunos</Label>
              <Input
                id="limite-alunos"
                type="number"
                value={formData.limiteAlunos}
                onChange={(e) => setFormData({ ...formData, limiteAlunos: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limite-usuarios">Limite de Usuários</Label>
              <Input
                id="limite-usuarios"
                type="number"
                value={formData.limiteUsuarios}
                onChange={(e) => setFormData({ ...formData, limiteUsuarios: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recursos">Recursos (um por linha)</Label>
            <textarea
              id="recursos"
              className="w-full min-h-32 p-3 border rounded-md"
              value={formData.recursos}
              onChange={(e) => setFormData({ ...formData, recursos: e.target.value })}
              placeholder="Gestão de cardápios&#10;Controle de estoque&#10;Relatórios básicos"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">{plano ? "Atualizar" : "Salvar"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
