import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            workspaceAccess: {
              where: { status: "active" },
              take: 1,
            },
          },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) {
          return null
        }

        // Get clientId from workspace access if client role
        const clientId = user.workspaceAccess?.[0]?.clientId ?? null

        return {
          id: user.id,
          email: user.email,
          name: user.name || "",
          image: (user as any).image || null,
          role: user.role,
          clientId: clientId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.image = (user as any).image
        token.clientId = (user as any).clientId
      }
      
      // Handle the 'update' trigger from useSession().update()
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name
        if (session.image) token.image = session.image
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.image = token.image as string | null
        session.user.name = token.name as string
        session.user.clientId = token.clientId as string | null
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
