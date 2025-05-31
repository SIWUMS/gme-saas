"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, HardDrive, Download, Upload, Calendar, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ConfiguracoesBanco() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)

  const [backupConfig, setBackupConfig] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupTime: "02:00",
    retentionDays: 30,
    compressBackups: true,
    includeUploads: true,
  })

  const [backupHistory] = useState([
    {
      id: 1,
      filename: "backup_2024-01-15_02-00.sql.gz",
      size: "45.2 MB",
      date: "2024-01-15 02:00:00",
      status: "success",
      type: "automatic",
    },
    {
      id: 2,
      filename: "backup_2024-01-14_02-00.sql.gz",
      size: "44.8 MB",
      date: "2024-01-14 02:00:00",
      status: "success",
      type: "automatic",
    },
    {
      id: 3,
      filename: "backup_manual_2024-01-13_15-30.sql.gz",
      size: "44.5 MB",
      date: "2024-01-13 15:30:00",
      status: "success",
      type: "manual",
    },
    {
      id: 4,
      filename: "backup_2024-01-13_02-00.sql.gz",
      size: "0 MB",
      date: "2024-01-13 02:00:00",
      status: "failed",
      type: "automatic",
    },
  ])

  const [dbStats] = useState({
    totalSize: "2.3 GB",
    tablesCount: 45,
    recordsCount: "1,234,567",
    indexSize: "456 MB",
    lastOptimization: "2024-01-10 03:00:00",
    connectionPool: {
      active: 8,
      idle: 12,
      max: 20,
    },
  })

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Configurações salvas",
        description: "As configurações de backup foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações de backup.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualBackup = async () => {
    setBackupProgress(0)
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          toast({
            title: "Backup concluído",
            description: "Backup manual criado com sucesso.",
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleRestoreBackup = (backupId: number) => {
    toast({
      title: "Restauração iniciada",
      description: "O processo de restauração foi iniciado. Isso pode levar alguns minutos.",
    })
  }

  const handleOptimizeDatabase = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Otimização concluída",
        description: "O banco de dados foi otimizado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao otimizar o banco de dados.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configurações de Backup
                </CardTitle>
                <CardDescription>Configure backups automáticos e manuais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoBackup"
                    checked={backupConfig.autoBackup}
                    onCheckedChange={(checked) => setBackupConfig((prev) => ({ ...prev, autoBackup: checked }))}
                  />
                  <Label htmlFor="autoBackup">Backup automático</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Frequência</Label>
                  <Select
                    value={backupConfig.backupFrequency}
                    onValueChange={(value) => setBackupConfig((prev) => ({ ...prev, backupFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupTime">Horário</Label>
                  <Input
                    id="backupTime"
                    type="time"
                    value={backupConfig.backupTime}
                    onChange={(e) => setBackupConfig((prev) => ({ ...prev, backupTime: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionDays">Retenção (dias)</Label>
                  <Input
                    id="retentionDays"
                    type="number"
                    min="7"
                    max="365"
                    value={backupConfig.retentionDays}
                    onChange={(e) =>
                      setBackupConfig((prev) => ({ ...prev, retentionDays: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="compressBackups"
                      checked={backupConfig.compressBackups}
                      onCheckedChange={(checked) => setBackupConfig((prev) => ({ ...prev, compressBackups: checked }))}
                    />
                    <Label htmlFor="compressBackups">Comprimir backups</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeUploads"
                      checked={backupConfig.includeUploads}
                      onCheckedChange={(checked) => setBackupConfig((prev) => ({ ...prev, includeUploads: checked }))}
                    />
                    <Label htmlFor="includeUploads">Incluir arquivos enviados</Label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={handleManualBackup} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Criar Backup Manual
                  </Button>
                  {backupProgress > 0 && backupProgress < 100 && (
                    <div className="mt-2">
                      <Progress value={backupProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-1">Criando backup... {backupProgress}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Histórico de Backups
                </CardTitle>
                <CardDescription>Backups disponíveis para restauração</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backupHistory.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{backup.filename}</span>
                          <Badge variant={backup.status === "success" ? "default" : "destructive"}>
                            {backup.status === "success" ? "Sucesso" : "Falha"}
                          </Badge>
                          <Badge variant="outline">{backup.type === "automatic" ? "Auto" : "Manual"}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {backup.size} • {backup.date}
                        </div>
                      </div>
                      {backup.status === "success" && (
                        <Button variant="outline" size="sm" onClick={() => handleRestoreBackup(backup.id)}>
                          <Upload className="h-3 w-3 mr-1" />
                          Restaurar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Estatísticas do Banco
                </CardTitle>
                <CardDescription>Informações sobre o banco de dados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tamanho Total</Label>
                    <div className="text-2xl font-bold">{dbStats.totalSize}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Número de Tabelas</Label>
                    <div className="text-2xl font-bold">{dbStats.tablesCount}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Total de Registros</Label>
                    <div className="text-2xl font-bold">{dbStats.recordsCount}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tamanho dos Índices</Label>
                    <div className="text-2xl font-bold">{dbStats.indexSize}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label>Última Otimização</Label>
                  <div className="text-sm text-muted-foreground">{dbStats.lastOptimization}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pool de Conexões</CardTitle>
                <CardDescription>Status das conexões com o banco</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Conexões Ativas</span>
                    <Badge variant="default">{dbStats.connectionPool.active}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conexões Inativas</span>
                    <Badge variant="secondary">{dbStats.connectionPool.idle}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Máximo Permitido</span>
                    <Badge variant="outline">{dbStats.connectionPool.max}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Utilização do Pool</Label>
                  <Progress
                    value={(dbStats.connectionPool.active / dbStats.connectionPool.max) * 100}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    {Math.round((dbStats.connectionPool.active / dbStats.connectionPool.max) * 100)}% utilizado
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Manutenção do Banco
              </CardTitle>
              <CardDescription>Ferramentas de manutenção e otimização</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Otimização</h4>
                  <p className="text-sm text-muted-foreground">Otimiza tabelas e índices para melhor performance</p>
                  <Button onClick={handleOptimizeDatabase} variant="outline" className="w-full">
                    Otimizar Banco de Dados
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Verificação de Integridade</h4>
                  <p className="text-sm text-muted-foreground">Verifica a integridade dos dados e estruturas</p>
                  <Button variant="outline" className="w-full">
                    Verificar Integridade
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Limpeza de Logs</h4>
                  <p className="text-sm text-muted-foreground">Remove logs antigos para liberar espaço</p>
                  <Button variant="outline" className="w-full">
                    Limpar Logs
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Reindexação</h4>
                  <p className="text-sm text-muted-foreground">Reconstrói índices para melhor performance</p>
                  <Button variant="outline" className="w-full">
                    Reindexar Tabelas
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Atenção</h4>
                    <p className="text-sm text-yellow-700">
                      Operações de manutenção podem afetar a performance do sistema temporariamente. Recomenda-se
                      executar durante períodos de baixo uso.
                    </p>
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
