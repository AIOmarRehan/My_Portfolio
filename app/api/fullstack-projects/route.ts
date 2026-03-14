import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('fullstack_projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase fullstack_projects select error', error)
      return new Response('Bad Gateway', { status: 502 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/fullstack-projects error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
