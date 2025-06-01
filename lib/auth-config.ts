import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { query } from "./database"
import bcrypt from "bcryptjs"

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

        try {
          const result = await query("SELECT * FROM usuarios WHERE email = $1 AND ativo = true", [credentials.email])

          if (result.rows.length === 0) {
            return null
          }

          const user = result.rows[0]
          const isPasswordValid = await bcrypt.compare(credentials.password, user.senha_hash)

          if (!isPasswordValid) {
            return null
          }

          // Atualizar último acesso
          await query("UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = $1", [user.id])

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.nome,
            role: user.tipo_usuario,
            tenantId: user.escola_id?.toString(),
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
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
  secret: process.env.NEXTAUTH_SECRET,
}
