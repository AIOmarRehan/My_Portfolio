import type { Metadata } from 'next'
import { supabase } from '@/lib/supabaseServer'
import { DEFAULT_CV_PATH } from '@/lib/cv'

export const metadata: Metadata = {
  title: "Omar Rehan's CV",
  description: 'Omar Rehan - CV',
  alternates: { canonical: '/view-cv' },
}

// Same hourly ISR as the homepage; admin saves refresh it through revalidatePath('/', 'layout').
export const revalidate = 3600

/** The contact card's admin-managed CV path, or the bundled PDF when it's unset or unreadable. */
async function getCvPath(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('site_cards')
      .select('card_data')
      .eq('section', 'contact')
      .order('sort_order', { ascending: true })
      .limit(1)
    if (error) return DEFAULT_CV_PATH
    const cvPath = (data?.[0]?.card_data as { cvPath?: unknown } | null | undefined)?.cvPath
    // Only a same-origin path or an https URL is framed; anything else uses the bundled PDF.
    if (typeof cvPath === 'string' && (/^\/(?!\/)/.test(cvPath) || cvPath.startsWith('https://'))) {
      return cvPath
    }
  } catch {
    // Fall through to the bundled PDF.
  }
  return DEFAULT_CV_PATH
}

export default async function CVPage() {
  const cvPath = await getCvPath()

  return (
    <div className="w-full min-h-[85vh] p-4" style={{ background: 'var(--neo-bg)' }}>
      <div className="neo-card w-full h-[85vh] overflow-hidden p-0">
        <iframe
          src={cvPath}
          className="w-full h-full border-none"
          title="Omar Rehan's CV"
        />
      </div>
    </div>
  )
}
