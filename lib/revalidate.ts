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
    } catch {
      // Non-critical — local write already succeeded
      console.warn('Failed to trigger production revalidation')
    }
  }
}
