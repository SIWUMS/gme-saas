import { SidebarTrigger } from "@/components/ui/sidebar"
import { ConsumoModule } from "@/components/consumo/consumo-module"

export default function ConsumoPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold">Registro de Consumo</h1>
      </header>
      <div className="flex-1 p-4">
        <ConsumoModule />
      </div>
    </div>
  )
}
