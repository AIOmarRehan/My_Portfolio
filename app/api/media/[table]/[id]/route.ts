import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

const ALLOWED_TABLES = ['projects', 'fullstack_projects', 'articles'] as const
type AllowedTable = (typeof ALLOWED_TABLES)[number]

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  const { table, id } = await params

  if (!ALLOWED_TABLES.includes(table as AllowedTable)) {
    return new Response('Not Found', { status: 404 })
  }

  const numericId = parseInt(id, 10)
  if (isNaN(numericId)) {
    return new Response('Not Found', { status: 404 })
  }

  const { data, error } = await supabase
    .from(table)
    .select('image')
    .eq('id', numericId)
    .single()

  if (error || !data?.image) {
    return new Response('Not Found', { status: 404 })
  }

  const image: string = data.image

  // If it's a URL, redirect to it
  if (image.startsWith('http')) {
    return NextResponse.redirect(image, { status: 302 })
  }

  // Parse base64 data URL: data:<mime>;base64,<data>
  const match = image.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    return new Response('Not Found', { status: 404 })
  }

  const contentType = match[1]
  const buffer = Buffer.from(match[2], 'base64')

  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
    },
  })
}
