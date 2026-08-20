import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabase } from '../../../../lib/supabaseServer'

const SECRET = process.env.NEXTAUTH_SECRET || ''
// Reuses the existing public bucket that images already go to, so no new
// bucket setup is needed. Videos land under the demos/ prefix.
const BUCKET = 'images'
const FOLDER = 'demos'

/**
 * Uploads a demo video to Supabase Storage and returns its public URL.
 *
 * This previously wrote into public/demos with fs.writeFile, which only ever
 * worked on a local dev machine (Vercel's filesystem is read-only/ephemeral)
 * and pushed large binaries into git. Storage works in both environments.
 *
 * Existing rows that still point at "/demos/..." keep working — those files
 * remain in public/ and are served statically.
 */
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || token?.email !== process.env.ADMIN_EMAIL) {
      return new Response('Unauthorized', { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('video') as File | null

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: MP4, WebM, OGG, MOV. Received: ${file.type || 'unknown'}` },
        { status: 400 }
      )
    }

    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return NextResponse.json(
        { error: `File too large. Maximum size is 50MB. Received: ${sizeMB}MB` },
        { status: 400 }
      )
    }

    const ext = (file.name.split('.').pop() || 'mp4').replace(/[^a-zA-Z0-9]/g, '')
    const fileName = `${FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('Supabase Storage video upload error:', uploadError)
      // Surface the real reason (admin-only route) so failures are diagnosable
      // instead of collapsing into a generic 500.
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadError.message}` },
        { status: 502 }
      )
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      // `path` is what the three admin pages read; `url` kept for parity with
      // the image upload route.
      path: urlData.publicUrl,
      url: urlData.publicUrl,
      filename: fileName,
      size: file.size,
    })
  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json(
      {
        error: `Failed to upload video: ${error instanceof Error ? error.message : String(error)}`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
