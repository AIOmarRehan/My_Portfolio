'use client'
import { memo, useEffect, useState } from 'react'
import { useThrottledCallback } from '@/lib/hooks'

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const onScroll = useThrottledCallback(() => {
    setIsVisible(window.scrollY > 300)
  }, 150)

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="neo-btn neo-btn-yellow w-12 h-12 !p-0 rounded-neo"
        title="Back to top"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 14l5-5 5 5H7z" />
        </svg>
      </button>
    </div>
  )
}

export default memo(ScrollToTop)
