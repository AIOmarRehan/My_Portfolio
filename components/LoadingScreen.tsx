'use client'
import { useEffect, useState } from 'react'
import NeoLoader from './NeoLoader'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (document.readyState === 'complete') {
      handleLoadComplete()
      return
    }
    const fallbackTimeout = setTimeout(() => handleLoadComplete(), 800)
    const handleLoad = () => {
      clearTimeout(fallbackTimeout)
      handleLoadComplete()
    }
    window.addEventListener('load', handleLoad)
    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(fallbackTimeout)
    }
  }, [])

  const handleLoadComplete = () => {
    setFadeOut(true)
    setTimeout(() => setIsLoading(false), 300)
  }

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <NeoLoader />
    </div>
  )
}
