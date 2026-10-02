import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabaseServer'
import { DETAIL_SECTIONS, SITE_URL } from '@/lib/detailPages'

// The only sitemap source (next-sitemap and its static public/ copies are gone).
// Rebuilt hourly, and on admin saves through revalidatePath('/', 'layout').
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const detailEntries = await Promise.all(
    Object.values(DETAIL_SECTIONS).map(async (section) => {
      const { data, error } = await supabase
        .from(section.table)
        .select('id, created_at')
        .order('created_at', { ascending: false })
      if (error) {
        console.error(`sitemap: failed to list ${section.table}:`, error.message)
        return []
      }
      return ((data ?? []) as { id: number; created_at: string | null }[]).map((row) => ({
        url: `${SITE_URL}${section.basePath}/${row.id}`,
        ...(row.created_at ? { lastModified: new Date(row.created_at) } : {}),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    })
  )

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...detailEntries.flat(),
    {
      url: `${SITE_URL}/view-cv`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
