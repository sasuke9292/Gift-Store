import NextAuth, { DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Update the Session type to include the user's role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
  
  interface User {
    role?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        loginType: { label: 'Login Type', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const cleanEmail = (credentials.email as string).trim().toLowerCase()
        const rawPassword = credentials.password as string

        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: cleanEmail,
              mode: 'insensitive'
            }
          }
        })

        if (!user || !user.password) {
          return null
        }

        // Support both bcrypt hashes and initial plaintext seed passwords
        let isPasswordValid = false
        const isBcrypt = user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')
        
        if (isBcrypt) {
          isPasswordValid = await bcrypt.compare(rawPassword, user.password).catch(() => false)
        } else {
          isPasswordValid = (rawPassword === user.password)
          // Silently upgrade to secure bcrypt hash for future logins
          if (isPasswordValid) {
            bcrypt.hash(rawPassword, 10).then(hashed => {
              prisma.user.update({
                where: { id: user.id },
                data: { password: hashed }
              }).catch(() => {})
            }).catch(() => {})
          }
        }

        if (!isPasswordValid) {
          return null
        }

        const loginType = credentials.loginType as string | undefined
        
        if (loginType === 'admin' && !['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR', 'SUPPORT', 'SALES'].includes(user.role)) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
