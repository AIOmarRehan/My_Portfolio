'use client'
import { useEffect, useState } from 'react'

interface HeroTitleProps {
  description: string
}

export default function HeroTitle({ description }: HeroTitleProps) {
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

  return (
    <>
      <h1
        className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent"
        style={{
          backgroundImage: isDarkMode
            ? 'linear-gradient(to right, #93c5fd, #e9d5ff, #c084fc)'
            : 'linear-gradient(to right, #0891b2, #7c3aed, #db2777)',
          textShadow: isDarkMode
            ? '0 0 20px rgba(147, 197, 253, 0.4), 0 0 40px rgba(233, 213, 255, 0.3)'
            : 'none',
          transition: 'text-shadow 450ms ease',
        }}
      >
        Welcome to my Portfolio
      </h1>
      <p className="text-lg text-gray-300 light:text-gray-800 mb-8">
        {description}
      </p>
    </>
  )
}
