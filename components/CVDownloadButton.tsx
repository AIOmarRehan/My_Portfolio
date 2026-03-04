'use client'

import { useEffect, useState } from 'react'

interface CVDownloadButtonProps {
  buttonSize?: 'lg' | 'sm'
}

export default function CVDownloadButton({ buttonSize = 'lg' }: CVDownloadButtonProps) {
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

  const handleViewAndDownload = () => {
    // Open PDF directly
    window.open('/cv/Omar_Rehan_CV.pdf', '_blank')
    
    // Trigger download simultaneously
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = '/cv/Omar_Rehan_CV.pdf'
      link.download = 'Omar_Rehan_CV.pdf'
      link.click()
    }, 100)
  }

  const sizeClasses = buttonSize === 'lg' 
    ? 'px-6 py-3 w-full' 
    : 'px-4 py-2 w-full'
  
  const textSize = buttonSize === 'lg'
    ? ''
    : 'text-sm'

  return (
    <button
      onClick={handleViewAndDownload}
      className={`${sizeClasses} font-semibold ${textSize} rounded-lg flex items-center justify-center gap-2 transition-transform duration-300 ease-out hover:scale-105`}
      style={{
        background: isDarkMode
          ? 'linear-gradient(45deg, #93c5fd, #e9d5ff)'
          : 'linear-gradient(45deg, #0284c7, #7c3aed)',
        color: isDarkMode ? '#000000' : '#ffffff',
        boxShadow: isDarkMode
          ? '0 0 20px #93c5fd, 0 0 40px #e9d5ff, inset 0 0 20px rgba(147, 197, 253, 0.3)'
          : '0 0 20px #0284c7, 0 0 40px #7c3aed, inset 0 0 20px rgba(2, 132, 199, 0.2)',
      }}
      aria-label="View and Download CV"
    >
      <svg className={buttonSize === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download CV
    </button>
  )
}
