'use client'
import { memo, useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

const navLink =
  'whitespace-nowrap font-bold text-[color:var(--neo-ink)] hover:bg-neo-yellow px-2 py-1 border-2 border-transparent hover:border-neo-border transition-all duration-100'

function HeaderComponent() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const isAdmin = session?.user?.email
  const isAdminPage = pathname.startsWith('/admin')
  const isProduction = process.env.NODE_ENV === 'production'

  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="neo-btn neo-btn-cyan w-10 h-10 !p-0"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: 'var(--neo-surface)',
        borderBottom: 'var(--neo-bw) solid var(--neo-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-6">
        {/* Logo */}
        <a
          href="/#top"
          onClick={() => setMenuOpen(false)}
          className="mr-4 lg:mr-10 shrink-0 flex items-center gap-3 hover:-translate-y-0.5 transition-transform duration-100"
        >
          <span className="neo-card neo-card-alt w-11 h-11 p-1.5 flex items-center justify-center shrink-0 -rotate-1">
            <img src="/favicon.svg?v=2" alt="" width={36} height={36} className="w-full h-full object-contain" />
          </span>
          <span className="text-xl sm:text-2xl font-extrabold bg-neo-yellow px-3 py-1.5 border-neo border-neo-border shadow-neo-sm -rotate-1 flex items-center gap-1.5">
            <span className="text-[color:var(--neo-pink)] leading-none">▘▝</span>
            Omar Rehan
            <span className="neo-blink">_</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {!isProduction && isAdmin && isAdminPage ? (
            <>
              <Link href="/admin" className={navLink}>Dashboard</Link>
              <div className="relative group">
                <span className={`${navLink} cursor-pointer select-none flex items-center gap-1`}>
                  Projects
                  <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
                <div className="absolute left-0 top-full pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150">
                  <div className="neo-panel shadow-neo py-2 min-w-[190px]">
                    <Link href="/admin/projects" className="block px-4 py-2 font-bold hover:bg-neo-yellow transition-colors">AI Projects</Link>
                    <Link href="/admin/fullstack-projects" className="block px-4 py-2 font-bold hover:bg-neo-cyan transition-colors">Full-Stack Projects</Link>
                    <Link href="/admin/data-analytics-projects" className="block px-4 py-2 font-bold hover:bg-neo-orange transition-colors">Data Analytics</Link>
                  </div>
                </div>
              </div>
              <Link href="/admin/experience" className={navLink}>Experience</Link>
              <Link href="/admin/certificates" className={navLink}>Certifications</Link>
              <Link href="/admin/articles" className={navLink}>Articles</Link>
              <Link href="/" className={navLink}>Public View</Link>
            </>
          ) : (
            <>
              <div className="relative group">
                <a href="/#projects" className={`${navLink} flex items-center gap-1`}>
                  Projects
                  <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </a>
                <div className="absolute left-0 top-full pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150">
                  <div className="neo-panel shadow-neo py-2 min-w-[190px]">
                    <a href="/#projects" className="block px-4 py-2 font-bold hover:bg-neo-yellow transition-colors">AI Projects</a>
                    <a href="/#fullstack-projects" className="block px-4 py-2 font-bold hover:bg-neo-cyan transition-colors">Full-Stack Projects</a>
                    <a href="/#data-analytics-projects" className="block px-4 py-2 font-bold hover:bg-neo-orange transition-colors">Data Analytics</a>
                  </div>
                </div>
              </div>
              <a href="/#experience" className={navLink}>Experience</a>
              <a href="/#certifications" className={navLink}>Certifications</a>
              <a href="/#articles" className={navLink}>Articles</a>
            </>
          )}

          <ThemeToggle />

          {!isProduction &&
            (isAdmin ? (
              <>
                {!isAdminPage && (
                  <Link href="/admin" className="neo-btn neo-btn-purple px-3 py-2 text-sm whitespace-nowrap">Admin</Link>
                )}
                <button onClick={() => signOut({ callbackUrl: '/' })} className="neo-btn neo-btn-red px-3 py-2 text-sm whitespace-nowrap">
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => signIn('google', { callbackUrl: '/admin' })} className="neo-btn neo-btn-blue px-3 py-2 text-sm">
                Sign In
              </button>
            ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="neo-btn neo-btn-pink w-10 h-10 !p-0 relative"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rounded bg-black transition-all duration-200 ${menuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rounded bg-black transition-all duration-200 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rounded bg-black transition-all duration-200 ${menuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed left-0 top-[60px] w-full transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: 'var(--neo-surface)', borderBottom: menuOpen ? 'var(--neo-bw) solid var(--neo-border)' : 'none' }}
      >
        <nav className="flex flex-col gap-3 p-6">
          {!isProduction && isAdmin && isAdminPage ? (
            <>
              <Link href="/admin" onClick={() => setMenuOpen(false)} className={navLink}>Dashboard</Link>
              <div>
                <button onClick={() => setProjectsOpen(!projectsOpen)} className={`${navLink} flex items-center gap-1 w-full`}>
                  Projects
                  <svg className={`w-3 h-3 transition-transform duration-200 ${projectsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${projectsOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <Link href="/admin/projects" onClick={() => setMenuOpen(false)} className="block pl-4 py-1 font-semibold">AI Projects</Link>
                  <Link href="/admin/fullstack-projects" onClick={() => setMenuOpen(false)} className="block pl-4 py-1 font-semibold">Full-Stack Projects</Link>
                  <Link href="/admin/data-analytics-projects" onClick={() => setMenuOpen(false)} className="block pl-4 py-1 font-semibold">Data Analytics</Link>
                </div>
              </div>
              <Link href="/admin/experience" onClick={() => setMenuOpen(false)} className={navLink}>Experience</Link>
              <Link href="/admin/certificates" onClick={() => setMenuOpen(false)} className={navLink}>Certifications</Link>
              <Link href="/admin/articles" onClick={() => setMenuOpen(false)} className={navLink}>Articles</Link>
              <Link href="/" onClick={() => setMenuOpen(false)} className={navLink}>Public View</Link>
            </>
          ) : (
            <>
              <div>
                <button onClick={() => setProjectsOpen(!projectsOpen)} className={`${navLink} flex items-center gap-1 w-full`}>
                  Projects
                  <svg className={`w-3 h-3 transition-transform duration-200 ${projectsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${projectsOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <a href="/#projects" onClick={() => setMenuOpen(false)} className="block pl-4 py-1 font-semibold">AI Projects</a>
                  <a href="/#fullstack-projects" onClick={() => setMenuOpen(false)} className="block pl-4 py-1 font-semibold">Full-Stack Projects</a>
                  <a href="/#data-analytics-projects" onClick={() => setMenuOpen(false)} className="block pl-4 py-1 font-semibold">Data Analytics</a>
                </div>
              </div>
              <a href="/#experience" onClick={() => setMenuOpen(false)} className={navLink}>Experience</a>
              <a href="/#certifications" onClick={() => setMenuOpen(false)} className={navLink}>Certifications</a>
              <a href="/#articles" onClick={() => setMenuOpen(false)} className={navLink}>Articles</a>
            </>
          )}

          {!isProduction &&
            (isAdmin ? (
              <>
                {!isAdminPage && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="neo-btn neo-btn-purple py-2 text-sm">Admin Panel</Link>
                )}
                <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }} className="neo-btn neo-btn-red py-2 text-sm">Sign Out</button>
              </>
            ) : (
              <button onClick={() => { setMenuOpen(false); signIn('google', { callbackUrl: '/admin' }) }} className="neo-btn neo-btn-blue py-2 text-sm">Sign In</button>
            ))}
        </nav>
      </div>
    </header>
  )
}

export default memo(HeaderComponent)
