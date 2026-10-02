import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { revalidateSite } from '../../../../lib/revalidate'
import { supabase } from '../../../../lib/supabaseServer'

const SECRET = process.env.NEXTAUTH_SECRET || ''
const SECTIONS = ['contact', 'qr'] as const

// PUT — replace every card in one section (contact or qr).
// The new rows are inserted first and the section's previous rows are deleted only after
// that succeeds, so a failed save can never leave the section empty.
export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token || token?.email !== process.env.ADMIN_EMAIL)
    return new Response('Not Found', { status: 404 })

  const body = await req.json().catch(() => null)
  const { section, cards } = (body ?? {}) as {
    section?: unknown
    cards?: { card_data?: unknown; sort_order?: number }[]
  }

  // Reject anything that would wipe or corrupt a section: unknown section, no cards,
  // or a card without an object payload.
  if (
    typeof section !== 'string' ||
    !SECTIONS.includes(section as (typeof SECTIONS)[number]) ||
    !Array.isArray(cards) ||
    cards.length === 0 ||
    !cards.every((c) => c && typeof c.card_data === 'object' && c.card_data !== null && !Array.isArray(c.card_data))
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const rows = cards.map((c, i) => ({
    section,
    card_data: c.card_data as Record<string, unknown>,
    sort_order: c.sort_order ?? i,
  }))

  // 1. Insert the new cards. On failure nothing has been deleted, so the old cards stay live.
  const { data, error: insertError } = await supabase
    .from('site_cards')
    .insert(rows)
    .select()

  if (insertError || !data || data.length === 0) {
    console.error('Error inserting site cards:', insertError)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  // 2. Remove the section's previous cards: every row that isn't one we just inserted.
  const newIds = data.map((r: { id: string }) => r.id)
  const { error: deleteError } = await supabase
    .from('site_cards')
    .delete()
    .eq('section', section)
    .not('id', 'in', `(${newIds.join(',')})`)

  if (deleteError) {
    // Old and new cards now coexist until the admin saves again. Revalidation is skipped,
    // but the homepage still regenerates on its own within the hour and would then show
    // both sets, so the error asks for an immediate retry.
    console.error('Error deleting previous site cards:', deleteError)
    return NextResponse.json(
      { error: 'Saved, but failed to remove the previous cards. Save again to clean up.' },
      { status: 500 }
    )
  }

  await revalidateSite()
  return NextResponse.json(data)
}
