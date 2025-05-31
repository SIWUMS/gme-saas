"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Shield, Zap, Save, RefreshCw, Download, Upload, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function ConfiguracoesSistemaModule() {
  const [systemConfig, setSystemConfig] = useState({
    siteName: "Sistema de Refeições Escolares",
    siteDescription: "Plataforma SaaS para gestão de refeições escolares",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxSchoolsPerPlan: 10,
    maxUsersPerSchool: 50,
    sessionTimeout: 30,
    backupFrequency: "daily",
  })

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "sistema@refeicoes.com",
    smtpPassword: "••••••••",
    fromEmail: "noreply@refeicoes.com",
    fromName: "Sistema Refeições",
  })

  const [securityConfig, setSecurityConfig] = useState({
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorEnabled: false,
  })

  const handleSaveSystem = () => {
    toast.success("Configurações do sistema salvas com sucesso!")
  }

  const handleSaveEmail = () => {
    toast.success("Configurações de email salvas com sucesso!")
  }

  const handleSaveSecurity = () => {
    toast.success("Configurações de segurança salvas com sucesso!")
  }

  const handleBackup = () => {
    toast.success("Backup iniciado com sucesso!")
  }

  const handleRestore = () => {
    toast.success("Restauração iniciada com sucesso!")
  }

  return (
    <div className="space-y-6">
      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-muted-foreground">Escolas Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1,250</div>
              <div className="text-sm text-muted-foreground">Usuários Totais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2.5GB</div>
              <div className="text-sm text-muted-foreground">Uso de Storage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* Configurações Gerais */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configure as informações básicas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Sistema</Label>
                  <Input
                    id="siteName"
                    value={systemConfig.siteName}
                    onChange={(e) => setSystemConfig((prev) => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSchools">Máx. Escolas por Plano</Label>
                  <Input
                    id="maxSchools"
                    type="number"
                    value={systemConfig.maxSchoolsPerPlan}
                    onChange={(e) =>
                      setSystemConfig((prev) => ({ ...prev, maxSchoolsPerPlan: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição do Sistema</Label>
                <Textarea
                  id="siteDescription"
                  value={systemConfig.siteDescription}
                  onChange={(e) => setSystemConfig((prev) => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Ativar para bloquear acesso ao sistema</p>
                  </div>
                  <Switch
                    checked={systemConfig.maintenanceMode}
                    onCheckedChange={(checked) => setSystemConfig((prev) => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro Habilitado</Label>
                    <p className="text-sm text-muted-foreground">Permitir criação de novas contas</p>
                  </div>
                  <Switch
                    checked={systemConfig.registrationEnabled}
                    onCheckedChange={(checked) =>
                      setSystemConfig((prev) => ({ ...prev, registrationEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verificação de Email</Label>
                    <p className="text-sm text-muted-foreground">Exigir verificação de email no registro</p>
                  </div>
                  <Switch
                    checked={systemConfig.emailVerificationRequired}
                    onCheckedChange={(checked) =>
                      setSystemConfig((prev) => ({ ...prev, emailVerificationRequired: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveSystem}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
              <CardDescription>Configure o servidor SMTP para envio de emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Servidor SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={emailConfig.smtpHost}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, smtpHost: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Porta SMTP</Label>
                  <Input
                    id="smtpPort"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, smtpPort: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Usuário SMTP</Label>
                  <Input
                    id="smtpUser"
                    value={emailConfig.smtpUser}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, smtpUser: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Senha SMTP</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailConfig.smtpPassword}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, smtpPassword: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Email Remetente</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailConfig.fromEmail}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, fromEmail: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">Nome Remetente</Label>
                  <Input
                    id="fromName"
                    value={emailConfig.fromName}
                    onChange={(e) => setEmailConfig((prev) => ({ ...prev, fromName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEmail}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Testar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Segurança */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Configure as políticas de segurança do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Tamanho Mínimo da Senha</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securityConfig.passwordMinLength}
                    onChange={(e) =>
                      setSecurityConfig((prev) => ({ ...prev, passwordMinLength: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Máx. Tentativas de Login</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securityConfig.maxLoginAttempts}
                    onChange={(e) =>
                      setSecurityConfig((prev) => ({ ...prev, maxLoginAttempts: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exigir Caracteres Especiais</Label>
                    <p className="text-sm text-muted-foreground">Senha deve conter caracteres especiais</p>
                  </div>
                  <Switch
                    checked={securityConfig.passwordRequireSpecial}
                    onCheckedChange={(checked) =>
                      setSecurityConfig((prev) => ({ ...prev, passwordRequireSpecial: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exigir Números</Label>
                    <p className="text-sm text-muted-foreground">Senha deve conter números</p>
                  </div>
                  <Switch
                    checked={securityConfig.passwordRequireNumbers}
                    onCheckedChange={(checked) =>
                      setSecurityConfig((prev) => ({ ...prev, passwordRequireNumbers: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground">Habilitar 2FA para todos os usuários</p>
                  </div>
                  <Switch
                    checked={securityConfig.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecurityConfig((prev) => ({ ...prev, twoFactorEnabled: checked }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSecurity}>
                <Shield className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup e Restauração</CardTitle>
              <CardDescription>Gerencie backups do sistema e dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Backup Automático</h3>
                  <div className="space-y-2">
                    <Label>Frequência</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={systemConfig.backupFrequency}
                      onChange={(e) => setSystemConfig((prev) => ({ ...prev, backupFrequency: e.target.value }))}
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    Último backup: Hoje às 03:00
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Backup Manual</h3>
                  <div className="space-y-2">
                    <Button onClick={handleBackup} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Criar Backup Agora
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Restaurar Backup
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Backups Disponíveis</h3>
                <div className="space-y-2">
                  {[
                    { name: "backup_2024_01_15.sql", size: "2.5 MB", date: "15/01/2024" },
                    { name: "backup_2024_01_14.sql", size: "2.4 MB", date: "14/01/2024" },
                    { name: "backup_2024_01_13.sql", size: "2.3 MB", date: "13/01/2024" },
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{backup.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {backup.size} • {backup.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações Avançadas */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>Configurações técnicas e de performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Performance</h3>
                  <div className="space-y-2">
                    <Label>Cache TTL (segundos)</Label>
                    <Input type="number" defaultValue="3600" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Conexões DB</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Logs</h3>
                  <div className="space-y-2">
                    <Label>Nível de Log</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="error">Error</option>
                      <option value="warn">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Retenção de Logs (dias)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-red-600">Zona de Perigo</h3>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-red-800">Limpar Cache do Sistema</h4>
                      <p className="text-sm text-red-600">Remove todos os dados em cache</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Limpar Cache
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
