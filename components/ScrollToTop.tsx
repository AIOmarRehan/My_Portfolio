'use client'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        style={{
          background: isDarkMode
            ? 'linear-gradient(45deg, #93c5fd, #e9d5ff)'
            : 'linear-gradient(45deg, #00ffff, #ff00ff)',
          boxShadow: isDarkMode
            ? '0 0 20px #93c5fd, 0 0 40px #e9d5ff, inset 0 0 20px rgba(147, 197, 253, 0.3)'
            : '0 0 20px #00ffff, 0 0 40px #ff00ff, inset 0 0 20px rgba(0, 255, 255, 0.3)',
          transition: 'background 450ms ease, box-shadow 450ms ease',
        }}
        title="Back to top"
      >
        <svg
          className="w-6 h-6 text-gray-900 font-bold"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M7 14l5-5 5 5H7z" />
        </svg>
      </button>
    </div>
  )
}
