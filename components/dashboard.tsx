"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  Utensils,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function Dashboard() {
  const { user, loading } = useAuth()

  // Dados mockados para demonstração
  const stats = {
    totalStudents: 1250,
    mealsServed: 3750,
    stockItems: 89,
    monthlyBudget: 45000,
    budgetUsed: 32500,
    pendingOrders: 12,
    lowStockItems: 5,
    menuCompliance: 95,
  }

  const recentActivities = [
    {
      id: 1,
      type: "meal",
      description: "Cardápio da semana aprovado",
      time: "2 horas atrás",
      status: "success",
    },
    {
      id: 2,
      type: "stock",
      description: "Estoque de arroz baixo",
      time: "4 horas atrás",
      status: "warning",
    },
    {
      id: 3,
      type: "order",
      description: "Pedido de verduras realizado",
      time: "1 dia atrás",
      status: "info",
    },
    {
      id: 4,
      type: "report",
      description: "Relatório mensal gerado",
      time: "2 dias atrás",
      status: "success",
    },
  ]

  const upcomingMeals = [
    { day: "Segunda", meal: "Arroz, feijão, frango grelhado, salada", students: 320 },
    { day: "Terça", meal: "Macarrão, molho de tomate, carne moída", students: 295 },
    { day: "Quarta", meal: "Arroz, feijão, peixe assado, legumes", students: 310 },
    { day: "Quinta", meal: "Risotto de frango, salada verde", students: 285 },
    { day: "Sexta", meal: "Arroz, feijão, bife acebolado, purê", students: 340 },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getUserRoleDisplay = (role?: string) => {
    switch (role) {
      case "super_admin":
        return "Painel de controle do sistema"
      case "admin":
        return "Painel administrativo da escola"
      case "nutricionista":
        return "Painel de nutrição e cardápios"
      case "estoquista":
        return "Painel de controle de estoque"
      case "servidor":
        return "Painel de registro de refeições"
      default:
        return "Sistema de Refeições Escolares"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="escola-header p-6 rounded-lg">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="escola-card">
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="escola-header p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-blue-900">Bem-vindo, {user?.name || "Usuário"}!</h1>
        <p className="text-blue-700 mt-2">{getUserRoleDisplay(user?.role)}</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="escola-card border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-blue-600">+2.5% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="escola-card border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Refeições Servidas</CardTitle>
            <Utensils className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.mealsServed.toLocaleString()}</div>
            <p className="text-xs text-yellow-600">Hoje: {Math.floor(stats.mealsServed / 30)} refeições</p>
          </CardContent>
        </Card>

        <Card className="escola-card border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Itens em Estoque</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.stockItems}</div>
            <p className="text-xs text-green-600">{stats.lowStockItems} itens com estoque baixo</p>
          </CardContent>
        </Card>

        <Card className="escola-card border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Orçamento Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">R$ {(stats.budgetUsed / 1000).toFixed(1)}k</div>
            <p className="text-xs text-purple-600">
              {Math.round((stats.budgetUsed / stats.monthlyBudget) * 100)}% utilizado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="meals" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Cardápios
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Estoque
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Atividades Recentes */}
            <Card className="escola-card">
              <CardHeader>
                <CardTitle className="text-blue-900">Atividades Recentes</CardTitle>
                <CardDescription>Últimas ações no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      {getStatusIcon(activity.status)}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-blue-900">{activity.description}</p>
                        <p className="text-xs text-blue-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Orçamento */}
            <Card className="escola-card">
              <CardHeader>
                <CardTitle className="text-blue-900">Orçamento Mensal</CardTitle>
                <CardDescription>Utilização do orçamento atual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Utilizado</span>
                    <span className="text-blue-900 font-medium">
                      R$ {stats.budgetUsed.toLocaleString()} / R$ {stats.monthlyBudget.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(stats.budgetUsed / stats.monthlyBudget) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {(stats.monthlyBudget - stats.budgetUsed).toLocaleString()}
                    </div>
                    <p className="text-xs text-blue-600">Disponível</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.pendingOrders}</div>
                    <p className="text-xs text-blue-600">Pedidos Pendentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          <Card className="escola-card">
            <CardHeader>
              <CardTitle className="text-blue-900">Cardápio da Semana</CardTitle>
              <CardDescription>Refeições planejadas para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeals.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          {meal.day}
                        </Badge>
                        <span className="text-sm text-blue-600">{meal.students} alunos</span>
                      </div>
                      <p className="text-sm text-blue-900">{meal.meal}</p>
                    </div>
                    <Button variant="outline" size="sm" className="escola-button-primary">
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="escola-card">
              <CardHeader>
                <CardTitle className="text-blue-900">Status do Estoque</CardTitle>
                <CardDescription>Situação atual dos itens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Itens em Estoque</span>
                    <Badge className="bg-blue-600">{stats.stockItems}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Estoque Baixo</span>
                    <Badge variant="destructive">{stats.lowStockItems}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Pedidos Pendentes</span>
                    <Badge className="bg-yellow-600">{stats.pendingOrders}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="escola-card">
              <CardHeader>
                <CardTitle className="text-blue-900">Conformidade Nutricional</CardTitle>
                <CardDescription>Adequação às diretrizes do PNAE</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.menuCompliance}%</div>
                    <p className="text-sm text-blue-600">Conformidade Geral</p>
                  </div>
                  <Progress value={stats.menuCompliance} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-900">30%</div>
                      <p className="text-xs text-blue-600">Agricultura Familiar</p>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-blue-900">R$ 0,36</div>
                      <p className="text-xs text-blue-600">Custo por Refeição</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="escola-card">
              <CardHeader>
                <CardTitle className="text-blue-900">Relatório Mensal</CardTitle>
                <CardDescription>Resumo do mês atual</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full escola-button-primary">Gerar Relatório</Button>
              </CardContent>
            </Card>

            <Card className="escola-card">
              <CardHeader>
                <CardTitle className="text-blue-900">Prestação de Contas</CardTitle>
                <CardDescription>Relatório PNAE</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full escola-button-secondary">Exportar PNAE</Button>
              </CardContent>
            </Card>

            <Card className="escola-card">
              <CardHeader>
                <CardTitle className="text-blue-900">Análise Nutricional</CardTitle>
                <CardDescription>Relatório nutricional</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full escola-button-primary">Ver Análise</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Alertas e Notificações */}
      {stats.lowStockItems > 0 && (
        <Card className="escola-card border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atenção Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              Existem {stats.lowStockItems} itens com estoque baixo que precisam de reposição.
            </p>
            <Button variant="outline" className="mt-2" size="sm">
              Ver Itens
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
