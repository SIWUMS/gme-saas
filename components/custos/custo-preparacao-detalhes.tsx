"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Edit, DollarSign, TrendingUp, Package } from "lucide-react"

interface CustoPreparacaoDetalhesProps {
  preparacao: any
  onClose: () => void
  onEdit: () => void
}

export function CustoPreparacaoDetalhes({ preparacao, onClose, onEdit }: CustoPreparacaoDetalhesProps) {
  const custoIngredientes = preparacao.ingredientes.reduce((total: number, ing: any) => total + ing.custoTotal, 0)
  const outrosCustos = preparacao.custoMaoObra + preparacao.custoEnergia + preparacao.outrosCustos
  const lucroTotal = (preparacao.precoVenda - preparacao.custoPorcao) * preparacao.rendimento

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-xl">{preparacao.nome}</CardTitle>
                <CardDescription>
                  {preparacao.categoria} • Rendimento: {preparacao.rendimento} porções
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-300">
                Margem: {preparacao.margemLucro}%
              </Badge>
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Custo Total</p>
                    <p className="text-xl font-bold">R$ {preparacao.custoTotal.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Custo/Porção</p>
                    <p className="text-xl font-bold">R$ {preparacao.custoPorcao.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Preço Venda</p>
                    <p className="text-xl font-bold">R$ {preparacao.precoVenda.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Lucro Total</p>
                    <p className="text-xl font-bold text-green-600">R$ {lucroTotal.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Composição de Custos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Composição de Custos</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ingredientes</span>
                    <span>
                      R$ {custoIngredientes.toFixed(2)} (
                      {((custoIngredientes / preparacao.custoTotal) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={(custoIngredientes / preparacao.custoTotal) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mão de Obra</span>
                    <span>
                      R$ {preparacao.custoMaoObra.toFixed(2)} (
                      {((preparacao.custoMaoObra / preparacao.custoTotal) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={(preparacao.custoMaoObra / preparacao.custoTotal) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energia/Gás</span>
                    <span>
                      R$ {preparacao.custoEnergia.toFixed(2)} (
                      {((preparacao.custoEnergia / preparacao.custoTotal) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={(preparacao.custoEnergia / preparacao.custoTotal) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Outros Custos</span>
                    <span>
                      R$ {preparacao.outrosCustos.toFixed(2)} (
                      {((preparacao.outrosCustos / preparacao.custoTotal) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={(preparacao.outrosCustos / preparacao.custoTotal) * 100} className="h-2" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Análise de Rentabilidade</h4>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">Lucro por Porção</span>
                    <span className="font-bold text-green-800">
                      R$ {(preparacao.precoVenda - preparacao.custoPorcao).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Margem de Lucro</span>
                    <span className="font-bold text-blue-800">{preparacao.margemLucro}%</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-800">ROI por Preparação</span>
                    <span className="font-bold text-purple-800">
                      {((lucroTotal / preparacao.custoTotal) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Lista de Ingredientes */}
          <div>
            <h4 className="font-medium mb-4">Ingredientes Detalhados</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Ingrediente</th>
                    <th className="text-right p-2">Quantidade</th>
                    <th className="text-right p-2">Custo Unit.</th>
                    <th className="text-right p-2">Custo Total</th>
                    <th className="text-right p-2">% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  {preparacao.ingredientes.map((ingrediente: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{ingrediente.nome}</td>
                      <td className="text-right p-2">
                        {ingrediente.quantidade} {ingrediente.unidade}
                      </td>
                      <td className="text-right p-2">R$ {ingrediente.custoUnitario.toFixed(2)}</td>
                      <td className="text-right p-2">R$ {ingrediente.custoTotal.toFixed(2)}</td>
                      <td className="text-right p-2">
                        {((ingrediente.custoTotal / custoIngredientes) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t font-medium">
                    <td className="p-2">Total Ingredientes</td>
                    <td className="text-right p-2">-</td>
                    <td className="text-right p-2">-</td>
                    <td className="text-right p-2">R$ {custoIngredientes.toFixed(2)}</td>
                    <td className="text-right p-2">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
