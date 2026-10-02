import { cache } from 'react'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabaseServer'

/*
 * Server-only helpers for the three project detail routes (/projects/[id],
 * /fullstack-projects/[id], /data-analytics-projects/[id]) and the sitemap.
 * They use the service-role client, so never import this from a client component.
 */

/** Production origin; matches metadataBase in app/layout.tsx. */
export const SITE_URL = 'https://omar-rehan.vercel.app'

export const DETAIL_SECTIONS = {
  ai: { table: 'projects', basePath: '/projects', label: 'AI Project' },
  fullstack: { table: 'fullstack_projects', basePath: '/fullstack-projects', label: 'Full-Stack Project' },
  analytics: { table: 'data_analytics_projects', basePath: '/data-analytics-projects', label: 'Data Analytics Project' },
} as const

export type DetailSection = (typeof DETAIL_SECTIONS)[keyof typeof DETAIL_SECTIONS]

export interface DetailRow {
  id: number
  title: string | null
  description: string | null
  image: string | null
  created_at: string | null
}

/**
 * The row behind one detail page, or null when the id isn't numeric or doesn't exist.
 * React cache() lets generateMetadata and the layout share a single query per request.
 * A database error throws instead of returning null, so an outage is never cached as
 * a 404; ISR keeps serving the last good page instead.
 */
export const getDetailRow = cache(async (table: DetailSection['table'], id: string): Promise<DetailRow | null> => {
  if (!/^\d{1,15}$/.test(id)) return null
  const { data, error } = await supabase
    .from(table)
    .select('id, title, description, image, created_at')
    .eq('id', Number(id))
    .maybeSingle()
  if (error) throw new Error(`Failed to load ${table} #${id}: ${error.message}`)
  return (data as DetailRow | null) ?? null
})

/** Every id in a section, prerendered at build. Errors only log, so a build never fails on data. */
export async function getDetailStaticParams(section: DetailSection): Promise<{ id: string }[]> {
  const { data, error } = await supabase.from(section.table).select('id')
  if (error) {
    console.error(`generateStaticParams: failed to list ${section.table}:`, error.message)
    return []
  }
  return ((data ?? []) as { id: number }[]).map((row) => ({ id: String(row.id) }))
}

/**
 * Metadata for an unknown id. The layout's notFound() renders the site 404 page, but the
 * root app/loading.tsx Suspense boundary means Next streams it with HTTP 200, so the page
 * needs its own title and an explicit noindex.
 */
export const NOT_FOUND_METADATA: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

const DESCRIPTION_MAX = 160

/** Collapse whitespace and cut at a word boundary to at most 160 characters plus an ellipsis. */
function summarize(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= DESCRIPTION_MAX) return clean
  const cut = clean.slice(0, DESCRIPTION_MAX)
  const lastSpace = cut.lastIndexOf(' ')
  const words = lastSpace > DESCRIPTION_MAX / 2 ? cut.slice(0, lastSpace) : cut
  return `${words.replace(/[\s,.;:!?-]+$/, '')}…`
}

/** Title, description, canonical and social cards for one detail page. */
export function buildDetailMetadata(section: DetailSection, row: DetailRow): Metadata {
  const path = `${section.basePath}/${row.id}`
  const title = row.title?.trim() || section.label
  const description = row.description?.trim()
    ? summarize(row.description)
    : `${title}: ${section.label} by Omar Rehan.`
  const image =
    row.image && /^https?:\/\//i.test(row.image)
      ? { url: row.image, alt: title }
      : { url: '/web-app-manifest-512x512.png', width: 512, height: 512, alt: 'Omar Rehan Portfolio' }
  const socialTitle = `${title} | Omar Rehan`

  return {
    // The root layout's template renders this as "<title> | Omar Rehan".
    title,
    description,
    alternates: { canonical: path },
    // These replace the root layout's openGraph/twitter objects wholesale, which is
    // why they repeat siteName, locale and creator.
    openGraph: {
      type: 'article',
      locale: 'en_US',
      siteName: 'Omar Rehan Portfolio',
      url: path,
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image.url],
      creator: '@omar_rehan',
    },
  }
}
