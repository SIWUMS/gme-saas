import { SidebarTrigger } from "@/components/ui/sidebar"
import { TransparenciaModule } from "@/components/pnae/transparencia-module"

export default function TransparenciaPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-blue-700 text-white">
        <SidebarTrigger className="-ml-1 text-white" />
        <h1 className="text-lg font-semibold">Portal de Transparência PNAE</h1>
      </header>
      <div className="flex-1 p-4 overflow-auto">
        <TransparenciaModule />
      </div>
    </div>
  )
}
