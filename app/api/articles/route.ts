import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase select error', error)
      return new Response('Bad Gateway', { status: 502 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    try {
      console.error('GET /api/articles error', err instanceof Error ? `${err.message}\n${err.stack}` : String(err))
    } catch (logErr) {
      console.error('Error logging GET error', logErr)
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
