"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Webhook, Key, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ConfiguracoesIntegracoes() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "API TACO",
      description: "Tabela Brasileira de Composição de Alimentos",
      status: "connected",
      url: "https://api.taco.gov.br",
      apiKey: "taco_key_123456",
      enabled: true,
      lastSync: "2024-01-15 14:30:00",
    },
    {
      id: 2,
      name: "WhatsApp Business",
      description: "Notificações via WhatsApp",
      status: "disconnected",
      url: "https://api.whatsapp.com",
      apiKey: "",
      enabled: false,
      lastSync: null,
    },
    {
      id: 3,
      name: "SMS Gateway",
      description: "Envio de SMS para notificações",
      status: "connected",
      url: "https://api.smsgateway.com",
      apiKey: "sms_key_789012",
      enabled: true,
      lastSync: "2024-01-15 12:15:00",
    },
    {
      id: 4,
      name: "Google Analytics",
      description: "Análise de uso do sistema",
      status: "connected",
      url: "https://analytics.google.com",
      apiKey: "GA_TRACKING_ID",
      enabled: true,
      lastSync: "2024-01-15 15:00:00",
    },
  ])

  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: "Notificação de Backup",
      url: "https://hooks.slack.com/backup-notifications",
      events: ["backup.completed", "backup.failed"],
      enabled: true,
      lastTriggered: "2024-01-15 02:00:00",
    },
    {
      id: 2,
      name: "Alertas de Sistema",
      url: "https://discord.com/api/webhooks/system-alerts",
      events: ["system.error", "system.warning"],
      enabled: true,
      lastTriggered: "2024-01-14 18:45:00",
    },
    {
      id: 3,
      name: "Relatórios Mensais",
      url: "https://api.reports.com/monthly",
      events: ["report.monthly"],
      enabled: false,
      lastTriggered: null,
    },
  ])

  const [apiConfig, setApiConfig] = useState({
    enablePublicApi: true,
    requireApiKey: true,
    rateLimitPerMinute: 100,
    allowedOrigins: "https://app.escola.com, https://mobile.escola.com",
    apiVersion: "v1",
  })

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Configurações salvas",
        description: "As configurações de integrações foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações de integrações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestIntegration = async (integrationId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Teste realizado",
        description: "Integração testada com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Falha na integração. Verifique as configurações.",
        variant: "destructive",
      })
    }
  }

  const handleTestWebhook = async (webhookId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Webhook testado",
        description: "Webhook enviado com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro no webhook",
        description: "Falha ao enviar webhook.",
        variant: "destructive",
      })
    }
  }

  const toggleIntegration = (id: number) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, enabled: !integration.enabled } : integration,
      ),
    )
  }

  const toggleWebhook = (id: number) => {
    setWebhooks((prev) =>
      prev.map((webhook) => (webhook.id === id ? { ...webhook, enabled: !webhook.enabled } : webhook)),
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="external" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="external">Integrações Externas</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api">API Pública</TabsTrigger>
        </TabsList>

        <TabsContent value="external" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Integrações Externas
              </CardTitle>
              <CardDescription>Configure integrações com serviços externos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                        <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                          {integration.status === "connected" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Conectado
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Desconectado
                            </>
                          )}
                        </Badge>
                      </div>
                      <Switch checked={integration.enabled} onCheckedChange={() => toggleIntegration(integration.id)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        <Label>URL da API</Label>
                        <Input value={integration.url} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Chave da API</Label>
                        <Input type="password" value={integration.apiKey} placeholder="Insira a chave da API" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {integration.lastSync ? `Última sincronização: ${integration.lastSync}` : "Nunca sincronizado"}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleTestIntegration(integration.id)}>
                          Testar
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Documentação
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>Configure webhooks para notificações automáticas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{webhook.name}</h4>
                        <p className="text-sm text-muted-foreground">Eventos: {webhook.events.join(", ")}</p>
                      </div>
                      <Switch checked={webhook.enabled} onCheckedChange={() => toggleWebhook(webhook.id)} />
                    </div>

                    <div className="space-y-2 mb-3">
                      <Label>URL do Webhook</Label>
                      <Input value={webhook.url} placeholder="https://exemplo.com/webhook" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {webhook.lastTriggered ? `Último disparo: ${webhook.lastTriggered}` : "Nunca disparado"}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleTestWebhook(webhook.id)}>
                        Testar Webhook
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  + Adicionar Novo Webhook
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Pública
              </CardTitle>
              <CardDescription>Configure o acesso à API pública do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enablePublicApi"
                  checked={apiConfig.enablePublicApi}
                  onCheckedChange={(checked) => setApiConfig((prev) => ({ ...prev, enablePublicApi: checked }))}
                />
                <Label htmlFor="enablePublicApi">Habilitar API pública</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requireApiKey"
                  checked={apiConfig.requireApiKey}
                  onCheckedChange={(checked) => setApiConfig((prev) => ({ ...prev, requireApiKey: checked }))}
                />
                <Label htmlFor="requireApiKey">Exigir chave de API</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rateLimitPerMinute">Limite de requisições/min</Label>
                  <Input
                    id="rateLimitPerMinute"
                    type="number"
                    min="10"
                    max="1000"
                    value={apiConfig.rateLimitPerMinute}
                    onChange={(e) =>
                      setApiConfig((prev) => ({ ...prev, rateLimitPerMinute: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiVersion">Versão da API</Label>
                  <Input
                    id="apiVersion"
                    value={apiConfig.apiVersion}
                    onChange={(e) => setApiConfig((prev) => ({ ...prev, apiVersion: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedOrigins">Origens Permitidas (CORS)</Label>
                <Input
                  id="allowedOrigins"
                  value={apiConfig.allowedOrigins}
                  onChange={(e) => setApiConfig((prev) => ({ ...prev, allowedOrigins: e.target.value }))}
                  placeholder="https://exemplo.com, https://app.exemplo.com"
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Endpoints Disponíveis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">GET /api/v1/cardapios</span>
                    <Badge variant="outline">Público</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">GET /api/v1/alimentos</span>
                    <Badge variant="outline">Público</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">POST /api/v1/consumo</span>
                    <Badge variant="secondary">Autenticado</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">GET /api/v1/relatorios</span>
                    <Badge variant="secondary">Autenticado</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Documentação da API
                </Button>
                <Button variant="outline" className="flex-1">
                  Gerar Nova Chave
                </Button>
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
