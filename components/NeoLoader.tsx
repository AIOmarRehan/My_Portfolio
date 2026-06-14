'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Shared neubrutalist full-screen loader (logo + bouncing 6-colour blocks).
 *
 * It is PORTALED to <body> so it escapes the <main> stacking context
 * (main has `relative z-10`, which would otherwise trap the overlay BELOW the
 * fixed header). This guarantees the loader covers the header on every loading
 * page (route transitions, project details, etc.).
 */
export default function NeoLoader() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const content = (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center"
      style={{ background: 'var(--neo-bg)' }}
      aria-label="Loading"
      role="status"
    >
      <div className="relative flex flex-col items-center gap-7">
        <div className="neo-card neo-card-alt w-20 h-20 p-2 flex items-center justify-center -rotate-2">
          <img src="/favicon.svg?v=2" alt="" width={64} height={64} className="w-full h-full object-contain" />
        </div>

        <div className="neo-loader">
          <span style={{ background: 'var(--neo-blue)' }} />
          <span style={{ background: 'var(--neo-cyan)' }} />
          <span style={{ background: 'var(--neo-orange)' }} />
          <span style={{ background: 'var(--neo-lime)' }} />
          <span style={{ background: 'var(--neo-yellow)' }} />
          <span style={{ background: 'var(--neo-pink)' }} />
        </div>

        <div className="neo-tag neo-tag-yellow uppercase tracking-widest">Loading…</div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}
