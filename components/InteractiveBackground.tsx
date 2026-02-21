'use client'
import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

export default function InteractiveBackground() {
  const [mounted, setMounted] = useState(false)
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text'>('default')
  const [hasFinePointer, setHasFinePointer] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, radius: 140 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updatePointer = () => setHasFinePointer(media.matches)
    updatePointer()
    media.addEventListener('change', updatePointer)
    return () => {
      media.removeEventListener('change', updatePointer)
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    // Removed scrollbar toggle logic - replaced with progress bar
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      const isSmallScreen = window.innerWidth < 768
      const particleCount = hasFinePointer ? (isSmallScreen ? 90 : 150) : 70
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: Math.random() > 0.5 ? '#00ffff' : '#ff00ff',
        })
      }
    }

    // Update particle position
    const updateParticle = (particle: Particle) => {
      particle.x += particle.speedX
      particle.y += particle.speedY

      if (particle.x > canvas.width || particle.x < 0) particle.speedX *= -1
      if (particle.y > canvas.height || particle.y < 0) particle.speedY *= -1

      const dx = particle.x - mouseRef.current.x
      const dy = particle.y - mouseRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < mouseRef.current.radius) {
        const angle = Math.atan2(dy, dx)
        const force = (mouseRef.current.radius - distance) / mouseRef.current.radius
        particle.x += Math.cos(angle) * force * 8
        particle.y += Math.sin(angle) * force * 8
      }
    }

    // Draw particle
    const drawParticle = (particle: Particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.shadowBlur = 15
      ctx.shadowColor = particle.color
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // Connect nearby particles with lines
    const connect = () => {
      for (let a = 0; a < particlesRef.current.length; a++) {
        for (let b = a; b < particlesRef.current.length; b++) {
          const dx = particlesRef.current[a].x - particlesRef.current[b].x
          const dy = particlesRef.current[a].y - particlesRef.current[b].y
          const distance = dx * dx + dy * dy

          if (distance < 9000) {
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y)
            ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        updateParticle(p)
        drawParticle(p)
      })

      connect()
      animationRef.current = requestAnimationFrame(animate)
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY

      // Detect cursor type based on target element
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], .cursor-pointer')) {
        setCursorType('pointer')
      } else if (target.closest('input, textarea, [contenteditable="true"]')) {
        setCursorType('text')
      } else {
        setCursorType('default')
      }

      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
    }

    // Window resize handler - ONLY resize canvas, don't reinitialize particles
    let resizeTimeout: NodeJS.Timeout | null = null
    const handleResize = () => {
      // Only resize canvas dimensions, do NOT recreate particles
      // This prevents the particle jumping issue on mobile
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth
        const newHeight = window.innerHeight
        
        if (canvas.width !== newWidth || canvas.height !== newHeight) {
          canvas.width = newWidth
          canvas.height = newHeight
          // Particles stay the same - they just move within the new canvas
        }
      }, 200)
    }

    initParticles()
    animate()

    if (hasFinePointer) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted, hasFinePointer])

  if (!mounted) return null

  // Dynamic cursor styles based on type
  const getCursorStyle = () => {
    const baseStyle = {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      pointerEvents: 'none' as const,
      zIndex: 10000,
      background: 'linear-gradient(45deg, #00ffff, #ff00ff, #00ffff)',
      backgroundSize: '200% 200%',
      animation: 'neonShift 3s linear infinite',
      boxShadow: '0 0 4px #00ffff, 0 0 8px #ff00ff, 0 0 12px #00ffff',
      transition: 'width 0.2s ease, height 0.2s ease, border-radius 0.2s ease, transform 0.2s ease, clip-path 0.2s ease',
    }

    if (cursorType === 'pointer') {
      return {
        ...baseStyle,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%) scale(1.2)',
      }
    } else if (cursorType === 'text') {
      return {
        ...baseStyle,
        width: '2px',
        height: '24px',
        borderRadius: '1px',
        transform: 'translate(-50%, -50%)',
      }
    } else {
      return {
        ...baseStyle,
        width: '16px',
        height: '24px',
        clipPath: 'polygon(0% 0%, 0% 100%, 30% 70%, 55% 100%, 70% 90%, 45% 60%, 100% 60%)',
      }
    }
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen -z-10"
        style={{ 
          background: 'radial-gradient(circle at center, #0f0c29, #302b63, #24243e)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
        }}
      />
      {hasFinePointer ? (
        <div
          ref={cursorRef}
          className="cyber-cursor"
          style={getCursorStyle()}
        />
      ) : null}
    </>
  )
}
