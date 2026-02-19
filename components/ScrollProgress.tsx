'use client'
import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = height > 0 ? (scrolled / height) * 100 : 0
      setProgress(scrollProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 h-1.5 z-50 w-full"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
        boxShadow: '0 0 15px #00ffff, 0 0 30px #ff00ff',
        transition: 'width 0.15s ease-out',
        height: '6px',
      }}
    />
  )
}
