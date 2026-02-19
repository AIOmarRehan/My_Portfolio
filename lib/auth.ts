import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

const adminEmail = process.env.ADMIN_EMAIL

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables")
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/admin",
    error: "/admin",
  },

  callbacks: {
    async signIn({ user }) {
      if (!adminEmail) return false
      return user.email === adminEmail
    },

    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email
      }
      return session
    },
  },
}

export default authOptions