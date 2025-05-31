"use client"

import {
  Calendar,
  ChefHat,
  FileText,
  Home,
  Package,
  Settings,
  Users,
  Apple,
  ClipboardList,
  Building,
  Shield,
  DollarSign,
  LogOut,
  Gavel,
  Sprout,
  Receipt,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    roles: ["super_admin", "admin", "nutricionista", "estoquista", "servidor"],
  },
  {
    title: "PNAE",
    url: "/pnae",
    icon: FileText,
    roles: ["super_admin", "admin", "nutricionista"],
  },
  {
    title: "Cardápios",
    url: "/cardapios",
    icon: Calendar,
    roles: ["super_admin", "admin", "nutricionista"],
  },
  {
    title: "Alimentos",
    url: "/alimentos",
    icon: Apple,
    roles: ["super_admin", "admin", "nutricionista", "estoquista"],
  },
  {
    title: "Estoque",
    url: "/estoque",
    icon: Package,
    roles: ["super_admin", "admin", "nutricionista", "estoquista"],
  },
  {
    title: "Consumo",
    url: "/consumo",
    icon: ClipboardList,
    roles: ["super_admin", "admin", "nutricionista", "estoquista", "servidor"],
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: FileText,
    roles: ["super_admin", "admin", "nutricionista"],
  },
  {
    title: "Custos",
    url: "/custos",
    icon: DollarSign,
    roles: ["super_admin", "admin", "nutricionista"],
  },
]

const pnaeItems = [
  {
    title: "Licitações",
    url: "/pnae/licitacoes",
    icon: Gavel,
    roles: ["super_admin", "admin", "nutricionista"],
  },
  {
    title: "Agricultura Familiar",
    url: "/pnae/agricultura-familiar",
    icon: Sprout,
    roles: ["super_admin", "admin", "nutricionista"],
  },
  {
    title: "Prestação de Contas",
    url: "/pnae/prestacao-contas",
    icon: Receipt,
    roles: ["super_admin", "admin", "nutricionista"],
  },
]

const adminItems = [
  {
    title: "Usuários",
    url: "/usuarios",
    icon: Users,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
    roles: ["super_admin", "admin"],
  },
]

const superAdminItems = [
  {
    title: "Gerenciar Escolas",
    url: "/sistema/escolas",
    icon: Building,
    roles: ["super_admin"],
  },
  {
    title: "Config. Sistema",
    url: "/sistema/configuracoes",
    icon: Shield,
    roles: ["super_admin"],
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const userRole = user?.role as string

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))
  const filteredPnaeItems = pnaeItems.filter((item) => item.roles.includes(userRole))
  const filteredAdminItems = adminItems.filter((item) => item.roles.includes(userRole))
  const filteredSuperAdminItems = superAdminItems.filter((item) => item.roles.includes(userRole))

  const handleSignOut = async () => {
    await logout()
    router.push("/login")
  }

  const getTenantName = (tenantId: string | null) => {
    if (!tenantId) return "Sistema Global"

    const tenants = {
      escola1: "Escola Municipal Centro",
      escola2: "Escola Municipal Norte",
      escola3: "Escola Municipal Sul",
    }

    return tenants[tenantId as keyof typeof tenants] || tenantId
  }

  if (!user) {
    return null
  }

  return (
    <Sidebar className="bg-gradient-to-b from-blue-600 to-blue-800 border-r-0">
      <SidebarHeader className="bg-blue-700">
        <div className="flex items-center gap-2 px-2 py-2">
          <ChefHat className="h-8 w-8 text-yellow-400" />
          <div>
            <h2 className="text-lg font-semibold text-white">Refeições SaaS</h2>
            <p className="text-sm text-blue-200">{getTenantName(user?.tenantId || null)}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gradient-to-b from-blue-600 to-blue-800">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-200">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-blue-500 hover:text-yellow-400">
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {filteredPnaeItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-200">PNAE</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredPnaeItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-white hover:bg-blue-500 hover:text-yellow-400">
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredAdminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-200">Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-white hover:bg-blue-500 hover:text-yellow-400">
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredSuperAdminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-200">Super Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredSuperAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-white hover:bg-blue-500 hover:text-yellow-400">
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="bg-blue-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2 text-white hover:bg-blue-700">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-yellow-400 text-blue-800">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate text-white">{user?.name}</p>
                  <p className="text-xs text-blue-200 truncate capitalize">{user?.role?.replace("_", " ")}</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/perfil">
                <Users className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes-sistema">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
