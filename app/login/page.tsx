"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, School, Shield, Users, Package, ChefHat } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    setLoading(true)
    setError("")

    const success = await login(loginEmail, loginPassword)

    if (success) {
      router.push("/")
    } else {
      setError("Email ou senha incorretos")
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleLogin(email, password)
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    await handleLogin(demoEmail, demoPassword)
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações do Sistema */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <School className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Sistema de Refeições Escolares</h1>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Plataforma completa para gestão de alimentação escolar com controle de custos, estoque, cardápios e
              relatórios nutricionais.
            </p>
          </div>

          {/* Usuários de Demonstração */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuários de Demonstração:</h3>

            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handleDemoLogin("superadmin@sistema.com", "123456")}
                disabled={loading}
              >
                <Shield className="h-5 w-5 mr-3 text-red-600" />
                <div className="text-left">
                  <div className="font-medium">Super Administrador</div>
                  <div className="text-sm text-gray-500">Gerencia todo o sistema</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handleDemoLogin("admin@escola1.com", "123456")}
                disabled={loading}
              >
                <Users className="h-5 w-5 mr-3 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">Admin Escola</div>
                  <div className="text-sm text-gray-500">Administra a escola</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handleDemoLogin("nutricionista@escola1.com", "123456")}
                disabled={loading}
              >
                <ChefHat className="h-5 w-5 mr-3 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">Nutricionista</div>
                  <div className="text-sm text-gray-500">Cardápios e nutrição</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handleDemoLogin("estoquista@escola1.com", "123456")}
                disabled={loading}
              >
                <Package className="h-5 w-5 mr-3 text-orange-600" />
                <div className="text-left">
                  <div className="font-medium">Estoquista</div>
                  <div className="text-sm text-gray-500">Controle de estoque</div>
                </div>
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Credenciais válidas:</strong>
                <br />• superadmin@sistema.com / 123456
                <br />• admin@escola1.com / 123456
                <br />• nutricionista@escola1.com / 123456
                <br />• estoquista@escola1.com / 123456
                <br />• servidor@escola1.com / 123456
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar no Sistema</CardTitle>
            <CardDescription>Digite suas credenciais ou use um usuário de demonstração</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">Sistema de Gestão de Refeições Escolares v1.0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
