'use client'
import { useEffect, useRef, useState } from 'react'

// Easing functions for smooth animations
const easeInOutSine = (t: number): number => -Math.cos(t * Math.PI) / 2 + 0.5

const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5)

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
  const [cursorType, setCursorType] = useState<'arrow' | 'hand' | 'text'>('arrow')
  const [hasFinePointer, setHasFinePointer] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [backgroundPos, setBackgroundPos] = useState(0)
  const [glowIntensity, setGlowIntensity] = useState(1)
  const [cursorColor, setCursorColor] = useState('#93c5fd')
  const [svgCache, setSvgCache] = useState<{arrow?: string, hand?: string, text?: string}>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, radius: 140 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const darkModeTargetRef = useRef(false)
  const darkModeProgressRef = useRef(0)

  useEffect(() => {
    setMounted(true)
    
    // Load SVG cursor files
    const loadSVGs = async () => {
      try {
        const [arrowRes, handRes, textRes] = await Promise.all([
          fetch('/cursors/arrowhead-pointer.svg'),
          fetch('/cursors/hand-pointer.svg'),
          fetch('/cursors/text-pointer.svg'),
        ])
        
        const [arrowSvg, handSvg, textSvg] = await Promise.all([
          arrowRes.text(),
          handRes.text(),
          textRes.text(),
        ])
        
        setSvgCache({
          arrow: arrowSvg,
          hand: handSvg,
          text: textSvg,
        })
      } catch (error) {
        console.error('Failed to load cursor SVGs:', error)
      }
    }
    
    loadSVGs()
  }, [])

  // Monitor theme changes for cursor styling
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

  // Advanced cursor animation with multiple effects
  useEffect(() => {
    if (!mounted) return
    let animationId: number
    let startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      
      // Main gradient position (smooth loop)
      const position = (elapsed * 35) % 200
      setBackgroundPos(position)
      
      // Pulsing glow effect (breathing effect)
      const pulse = easeInOutSine((elapsed * 2) % 1)
      setGlowIntensity(0.7 + pulse * 0.3)
      
      // Gradual color transition (very slow, smooth)
      const colorProgress = easeInOutSine((elapsed * 0.1) % 1) // Much slower (0.1 instead of 0.5)
      
      // Smoothly interpolate between two main colors
      if (isDarkMode) {
        const from = hexToRgb('#93c5fd') // Light blue
        const to = hexToRgb('#e9d5ff')   // Light purple
        const r = Math.round(from.r + (to.r - from.r) * colorProgress)
        const g = Math.round(from.g + (to.g - from.g) * colorProgress)
        const b = Math.round(from.b + (to.b - from.b) * colorProgress)
        setCursorColor(`rgb(${r}, ${g}, ${b})`)
      } else {
        const from = hexToRgb('#00ffff') // Cyan
        const to = hexToRgb('#ff00ff')   // Magenta
        const r = Math.round(from.r + (to.r - from.r) * colorProgress)
        const g = Math.round(from.g + (to.g - from.g) * colorProgress)
        const b = Math.round(from.b + (to.b - from.b) * colorProgress)
        setCursorColor(`rgb(${r}, ${g}, ${b})`)
      }
      
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [mounted, isDarkMode])

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

      // Update cursor style based on element - prioritize clickables
      const target = e.target as HTMLElement
      if (target.closest('button, a, [role="button"], link, [role="link"], .cursor-pointer, .interactive')) {
        setCursorType('hand')
      } else if (target.closest('input, textarea, [contenteditable="true"]')) {
        setCursorType('text')
      } else {
        setCursorType('arrow')
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

  // SVG cursor with dynamic theme colors and glow
  const getCursorStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.15s ease',
    }

    if (cursorType === 'arrow') {
      return {
        ...baseStyle,
        width: '24px',
        height: '24px',
      }
    } else if (cursorType === 'hand') {
      return {
        ...baseStyle,
        width: '20px',
        height: '20px',
      }
    } else if (cursorType === 'text') {
      return {
        ...baseStyle,
        width: '3px',
        height: '24px',
      }
    }

    return baseStyle
  }

  const rendererSVG = () => {
    const glowSize = 1 + glowIntensity * 1.5 // Reduced glow for smaller cursors
    let svg = ''
    let baseSvg = ''

    if (cursorType === 'arrow' && svgCache.arrow) {
      baseSvg = svgCache.arrow
    } else if (cursorType === 'hand' && svgCache.hand) {
      baseSvg = svgCache.hand
    } else if (cursorType === 'text' && svgCache.text) {
      baseSvg = svgCache.text
    }

    if (!baseSvg) return ''

    // Add glow filter and replace colors dynamically
    const glowFilter = `
      <defs>
        <filter id="glow-cursor" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="${glowSize}" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    `

    // Replace colors in SVG with dynamic theme colors
    svg = baseSvg
      .replace(/fill='#FFF'/g, `fill='${cursorColor}'`)
      .replace(/fill="#FFF"/g, `fill="${cursorColor}"`)
      .replace(/stroke='#000'/g, `stroke='${isDarkMode ? '#1e293b' : '#0f172a'}'`)
      .replace(/stroke="#000"/g, `stroke="${isDarkMode ? '#1e293b' : '#0f172a'}"`)
      .replace(/fill='#010101'/g, `fill='${cursorColor}'`)
      .replace(/fill="#010101"/g, `fill="${cursorColor}"`)
      .replace(/fill='#12171A'/g, `fill='${isDarkMode ? '#334155' : '#475569'}'`)
      .replace(/fill="#12171A"/g, `fill="${isDarkMode ? '#334155' : '#475569'}"`)
    
    // Remove existing defs to avoid conflicts, then inject new one
    svg = svg.replace(/<defs>[\s\S]*?<\/defs>/g, '')
    
    // Add glow filter at the beginning of SVG
    svg = svg.replace(/<svg/, `<svg style="overflow: visible"`)
    const firstClosingBracket = svg.indexOf('>')
    svg = svg.substring(0, firstClosingBracket + 1) + glowFilter + svg.substring(firstClosingBracket + 1)
    
    // Add filter to all path elements
    svg = svg.replace(/<path/g, `<path filter="url(#glow-cursor)"`)

    return svg
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
          dangerouslySetInnerHTML={{ __html: rendererSVG() }}
        />
      ) : null}
    </>
  )
}
