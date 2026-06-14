'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import ScrollToContactButton from './ScrollToContactButton'
import { NeoBlockSkeleton } from './Skeletons'

/**
 * Below-the-fold contact + QR block.
 * Heavy client deps (reCAPTCHA, the animated tech-card canvas) are code-split
 * via next/dynamic and only mounted once the block scrolls near the viewport.
 * Keeps them out of the initial bundle => snappier first load.
 */

const ContactForm = dynamic(() => import('./ContactForm'), {
  ssr: false,
  loading: () => (
    <div className="max-w-lg mx-auto space-y-5 px-2 sm:px-6">
      <NeoBlockSkeleton className="h-12 w-full" />
      <NeoBlockSkeleton className="h-12 w-full" />
      <NeoBlockSkeleton className="h-28 w-full" />
      <NeoBlockSkeleton className="h-12 w-full" />
    </div>
  ),
})

const QRSection = dynamic(() => import('./QRSection'), {
  ssr: false,
  loading: () => <NeoBlockSkeleton className="h-[420px] w-full" />,
})

interface QRCard {
  label: string
  imageSrc: string
  borderColor: string
  textColor: string
  buttonType: 'cv' | 'whatsapp'
  linkUrl: string
}

export default function HomeContactQR({ qrCards }: { qrCards?: QRCard[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* CTA / Contact - Left */}
      <section className="neo-card neo-card-alt py-12 px-6 fade-in" aria-label="Contact form section">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 inline-block bg-neo-purple border-neo border-neo-border px-4 py-2 shadow-neo-sm -rotate-1">
            Interested in collaborating?
          </h2>
          <p className="mb-2 max-w-xl mx-auto font-semibold text-[color:var(--neo-ink-soft)]">
            I&apos;m always open to new opportunities and interesting projects.
          </p>
          <p className="mb-6 max-w-xl mx-auto font-semibold text-[color:var(--neo-ink-soft)]">
            Feel free to reach out!
          </p>
          <div className="mb-8">
            <ScrollToContactButton />
          </div>
        </div>
        {show ? (
          <ContactForm />
        ) : (
          <div className="max-w-lg mx-auto space-y-5 px-2 sm:px-6">
            <NeoBlockSkeleton className="h-12 w-full" />
            <NeoBlockSkeleton className="h-12 w-full" />
            <NeoBlockSkeleton className="h-28 w-full" />
            <NeoBlockSkeleton className="h-12 w-full" />
          </div>
        )}
      </section>

      {/* QR - Right */}
      {show ? <QRSection initialCards={qrCards} /> : <NeoBlockSkeleton className="h-[420px] w-full" />}
    </div>
  )
}
