import Link from 'next/link'
import type { Metadata } from 'next'
import PixelHeart from '@/components/PixelHeart'

// Stripe Checkout sends sponsors here after a successful payment.
// Kept out of search results (and out of app/sitemap.ts).
export const metadata: Metadata = {
  title: 'Thank You',
  robots: { index: false, follow: true },
}

export default function SponsorThanksPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="neo-card neo-card-alt max-w-xl px-8 sm:px-14 py-12 -rotate-1">
        <PixelHeart className="mx-auto mb-8 w-[72px] h-16" />
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-5">
          Thank you for your{' '}
          <span className="bg-neo-pink px-2 border-neo border-neo-border shadow-neo-sm inline-block">support</span>
        </h1>
        <p className="text-base sm:text-lg font-medium text-[color:var(--neo-ink-soft)] mb-10">
          Your sponsorship helps me keep building and sharing my work. It means a lot.
        </p>
        <Link href="/" className="neo-btn neo-btn-yellow px-8 py-3.5 uppercase tracking-wide">
          ← Back to Home Page
        </Link>
      </div>
    </section>
  )
}
