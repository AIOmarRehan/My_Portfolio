'use client'
import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lastProgress = 0
    let rafId: number

    const handleScroll = () => {
      // Cancel previous frame if pending
      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        const scrolled = window.scrollY
        const height = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = height > 0 ? (scrolled / height) * 100 : 0

        // Only update if change is significant (more than 0.1%) to reduce repaints
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
        background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
        boxShadow: '0 0 15px #00ffff, 0 0 30px #ff00ff',
        height: '3px',
        willChange: 'width',
        contain: 'layout style paint',
        transform: 'translateZ(0)',
      }}
    />
  )
}
