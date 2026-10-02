'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import PixelHeart, { MiniPixelHeart } from './PixelHeart'

/** The burst plays for at least this long before the browser leaves for Stripe. */
const BURST_MS = 600

const BURST_COLORS = ['var(--neo-red)', 'var(--neo-pink)', 'var(--neo-yellow)', 'var(--neo-purple)']

/* Eight small hearts fly out of the main one, alternating near and far
   (the X/Twitter like burst, in pixels). Offsets feed the CSS keyframes. */
const PARTICLES = Array.from({ length: 8 }, (_, i) => {
  const rad = ((i * 45 - 90) * Math.PI) / 180
  const dist = i % 2 ? 26 : 36
  return {
    color: BURST_COLORS[i % BURST_COLORS.length],
    style: {
      '--tx': `${Math.round(Math.cos(rad) * dist)}px`,
      '--ty': `${Math.round(Math.sin(rad) * dist)}px`,
      '--rot': `${i % 2 ? 20 : -20}deg`,
      animationDelay: `${i % 2 ? 50 : 0}ms`,
    } as CSSProperties,
  }
})

type CheckoutResult = { url: string } | { error: string }

/** Asks our server for a Stripe Checkout Session. Never throws. */
async function requestCheckout(): Promise<CheckoutResult> {
  try {
    const res = await fetch('/api/sponsor', { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    if (res.ok && typeof data.url === 'string' && data.url.startsWith('https://')) {
      return { url: data.url }
    }
    return { error: typeof data.error === 'string' ? data.error : 'Could not open Stripe checkout. Please try again.' }
  } catch {
    return { error: 'Could not reach the server. Please check your connection and try again.' }
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Sponsor button for the Contact & Profiles card. Payment happens on Stripe's
 * hosted Checkout page, so no card details ever touch this site.
 */
export default function SponsorButton() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [burst, setBurst] = useState(0)
  const burstTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    // Pressing Back on Stripe can restore this page from the back/forward cache
    // with the button still busy, so reset it.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setPending(false)
        setBurst(0)
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      clearTimeout(burstTimer.current)
    }
  }, [])

  const handleClick = useCallback(async () => {
    if (pending) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPending(true)
    setError('')
    if (!reduceMotion) {
      setBurst((n) => n + 1)
      clearTimeout(burstTimer.current)
      burstTimer.current = setTimeout(() => setBurst(0), 900)
    }

    // Create the session while the burst plays; reduced motion redirects as soon as it can.
    const [result] = await Promise.all([requestCheckout(), wait(reduceMotion ? 0 : BURST_MS)])
    if ('url' in result) {
      window.location.assign(result.url)
      return // stay busy while the browser navigates to Stripe
    }
    setError(result.error)
    setPending(false)
  }, [pending])

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        aria-disabled={pending || undefined}
        aria-busy={pending || undefined}
        aria-label={pending ? undefined : 'Sponsor Omar Rehan through Stripe secure checkout'}
        className="neo-btn neo-btn-pink neo-btn-sponsor relative w-full py-3.5 text-base uppercase tracking-wide"
      >
        <span className="neo-sponsor-icon" aria-hidden="true">
          <span key={`heart-${burst}`} className={burst ? 'neo-sponsor-heart is-popping' : 'neo-sponsor-heart'}>
            <PixelHeart className="w-[27px] h-6 -my-0.5" />
          </span>
          {burst > 0 && (
            <span key={`burst-${burst}`} className="neo-heart-burst">
              {PARTICLES.map((p, i) => (
                <span key={i} className="neo-heart-particle" style={p.style}>
                  <MiniPixelHeart color={p.color} />
                </span>
              ))}
            </span>
          )}
        </span>
        {pending ? 'Opening Stripe…' : 'Sponsor'}
      </button>
      <p className="mt-2 text-center text-[0.68rem] font-extrabold uppercase tracking-widest text-[color:var(--neo-ink-soft)]">
        Secure checkout by Stripe
      </p>
      <p role="status" aria-live="polite" className="text-center [&:not(:empty)]:mt-2">
        {error && (
          <span className="inline-block bg-neo-yellow text-[#111] border-2 border-neo-border rounded px-2.5 py-1 text-xs font-extrabold shadow-neo-sm">
            {error}
          </span>
        )}
      </p>
    </div>
  )
}
