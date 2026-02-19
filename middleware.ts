import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const ADMIN_PATH = '/admin'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProduction = process.env.NODE_ENV === 'production'

  if (
    isProduction &&
    (pathname === ADMIN_PATH || pathname.startsWith(ADMIN_PATH + '/') || pathname.startsWith('/api/admin'))
  ) {
    return new Response('Not Found', { status: 404 })
  }

  // Allow public access to the admin landing page so owner can sign in.
  if (pathname === ADMIN_PATH) {
    return NextResponse.next()
  }

  // Protect admin subpaths (e.g. /admin/*) and admin API routes under /api/admin
  if (pathname.startsWith(ADMIN_PATH + '/') || pathname.startsWith('/api/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || token?.email !== process.env.ADMIN_EMAIL) {
      return new Response('Not Found', { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
