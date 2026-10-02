import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabase } from '../../../../lib/supabaseServer'
import { IMAGE_EXTENSION_BY_MIME, imageUploadError } from '../../../../lib/uploadValidation'

const SECRET = process.env.NEXTAUTH_SECRET || ''
const BUCKET = 'images'

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token || token?.email !== process.env.ADMIN_EMAIL)
    return new Response('Not Found', { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file')
  const rawFolder = formData.get('folder')
  // The folder becomes part of the object path, so keep it to one safe segment.
  const folder = (typeof rawFolder === 'string' ? rawFolder.replace(/[^A-Za-z0-9_-]/g, '') : '') || 'misc'

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Image MIME allowlist + 5MB limit
  const invalid = imageUploadError(file)
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 })
  }

  // The extension comes from the validated MIME type, never from the client's file name.
  const ext = IMAGE_EXTENSION_BY_MIME[file.type]
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

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
