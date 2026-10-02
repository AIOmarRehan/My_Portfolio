import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabase } from '../../../../lib/supabaseServer'
import { IMAGE_EXTENSION_BY_MIME, imageUploadError } from '../../../../lib/uploadValidation'

const SECRET = process.env.NEXTAUTH_SECRET || ''
// The 'qr-images' bucket never existed, so every QR upload failed. QR codes go to the
// existing public 'images' bucket under qr/, the same pattern as upload-video's demos/.
const BUCKET = 'images'
const FOLDER = 'qr'

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: SECRET })
  if (!token || token?.email !== process.env.ADMIN_EMAIL)
    return new Response('Not Found', { status: 404 })

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const invalid = imageUploadError(file)
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 })
    }

    // The extension comes from the validated MIME type, never from the client's file name.
    const fileName = `${FOLDER}/qr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${IMAGE_EXTENSION_BY_MIME[file.type]}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase Storage QR upload error:', uploadError)
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 502 })
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('QR upload error:', error)
    return NextResponse.json(
      { error: `Failed to upload QR image: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}
