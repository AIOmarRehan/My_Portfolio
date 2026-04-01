import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabase } from '../../../../lib/supabaseServer'

const SECRET = process.env.NEXTAUTH_SECRET || ''
const BUCKET = 'qr-images'

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token || token?.email !== process.env.ADMIN_EMAIL)
    return new Response('Not Found', { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() || 'png'
  const fileName = `qr-${Date.now()}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('Supabase Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName)

  return NextResponse.json({ url: urlData.publicUrl })
}
