import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const ADMIN_PATH = '/admin'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow access to login page
  if (pathname === ADMIN_PATH) {
    return NextResponse.next()
  }

  // Protect admin routes
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
