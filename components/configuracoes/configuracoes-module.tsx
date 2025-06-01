"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DadosEscolaForm } from "./dados-escola-form"
import { FuncionariosModule } from "./funcionarios-module"
import { LogoUpload } from "./logo-upload"
import { ConfiguracoesGerais } from "./configuracoes-gerais"
import { School, Users, ImageIcon, Settings } from "lucide-react"

export function ConfiguracoesModule() {
  const [activeTab, setActiveTab] = useState("dados")

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações da Escola</h2>
        <p className="text-muted-foreground">Gerencie as informações e configurações da sua escola</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dados" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Dados da Escola
          </TabsTrigger>
          <TabsTrigger value="funcionarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Logo
          </TabsTrigger>
          <TabsTrigger value="gerais" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações Gerais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Escola</CardTitle>
              <CardDescription>Atualize os dados básicos da sua escola</CardDescription>
            </CardHeader>
            <CardContent>
              <DadosEscolaForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funcionarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Funcionários</CardTitle>
              <CardDescription>Gerencie os funcionários da escola</CardDescription>
            </CardHeader>
            <CardContent>
              <FuncionariosModule />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo da Escola</CardTitle>
              <CardDescription>Faça upload e gerencie o logo da sua escola</CardDescription>
            </CardHeader>
            <CardContent>
              <LogoUpload />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gerais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configure preferências gerais do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ConfiguracoesGerais />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
