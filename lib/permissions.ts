export type UserRole = "super_admin" | "admin" | "nutricionista" | "estoquista" | "servidor"

export const permissions = {
  // Super Admin - acesso total
  super_admin: {
    tenants: ["create", "read", "update", "delete"],
    users: ["create", "read", "update", "delete"],
    system_config: ["create", "read", "update", "delete"],
    all_modules: true,
  },

  // Admin da Escola - acesso completo à sua escola
  admin: {
    users: ["create", "read", "update", "delete"],
    config: ["create", "read", "update", "delete"],
    cardapios: ["create", "read", "update", "delete"],
    alimentos: ["create", "read", "update", "delete"],
    estoque: ["create", "read", "update", "delete"],
    consumo: ["create", "read", "update", "delete"],
    relatorios: ["create", "read", "update", "delete"],
  },

  // Nutricionista - foco em cardápios e nutrição
  nutricionista: {
    cardapios: ["create", "read", "update", "delete"],
    alimentos: ["create", "read", "update", "delete"],
    consumo: ["read", "update"],
    relatorios: ["read"],
    estoque: ["read"],
  },

  // Estoquista - foco em estoque
  estoquista: {
    estoque: ["create", "read", "update", "delete"],
    alimentos: ["read"],
    consumo: ["read"],
    relatorios: ["read"],
  },

  // Servidor - registro de consumo
  servidor: {
    consumo: ["create", "read", "update"],
    cardapios: ["read"],
    estoque: ["read"],
  },
}

export function hasPermission(userRole: UserRole, module: string, action: string): boolean {
  const userPermissions = permissions[userRole]

  if (userPermissions.all_modules) return true

  const modulePermissions = userPermissions[module as keyof typeof userPermissions]
  if (!modulePermissions) return false

  return Array.isArray(modulePermissions) && modulePermissions.includes(action)
}
