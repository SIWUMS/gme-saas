"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface EscolaFormProps {
  escola?: any
}

export function EscolaForm({ escola }: EscolaFormProps) {
  const [formData, setFormData] = useState({
    // Dados da Escola/Empresa
    nome: escola?.nome || "",
    codigo: escola?.codigo || "",
    cnpj: escola?.cnpj || "",
    tipoInstituicao: escola?.tipoInstituicao || "",
    endereco: escola?.endereco || "",
    cidade: escola?.cidade || "",
    estado: escola?.estado || "",
    cep: escola?.cep || "",
    telefone: escola?.telefone || "",
    email: escola?.email || "",
    totalAlunos: escola?.totalAlunos || "",

    // Dados do Contrato
    plano: escola?.plano || "Basic",
    valorMensal: escola?.valorMensal || "",
    dataContrato: escola?.dataContrato || "",
    dataVencimento: escola?.dataVencimento || "",
    status: escola?.status || "trial",

    // Dados do Admin
    adminNome: escola?.admin?.nome || "",
    adminEmail: escola?.admin?.email || "",
    adminTelefone: escola?.admin?.telefone || "",

    // Observações
    observacoes: escola?.observacoes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Salvando escola/empresa:", formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{escola ? "Editar Cliente" : "Nova Escola/Empresa"}</CardTitle>
        <CardDescription>
          {escola ? "Atualize as informações do cliente" : "Cadastre uma nova escola ou empresa no sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados da Instituição */}
          <div>
            <h4 className="font-medium mb-4">Dados da Instituição</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Instituição</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Instituição</Label>
                <Select
                  value={formData.tipoInstituicao}
                  onValueChange={(value) => setFormData({ ...formData, tipoInstituicao: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="municipal">Escola Municipal</SelectItem>
                    <SelectItem value="estadual">Escola Estadual</SelectItem>
                    <SelectItem value="federal">Escola Federal</SelectItem>
                    <SelectItem value="privada">Escola Privada</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                    <SelectItem value="ong">ONG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                    <SelectItem value="SC">Santa Catarina</SelectItem>
                    {/* Adicionar outros estados */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-alunos">Total de Alunos</Label>
                <Input
                  id="total-alunos"
                  type="number"
                  value={formData.totalAlunos}
                  onChange={(e) => setFormData({ ...formData, totalAlunos: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Dados do Contrato */}
          <div>
            <h4 className="font-medium mb-4">Dados do Contrato</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plano">Plano</Label>
                <Select value={formData.plano} onValueChange={(value) => setFormData({ ...formData, plano: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic - R$ 149,90/mês</SelectItem>
                    <SelectItem value="Premium">Premium - R$ 299,90/mês</SelectItem>
                    <SelectItem value="Enterprise">Enterprise - R$ 599,90/mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor-mensal">Valor Mensal (R$)</Label>
                <Input
                  id="valor-mensal"
                  type="number"
                  step="0.01"
                  value={formData.valorMensal}
                  onChange={(e) => setFormData({ ...formData, valorMensal: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="data-contrato">Data do Contrato</Label>
                <Input
                  id="data-contrato"
                  type="date"
                  value={formData.dataContrato}
                  onChange={(e) => setFormData({ ...formData, dataContrato: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-vencimento">Próximo Vencimento</Label>
                <Input
                  id="data-vencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dados do Administrador */}
          <div>
            <h4 className="font-medium mb-4">Administrador da Conta</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-nome">Nome do Administrador</Label>
                <Input
                  id="admin-nome"
                  value={formData.adminNome}
                  onChange={(e) => setFormData({ ...formData, adminNome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email do Administrador</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="admin-telefone">Telefone do Administrador</Label>
                <Input
                  id="admin-telefone"
                  value={formData.adminTelefone}
                  onChange={(e) => setFormData({ ...formData, adminTelefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações adicionais sobre o cliente..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">{escola ? "Atualizar" : "Salvar"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
