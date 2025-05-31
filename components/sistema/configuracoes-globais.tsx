"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConfiguracoesGlobais() {
  const [config, setConfig] = useState({
    nomeSistema: "Sistema de Refeições SaaS",
    versao: "1.0.0",
    urlSistema: "https://refeicoes.saas.com",
    suporteEmail: "suporte@refeicoes.saas.com",
    suporteTelefone: "(11) 9999-0000",

    // Configurações de Trial
    diasTrial: 30,
    permitirTrial: true,
    limiteTrial: 50, // limite de alunos no trial

    // Configurações de Backup
    backupAutomatico: true,
    frequenciaBackup: "diario",
    manterBackups: 30,

    // Configurações de Manutenção
    modoManutencao: false,
    mensagemManutencao: "Sistema em manutenção. Voltaremos em breve.",

    // Configurações de Log
    nivelLog: "info",
    manterLogs: 90,

    // Configurações de Performance
    cacheAtivo: true,
    tempoCache: 3600,
    limiteTaxaRequisicoes: 1000,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Salvando configurações globais:", config)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Globais do Sistema</CardTitle>
        <CardDescription>Configurações que afetam todo o sistema SaaS</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h4 className="font-medium mb-4">Informações Básicas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome-sistema">Nome do Sistema</Label>
                <Input
                  id="nome-sistema"
                  value={config.nomeSistema}
                  onChange={(e) => setConfig({ ...config, nomeSistema: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="versao">Versão</Label>
                <Input
                  id="versao"
                  value={config.versao}
                  onChange={(e) => setConfig({ ...config, versao: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="url-sistema">URL do Sistema</Label>
                <Input
                  id="url-sistema"
                  value={config.urlSistema}
                  onChange={(e) => setConfig({ ...config, urlSistema: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Configurações de Suporte */}
          <div>
            <h4 className="font-medium mb-4">Suporte</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="suporte-email">Email de Suporte</Label>
                <Input
                  id="suporte-email"
                  type="email"
                  value={config.suporteEmail}
                  onChange={(e) => setConfig({ ...config, suporteEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suporte-telefone">Telefone de Suporte</Label>
                <Input
                  id="suporte-telefone"
                  value={config.suporteTelefone}
                  onChange={(e) => setConfig({ ...config, suporteTelefone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Configurações de Trial */}
          <div>
            <h4 className="font-medium mb-4">Trial/Teste Gratuito</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="permitir-trial"
                  checked={config.permitirTrial}
                  onCheckedChange={(checked) => setConfig({ ...config, permitirTrial: checked as boolean })}
                />
                <Label htmlFor="permitir-trial">Permitir período de teste gratuito</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dias-trial">Dias de Trial</Label>
                  <Input
                    id="dias-trial"
                    type="number"
                    value={config.diasTrial}
                    onChange={(e) => setConfig({ ...config, diasTrial: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limite-trial">Limite de Alunos no Trial</Label>
                  <Input
                    id="limite-trial"
                    type="number"
                    value={config.limiteTrial}
                    onChange={(e) => setConfig({ ...config, limiteTrial: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configurações de Backup */}
          <div>
            <h4 className="font-medium mb-4">Backup</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="backup-automatico"
                  checked={config.backupAutomatico}
                  onCheckedChange={(checked) => setConfig({ ...config, backupAutomatico: checked as boolean })}
                />
                <Label htmlFor="backup-automatico">Backup automático</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequencia-backup">Frequência</Label>
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
                  <Label htmlFor="manter-backups">Manter Backups (dias)</Label>
                  <Input
                    id="manter-backups"
                    type="number"
                    value={config.manterBackups}
                    onChange={(e) => setConfig({ ...config, manterBackups: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configurações de Manutenção */}
          <div>
            <h4 className="font-medium mb-4">Manutenção</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="modo-manutencao"
                  checked={config.modoManutencao}
                  onCheckedChange={(checked) => setConfig({ ...config, modoManutencao: checked as boolean })}
                />
                <Label htmlFor="modo-manutencao">Modo manutenção ativo</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensagem-manutencao">Mensagem de Manutenção</Label>
                <Textarea
                  id="mensagem-manutencao"
                  value={config.mensagemManutencao}
                  onChange={(e) => setConfig({ ...config, mensagemManutencao: e.target.value })}
                  rows={3}
                />
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
