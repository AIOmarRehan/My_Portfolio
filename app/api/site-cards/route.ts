import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseServer'

// GET — public read of all site cards
export async function GET() {
  const { data, error } = await supabase
    .from('site_cards')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching site cards:', error)
    return NextResponse.json([], { status: 500 })
  }

  return NextResponse.json(data || [])
}
