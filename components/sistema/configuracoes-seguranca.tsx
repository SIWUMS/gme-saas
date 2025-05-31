"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Key, Users, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ConfiguracoesSeguranca() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [securityConfig, setSecurityConfig] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 480,
    require2FA: false,
    allowPasswordReset: true,
    forcePasswordChange: false,
  })

  const [auditLogs] = useState([
    {
      id: 1,
      user: "Super Admin",
      action: "Login realizado",
      ip: "192.168.1.100",
      timestamp: "2024-01-15 14:30:25",
      status: "success",
    },
    {
      id: 2,
      user: "admin@escola1.com",
      action: "Tentativa de login falhada",
      ip: "192.168.1.105",
      timestamp: "2024-01-15 14:25:10",
      status: "failed",
    },
    {
      id: 3,
      user: "nutricionista@escola1.com",
      action: "Senha alterada",
      ip: "192.168.1.110",
      timestamp: "2024-01-15 13:45:00",
      status: "success",
    },
    {
      id: 4,
      user: "Sistema",
      action: "Backup automático executado",
      ip: "localhost",
      timestamp: "2024-01-15 02:00:00",
      status: "success",
    },
  ])

  const [activeSessions] = useState([
    {
      id: 1,
      user: "Super Admin",
      ip: "192.168.1.100",
      device: "Chrome - Windows",
      loginTime: "2024-01-15 14:30:25",
      lastActivity: "2024-01-15 15:45:10",
      status: "active",
    },
    {
      id: 2,
      user: "admin@escola1.com",
      ip: "192.168.1.105",
      device: "Firefox - Linux",
      loginTime: "2024-01-15 13:20:15",
      lastActivity: "2024-01-15 15:40:30",
      status: "active",
    },
    {
      id: 3,
      user: "nutricionista@escola1.com",
      ip: "192.168.1.110",
      device: "Safari - macOS",
      loginTime: "2024-01-15 12:15:00",
      lastActivity: "2024-01-15 14:30:45",
      status: "idle",
    },
  ])

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Configurações salvas",
        description: "As configurações de segurança foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações de segurança.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTerminateSession = (sessionId: number) => {
    toast({
      title: "Sessão encerrada",
      description: "A sessão foi encerrada com sucesso.",
    })
  }

  const handleClearLogs = () => {
    toast({
      title: "Logs limpos",
      description: "Os logs de auditoria foram limpos com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="passwords" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="passwords">Senhas</TabsTrigger>
          <TabsTrigger value="access">Controle de Acesso</TabsTrigger>
          <TabsTrigger value="sessions">Sessões Ativas</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="passwords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Políticas de Senha
              </CardTitle>
              <CardDescription>Configure os requisitos de segurança para senhas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Comprimento Mínimo</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="20"
                    value={securityConfig.passwordMinLength}
                    onChange={(e) =>
                      setSecurityConfig((prev) => ({ ...prev, passwordMinLength: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiryDays">Expiração (dias)</Label>
                  <Input
                    id="passwordExpiryDays"
                    type="number"
                    min="30"
                    max="365"
                    value={securityConfig.passwordExpiryDays}
                    onChange={(e) =>
                      setSecurityConfig((prev) => ({ ...prev, passwordExpiryDays: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Requisitos de Caracteres</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireUppercase"
                      checked={securityConfig.passwordRequireUppercase}
                      onCheckedChange={(checked) =>
                        setSecurityConfig((prev) => ({ ...prev, passwordRequireUppercase: checked }))
                      }
                    />
                    <Label htmlFor="requireUppercase">Letras maiúsculas (A-Z)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireLowercase"
                      checked={securityConfig.passwordRequireLowercase}
                      onCheckedChange={(checked) =>
                        setSecurityConfig((prev) => ({ ...prev, passwordRequireLowercase: checked }))
                      }
                    />
                    <Label htmlFor="requireLowercase">Letras minúsculas (a-z)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireNumbers"
                      checked={securityConfig.passwordRequireNumbers}
                      onCheckedChange={(checked) =>
                        setSecurityConfig((prev) => ({ ...prev, passwordRequireNumbers: checked }))
                      }
                    />
                    <Label htmlFor="requireNumbers">Números (0-9)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireSymbols"
                      checked={securityConfig.passwordRequireSymbols}
                      onCheckedChange={(checked) =>
                        setSecurityConfig((prev) => ({ ...prev, passwordRequireSymbols: checked }))
                      }
                    />
                    <Label htmlFor="requireSymbols">Símbolos (!@#$%)</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Outras Configurações</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowPasswordReset"
                      checked={securityConfig.allowPasswordReset}
                      onCheckedChange={(checked) =>
                        setSecurityConfig((prev) => ({ ...prev, allowPasswordReset: checked }))
                      }
                    />
                    <Label htmlFor="allowPasswordReset">Permitir redefinição de senha</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="forcePasswordChange"
                      checked={securityConfig.forcePasswordChange}
                      onCheckedChange={(checked) =>
                        setSecurityConfig((prev) => ({ ...prev, forcePasswordChange: checked }))
                      }
                    />
                    <Label htmlFor="forcePasswordChange">Forçar alteração no primeiro login</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Controle de Acesso
              </CardTitle>
              <CardDescription>Configure tentativas de login e bloqueios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Máximo de Tentativas</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={securityConfig.maxLoginAttempts}
                    onChange={(e) =>
                      setSecurityConfig((prev) => ({ ...prev, maxLoginAttempts: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Duração do Bloqueio (min)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    min="5"
                    max="120"
                    value={securityConfig.lockoutDuration}
                    onChange={(e) =>
                      setSecurityConfig((prev) => ({ ...prev, lockoutDuration: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sessão (min)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="30"
                  max="1440"
                  value={securityConfig.sessionTimeout}
                  onChange={(e) =>
                    setSecurityConfig((prev) => ({ ...prev, sessionTimeout: Number.parseInt(e.target.value) }))
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="require2FA"
                  checked={securityConfig.require2FA}
                  onCheckedChange={(checked) => setSecurityConfig((prev) => ({ ...prev, require2FA: checked }))}
                />
                <Label htmlFor="require2FA">Exigir autenticação de dois fatores (2FA)</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Sessões Ativas
              </CardTitle>
              <CardDescription>Monitore e gerencie sessões de usuários ativos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{session.user}</span>
                        <Badge variant={session.status === "active" ? "default" : "secondary"}>
                          {session.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>
                          IP: {session.ip} • {session.device}
                        </div>
                        <div>
                          Login: {session.loginTime} • Última atividade: {session.lastActivity}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleTerminateSession(session.id)}>
                      Encerrar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Logs de Auditoria
              </CardTitle>
              <CardDescription>Histórico de atividades e eventos de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="login">Login</SelectItem>
                        <SelectItem value="logout">Logout</SelectItem>
                        <SelectItem value="password">Senha</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" onClick={handleClearLogs}>
                    Limpar Logs
                  </Button>
                </div>

                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.user}</span>
                          <Badge variant={log.status === "success" ? "default" : "destructive"}>
                            {log.status === "success" ? "Sucesso" : "Falha"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.action} • IP: {log.ip}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{log.timestamp}</div>
                    </div>
                  ))}
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
