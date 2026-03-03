'use client'
import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  kind: 'primary' | 'secondary'
}

interface RGB {
  r: number
  g: number
  b: number
}

const hexToRgb = (hex: string): RGB => {
  const normalized = hex.replace('#', '')
  const bigint = parseInt(normalized, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

const mixColor = (from: RGB, to: RGB, t: number, alpha = 1) => {
  const clamped = Math.max(0, Math.min(1, t))
  const r = Math.round(from.r + (to.r - from.r) * clamped)
  const g = Math.round(from.g + (to.g - from.g) * clamped)
  const b = Math.round(from.b + (to.b - from.b) * clamped)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
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
  const darkModeTargetRef = useRef(false)
  const darkModeProgressRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const updateDarkMode = () => {
      darkModeTargetRef.current = document.documentElement.classList.contains('dark-mode')
    }

    updateDarkMode()

    const observer = new MutationObserver(updateDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      observer.disconnect()
    }
  }, [mounted])

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
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const palettes = {
      normal: {
        gradient1: hexToRgb('#0f0c29'),
        gradient2: hexToRgb('#302b63'),
        gradient3: hexToRgb('#24243e'),
        primary: hexToRgb('#00ffff'),
        secondary: hexToRgb('#ff00ff'),
        line: hexToRgb('#ff00ff'),
        lineAlpha: 0.1,
      },
      dark: {
        gradient1: hexToRgb('#020617'),
        gradient2: hexToRgb('#030712'),
        gradient3: hexToRgb('#000000'),
        primary: hexToRgb('#93c5fd'),
        secondary: hexToRgb('#e9d5ff'),
        line: hexToRgb('#bae6fd'),
        lineAlpha: 0.22,
      },
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Create particles
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
          kind: Math.random() > 0.5 ? 'primary' : 'secondary',
        })
      }
    }

    const drawBackground = (progress: number) => {
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        Math.max(canvas.width, canvas.height) * 0.08,
        canvas.width * 0.5,
        canvas.height * 0.5,
        Math.max(canvas.width, canvas.height) * 0.75
      )

      gradient.addColorStop(
        0,
        mixColor(palettes.normal.gradient1, palettes.dark.gradient1, progress)
      )
      gradient.addColorStop(
        0.55,
        mixColor(palettes.normal.gradient2, palettes.dark.gradient2, progress)
      )
      gradient.addColorStop(
        1,
        mixColor(palettes.normal.gradient3, palettes.dark.gradient3, progress)
      )

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

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

    const drawParticle = (particle: Particle, progress: number) => {
      const normalColor = particle.kind === 'primary' ? palettes.normal.primary : palettes.normal.secondary
      const darkColor = particle.kind === 'primary' ? palettes.dark.primary : palettes.dark.secondary
      const particleColor = mixColor(normalColor, darkColor, progress)

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particleColor
      ctx.shadowBlur = 15
      ctx.shadowColor = particleColor
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const connect = (progress: number) => {
      const lineAlpha = palettes.normal.lineAlpha + (palettes.dark.lineAlpha - palettes.normal.lineAlpha) * progress
      const lineColor = mixColor(palettes.normal.line, palettes.dark.line, progress, lineAlpha)

      for (let a = 0; a < particlesRef.current.length; a++) {
        for (let b = a; b < particlesRef.current.length; b++) {
          const dx = particlesRef.current[a].x - particlesRef.current[b].x
          const dy = particlesRef.current[a].y - particlesRef.current[b].y
          const distance = dx * dx + dy * dy

          if (distance < 9000) {
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y)
            ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      const target = darkModeTargetRef.current ? 1 : 0
      const current = darkModeProgressRef.current
      const next = current + (target - current) * 0.06
      darkModeProgressRef.current = Math.abs(target - next) < 0.001 ? target : next

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBackground(darkModeProgressRef.current)

      particlesRef.current.forEach((p) => {
        updateParticle(p)
        drawParticle(p, darkModeProgressRef.current)
      })

      connect(darkModeProgressRef.current)
      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {

      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY

      // Update cursor style based on element
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

    // Handle window resize
    let resizeTimeout: NodeJS.Timeout | null = null
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const newWidth = window.innerWidth
        const newHeight = window.innerHeight
        
        if (canvas.width !== newWidth || canvas.height !== newHeight) {
          canvas.width = newWidth
          canvas.height = newHeight
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

  // Cursor styling
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
          background: 'transparent',
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
