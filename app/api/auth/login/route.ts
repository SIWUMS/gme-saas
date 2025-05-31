import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

// Usuários do sistema
const users = [
  {
    id: "1",
    email: "superadmin@sistema.com",
    password: "123456",
    name: "Super Administrador",
    role: "super_admin",
    tenantId: null,
  },
  {
    id: "2",
    email: "admin@escola1.com",
    password: "123456",
    name: "Admin Escola Municipal Centro",
    role: "admin",
    tenantId: "escola1",
  },
  {
    id: "3",
    email: "nutricionista@escola1.com",
    password: "123456",
    name: "Maria Silva - Nutricionista",
    role: "nutricionista",
    tenantId: "escola1",
  },
  {
    id: "4",
    email: "estoquista@escola1.com",
    password: "123456",
    name: "João Santos - Estoquista",
    role: "estoquista",
    tenantId: "escola1",
  },
  {
    id: "5",
    email: "servidor@escola1.com",
    password: "123456",
    name: "Ana Costa - Servidora",
    role: "servidor",
    tenantId: "escola1",
  },
]

const secret = new TextEncoder().encode("sistema-refeicoes-secret-key-123456")

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Verificar credenciais
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Criar JWT token
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret)

    // Criar resposta com cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
    })

    // Definir cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 horas
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
