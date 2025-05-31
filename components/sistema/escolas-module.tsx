"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, School, Users, MapPin } from "lucide-react"
import { EscolaForm } from "./escola-form"

interface Escola {
  id: string
  nome: string
  codigo: string
  endereco: string
  cidade: string
  estado: string
  telefone: string
  email: string
  diretor: string
  totalAlunos: number
  status: "ativa" | "inativa"
  plano: "basico" | "premium" | "enterprise"
  dataVencimento: string
}

const escolasMock: Escola[] = [
  {
    id: "1",
    nome: "Escola Municipal João Silva",
    codigo: "EM001",
    endereco: "Rua das Flores, 123",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 1234-5678",
    email: "contato@emjoaosilva.edu.br",
    diretor: "Maria Santos",
    totalAlunos: 450,
    status: "ativa",
    plano: "premium",
    dataVencimento: "2024-12-31",
  },
  {
    id: "2",
    nome: "EMEI Pequenos Sonhos",
    codigo: "EMEI002",
    endereco: "Av. Central, 456",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    telefone: "(21) 9876-5432",
    email: "contato@pequenossonhos.edu.br",
    diretor: "João Oliveira",
    totalAlunos: 180,
    status: "ativa",
    plano: "basico",
    dataVencimento: "2024-06-30",
  },
]

export function EscolasModule() {
  const [escolas, setEscolas] = useState<Escola[]>(escolasMock)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEscola, setEditingEscola] = useState<Escola | null>(null)

  const filteredEscolas = escolas.filter(
    (escola) =>
      escola.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escola.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      escola.cidade.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEscola = (novaEscola: Omit<Escola, "id">) => {
    const escola: Escola = {
      ...novaEscola,
      id: Date.now().toString(),
    }
    setEscolas([...escolas, escola])
    setIsDialogOpen(false)
  }

  const handleEditEscola = (escolaAtualizada: Omit<Escola, "id">) => {
    if (editingEscola) {
      setEscolas(escolas.map((e) => (e.id === editingEscola.id ? { ...escolaAtualizada, id: editingEscola.id } : e)))
      setEditingEscola(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteEscola = (id: string) => {
    setEscolas(escolas.filter((e) => e.id !== id))
  }

  const getPlanoColor = (plano: Escola["plano"]) => {
    const colors = {
      basico: "bg-gray-100 text-gray-800",
      premium: "bg-blue-100 text-blue-800",
      enterprise: "bg-purple-100 text-purple-800",
    }
    return colors[plano]
  }

  const totalAlunos = escolas.reduce((acc, escola) => acc + escola.totalAlunos, 0)
  const escolasAtivas = escolas.filter((e) => e.status === "ativa").length

  return (
    <div className="space-y-4">
      {/* Header com estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Escolas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escolas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas Ativas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escolasAtivas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlunos.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Escola</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {escolas.length > 0 ? Math.round(totalAlunos / escolas.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar escolas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEscola(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Escola
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingEscola ? "Editar Escola" : "Nova Escola"}</DialogTitle>
              <DialogDescription>
                {editingEscola
                  ? "Edite as informações da escola abaixo."
                  : "Preencha as informações para cadastrar uma nova escola."}
              </DialogDescription>
            </DialogHeader>
            <EscolaForm
              escola={editingEscola}
              onSubmit={editingEscola ? handleEditEscola : handleAddEscola}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingEscola(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de escolas */}
      <Card>
        <CardHeader>
          <CardTitle>Escolas Cadastradas</CardTitle>
          <CardDescription>Gerencie todas as escolas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Cidade/Estado</TableHead>
                <TableHead>Diretor</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEscolas.map((escola) => (
                <TableRow key={escola.id}>
                  <TableCell className="font-medium">{escola.nome}</TableCell>
                  <TableCell>{escola.codigo}</TableCell>
                  <TableCell>
                    {escola.cidade}/{escola.estado}
                  </TableCell>
                  <TableCell>{escola.diretor}</TableCell>
                  <TableCell>{escola.totalAlunos}</TableCell>
                  <TableCell>
                    <Badge className={getPlanoColor(escola.plano)}>{escola.plano}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={escola.status === "ativa" ? "default" : "secondary"}>{escola.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingEscola(escola)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteEscola(escola.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
