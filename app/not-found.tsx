'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
  }, [])

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className={`text-8xl font-extrabold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        404
      </h1>
      <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        This page could not be found.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
      >
        Back to Home
      </Link>
    </section>
  )
}
