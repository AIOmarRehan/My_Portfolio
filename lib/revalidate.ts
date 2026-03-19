import { revalidatePath } from 'next/cache'

/**
 * Revalidate the site cache locally, and also trigger
 * revalidation on the production Vercel deployment so changes
 * made from the local admin panel appear instantly in production.
 */
export async function revalidateSite() {
  // Revalidate the local Next.js cache
  revalidatePath('/', 'layout')

  // Trigger revalidation on the production deployment
  const siteUrl = process.env.SITE_URL
  const secret = process.env.REVALIDATION_SECRET
  if (siteUrl && secret) {
    try {
      await fetch(`${siteUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      })

      // Pre-warm the homepage cache so the page is already cached
      // by the time the admin switches to the browser.
      // Awaited intentionally — the admin action stays "loading" until
      // the Vercel page is fully rendered and cached. After this,
      // visiting the site is instant.
      await fetch(siteUrl).catch(() => {})
    } catch {
      // Non-critical — local write already succeeded
      console.warn('Failed to trigger production revalidation')
    }
  }
}
