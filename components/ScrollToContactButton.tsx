'use client'

import { useEffect, useState } from 'react'

export default function ScrollToContactButton() {
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
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    const contactCard = document.getElementById('contact-card')
    if (contactCard) {
      contactCard.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      
      // Highlight animation
      contactCard.classList.add('highlight-pulse')
      
      setTimeout(() => {
        contactCard.classList.remove('highlight-pulse')
      }, 2000)
    }
  }

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className="inline-flex items-center px-8 py-3 rounded-lg font-semibold transition-transform duration-300 ease-out hover:scale-105"
      style={{
        background: isDarkMode
          ? 'linear-gradient(45deg, #93c5fd, #e9d5ff)'
          : 'linear-gradient(45deg, #0284c7, #7c3aed)',
        color: isDarkMode ? '#000000' : '#ffffff',
        boxShadow: isDarkMode
          ? '0 0 20px #93c5fd, 0 0 40px #e9d5ff, inset 0 0 20px rgba(147, 197, 253, 0.3)'
          : '0 0 20px #0284c7, 0 0 40px #7c3aed, inset 0 0 20px rgba(2, 132, 199, 0.2)',
      }}
    >
      Get in Touch →
    </a>
  )
}
