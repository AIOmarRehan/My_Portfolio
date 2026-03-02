import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { writeFile } from 'fs/promises'
import path from 'path'

const SECRET = process.env.NEXTAUTH_SECRET || ''

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req, secret: SECRET })
    if (!token || token?.email !== process.env.ADMIN_EMAIL) {
      return new Response('Unauthorized', { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('video') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    // Validate file type (videos only)
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types: MP4, WebM, OGG, MOV. Received: ${file.type}` 
      }, { status: 400 })
    }

    // Validate file size (max 50MB for videos)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return NextResponse.json({ 
        error: `File too large. Maximum size is 50MB. Received: ${sizeMB}MB` 
      }, { status: 400 })
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${originalName}`
    
    // Get the file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write to public/demos folder
    const publicPath = path.join(process.cwd(), 'public', 'demos', filename)
    await writeFile(publicPath, buffer)

    // Return the relative path (accessible via /demos/filename.mp4)
    const relativePath = `/demos/${filename}`

    return NextResponse.json({ 
      success: true, 
      path: relativePath,
      filename,
      size: file.size
    })

  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload video',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
