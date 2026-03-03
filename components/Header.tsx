'use client'
import { memo, useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

function HeaderComponent() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const isAdmin = session?.user?.email
  const isAdminPage = pathname.startsWith('/admin')
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900 via-gray-800 to-black light:from-white light:via-gray-50 light:to-gray-100 shadow-lg transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a
          href="/#top"
          onClick={() => setMenuOpen(false)}
          className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent hover:opacity-80 transition-all duration-500 cursor-pointer ${
            theme === 'dark'
              ? 'from-blue-300 via-cyan-300 to-purple-200 drop-shadow-[0_0_10px_rgba(147,197,253,0.45)]'
              : 'from-blue-400 to-purple-500'
          }`}
        >
          Omar Rehan
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {!isProduction && isAdmin && isAdminPage ? (
            <>
              {/* Admin Navigation */}
              <Link href="/admin" className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium">
                Dashboard
              </Link>
              <Link href="/admin/projects" className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium">
                Projects
              </Link>
              <Link href="/admin/experience" className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium">
                Experience
              </Link>
              <Link href="/admin/certificates" className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium">
                Certifications
              </Link>
              <Link href="/admin/articles" className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium">
                Articles
              </Link>
              <Link href="/" className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium">
                Public View
              </Link>
            </>
          ) : (
            <>
              {/* Public Navigation */}
              <a href="/#projects" className="text-gray-300 light:text-gray-700 hover:text-white light:hover:text-black transition duration-300">
                Projects
              </a>
              <a href="/#experience" className="text-gray-300 light:text-gray-700 hover:text-white light:hover:text-black transition duration-300">
                Experience
              </a>
              <a href="/#certifications" className="text-gray-300 light:text-gray-700 hover:text-white light:hover:text-black transition duration-300">
                Certifications
              </a>
              <a href="/#articles" className="text-gray-300 light:text-gray-700 hover:text-white light:hover:text-black transition duration-300">
                Articles
              </a>
            </>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-800 light:bg-gray-200 hover:bg-gray-700 light:hover:bg-gray-300 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

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
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-800 light:bg-gray-200 hover:bg-gray-700 light:hover:bg-gray-300 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          
          <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative h-8 w-8 focus:outline-none"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span
            className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded bg-white light:bg-gray-900 transition-all duration-300 ${
              menuOpen ? 'rotate-45' : '-translate-y-2'
            }`}
          />
          <span
            className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded bg-white light:bg-gray-900 transition-all duration-300 ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded bg-white light:bg-gray-900 transition-all duration-300 ${
              menuOpen ? '-rotate-45' : 'translate-y-2'
            }`}
          />
        </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed left-0 top-16 w-full bg-gray-900 light:bg-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
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
                className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/projects"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium"
              >
                Projects
              </Link>
              <Link
                href="/admin/experience"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium"
              >
                Experience
              </Link>
              <Link
                href="/admin/certificates"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium"
              >
                Certifications
              </Link>
              <Link
                href="/admin/articles"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium"
              >
                Articles
              </Link>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 light:text-gray-700 hover:text-blue-400 transition duration-300 font-medium"
              >
                Public View
              </Link>
            </>
          ) : (
            <>
              {/* Public Navigation */}
              <a
                href="/#projects"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 light:text-gray-700 hover:text-white light:hover:text-black transition duration-300"
              >
                Projects
              </a>
              <a
                href="/#experience"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 light:text-gray-700 hover:text-white light:hover:text-black transition duration-300"
              >
                Experience
              </a>
              <a
                href="/#certifications"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 light:text-gray-700 hover:text-white light:hover:text-black transition duration-300"
              >
                Certifications
              </a>
              <a
                href="/#articles"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 light:text-gray-700 hover:text-white light:hover:text-black transition duration-300"
              >
                Articles
              </a>
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

export default memo(HeaderComponent)
