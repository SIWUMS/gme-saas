import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Usuários pré-configurados do sistema
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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find((u) => u.email === credentials.email)
        if (!user || user.password !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.tenantId = user.tenantId
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "desenvolvimento-secret-key-123456",
}
