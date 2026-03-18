import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const secret = body?.secret

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return new Response('Not Found', { status: 404 })
  }

  revalidatePath('/', 'layout')
  return new Response(JSON.stringify({ revalidated: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
