'use client'

import { useEffect, useRef, useState } from 'react'

interface LazyVideoProps {
  src: string
  alt?: string
  className?: string
  posterSrc?: string
}

export default function LazyVideo({ src, alt, className = '', posterSrc }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Intersection Observer to detect when video enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            // Load video when it's about to enter viewport (with 200px margin)
            if (!isLoaded) {
              setIsLoaded(true)
            }
          }
        })
      },
      {
        rootMargin: '200px', // Start loading 200px before video enters viewport
        threshold: 0.01,
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [isLoaded])

  // Auto-play when video is in view and loaded
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isLoaded || !isInView) return

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Auto-play was prevented, user interaction needed
        console.log('Video autoplay prevented:', error)
      })
    }
  }, [isLoaded, isInView])

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={isLoaded && isInView}
        muted
        loop
        playsInline
        preload="none"
        poster={posterSrc || undefined}
        aria-label={alt || 'Project demo video'}
      >
        {isLoaded && <source src={src} type="video/mp4" />}
        {isLoaded && src.endsWith('.webm') && <source src={src} type="video/webm" />}
        Your browser does not support the video tag.
      </video>
      
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
