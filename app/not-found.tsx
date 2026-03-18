'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
  }, [])

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 text-center overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDarkMode
            ? 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 1px, transparent 1px, transparent 2px)'
            : 'repeating-linear-gradient(0deg, rgba(0,0,0,0.015), rgba(0,0,0,0.015) 1px, transparent 1px, transparent 2px)',
        }}
      />

      <h1
        className="relative text-[8rem] sm:text-[10rem] md:text-[12rem] font-extrabold mb-4 tracking-widest select-none"
        style={{
          color: isDarkMode ? '#a78bfa' : '#7c3aed',
          animation: 'flicker 2.5s infinite',
        }}
      >
        404
      </h1>

      <p className={`text-xl sm:text-2xl mb-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Oops… Page not found
      </p>

      <Link
        href="/"
        className={`
          relative px-8 py-3 rounded-lg font-semibold text-white
          bg-gradient-to-r from-blue-600 to-purple-600
          hover:from-blue-700 hover:to-purple-700
          transition-all duration-300 hover:scale-105
          hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]
        `}
      >
        Back to Home
      </Link>

      {/* Flicker keyframes — theme-aware via CSS custom properties */}
      <style>{`
        @keyframes flicker {
          0%   { opacity: 1;   text-shadow: 0 0 10px ${isDarkMode ? 'rgba(167,139,250,0.6)' : 'rgba(124,58,237,0.4)'}, 0 0 20px ${isDarkMode ? 'rgba(139,92,246,0.4)' : 'rgba(109,40,217,0.25)'}; }
          5%   { opacity: 0.2; text-shadow: none; }
          10%  { opacity: 1; }
          15%  { opacity: 0.3; }
          20%  { opacity: 1; }
          25%  { opacity: 0.1; text-shadow: none; }
          30%  { opacity: 1; }
          40%  { opacity: 0.4; }
          50%  { opacity: 1;   text-shadow: 0 0 20px ${isDarkMode ? 'rgba(167,139,250,0.8)' : 'rgba(124,58,237,0.5)'}, 0 0 40px ${isDarkMode ? 'rgba(139,92,246,0.5)' : 'rgba(109,40,217,0.3)'}; }
          60%  { opacity: 0.2; text-shadow: none; }
          70%  { opacity: 1; }
          80%  { opacity: 0.3; }
          90%  { opacity: 1; }
          100% { opacity: 0.9; }
        }
      `}</style>
    </section>
  )
}
