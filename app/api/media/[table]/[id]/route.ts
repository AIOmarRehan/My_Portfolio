import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'

const ALLOWED_TABLES = ['projects', 'fullstack_projects', 'data_analytics_projects', 'articles'] as const
type AllowedTable = (typeof ALLOWED_TABLES)[number]

const BUCKET = 'images'

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

  // Already a URL — redirect to the CDN
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
  const ext = contentType.split('/')[1] || 'png'
  const fileName = `${table}/${Date.now()}-${numericId}.${ext}`

  // Upload to Supabase Storage (migrates base64 → CDN on first request)
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, { contentType, upsert: false })

  if (!uploadError) {
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName)
    // Update DB so future requests skip this path entirely
    await supabase.from(table).update({ image: urlData.publicUrl }).eq('id', numericId)
    return NextResponse.redirect(urlData.publicUrl, { status: 302 })
  }

  // Fallback: serve base64 directly (with aggressive caching)
  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
    },
  })
}
