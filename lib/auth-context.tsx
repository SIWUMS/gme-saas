"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
  tenantId: string | null
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Auth check error:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Usuários válidos para o preview
      const validUsers = [
        {
          email: "superadmin@sistema.com",
          password: "123456",
          name: "Super Administrador",
          role: "super_admin",
          tenantId: null,
        },
        { email: "admin@escola1.com", password: "123456", name: "Admin Escola", role: "admin", tenantId: "escola1" },
        {
          email: "nutricionista@escola1.com",
          password: "123456",
          name: "Maria Silva",
          role: "nutricionista",
          tenantId: "escola1",
        },
        {
          email: "estoquista@escola1.com",
          password: "123456",
          name: "João Santos",
          role: "estoquista",
          tenantId: "escola1",
        },
        { email: "servidor@escola1.com", password: "123456", name: "Ana Costa", role: "servidor", tenantId: "escola1" },
      ]

      const user = validUsers.find((u) => u.email === email && u.password === password)

      if (user) {
        setUser({
          id: Math.random().toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
        })
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
