"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Pencil, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Definição do schema de validação
const turmaFormSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome da turma deve ter pelo menos 2 caracteres.",
  }),
  serie: z.string().min(1, {
    message: "A série é obrigatória.",
  }),
  quantidadeEstudantes: z.coerce
    .number()
    .min(1, {
      message: "A turma deve ter pelo menos 1 estudante.",
    })
    .max(100, {
      message: "A quantidade máxima é de 100 estudantes por turma.",
    }),
  turno: z.enum(["matutino", "vespertino", "noturno", "integral"], {
    required_error: "Selecione um turno.",
  }),
  professorResponsavel: z
    .string()
    .min(2, {
      message: "O nome do professor deve ter pelo menos 2 caracteres.",
    })
    .optional(),
  sala: z.string().optional(),
  observacoes: z.string().optional(),
})

type TurmaFormValues = z.infer<typeof turmaFormSchema>

// Dados de exemplo para turmas
const turmasIniciais = [
  {
    id: 1,
    nome: "1º Ano A",
    serie: "1º Ano",
    quantidadeEstudantes: 25,
    turno: "matutino",
    professorResponsavel: "Maria Silva",
    sala: "Sala 101",
    observacoes: "",
  },
  {
    id: 2,
    nome: "2º Ano B",
    serie: "2º Ano",
    quantidadeEstudantes: 28,
    turno: "vespertino",
    professorResponsavel: "João Pereira",
    sala: "Sala 102",
    observacoes: "",
  },
  {
    id: 3,
    nome: "3º Ano C",
    serie: "3º Ano",
    quantidadeEstudantes: 30,
    turno: "integral",
    professorResponsavel: "Ana Souza",
    sala: "Sala 103",
    observacoes: "Turma participante do projeto de educação integral",
  },
]

// Função para obter o label do turno
function getTurnoLabel(turno: string) {
  const turnos = {
    matutino: "Matutino",
    vespertino: "Vespertino",
    noturno: "Noturno",
    integral: "Integral",
  }
  return turnos[turno as keyof typeof turnos] || turno
}

// Função para obter a cor do badge do turno
function getTurnoBadgeClass(turno: string) {
  const classes = {
    matutino: "bg-yellow-500 hover:bg-yellow-600",
    vespertino: "bg-orange-500 hover:bg-orange-600",
    noturno: "bg-blue-800 hover:bg-blue-900",
    integral: "bg-green-600 hover:bg-green-700",
  }
  return classes[turno as keyof typeof classes] || "bg-gray-500 hover:bg-gray-600"
}

export function TurmasModule() {
  const [turmas, setTurmas] = useState(turmasIniciais)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTurma, setEditingTurma] = useState<(typeof turmas)[0] | null>(null)

  // Configuração do formulário
  const form = useForm<TurmaFormValues>({
    resolver: zodResolver(turmaFormSchema),
    defaultValues: {
      nome: "",
      serie: "",
      quantidadeEstudantes: 0,
      turno: "matutino",
      professorResponsavel: "",
      sala: "",
      observacoes: "",
    },
  })

  // Função para abrir o formulário de edição
  function handleEdit(turma: (typeof turmas)[0]) {
    setEditingTurma(turma)
    form.reset({
      nome: turma.nome,
      serie: turma.serie,
      quantidadeEstudantes: turma.quantidadeEstudantes,
      turno: turma.turno,
      professorResponsavel: turma.professorResponsavel,
      sala: turma.sala,
      observacoes: turma.observacoes,
    })
    setIsDialogOpen(true)
  }

  // Função para abrir o formulário de nova turma
  function handleNew() {
    setEditingTurma(null)
    form.reset({
      nome: "",
      serie: "",
      quantidadeEstudantes: 0,
      turno: "matutino",
      professorResponsavel: "",
      sala: "",
      observacoes: "",
    })
    setIsDialogOpen(true)
  }

  // Função para excluir uma turma
  function handleDelete(id: number) {
    if (confirm("Tem certeza que deseja excluir esta turma?")) {
      setTurmas(turmas.filter((turma) => turma.id !== id))
      toast({
        title: "Turma excluída",
        description: "A turma foi excluída com sucesso.",
      })
    }
  }

  // Função para salvar o formulário
  function onSubmit(data: TurmaFormValues) {
    if (editingTurma) {
      // Atualizar turma existente
      setTurmas(turmas.map((turma) => (turma.id === editingTurma.id ? { ...turma, ...data } : turma)))
      toast({
        title: "Turma atualizada",
        description: `A turma ${data.nome} foi atualizada com sucesso.`,
      })
    } else {
      // Criar nova turma
      const newId = Math.max(0, ...turmas.map((t) => t.id)) + 1
      setTurmas([...turmas, { id: newId, ...data }])
      toast({
        title: "Turma criada",
        description: `A turma ${data.nome} foi criada com sucesso.`,
      })
    }
    setIsDialogOpen(false)
  }

  // Calcular estatísticas
  const totalEstudantes = turmas.reduce((sum, turma) => sum + turma.quantidadeEstudantes, 0)
  const turmasPorTurno = turmas.reduce(
    (acc, turma) => {
      acc[turma.turno] = (acc[turma.turno] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total de Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{turmas.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total de Estudantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEstudantes}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Média por Turma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{turmas.length ? Math.round(totalEstudantes / turmas.length) : 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-700 to-blue-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Turnos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {Object.entries(turmasPorTurno).map(([turno, quantidade]) => (
              <div key={turno} className="flex justify-between items-center">
                <span>{getTurnoLabel(turno)}</span>
                <Badge className={getTurnoBadgeClass(turno)}>{quantidade}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Cabeçalho da tabela */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Lista de Turmas</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie as turmas da sua escola e a quantidade de estudantes por turno.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingTurma ? "Editar Turma" : "Nova Turma"}</DialogTitle>
              <DialogDescription>
                {editingTurma
                  ? "Edite as informações da turma existente."
                  : "Preencha as informações para criar uma nova turma."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Turma</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1º Ano A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Série</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1º Ano" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantidadeEstudantes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de Estudantes</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={100} placeholder="Ex: 25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="turno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Turno</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um turno" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="matutino">Matutino</SelectItem>
                            <SelectItem value="vespertino">Vespertino</SelectItem>
                            <SelectItem value="noturno">Noturno</SelectItem>
                            <SelectItem value="integral">Integral</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="professorResponsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professor Responsável</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Maria Silva" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sala"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sala</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Sala 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Input placeholder="Observações adicionais" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    {editingTurma ? "Salvar Alterações" : "Criar Turma"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de turmas */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead>Nome</TableHead>
              <TableHead>Série</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead className="text-center">Estudantes</TableHead>
              <TableHead>Professor</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turmas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Nenhuma turma cadastrada. Clique em "Nova Turma" para adicionar.
                </TableCell>
              </TableRow>
            ) : (
              turmas.map((turma) => (
                <TableRow key={turma.id}>
                  <TableCell className="font-medium">{turma.nome}</TableCell>
                  <TableCell>{turma.serie}</TableCell>
                  <TableCell>
                    <Badge className={getTurnoBadgeClass(turma.turno)}>{getTurnoLabel(turma.turno)}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 mr-1 text-blue-600" />
                      {turma.quantidadeEstudantes}
                    </div>
                  </TableCell>
                  <TableCell>{turma.professorResponsavel}</TableCell>
                  <TableCell>{turma.sala}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(turma)}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(turma.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
