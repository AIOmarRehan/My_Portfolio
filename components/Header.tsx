'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  const isAdmin = session?.user?.email
  const isAdminPage = pathname.startsWith('/admin')
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition">
          Omar Rehan
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {!isProduction && isAdmin && isAdminPage ? (
            <>
              {/* Admin Navigation */}
              <Link href="/admin" className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium">
                Dashboard
              </Link>
              <Link href="/admin/projects" className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium">
                Projects
              </Link>
              <Link href="/admin/experience" className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium">
                Experience
              </Link>
              <Link href="/admin/certificates" className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium">
                Certifications
              </Link>
              <Link href="/admin/articles" className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium">
                Articles
              </Link>
              <Link href="/" className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium">
                Public View
              </Link>
            </>
          ) : (
            <>
              {/* Public Navigation */}
              <Link href="#projects" className="text-gray-300 hover:text-white transition duration-300">
                Projects
              </Link>
              <Link href="#experience" className="text-gray-300 hover:text-white transition duration-300">
                Experience
              </Link>
              <Link href="#certifications" className="text-gray-300 hover:text-white transition duration-300">
                Certifications
              </Link>
              <Link href="#articles" className="text-gray-300 hover:text-white transition duration-300">
                Articles
              </Link>
            </>
          )}

          {!isProduction &&
            (isAdmin ? (
              <>
                {!isAdminPage && (
                  <Link
                    href="/admin"
                    className="text-blue-400 hover:text-blue-300 transition duration-300 font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google', { callbackUrl: '/admin' })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Sign In
              </button>
            ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 focus:outline-none"
        >
          <div className={`h-1 w-6 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`h-1 w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`h-1 w-6 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed left-0 top-16 w-full bg-gray-900 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-4 p-6">
          {!isProduction && isAdmin && isAdminPage ? (
            <>
              {/* Admin Navigation */}
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/projects"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium"
              >
                Projects
              </Link>
              <Link
                href="/admin/experience"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium"
              >
                Experience
              </Link>
              <Link
                href="/admin/certificates"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium"
              >
                Certifications
              </Link>
              <Link
                href="/admin/articles"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium"
              >
                Articles
              </Link>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium"
              >
                Public View
              </Link>
            </>
          ) : (
            <>
              {/* Public Navigation */}
              <Link
                href="#projects"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                Projects
              </Link>
              <Link
                href="#experience"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                Experience
              </Link>
              <Link
                href="#certifications"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                Certifications
              </Link>
              <Link
                href="#articles"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                Articles
              </Link>
            </>
          )}

          {!isProduction &&
            (isAdmin ? (
              <>
                {!isAdminPage && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="text-blue-400 hover:text-blue-300 transition duration-300 font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false)
                  signIn('google', { callbackUrl: '/admin' })
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-left"
              >
                Sign In
              </button>
            ))}
        </nav>
      </div>
    </header>
  )
}
