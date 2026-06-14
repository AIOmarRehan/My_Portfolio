'use client'
import { useEffect, useState } from 'react'
import { NeoLoaderVisual } from './NeoLoader'

/**
 * Startup loader. Rendered INLINE (not portaled) so it's present in the very
 * first SSR paint and covers the page immediately — no flash of the homepage
 * before the loader. It lives directly in <body>, so z-[100000] is enough to
 * sit above the header. Fades out once the window finishes loading.
 */
export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (document.readyState === 'complete') {
      handleLoadComplete()
      return
    }
    const fallbackTimeout = setTimeout(() => handleLoadComplete(), 1200)
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
      className={`fixed inset-0 z-[100000] flex items-center justify-center transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'var(--neo-bg)' }}
      aria-hidden="true"
    >
      <NeoLoaderVisual />
    </div>
  )
}
