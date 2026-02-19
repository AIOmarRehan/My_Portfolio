import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { supabase } from '../../../../lib/supabaseServer'

const SECRET = process.env.NEXTAUTH_SECRET || ''

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || token?.email !== process.env.ADMIN_EMAIL) return new Response('Not Found', { status: 404 })
    const body = await req.json()
    if (!body?.title || !body?.issuer || !body?.issue_date) return new Response('Bad Request', { status: 400 })

    const payload = {
      title: body.title,
      issuer: body.issuer,
      issue_date: body.issue_date,
      credential_url: body.credential_url || null,
      description: body.description || '',
      tags: body.tags || []
    }

    const { data, error } = await supabase.from('certificates').insert([payload]).select().single()
    if (error) {
      console.error('Supabase insert error', error)
      return new Response('Bad Gateway', { status: 502 })
    }
    return NextResponse.json(data)
  } catch (err) {
    try {
      console.error('POST /api/admin/certificates error', err instanceof Error ? `${err.message}\n${err.stack}` : String(err))
    } catch (logErr) {
      console.error('Error logging POST error', logErr)
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || token?.email !== process.env.ADMIN_EMAIL) return new Response('Not Found', { status: 404 })
    const body = await req.json()
    if (!body?.id) return new Response('Bad Request', { status: 400 })

    const updates: any = body.updates || {}

    const { data, error } = await supabase.from('certificates').update(updates).eq('id', body.id).select().single()
    if (error) {
      console.error('Supabase update error', error)
      return new Response('Bad Gateway', { status: 502 })
    }
    return NextResponse.json(data)
  } catch (err) {
    try {
      console.error('PUT /api/admin/certificates error', err instanceof Error ? `${err.message}\n${err.stack}` : String(err))
    } catch (logErr) {
      console.error('Error logging PUT error', logErr)
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET })
    if (!token || token?.email !== process.env.ADMIN_EMAIL) return new Response('Not Found', { status: 404 })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return new Response('Bad Request', { status: 400 })

    const { error } = await supabase.from('certificates').delete().eq('id', id)
    if (error) {
      console.error('Supabase delete error', error)
      return new Response('Bad Gateway', { status: 502 })
    }
    return new Response(null, { status: 204 })
  } catch (err) {
    try {
      console.error('DELETE /api/admin/certificates error', err instanceof Error ? `${err.message}\n${err.stack}` : String(err))
    } catch (logErr) {
      console.error('Error logging DELETE error', logErr)
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
