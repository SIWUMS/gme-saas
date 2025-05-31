"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"

const refeicoesPadrao = [
  { id: 1, nome: "Café da Manhã", horario: "07:30" },
  { id: 2, nome: "Lanche da Manhã", horario: "09:30" },
  { id: 3, nome: "Almoço", horario: "11:30" },
  { id: 4, nome: "Lanche da Tarde", horario: "14:30" },
  { id: 5, nome: "Jantar", horario: "17:30" },
]

export function CardapioForm() {
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [refeicoes, setRefeicoes] = useState(refeicoesPadrao)

  const adicionarRefeicao = () => {
    const novaRefeicao = {
      id: Date.now(),
      nome: "",
      horario: "",
    }
    setRefeicoes([...refeicoes, novaRefeicao])
  }

  const removerRefeicao = (id: number) => {
    setRefeicoes(refeicoes.filter((r) => r.id !== id))
  }

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo Cardápio</CardTitle>
          <CardDescription>Preencha as informações básicas do cardápio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Cardápio</Label>
              <Input id="nome" placeholder="Ex: Cardápio Creche - Junho 2024" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faixa-etaria">Faixa Etária</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa etária" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-3">0-3 anos (Creche)</SelectItem>
                  <SelectItem value="4-5">4-5 anos (Pré-escola)</SelectItem>
                  <SelectItem value="6-14">6-14 anos (Fundamental)</SelectItem>
                  <SelectItem value="15-17">15-17 anos (Médio)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? formatarData(dataInicio) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Data de Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? formatarData(dataFim) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataFim} onSelect={setDataFim} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" placeholder="Observações gerais sobre o cardápio..." rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Refeições</CardTitle>
              <CardDescription>Configure as refeições e horários</CardDescription>
            </div>
            <Button onClick={adicionarRefeicao} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Refeição
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {refeicoes.map((refeicao) => (
              <div key={refeicao.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <Input placeholder="Nome da refeição" defaultValue={refeicao.nome} />
                </div>
                <div className="w-32">
                  <Input type="time" defaultValue={refeicao.horario} />
                </div>
                <Button variant="outline" size="sm" onClick={() => removerRefeicao(refeicao.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Cardápio</Button>
      </div>
    </div>
  )
}
