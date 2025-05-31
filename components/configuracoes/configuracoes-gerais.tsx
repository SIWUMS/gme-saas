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

export function ConfiguracoesGerais() {
  const [config, setConfig] = useState({
    // Configurações de Cardápio
    diasAntecedenciaCardapio: 7,
    aprovacaoObrigatoria: true,
    permitirEdicaoCardapioAprovado: false,

    // Configurações de Estoque
    alertaEstoqueBaixo: true,
    diasAlertaVencimento: 30,
    controleValidade: true,

    // Configurações de Relatórios
    formatoPadraoRelatorio: "pdf",
    incluirLogoRelatorios: true,
    assinaturaDigital: false,

    // Configurações de Notificações
    notificacaoEmail: true,
    notificacaoEstoqueBaixo: true,
    notificacaoVencimento: true,

    // Configurações de Sistema
    backupAutomatico: true,
    frequenciaBackup: "diario",
    manterHistorico: 365,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Salvando configurações:", config)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
        <CardDescription>Personalize o comportamento do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Configurações de Cardápio */}
          <div>
            <h4 className="font-medium mb-4">Cardápios</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dias-antecedencia">Dias de Antecedência para Cardápio</Label>
                  <Input
                    id="dias-antecedencia"
                    type="number"
                    value={config.diasAntecedenciaCardapio}
                    onChange={(e) =>
                      setConfig({ ...config, diasAntecedenciaCardapio: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aprovacao-obrigatoria"
                    checked={config.aprovacaoObrigatoria}
                    onCheckedChange={(checked) => setConfig({ ...config, aprovacaoObrigatoria: checked as boolean })}
                  />
                  <Label htmlFor="aprovacao-obrigatoria">Aprovação obrigatória para cardápios</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edicao-aprovado"
                    checked={config.permitirEdicaoCardapioAprovado}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, permitirEdicaoCardapioAprovado: checked as boolean })
                    }
                  />
                  <Label htmlFor="edicao-aprovado">Permitir edição de cardápio aprovado</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configurações de Estoque */}
          <div>
            <h4 className="font-medium mb-4">Estoque</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dias-vencimento">Dias para Alerta de Vencimento</Label>
                  <Input
                    id="dias-vencimento"
                    type="number"
                    value={config.diasAlertaVencimento}
                    onChange={(e) => setConfig({ ...config, diasAlertaVencimento: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alerta-estoque"
                    checked={config.alertaEstoqueBaixo}
                    onCheckedChange={(checked) => setConfig({ ...config, alertaEstoqueBaixo: checked as boolean })}
                  />
                  <Label htmlFor="alerta-estoque">Alertas de estoque baixo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="controle-validade"
                    checked={config.controleValidade}
                    onCheckedChange={(checked) => setConfig({ ...config, controleValidade: checked as boolean })}
                  />
                  <Label htmlFor="controle-validade">Controle de validade</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configurações de Relatórios */}
          <div>
            <h4 className="font-medium mb-4">Relatórios</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formato-relatorio">Formato Padrão</Label>
                  <Select
                    value={config.formatoPadraoRelatorio}
                    onValueChange={(value) => setConfig({ ...config, formatoPadraoRelatorio: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="logo-relatorios"
                    checked={config.incluirLogoRelatorios}
                    onCheckedChange={(checked) => setConfig({ ...config, incluirLogoRelatorios: checked as boolean })}
                  />
                  <Label htmlFor="logo-relatorios">Incluir logo nos relatórios</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="assinatura-digital"
                    checked={config.assinaturaDigital}
                    onCheckedChange={(checked) => setConfig({ ...config, assinaturaDigital: checked as boolean })}
                  />
                  <Label htmlFor="assinatura-digital">Assinatura digital nos relatórios</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configurações de Notificações */}
          <div>
            <h4 className="font-medium mb-4">Notificações</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notificacao-email"
                  checked={config.notificacaoEmail}
                  onCheckedChange={(checked) => setConfig({ ...config, notificacaoEmail: checked as boolean })}
                />
                <Label htmlFor="notificacao-email">Notificações por email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notif-estoque"
                  checked={config.notificacaoEstoqueBaixo}
                  onCheckedChange={(checked) => setConfig({ ...config, notificacaoEstoqueBaixo: checked as boolean })}
                />
                <Label htmlFor="notif-estoque">Notificar estoque baixo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notif-vencimento"
                  checked={config.notificacaoVencimento}
                  onCheckedChange={(checked) => setConfig({ ...config, notificacaoVencimento: checked as boolean })}
                />
                <Label htmlFor="notif-vencimento">Notificar produtos vencendo</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configurações de Sistema */}
          <div>
            <h4 className="font-medium mb-4">Sistema</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequencia-backup">Frequência de Backup</Label>
                  <Select
                    value={config.frequenciaBackup}
                    onValueChange={(value) => setConfig({ ...config, frequenciaBackup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manter-historico">Manter Histórico (dias)</Label>
                  <Input
                    id="manter-historico"
                    type="number"
                    value={config.manterHistorico}
                    onChange={(e) => setConfig({ ...config, manterHistorico: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backup-automatico"
                  checked={config.backupAutomatico}
                  onCheckedChange={(checked) => setConfig({ ...config, backupAutomatico: checked as boolean })}
                />
                <Label htmlFor="backup-automatico">Backup automático</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Salvar Configurações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
