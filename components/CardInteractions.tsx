'use client'
import { useEffect } from 'react'

/**
 * Smooth 3D tilt for every .neo-tilt card (desktop only).
 *
 * This component lives in the persistent layout, so after client navigation the
 * old card nodes are replaced. Rather than depend on fragile mount timing, we
 * use a MutationObserver that binds ANY .neo-tilt card the moment it appears in
 * the DOM (and only once, tracked via a data flag). This survives every
 * navigation: back button, "Details" link, logo click, etc.
 *
 * Per-card mousemove + mouseleave (mouseleave does NOT fire on internal child
 * moves => no flicker). Disabled on touch / narrow screens / reduced-motion.
 */
export default function CardInteractions() {
  useEffect(() => {
    const ok =
      window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!ok) return

    const rafByCard = new WeakMap<HTMLElement, number>()

    const onMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement
      const prev = rafByCard.get(card)
      if (prev) cancelAnimationFrame(prev)
      const cx = e.clientX
      const cy = e.clientY
      const id = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect()
        const px = (cx - r.left) / r.width - 0.5
        const py = (cy - r.top) / r.height - 0.5
        card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`
      })
      rafByCard.set(card, id)
    }
    const onLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement
      const prev = rafByCard.get(card)
      if (prev) cancelAnimationFrame(prev)
      card.style.transform = ''
    }

    const bindAll = () => {
      document.querySelectorAll<HTMLElement>('.neo-tilt:not([data-tilt])').forEach((card) => {
        card.dataset.tilt = '1'
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
      })
    }

    bindAll()
    const mo = new MutationObserver(() => bindAll())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => mo.disconnect()
  }, [])

  return null
}
