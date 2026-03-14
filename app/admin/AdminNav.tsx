'use client'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AdminNav() {
  return (
    <nav className="fixed top-16 left-0 right-0 z-30 bg-gradient-to-r from-gray-900 via-gray-800 to-black border-b border-gray-700 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-6 flex-wrap">
          <Link href="/admin" className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium">
            Dashboard
          </Link>
          <div className="relative group">
            <span className="text-gray-300 hover:text-blue-400 transition duration-300 font-medium cursor-pointer select-none flex items-center gap-1">
              Projects
              <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </span>
            <div className="absolute left-0 top-full pt-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 min-w-[180px]">
                <Link href="/admin/projects" className="block px-4 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-700/50 transition duration-200 text-sm font-medium">
                  AI Projects
                </Link>
                <Link href="/admin/fullstack-projects" className="block px-4 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-700/50 transition duration-200 text-sm font-medium">
                  Full-Stack Projects
                </Link>
              </div>
            </div>
          </div>
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
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition duration-300"
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}

