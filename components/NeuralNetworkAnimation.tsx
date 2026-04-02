'use client'

import { useEffect, useRef, useState } from 'react'

export default function NeuralNetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scanLineRef = useRef<HTMLDivElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const scanLine = scanLineRef.current
    if (!canvas || !container || !scanLine) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0
    let scanTop = 0

    const layers = [3, 5, 6, 5, 3]

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width = container!.offsetWidth * dpr
      canvas!.height = container!.offsetHeight * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const W = () => container!.offsetWidth
    const H = () => container!.offsetHeight

    function getNodes() {
      const nodes: { x: number; y: number; l: number; i: number }[] = []
      const padX = 40
      const w = W()
      const h = H()
      for (let l = 0; l < layers.length; l++) {
        const x = padX + (l / (layers.length - 1)) * (w - padX * 2)
        const n = layers[l]
        for (let i = 0; i < n; i++) {
          const y = h / 2 + (i - (n - 1) / 2) * 20
          nodes.push({ x, y, l, i })
        }
      }
      return nodes
    }

    function draw() {
      const w = W()
      const h = H()
      ctx!.clearRect(0, 0, w, h)
      const nodes = getNodes()
      t += 0.02

      const dark = isDarkMode

      // Edge + pulse colors
      const edgeR = dark ? 147 : 99
      const edgeG = dark ? 130 : 80
      const edgeB = dark ? 234 : 199

      const dotR = dark ? 167 : 109
      const dotG = dark ? 139 : 40
      const dotB = dark ? 250 : 217

      const nodeOuterR = dark ? 124 : 99
      const nodeOuterG = dark ? 58 : 80
      const nodeOuterB = dark ? 237 : 199

      const nodeInnerR = dark ? 196 : 124
      const nodeInnerG = dark ? 181 : 58
      const nodeInnerB = dark ? 253 : 237

      // Draw edges with travelling pulses
      for (let l = 0; l < layers.length - 1; l++) {
        const fromNodes = nodes.filter(n => n.l === l)
        const toNodes = nodes.filter(n => n.l === l + 1)

        for (const f of fromNodes) {
          for (const to of toNodes) {
            const pulse = (Math.sin(t * 2 + f.i * 0.7 + to.i * 0.5) + 1) / 2

            // Edge line
            ctx!.beginPath()
            ctx!.moveTo(f.x, f.y)
            ctx!.lineTo(to.x, to.y)
            ctx!.strokeStyle = `rgba(${edgeR},${edgeG},${edgeB},${0.06 + pulse * 0.18})`
            ctx!.lineWidth = 0.7
            ctx!.stroke()

            // Travelling dot
            if (Math.sin(t + f.i * 1.3 + to.i * 2.1) > 0.8) {
              const prog = (Math.sin(t * 3 + f.i + to.i) + 1) / 2
              const dx = f.x + (to.x - f.x) * prog
              const dy = f.y + (to.y - f.y) * prog

              ctx!.beginPath()
              ctx!.arc(dx, dy, 1.8, 0, Math.PI * 2)
              ctx!.fillStyle = `rgba(${dotR},${dotG},${dotB},${0.5 + pulse * 0.5})`
              ctx!.fill()
            }
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = (Math.sin(t * 1.5 + n.i * 0.9 + n.l * 1.2) + 1) / 2
        const r = 5 + pulse * 2.5

        // Outer glow
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${nodeOuterR},${nodeOuterG},${nodeOuterB},${0.2 + pulse * 0.35})`
        ctx!.fill()

        // Inner core
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, 3, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${nodeInnerR},${nodeInnerG},${nodeInnerB},0.9)`
        ctx!.fill()
      }

      // Scan line movement
      scanTop += 0.8
      if (scanTop > h) scanTop = -2
      if (scanLine) {
        scanLine.style.top = scanTop + 'px'
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [isDarkMode])

  const scanGradient = isDarkMode
    ? 'linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.5) 40%, rgba(167,139,250,0.5) 60%, transparent 100%)'
    : 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.4) 40%, rgba(124,58,237,0.4) 60%, transparent 100%)'

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: 130 }}
      aria-hidden="true"
    >
      <div
        ref={scanLineRef}
        className="absolute left-0 right-0"
        style={{
          height: '1.5px',
          background: scanGradient,
          opacity: 0.6,
          top: 0,
        }}
      />
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
