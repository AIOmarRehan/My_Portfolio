'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Minimize loading screen impact on FCP
    // Check if page is already loaded (for fast connections)
    if (document.readyState === 'complete') {
      handleLoadComplete()
      return
    }

    // Set aggressive timeout to not block FCP
    // Reduced from 3000ms to 800ms for better performance
    const fallbackTimeout = setTimeout(() => {
      handleLoadComplete()
    }, 800)

    // Listen for actual load event
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
    // Quick fade animation (reduced from 600ms to 300ms)
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  // Don't render if loading is complete
  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Simplified background pattern - less CPU intensive */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(0, 255, 255, 0.1) 1px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Simplified loading content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Lightweight icon with minimal animation */}
        <div className="relative">
          {/* Simplified rotating ring - single element */}
          <div className="absolute inset-0 -m-4">
            <div className="loading-spinner w-24 h-24" />
          </div>

          {/* Icon container */}
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-2 shadow-xl">
            <Image
              src="/favicon-128x128.png"
              alt=""
              width={64}
              height={64}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Minimal loading text */}
        <div className="text-sm text-gray-400 opacity-80">Loading...</div>
      </div>

      <style jsx>{`
        .loading-spinner {
          border: 2px solid transparent;
          border-top: 2px solid #00ffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
