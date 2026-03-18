import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { revalidateSite } from '../../../../lib/revalidate'
import { supabase } from '../../../../lib/supabaseServer'

const SECRET = process.env.NEXTAUTH_SECRET || ''

// PUT — upsert a site card (insert or update by section + sort_order)
export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token || token?.email !== process.env.ADMIN_EMAIL)
    return new Response('Not Found', { status: 404 })

  const body = await req.json()
  const { section, cards } = body as {
    section: 'contact' | 'qr'
    cards: { card_data: Record<string, unknown>; sort_order: number }[]
  }

  if (!section || !Array.isArray(cards)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Delete existing cards for this section, then insert new ones
  const { error: deleteError } = await supabase
    .from('site_cards')
    .delete()
    .eq('section', section)

  if (deleteError) {
    console.error('Error deleting site cards:', deleteError)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  const rows = cards.map((c, i) => ({
    section,
    card_data: c.card_data,
    sort_order: c.sort_order ?? i,
  }))

  const { data, error: insertError } = await supabase
    .from('site_cards')
    .insert(rows)
    .select()

  if (insertError) {
    console.error('Error inserting site cards:', insertError)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  await revalidateSite()
  return NextResponse.json(data)
}
