import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/*
 * Sponsor checkout: creates a Stripe Checkout Session and returns its hosted URL.
 * Visitors pay on Stripe's own page, so card details never reach this site, and
 * the secret key only ever lives on the server (server-only env vars, no
 * NEXT_PUBLIC_ prefix). Public by design: it can only start a checkout for the
 * one sponsor price configured below.
 *
 *   STRIPE_SECRET_KEY        sk_test_... while testing, sk_live_... in production
 *   STRIPE_SPONSOR_PRICE_ID  price_... of a "customer chooses what to pay" price
 */
const STRIPE_CHECKOUT_SESSIONS = 'https://api.stripe.com/v1/checkout/sessions'
const GENERIC_ERROR = 'Could not open Stripe checkout. Please try again.'

// Stripe masks keys in its error messages; strip even the masked form from our logs.
const redactKeys = (text: unknown) => String(text ?? '').replace(/\b(?:sk|rk|pk)_(?:test|live)_[\w*]+/g, '[redacted]')

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin

  // Browsers send Origin on cross-site POSTs; only this site may start a checkout.
  const requestOrigin = req.headers.get('origin')
  if (requestOrigin && requestOrigin !== origin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_SPONSOR_PRICE_ID
  if (!secretKey || !priceId) {
    return NextResponse.json({ error: 'Sponsoring is not set up yet.' }, { status: 503 })
  }

  const params = new URLSearchParams({
    mode: 'payment',
    submit_type: 'donate',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: `${origin}/sponsor/thanks`,
    cancel_url: `${origin}/#contact-card`,
  })

  try {
    const res = await fetch(STRIPE_CHECKOUT_SESSIONS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
      cache: 'no-store',
    })
    const data = await res.json().catch(() => null)

    if (!res.ok || typeof data?.url !== 'string') {
      // Only Stripe's error summary is logged: never the key or the request headers.
      const err = data?.error
      console.error('Stripe Checkout error:', res.status, err?.type, err?.code, redactKeys(err?.message))
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 })
    }

    return NextResponse.json({ url: data.url })
  } catch (err) {
    console.error('Stripe Checkout request failed:', redactKeys(err instanceof Error ? err.message : err))
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 })
  }
}
