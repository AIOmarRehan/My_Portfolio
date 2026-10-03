'use client'

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import PixelHeart, { MiniPixelHeart } from './PixelHeart'

/** Sponsorships go through PayPal.me, so payment happens entirely on PayPal's site. */
const PAYPAL_URL = 'https://paypal.me/AIOmarRehan'

/** Length of the like animation; PayPal opens once it has played. */
const LIKE_MS = 900

const COLORS = [
  'var(--neo-red)',
  'var(--neo-pink)',
  'var(--neo-yellow)',
  'var(--neo-purple)',
  'var(--neo-cyan)',
  'var(--neo-lime)',
  'var(--neo-orange)',
]

const at = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180
  return { x: Math.round(Math.cos(rad) * r), y: Math.round(Math.sin(rad) * r) }
}
/** Start/end offsets for a particle travelling outward along one angle. */
const path = (deg: number, from: number, to: number) => {
  const s = at(deg, from)
  const e = at(deg, to)
  return { '--sx': `${s.x}px`, '--sy': `${s.y}px`, '--tx': `${e.x}px`, '--ty': `${e.y}px` }
}

/* Like the X/Twitter like burst: 7 pairs around the ring, each a small pixel heart
   plus a pixel dot, flying out from the ring's edge and shrinking away. */
const PAIRS = Array.from({ length: 7 }, (_, i) => {
  const angle = -90 + (i * 360) / 7
  return {
    heartColor: COLORS[i],
    heart: path(angle - 9, 15, 34) as CSSProperties,
    dot: { ...path(angle + 11, 13, 27), background: COLORS[(i + 3) % COLORS.length] } as CSSProperties,
  }
})

/**
 * Sponsor button for the Contact & Profiles card. A click plays the like animation,
 * then switches to PayPal.me (no payment details ever touch this site). It moves in
 * the same tab: a new tab opened after a delay would be stopped by popup blockers.
 */
export default function SponsorButton() {
  const [burst, setBurst] = useState(0)
  const leaving = useRef(false)
  const navTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    // Pressing Back on PayPal can restore this page from the back/forward cache.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        leaving.current = false
        setBurst(0)
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      clearTimeout(navTimer.current)
    }
  }, [])

  const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    // Modified clicks (new tab or window) behave like a normal link.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    // Reduced motion: no animation, the link opens straight away.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    e.preventDefault()
    if (leaving.current) return
    leaving.current = true
    setBurst((n) => n + 1)
    navTimer.current = setTimeout(() => window.location.assign(PAYPAL_URL), LIKE_MS)
  }, [])

  return (
    <div>
      <a
        href={PAYPAL_URL}
        onClick={handleClick}
        aria-label="Sponsor Omar Rehan on PayPal"
        className="neo-btn neo-btn-pink neo-btn-sponsor relative w-full py-3.5 text-base uppercase tracking-wide"
      >
        <span className="neo-sponsor-icon" aria-hidden="true">
          <span key={`heart-${burst}`} className={burst ? 'neo-sponsor-heart is-liked' : 'neo-sponsor-heart'}>
            <PixelHeart className="w-[27px] h-6 -my-0.5" />
          </span>
          {burst > 0 && (
            <span key={`burst-${burst}`} className="neo-heart-burst">
              <span className="neo-heart-ring" />
              {PAIRS.map((p, i) => (
                <Fragment key={i}>
                  <span className="neo-heart-particle" style={p.heart}>
                    <MiniPixelHeart color={p.heartColor} />
                  </span>
                  <span className="neo-heart-dot" style={p.dot} />
                </Fragment>
              ))}
            </span>
          )}
        </span>
        Sponsor
      </a>
      <p className="mt-2 text-center text-[0.68rem] font-extrabold uppercase tracking-widest text-[color:var(--neo-ink-soft)]">
        Secure payment via PayPal
      </p>
    </div>
  )
}
