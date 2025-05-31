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
import { Plus, Search, MoreHorizontal, Edit, Trash2, UserPlus, Shield, Users } from "lucide-react"
import { UsuarioForm } from "./usuario-form"

interface Usuario {
  id: string
  nome: string
  email: string
  cargo: string
  tipo: "admin" | "nutricionista" | "cozinheiro" | "diretor"
  status: "ativo" | "inativo"
  ultimoAcesso: string
}

const usuariosMock: Usuario[] = [
  {
    id: "1",
    nome: "Maria Silva",
    email: "maria.silva@escola.edu.br",
    cargo: "Nutricionista",
    tipo: "nutricionista",
    status: "ativo",
    ultimoAcesso: "2024-01-15",
  },
  {
    id: "2",
    nome: "João Santos",
    email: "joao.santos@escola.edu.br",
    cargo: "Diretor",
    tipo: "diretor",
    status: "ativo",
    ultimoAcesso: "2024-01-14",
  },
]

export function UsuariosModule() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosMock)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUsuario = (novoUsuario: Omit<Usuario, "id">) => {
    const usuario: Usuario = {
      ...novoUsuario,
      id: Date.now().toString(),
    }
    setUsuarios([...usuarios, usuario])
    setIsDialogOpen(false)
  }

  const handleEditUsuario = (usuarioAtualizado: Omit<Usuario, "id">) => {
    if (editingUsuario) {
      setUsuarios(
        usuarios.map((u) => (u.id === editingUsuario.id ? { ...usuarioAtualizado, id: editingUsuario.id } : u)),
      )
      setEditingUsuario(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteUsuario = (id: string) => {
    setUsuarios(usuarios.filter((u) => u.id !== id))
  }

  const getTipoColor = (tipo: Usuario["tipo"]) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      nutricionista: "bg-green-100 text-green-800",
      cozinheiro: "bg-blue-100 text-blue-800",
      diretor: "bg-purple-100 text-purple-800",
    }
    return colors[tipo]
  }

  const getTipoIcon = (tipo: Usuario["tipo"]) => {
    const icons = {
      admin: Shield,
      nutricionista: Users,
      cozinheiro: Users,
      diretor: UserPlus,
    }
    const Icon = icons[tipo]
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {/* Header com estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.filter((u) => u.status === "ativo").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.filter((u) => u.tipo === "admin").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nutricionistas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.filter((u) => u.tipo === "nutricionista").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUsuario(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingUsuario ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
              <DialogDescription>
                {editingUsuario
                  ? "Edite as informações do usuário abaixo."
                  : "Preencha as informações para criar um novo usuário."}
              </DialogDescription>
            </DialogHeader>
            <UsuarioForm
              usuario={editingUsuario}
              onSubmit={editingUsuario ? handleEditUsuario : handleAddUsuario}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingUsuario(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>Gerencie os usuários e suas permissões no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.cargo}</TableCell>
                  <TableCell>
                    <Badge className={getTipoColor(usuario.tipo)}>
                      <div className="flex items-center gap-1">
                        {getTipoIcon(usuario.tipo)}
                        {usuario.tipo}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={usuario.status === "ativo" ? "default" : "secondary"}>{usuario.status}</Badge>
                  </TableCell>
                  <TableCell>{usuario.ultimoAcesso}</TableCell>
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
                            setEditingUsuario(usuario)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUsuario(usuario.id)} className="text-red-600">
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
