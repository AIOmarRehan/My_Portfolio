import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase projects select error', error)
      return new Response('Bad Gateway', { status: 502 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('GET /api/projects error', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
