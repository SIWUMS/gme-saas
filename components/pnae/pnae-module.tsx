"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Calendar,
  ShoppingCart,
  Gavel,
  Sprout,
  FileText,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
} from "lucide-react"
import Link from "next/link"

export function PnaeModule() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">PNAE - Programa Nacional de Alimentação Escolar</h2>
          <p className="text-muted-foreground">Gestão completa do programa de alimentação escolar</p>
        </div>
        <Badge variant="outline">Versão 2024</Badge>
      </div>

      {/* Indicadores Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recursos Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.847.650,00</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> em relação ao ano anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Atendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.450</div>
            <p className="text-xs text-muted-foreground">Em 47 escolas municipais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agricultura Familiar</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35,2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">✓</span> Acima do mínimo exigido (30%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execução Orçamentária</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87,3%</div>
            <p className="text-xs text-muted-foreground">R$ 2.486.420,00 executados</p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos PNAE */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Distribuição de Recursos
            </CardTitle>
            <CardDescription>Automatize o cálculo dos repasses financeiros baseado no Censo Escolar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Repasses Calculados:</span>
                <span className="font-medium">47 escolas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pendências:</span>
                <Badge variant="outline" className="h-5">
                  2
                </Badge>
              </div>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/pnae/distribuicao">Gerenciar Distribuição</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Planejamento de Cardápio
            </CardTitle>
            <CardDescription>Cardápios automatizados conforme normas nutricionais do PNAE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cardápios Ativos:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Conformidade:</span>
                <Badge variant="default" className="h-5 bg-green-600">
                  98%
                </Badge>
              </div>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/pnae/cardapios">Planejar Cardápios</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
              Lista de Compras
            </CardTitle>
            <CardDescription>Geração automática a partir do cardápio planejado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Listas Geradas:</span>
                <span className="font-medium">8 este mês</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Itens Pendentes:</span>
                <Badge variant="secondary" className="h-5">
                  156
                </Badge>
              </div>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/pnae/compras">Gerenciar Compras</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-orange-600" />
              Licitações
            </CardTitle>
            <CardDescription>Pregão, Dispensa e Chamada Pública com geração automática de documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processos Ativos:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Vencendo em 7 dias:</span>
                <Badge variant="destructive" className="h-5">
                  2
                </Badge>
              </div>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/pnae/licitacoes">Gerenciar Licitações</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-green-700" />
              Agricultura Familiar
            </CardTitle>
            <CardDescription>Acompanhamento do mínimo de 30% de aquisições da agricultura familiar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Percentual Atual:</span>
                <Badge variant="default" className="h-5 bg-green-600">
                  35,2%
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fornecedores:</span>
                <span className="font-medium">23 ativos</span>
              </div>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/pnae/agricultura-familiar">Gerenciar AF</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              Prestação de Contas
            </CardTitle>
            <CardDescription>Acompanhamento em tempo real de repasses, editais e contratos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prestações Pendentes:</span>
                <Badge variant="secondary" className="h-5">
                  3
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Próximo Vencimento:</span>
                <span className="font-medium text-red-600">15/02</span>
              </div>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/pnae/prestacao-contas">Prestação de Contas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transparência e Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Gestão de Dados e Transparência
          </CardTitle>
          <CardDescription>
            Painéis de monitoramento e integração com Portal Nacional de Contratações Públicas (PNCP)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">PNCP Sincronizado</span>
              </div>
              <p className="text-xs text-muted-foreground">Última sincronização: hoje às 14:30</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">3 Alertas Pendentes</span>
              </div>
              <p className="text-xs text-muted-foreground">Verificar conformidade nutricional</p>
            </div>
            <div className="text-right">
              <Button asChild>
                <Link href="/pnae/transparencia">Painel de Transparência</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Status Geral do PNAE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Conformidade Nutricional</p>
              <p className="text-xs text-muted-foreground">Todas as refeições aprovadas</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Execução Financeira</p>
              <p className="text-xs text-muted-foreground">Dentro do cronograma</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Sprout className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Agricultura Familiar</p>
              <p className="text-xs text-muted-foreground">Meta superada</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Ações Pendentes</p>
              <p className="text-xs text-muted-foreground">5 itens para revisar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
