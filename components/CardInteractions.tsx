'use client'
import { useEffect } from 'react'

/**
 * Smooth 3D tilt for every .neo-tilt card (desktop only).
 *
 * This lives in the persistent layout, so after client navigation the old card
 * nodes are replaced. A MutationObserver binds any .neo-tilt card the moment it
 * enters the DOM, which survives every navigation (back button, detail links,
 * logo click) without depending on mount timing.
 *
 * Bound cards are tracked in a WeakSet rather than a `data-tilt` attribute:
 * writing an attribute here ran before React hydrated these nodes, so the
 * client DOM carried an attribute the server HTML didn't and React reported a
 * hydration mismatch. A WeakSet keeps the bookkeeping entirely out of the DOM.
 *
 * Per-card mousemove + mouseleave (mouseleave does NOT fire when moving between
 * a card's own children, so there's no flicker). Disabled on touch, narrow
 * screens and reduced-motion.
 */
export default function CardInteractions() {
  useEffect(() => {
    const ok =
      window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!ok) return

    const rafByCard = new WeakMap<HTMLElement, number>()
    const bound = new WeakSet<HTMLElement>()

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

    let scheduled = 0
    const bindAll = () => {
      scheduled = 0
      document.querySelectorAll<HTMLElement>('.neo-tilt').forEach((card) => {
        if (bound.has(card)) return
        bound.add(card)
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
      })
    }

    // Coalesce bursts of DOM mutations (hydration, modal open/close, "Show
    // All") into a single pass per frame instead of one querySelectorAll each.
    const schedule = () => {
      if (scheduled) return
      scheduled = requestAnimationFrame(bindAll)
    }

    schedule()
    const mo = new MutationObserver(schedule)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      if (scheduled) cancelAnimationFrame(scheduled)
    }
  }, [])

  return null
}
