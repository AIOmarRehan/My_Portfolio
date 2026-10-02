import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { DETAIL_SECTIONS, NOT_FOUND_METADATA, buildDetailMetadata, getDetailRow, getDetailStaticParams } from '@/lib/detailPages'

const section = DETAIL_SECTIONS.analytics

// Same caching as the homepage; admin saves call revalidatePath('/', 'layout'), which refreshes these too.
export const revalidate = 3600

export function generateStaticParams() {
  return getDetailStaticParams(section)
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const row = await getDetailRow(section.table, id)
  // Unknown id: the layout below calls notFound(); this only titles that 404 page.
  if (!row) return NOT_FOUND_METADATA
  return buildDetailMetadata(section, row)
}

/**
 * Server shell for the client detail page: metadata in <head>. Unknown ids get the site
 * 404 page with noindex, but HTTP 200, because the root app/loading.tsx boundary has
 * already started streaming when notFound() runs.
 */
export default async function DataAnalyticsDetailLayout({ children, params }: Props & { children: ReactNode }) {
  const { id } = await params
  if (!(await getDetailRow(section.table, id))) notFound()
  return children
}
