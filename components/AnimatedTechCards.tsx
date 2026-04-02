'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const cards = [NeuralNetCard, TypingCard, SignalBarsCard] as const

export default function AnimatedTechCards() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [cardIndex, setCardIndex] = useState<number | null>(null)

  useEffect(() => {
    setCardIndex(Math.floor(Math.random() * cards.length))
    const update = () => setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  if (cardIndex === null) return null

  const Card = cards[cardIndex]

  return (
    <div className="mt-6">
      <Card isDarkMode={isDarkMode} />
    </div>
  )
}

/* ─── Card 1: Neural net canvas ─── */
function NeuralNetCard({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const zoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const zone = zoneRef.current
    if (!canvas || !zone) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0
    const layers = [3, 4, 4, 2]

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width = zone!.offsetWidth * dpr
      canvas!.height = zone!.offsetHeight * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => zone!.offsetWidth
    const H = () => zone!.offsetHeight

    function getNodes() {
      const nodes: { x: number; y: number; l: number; i: number }[] = []
      const padX = 24
      for (let l = 0; l < layers.length; l++) {
        const x = padX + (l / (layers.length - 1)) * (W() - padX * 2)
        const n = layers[l]
        for (let i = 0; i < n; i++) {
          const y = H() / 2 + (i - (n - 1) / 2) * 18
          nodes.push({ x, y, l, i })
        }
      }
      return nodes
    }

    function draw() {
      const w = W(), h = H()
      ctx!.clearRect(0, 0, w, h)
      const nodes = getNodes()
      t += 0.025

      const eR = isDarkMode ? 147 : 99, eG = isDarkMode ? 130 : 80, eB = isDarkMode ? 234 : 199
      const dR = isDarkMode ? 167 : 109, dG = isDarkMode ? 139 : 40, dB = isDarkMode ? 250 : 217
      const oR = isDarkMode ? 124 : 99, oG = isDarkMode ? 58 : 80, oB = isDarkMode ? 237 : 199
      const iR = isDarkMode ? 196 : 124, iG = isDarkMode ? 181 : 58, iB = isDarkMode ? 253 : 237

      for (let l = 0; l < layers.length - 1; l++) {
        const from = nodes.filter(n => n.l === l)
        const to = nodes.filter(n => n.l === l + 1)
        for (const f of from) {
          for (const tt of to) {
            const p = (Math.sin(t * 2 + f.i * 0.7 + tt.i * 0.5) + 1) / 2
            ctx!.beginPath()
            ctx!.moveTo(f.x, f.y)
            ctx!.lineTo(tt.x, tt.y)
            ctx!.strokeStyle = `rgba(${eR},${eG},${eB},${0.08 + p * 0.25})`
            ctx!.lineWidth = 0.8
            ctx!.stroke()
            if (Math.sin(t + f.i * 1.3 + tt.i * 2.1) > 0.85) {
              const prog = (Math.sin(t * 3 + f.i + tt.i) + 1) / 2
              ctx!.beginPath()
              ctx!.arc(f.x + (tt.x - f.x) * prog, f.y + (tt.y - f.y) * prog, 2, 0, Math.PI * 2)
              ctx!.fillStyle = `rgba(${dR},${dG},${dB},${0.6 + p * 0.4})`
              ctx!.fill()
            }
          }
        }
      }

      for (const n of nodes) {
        const p = (Math.sin(t * 1.5 + n.i * 0.9 + n.l * 1.2) + 1) / 2
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, 5 + p * 2, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${oR},${oG},${oB},${0.3 + p * 0.5})`
        ctx!.fill()
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, 3, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${iR},${iG},${iB},0.9)`
        ctx!.fill()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [isDarkMode])

  const scanColor = isDarkMode ? 'rgba(167,139,250,0.5)' : 'rgba(124,58,237,0.4)'

  return (
    <CardShell
      isDarkMode={isDarkMode}
      icon={
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="4" cy="5" r="2" fill={isDarkMode ? '#a78bfa' : '#7c3aed'} />
          <circle cx="4" cy="10" r="2" fill={isDarkMode ? '#a78bfa' : '#7c3aed'} />
          <circle cx="4" cy="15" r="2" fill={isDarkMode ? '#a78bfa' : '#7c3aed'} />
          <circle cx="10" cy="7.5" r="2" fill={isDarkMode ? '#8b5cf6' : '#6d28d9'} />
          <circle cx="10" cy="12.5" r="2" fill={isDarkMode ? '#8b5cf6' : '#6d28d9'} />
          <circle cx="16" cy="10" r="2" fill={isDarkMode ? '#7c3aed' : '#5b21b6'} />
          <line x1="6" y1="5" x2="8" y2="7.5" stroke={isDarkMode ? '#c4b5fd' : '#a78bfa'} strokeWidth="0.8" />
          <line x1="6" y1="10" x2="8" y2="7.5" stroke={isDarkMode ? '#c4b5fd' : '#a78bfa'} strokeWidth="0.8" />
          <line x1="6" y1="10" x2="8" y2="12.5" stroke={isDarkMode ? '#c4b5fd' : '#a78bfa'} strokeWidth="0.8" />
          <line x1="6" y1="15" x2="8" y2="12.5" stroke={isDarkMode ? '#c4b5fd' : '#a78bfa'} strokeWidth="0.8" />
          <line x1="12" y1="7.5" x2="14" y2="10" stroke={isDarkMode ? '#a78bfa' : '#7c3aed'} strokeWidth="0.8" />
          <line x1="12" y1="12.5" x2="14" y2="10" stroke={isDarkMode ? '#a78bfa' : '#7c3aed'} strokeWidth="0.8" />
        </svg>
      }
      title="AI model inference"
      sub="neural · prediction"
      badge="AI / ML"
      badgeClass={isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}
    >
      <div ref={zoneRef} className="relative w-full h-[110px] rounded-lg overflow-hidden">
        <div
          className="absolute left-0 right-0 h-[1.5px] opacity-50 z-10"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${scanColor} 40%, ${scanColor} 60%, transparent 100%)`,
            animation: 'scanDown 3s ease-in-out infinite',
          }}
        />
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </CardShell>
  )
}

/* ─── Card 2: Typing code ─── */
function TypingCard({ isDarkMode }: { isDarkMode: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    const lines = [
      'POST /api/inference',
      '> status: 200 OK',
      '> latency: 42ms',
      '> model: gpt-4o',
      '> tokens: 512',
      'GET /api/projects',
      '> count: 8 items',
      '> cache: HIT',
      'WS /stream/events',
      '> event: data_chunk',
      '> seq: 1041',
    ]

    let lineIdx = 0
    let charIdx = 0
    let displayed: string[] = []
    const MAX_LINES = 5
    let timerId: ReturnType<typeof setTimeout>

    function typeNext() {
      if (!box) return
      const line = lines[lineIdx % lines.length]
      if (charIdx <= line.length) {
        const partial = line.slice(0, charIdx)
        const showing = [...displayed, partial]
        if (showing.length > MAX_LINES) showing.shift()
        box.innerHTML = showing.join('\n') + '<span class="cursor-blink"></span>'
        charIdx++
        timerId = setTimeout(typeNext, 38 + Math.random() * 30)
      } else {
        displayed.push(line)
        if (displayed.length > MAX_LINES) displayed.shift()
        lineIdx++
        charIdx = 0
        timerId = setTimeout(typeNext, 420)
      }
    }
    typeNext()

    return () => clearTimeout(timerId)
  }, [])

  const textColor = isDarkMode ? '#c4b5fd' : '#6d28d9'

  return (
    <CardShell
      isDarkMode={isDarkMode}
      icon={
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="3" width="16" height="14" rx="2" stroke={isDarkMode ? '#60a5fa' : '#2563eb'} strokeWidth="1.2" fill="none" />
          <line x1="6" y1="8" x2="10" y2="8" stroke={isDarkMode ? '#93c5fd' : '#3b82f6'} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="6" y1="11" x2="14" y2="11" stroke={isDarkMode ? '#93c5fd' : '#3b82f6'} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="6" y1="14" x2="12" y2="14" stroke={isDarkMode ? '#bfdbfe' : '#60a5fa'} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      }
      title="Full stack API"
      sub="node · postgres · rest"
      badge="Full Stack"
      badgeClass={isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}
    >
      <div className="relative w-full h-[110px] rounded-lg overflow-hidden">
        <div
          ref={boxRef}
          className="absolute inset-0 font-mono text-[9px] leading-[1.7] whitespace-pre p-2 overflow-hidden"
          style={{ color: textColor }}
        />
      </div>
    </CardShell>
  )
}

/* ─── Card 3: Signal bars ─── */
function SignalBarsCard({ isDarkMode }: { isDarkMode: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    wrap.innerHTML = ''

    const N = 18
    const darkColors = ['#e9d5ff', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9']
    const lightColors = ['#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6']
    const colors = isDarkMode ? darkColors : lightColors

    for (let i = 0; i < N; i++) {
      const b = document.createElement('div')
      const maxH = 60 + Math.random() * 30
      const dur = (0.6 + Math.random() * 0.9).toFixed(2)
      const delay = (i * 0.07).toFixed(2)
      const color = colors[Math.floor(Math.random() * colors.length)]
      b.style.cssText = `width:10px;border-radius:2px 2px 0 0;height:${maxH}px;background:${color};transform-origin:bottom;animation:barPulse ${dur}s ease-in-out infinite alternate;animation-delay:${delay}s;opacity:0.85;`
      wrap.appendChild(b)
    }
  }, [isDarkMode])

  return (
    <CardShell
      isDarkMode={isDarkMode}
      icon={
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M10 10 L18 4 L18 16 Z" fill={isDarkMode ? '#fbbf24' : '#b45309'} opacity="0.8" />
          <circle cx="5" cy="10" r="3" fill="none" stroke={isDarkMode ? '#fbbf24' : '#d97706'} strokeWidth="1.2" />
          <circle cx="5" cy="10" r="1.5" fill={isDarkMode ? '#fbbf24' : '#d97706'} />
        </svg>
      }
      title="Real-time data stream"
      sub="websocket · events"
      badge="API · WS"
      badgeClass={isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'}
    >
      <div className="relative w-full h-[110px] rounded-lg overflow-hidden">
        <div
          ref={wrapRef}
          className="flex items-end justify-center gap-1 h-full px-1 py-3"
        />
      </div>
    </CardShell>
  )
}

/* ─── Shared card shell ─── */
function CardShell({
  isDarkMode,
  icon,
  title,
  sub,
  badge,
  badgeClass,
  children,
}: {
  isDarkMode: boolean
  icon: React.ReactNode
  title: string
  sub: string
  badge: string
  badgeClass: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl p-4 border transition-colors duration-300 ${
        isDarkMode
          ? 'border-gray-700/30'
          : 'border-gray-200/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-800/60 border-gray-700/50'
              : 'bg-gray-100 border-gray-200'
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight truncate text-white">
            {title}
          </p>
          <p className="text-[11px] font-mono mt-0.5 text-gray-300">
            {sub}
          </p>
        </div>
      </div>

      {/* Animation zone */}
      {children}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${badgeClass}`}>{badge}</span>
        <span
          className="w-[7px] h-[7px] rounded-full shrink-0"
          style={{
            background: isDarkMode ? '#34d399' : '#16a34a',
            animation: 'livePulse 1.4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes scanDown {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes barPulse {
          0%   { transform: scaleY(0.15); }
          100% { transform: scaleY(1); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(0.6); }
        }
        .cursor-blink {
          display: inline-block;
          width: 6px;
          height: 10px;
          background: currentColor;
          animation: blink 0.9s step-end infinite;
          vertical-align: -1px;
          margin-left: 1px;
        }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}
