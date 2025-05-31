"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfiguracoesGlobais } from "./configuracoes-globais"
import { PlanosPrecos } from "./planos-precos"
import { ConfiguracoesEmail } from "./configuracoes-email"
import { ConfiguracoesSeguranca } from "./configuracoes-seguranca"
import { ConfiguracoesBanco } from "./configuracoes-banco"
import { ConfiguracoesIntegracoes } from "./configuracoes-integracoes"
import { Settings, DollarSign, Mail, Shield, Database, Zap } from "lucide-react"

export function ConfiguracoesSistemaModule() {
  const [activeTab, setActiveTab] = useState("globais")

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h2>
        <p className="text-muted-foreground">Configure as definições globais e parâmetros do sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="globais" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Globais
          </TabsTrigger>
          <TabsTrigger value="planos" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            E-mail
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="banco" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Banco
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="globais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>Defina as configurações gerais do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ConfiguracoesGlobais />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planos e Preços</CardTitle>
              <CardDescription>Configure os planos de assinatura e preços</CardDescription>
            </CardHeader>
            <CardContent>
              <PlanosPrecos />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de E-mail</CardTitle>
              <CardDescription>Configure o servidor SMTP e templates de e-mail</CardDescription>
            </CardHeader>
            <CardContent>
              <ConfiguracoesEmail />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Configure políticas de segurança e autenticação</CardDescription>
            </CardHeader>
            <CardContent>
              <ConfiguracoesSeguranca />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banco" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Banco de Dados</CardTitle>
              <CardDescription>Gerencie backups e configurações do banco</CardDescription>
            </CardHeader>
            <CardContent>
              <ConfiguracoesBanco />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Configure integrações com sistemas externos</CardDescription>
            </CardHeader>
            <CardContent>
              <ConfiguracoesIntegracoes />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
