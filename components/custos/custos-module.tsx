"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, FileText, PieChart } from "lucide-react"
import { CustoPreparacoes } from "./custo-preparacoes"
import { CustoCardapios } from "./custo-cardapios"
import { RelatorioFinanceiro } from "./relatorio-financeiro"
import { AnaliseComparativa } from "./analise-comparativa"

export function CustosModule() {
  const [activeTab, setActiveTab] = useState("preparacoes")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Custos</h2>
          <p className="text-muted-foreground">Controle financeiro completo das refeições</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preparacoes" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Preparações
          </TabsTrigger>
          <TabsTrigger value="cardapios" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Cardápios
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="analise" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Análise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preparacoes">
          <CustoPreparacoes />
        </TabsContent>

        <TabsContent value="cardapios">
          <CustoCardapios />
        </TabsContent>

        <TabsContent value="relatorios">
          <RelatorioFinanceiro />
        </TabsContent>

        <TabsContent value="analise">
          <AnaliseComparativa />
        </TabsContent>
      </Tabs>
    </div>
  )
}
