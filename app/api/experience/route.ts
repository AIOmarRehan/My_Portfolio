import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')

    if (error) {
      console.error('Supabase select error', error)
      return new Response('Bad Gateway', { status: 502 })
    }

    // Sort with "Present" entries first, then by start_date descending
    const sorted = (data || []).sort((a, b) => {
      // If both are "Present" or both are not, sort by start_date
      if ((a.end_date === 'Present' && b.end_date === 'Present') || 
          (a.end_date !== 'Present' && b.end_date !== 'Present')) {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      }
      // Otherwise, "Present" comes first
      return a.end_date === 'Present' ? -1 : 1
    })

    return NextResponse.json(sorted)
  } catch (err) {
    try {
      console.error('GET /api/experience error', err instanceof Error ? `${err.message}\n${err.stack}` : String(err))
    } catch (logErr) {
      console.error('Error logging GET error', logErr)
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
