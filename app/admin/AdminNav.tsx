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

