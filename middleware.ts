import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode("sistema-refeicoes-secret-key-123456")

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicPaths = ["/login", "/api/auth"]

  // Verificar se é uma rota pública
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Permitir acesso a arquivos estáticos
  if (pathname.startsWith("/_next") || pathname.includes(".") || isPublicPath) {
    return NextResponse.next()
  }

  // Verificar token de autenticação
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)

    // Verificar permissões para rotas específicas
    const role = payload.role as string

    // Rotas do super admin
    if (pathname.startsWith("/sistema") && role !== "super_admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Rotas administrativas
    if (
      (pathname.startsWith("/usuarios") || pathname.startsWith("/configuracoes")) &&
      !["super_admin", "admin"].includes(role)
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Rotas de custos
    if (pathname.startsWith("/custos") && !["super_admin", "admin", "nutricionista"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
