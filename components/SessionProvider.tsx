'use client'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

const isProduction = process.env.NODE_ENV === 'production'

export default function AppSessionProvider({ children }: { children: ReactNode }) {
  // Production compiles every admin control out (Header, ContactCard, QRSection) and middleware
  // 404s /admin, so visitors never need a session: session={null} skips next-auth's
  // /api/auth/session fetch on mount and refetchOnWindowFocus={false} skips it on tab focus.
  // Dev keeps the default provider, so the local admin sign-in works exactly as before.
  if (isProduction) {
    return (
      <SessionProvider session={null} refetchOnWindowFocus={false}>
        {children}
      </SessionProvider>
    )
  }
  return <SessionProvider>{children}</SessionProvider>
}
