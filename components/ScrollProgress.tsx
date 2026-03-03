'use client'
import { useEffect, useRef, useState } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

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

  useEffect(() => {
    let lastProgress = 0
    let rafId: number

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        const scrolled = window.scrollY
        const height = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = height > 0 ? (scrolled / height) * 100 : 0

        // Update only if changed significantly
        if (Math.abs(scrollProgress - lastProgress) > 0.1) {
          lastProgress = scrollProgress
          if (barRef.current) {
            barRef.current.style.width = `${scrollProgress}%`
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-1.5 z-50 w-0"
      style={{
        background: isDarkMode
          ? 'linear-gradient(90deg, #93c5fd, #e9d5ff)'
          : 'linear-gradient(90deg, #00ffff, #ff00ff)',
        boxShadow: isDarkMode
          ? '0 0 15px #93c5fd, 0 0 30px #e9d5ff'
          : '0 0 15px #00ffff, 0 0 30px #ff00ff',
        height: '3px',
        transition: 'background 450ms ease, box-shadow 450ms ease',
        willChange: 'width',
        contain: 'layout style paint',
        transform: 'translateZ(0)',
      }}
    />
  )
}
