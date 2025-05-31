"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, User, Phone, Mail } from "lucide-react"
import { FuncionarioForm } from "./funcionario-form"

const funcionariosData = [
  {
    id: 1,
    nome: "João Silva",
    cargo: "Diretor",
    email: "joao.silva@escola.edu.br",
    telefone: "(11) 9999-1111",
    cpf: "123.456.789-00",
    dataAdmissao: "2020-01-15",
    ativo: true,
  },
  {
    id: 2,
    nome: "Maria Santos",
    cargo: "Nutricionista",
    email: "maria.santos@escola.edu.br",
    telefone: "(11) 9999-2222",
    cpf: "987.654.321-00",
    dataAdmissao: "2021-03-10",
    ativo: true,
  },
  {
    id: 3,
    nome: "Ana Costa",
    cargo: "Cozinheira",
    email: "ana.costa@escola.edu.br",
    telefone: "(11) 9999-3333",
    cpf: "456.789.123-00",
    dataAdmissao: "2022-05-20",
    ativo: true,
  },
  {
    id: 4,
    nome: "Carlos Oliveira",
    cargo: "Auxiliar de Cozinha",
    email: "carlos.oliveira@escola.edu.br",
    telefone: "(11) 9999-4444",
    cpf: "789.123.456-00",
    dataAdmissao: "2023-02-01",
    ativo: false,
  },
]

export function FuncionariosModule() {
  const [showForm, setShowForm] = useState(false)
  const [selectedFuncionario, setSelectedFuncionario] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFuncionarios = funcionariosData.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (funcionario: any) => {
    setSelectedFuncionario(funcionario)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      console.log("Excluindo funcionário:", id)
    }
  }

  const handleNew = () => {
    setSelectedFuncionario(null)
    setShowForm(true)
  }

  if (showForm) {
    return (
      <FuncionarioForm
        funcionario={selectedFuncionario}
        onCancel={() => setShowForm(false)}
        onSave={() => setShowForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Funcionários</CardTitle>
              <CardDescription>Gerencie os funcionários da instituição</CardDescription>
            </div>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredFuncionarios.map((funcionario) => (
              <Card key={funcionario.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{funcionario.nome}</CardTitle>
                        <CardDescription>{funcionario.cargo}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={funcionario.ativo ? "default" : "secondary"}>
                      {funcionario.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{funcionario.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{funcionario.telefone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CPF:</span>
                      <span className="ml-1">{funcionario.cpf}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Admissão: {new Date(funcionario.dataAdmissao).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(funcionario)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(funcionario.id)}>
                        <Trash2 className="h-4 w-4" />
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
