"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Package, AlertTriangle, TrendingUp, Calendar, DollarSign, ChefHat } from "lucide-react"

const consumoData = [
  { dia: "Seg", refeicoes: 450, planejado: 500 },
  { dia: "Ter", refeicoes: 480, planejado: 500 },
  { dia: "Qua", refeicoes: 520, planejado: 500 },
  { dia: "Qui", refeicoes: 490, planejado: 500 },
  { dia: "Sex", refeicoes: 470, planejado: 500 },
]

const custoData = [
  { mes: "Jan", custo: 2500 },
  { mes: "Fev", custo: 2800 },
  { mes: "Mar", custo: 2600 },
  { mes: "Abr", custo: 2900 },
  { mes: "Mai", custo: 3100 },
]

const nutrientesData = [
  { name: "Carboidratos", value: 45, color: "#8884d8" },
  { name: "Proteínas", value: 25, color: "#82ca9d" },
  { name: "Gorduras", value: 20, color: "#ffc658" },
  { name: "Fibras", value: 10, color: "#ff7300" },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refeições Hoje</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% em relação a ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">3 itens com estoque baixo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15,240</div>
            <p className="text-xs text-muted-foreground">R$ 12,34 por aluno</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cardápios Ativos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Por faixa etária</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertas do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <p className="font-medium text-orange-800">Estoque Baixo - Arroz</p>
                <p className="text-sm text-orange-600">Apenas 15kg restantes</p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Urgente
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="font-medium text-yellow-800">Vencimento Próximo - Leite</p>
                <p className="text-sm text-yellow-600">Vence em 3 dias</p>
              </div>
              <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                Atenção
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consumo Semanal</CardTitle>
            <CardDescription>Refeições servidas vs planejadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consumoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planejado" fill="#e2e8f0" name="Planejado" />
                <Bar dataKey="refeicoes" fill="#3b82f6" name="Servido" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição Nutricional</CardTitle>
            <CardDescription>Percentual de macronutrientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nutrientesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nutrientesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução de Custos</CardTitle>
          <CardDescription>Custo mensal por aluno</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={custoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${value}`, "Custo"]} />
              <Line type="monotone" dataKey="custo" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às funcionalidades principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <ChefHat className="h-6 w-6" />
              Novo Cardápio
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Package className="h-6 w-6" />
              Entrada Estoque
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              Registrar Consumo
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <TrendingUp className="h-6 w-6" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
