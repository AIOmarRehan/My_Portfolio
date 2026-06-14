'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Combines two interactions in one mounted client component:
 *  1. A blend-mode custom cursor (ring lerps toward the pointer, dot snaps).
 *     Grows over interactive elements, becomes an I-beam over text fields.
 *     The OS cursor is hidden whenever this is active.
 *  2. A drifting floating-shapes background that parallaxes with the mouse
 *     and is theme-aware (shapes inherit the neo CSS variables).
 */
export default function InteractiveBackground() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const shapesRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState<'default' | 'interactive' | 'text'>('default')

  useEffect(() => {
    const evaluate = () => {
      // Desktop / fine-pointer devices get the cursor; phones & tablets
      // (hover:none / pointer:coarse) do not. Width guard for small laptops.
      const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const wide = window.innerWidth >= 1024
      setEnabled(desktopPointer && wide)
    }
    evaluate()
    window.addEventListener('resize', evaluate)
    return () => window.removeEventListener('resize', evaluate)
  }, [])

  // ---- Cursor ----
  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('neo-cursor-on')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0

    const loop = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable="true"]')) {
        setVariant('text')
      } else if (t.closest('a, button, [role="button"], [role="link"], .neo-btn, .neo-interactive, .neo-tilt, [data-hover]')) {
        setVariant('interactive')
      } else {
        setVariant('default')
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.classList.remove('neo-cursor-on')
    }
  }, [enabled])

  // ---- Floating shapes ----
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wrap = shapesRef.current
    if (!wrap || prefersReduced) return

    // Exactly the 6 section colors (AI, full-stack, data, experience, certs, articles)
    const palette = ['var(--neo-blue)', 'var(--neo-cyan)', 'var(--neo-orange)', 'var(--neo-lime)', 'var(--neo-yellow)', 'var(--neo-pink)']
    const count = window.innerWidth < 700 ? 5 : 9
    const shapes: { el: HTMLDivElement; rot: number }[] = []
    wrap.innerHTML = ''

    for (let i = 0; i < count; i++) {
      const s = document.createElement('div')
      s.className = 'neo-floaty'
      const size = 40 + Math.random() * 90
      s.style.width = size + 'px'
      s.style.height = size + 'px'
      s.style.left = Math.random() * 90 + '%'
      s.style.top = Math.random() * 90 + '%'
      s.style.background = palette[i % palette.length]
      if (Math.random() > 0.6) s.style.borderRadius = '50%'
      wrap.appendChild(s)
      shapes.push({ el: s, rot: Math.random() * 0.4 })
    }

    let pmx = 0
    let pmy = 0
    const onMove = (e: MouseEvent) => {
      pmx = e.clientX / window.innerWidth - 0.5
      pmy = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let t = 0
    let raf = 0
    const drift = () => {
      t += 0.01
      for (let i = 0; i < shapes.length; i++) {
        const o = shapes[i]
        const fx = Math.sin(t + i) * 14 + pmx * (30 + i * 6)
        const fy = Math.cos(t + i) * 14 + pmy * (30 + i * 6)
        o.el.style.transform = `translate(${fx}px, ${fy}px) rotate(${t * 20 * o.rot + i * 15}deg)`
      }
      raf = requestAnimationFrame(drift)
    }
    raf = requestAnimationFrame(drift)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div ref={shapesRef} className="neo-bg-shapes" aria-hidden="true" />
      {enabled && (
        <>
          <div ref={ringRef} className={`neo-cursor-ring neo-cursor-ring--${variant}`} aria-hidden="true" />
          <div ref={dotRef} className={`neo-cursor-dot neo-cursor-dot--${variant}`} aria-hidden="true" />
        </>
      )}
    </>
  )
}
