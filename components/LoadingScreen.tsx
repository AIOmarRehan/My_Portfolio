'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoadComplete()
    } else {
      // Wait for all resources to load
      window.addEventListener('load', handleLoadComplete)
    }

    // Fallback: hide after 3 seconds max
    const fallbackTimeout = setTimeout(() => {
      handleLoadComplete()
    }, 3000)

    return () => {
      window.removeEventListener('load', handleLoadComplete)
      clearTimeout(fallbackTimeout)
    }
  }, [])

  const handleLoadComplete = () => {
    setFadeOut(true)
    // Remove from DOM after fade animation completes
    setTimeout(() => {
      setIsLoading(false)
    }, 600)
  }

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 255, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Loading content */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Icon with glow effect */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 -m-6">
            <div className="loading-spinner w-32 h-32" />
          </div>

          {/* Icon container with glow */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-3 shadow-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 blur-xl" />
            <div className="relative w-full h-full">
              <Image
                src="/favicon-128x128.png"
                alt="Loading"
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Loading text with animation */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Loading
            </span>
            <div className="flex gap-1">
              <span className="loading-dot">.</span>
              <span className="loading-dot" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="loading-dot" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
          <p className="text-sm text-gray-400">Preparing your experience</p>
        </div>
      </div>

      <style jsx>{`
        .loading-spinner {
          border: 3px solid transparent;
          border-top: 3px solid #00ffff;
          border-right: 3px solid #ff00ff;
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.5),
            0 0 40px rgba(255, 0, 255, 0.3);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-dot {
          color: #00ffff;
          font-size: 1.5rem;
          animation: blink 1.4s infinite;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
        }

        @keyframes blink {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
