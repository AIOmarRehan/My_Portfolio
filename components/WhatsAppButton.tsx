'use client'

import { useEffect, useState } from 'react'

interface WhatsAppButtonProps {
  href?: string
}

export default function WhatsAppButton({ href = 'https://wa.me/971509669311' }: WhatsAppButtonProps) {
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full px-4 py-2 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-transform duration-300 ease-out hover:scale-105"
      style={{
        background: isDarkMode
          ? 'linear-gradient(45deg, #d8b4fe, #f472b6)'
          : 'linear-gradient(45deg, #9333ea, #ec4899)',
        color: isDarkMode ? '#000000' : '#ffffff',
        boxShadow: isDarkMode
          ? '0 0 20px #d8b4fe, 0 0 40px #f472b6, inset 0 0 20px rgba(216, 180, 254, 0.3)'
          : '0 0 20px #9333ea, 0 0 40px #ec4899, inset 0 0 20px rgba(147, 51, 234, 0.2)',
      }}
      aria-label="Open WhatsApp"
    >
      <img 
        src="/svg-icons/whatsapp.svg" 
        alt="WhatsApp icon" 
        className="w-4 h-4 brightness-0 invert"
        aria-hidden="true"
      />
      WhatsApp
    </a>
  )
}
