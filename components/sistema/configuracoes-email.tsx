"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Send, TestTube, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ConfiguracoesEmail() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "sistema@escola.com",
    smtpPassword: "",
    smtpSecure: true,
    fromName: "Sistema Refeições Escolares",
    fromEmail: "noreply@escola.com",
    replyTo: "suporte@escola.com",
  })

  const [templates, setTemplates] = useState({
    welcomeSubject: "Bem-vindo ao Sistema de Refeições",
    welcomeBody:
      "Olá {{nome}},\n\nSeu acesso foi criado com sucesso!\n\nUsuário: {{email}}\nSenha temporária: {{senha}}\n\nPor favor, altere sua senha no primeiro acesso.",
    resetSubject: "Redefinição de Senha",
    resetBody:
      "Olá {{nome}},\n\nClique no link abaixo para redefinir sua senha:\n{{link}}\n\nEste link expira em 24 horas.",
    reportSubject: "Relatório Mensal - {{mes}}/{{ano}}",
    reportBody:
      "Segue em anexo o relatório mensal de {{mes}}/{{ano}}.\n\nResumo:\n- Total de refeições: {{total_refeicoes}}\n- Custo total: R$ {{custo_total}}",
  })

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Configurações salvas",
        description: "As configurações de email foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações de email.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setTestStatus("testing")
    try {
      // Simular teste de conexão
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setTestStatus("success")
      toast({
        title: "Teste realizado",
        description: "Conexão SMTP testada com sucesso!",
      })
    } catch (error) {
      setTestStatus("error")
      toast({
        title: "Erro no teste",
        description: "Falha na conexão SMTP. Verifique as configurações.",
        variant: "destructive",
      })
    }
  }

  const handleSendTestEmail = async () => {
    try {
      // Simular envio de email de teste
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Email de teste enviado",
        description: "Verifique sua caixa de entrada.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar email de teste.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="smtp" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smtp">Configuração SMTP</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="teste">Teste</TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Servidor SMTP
              </CardTitle>
              <CardDescription>Configure o servidor de email para envio de notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Servidor SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={emailConfig.smtpHost}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, smtpHost: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta</Label>
                  <Input
                    id="smtpPort"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, smtpPort: e.target.value }))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Usuário</Label>
                  <Input
                    id="smtpUser"
                    type="email"
                    value={emailConfig.smtpUser}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, smtpUser: e.target.value }))}
                    placeholder="usuario@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Senha</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailConfig.smtpPassword}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, smtpPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="smtpSecure"
                  checked={emailConfig.smtpSecure}
                  onCheckedChange={(checked) => setEmailConfig((prev) => ({ ...prev, smtpSecure: checked }))}
                />
                <Label htmlFor="smtpSecure">Usar conexão segura (TLS/SSL)</Label>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Configurações de Envio</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromName">Nome do Remetente</Label>
                    <Input
                      id="fromName"
                      value={emailConfig.fromName}
                      onChange={(e) => setEmailConfig((prev) => ({ ...prev, fromName: e.target.value }))}
                      placeholder="Sistema Refeições"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email do Remetente</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailConfig.fromEmail}
                      onChange={(e) => setEmailConfig((prev) => ({ ...prev, fromEmail: e.target.value }))}
                      placeholder="noreply@escola.com"
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="replyTo">Email para Resposta</Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={emailConfig.replyTo}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, replyTo: e.target.value }))}
                    placeholder="suporte@escola.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Email</CardTitle>
              <CardDescription>Configure os templates para diferentes tipos de email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email de Boas-vindas</h4>
                <div className="space-y-2">
                  <Label htmlFor="welcomeSubject">Assunto</Label>
                  <Input
                    id="welcomeSubject"
                    value={templates.welcomeSubject}
                    onChange={(e) => setTemplates((prev) => ({ ...prev, welcomeSubject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcomeBody">Corpo do Email</Label>
                  <Textarea
                    id="welcomeBody"
                    rows={4}
                    value={templates.welcomeBody}
                    onChange={(e) => setTemplates((prev) => ({ ...prev, welcomeBody: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Variáveis disponíveis: {`{{nome}}, {{email}}, {{senha}}`}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Redefinição de Senha</h4>
                <div className="space-y-2">
                  <Label htmlFor="resetSubject">Assunto</Label>
                  <Input
                    id="resetSubject"
                    value={templates.resetSubject}
                    onChange={(e) => setTemplates((prev) => ({ ...prev, resetSubject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resetBody">Corpo do Email</Label>
                  <Textarea
                    id="resetBody"
                    rows={4}
                    value={templates.resetBody}
                    onChange={(e) => setTemplates((prev) => ({ ...prev, resetBody: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">Variáveis disponíveis: {`{{nome}}, {{link}}`}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Relatório Mensal</h4>
                <div className="space-y-2">
                  <Label htmlFor="reportSubject">Assunto</Label>
                  <Input
                    id="reportSubject"
                    value={templates.reportSubject}
                    onChange={(e) => setTemplates((prev) => ({ ...prev, reportSubject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportBody">Corpo do Email</Label>
                  <Textarea
                    id="reportBody"
                    rows={4}
                    value={templates.reportBody}
                    onChange={(e) => setTemplates((prev) => ({ ...prev, reportBody: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Variáveis disponíveis: {`{{mes}}, {{ano}}, {{total_refeicoes}}, {{custo_total}}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teste" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Teste de Configuração
              </CardTitle>
              <CardDescription>Teste a conexão SMTP e envio de emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button onClick={handleTestConnection} disabled={testStatus === "testing"} variant="outline">
                  {testStatus === "testing" ? "Testando..." : "Testar Conexão SMTP"}
                </Button>
                {testStatus === "success" && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Conexão OK
                  </Badge>
                )}
                {testStatus === "error" && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Erro na Conexão
                  </Badge>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Enviar Email de Teste</h4>
                <div className="space-y-2">
                  <Label htmlFor="testEmail">Email de Destino</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="teste@exemplo.com"
                    defaultValue={emailConfig.smtpUser}
                  />
                </div>
                <Button onClick={handleSendTestEmail} className="mt-3" disabled={testStatus !== "success"}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Email de Teste
                </Button>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Status da Configuração</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Servidor SMTP:</span>
                    <span className="font-mono">
                      {emailConfig.smtpHost}:{emailConfig.smtpPort}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usuário:</span>
                    <span className="font-mono">{emailConfig.smtpUser}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conexão Segura:</span>
                    <Badge variant={emailConfig.smtpSecure ? "default" : "secondary"}>
                      {emailConfig.smtpSecure ? "Ativada" : "Desativada"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveConfig} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  )
}
