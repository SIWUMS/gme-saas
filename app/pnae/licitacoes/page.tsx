import { SidebarTrigger } from "@/components/ui/sidebar"
import { LicitacoesModule } from "@/components/pnae/licitacoes-module"

export default function LicitacoesPnaePage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold">PNAE - Licitações</h1>
      </header>
      <div className="flex-1 p-4">
        <LicitacoesModule />
      </div>
    </div>
  )
}
