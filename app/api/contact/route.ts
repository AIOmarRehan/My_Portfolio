import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'
import nodemailer from 'nodemailer'

// Limits match the maxLength attributes on the contact form.
const MAX_NAME = 100
const MAX_EMAIL = 254
const MAX_MESSAGE = 5000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Visitor input goes into the notification email's HTML, so it must be escaped. */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 })

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return badRequest('Invalid request body')
    }
    const { captchaToken } = body as Record<string, unknown>
    const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
    const name = text((body as Record<string, unknown>).name)
    const email = text((body as Record<string, unknown>).email)
    const message = text((body as Record<string, unknown>).message)

    // Validate input (all before reCAPTCHA, so bad requests never reach Google)
    if (!name || !email || !message) {
      return badRequest('All fields are required')
    }
    if (name.length > MAX_NAME) return badRequest(`Name must be at most ${MAX_NAME} characters`)
    if (email.length > MAX_EMAIL) return badRequest(`Email must be at most ${MAX_EMAIL} characters`)
    if (message.length > MAX_MESSAGE) return badRequest(`Message must be at most ${MAX_MESSAGE} characters`)
    if (!EMAIL_RE.test(email)) {
      return badRequest('Invalid email format')
    }

    // Verify reCAPTCHA
    if (typeof captchaToken !== 'string' || !captchaToken) {
      return badRequest('Please complete the CAPTCHA')
    }

    const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: captchaToken,
      }),
    })

    const captchaResult = await captchaResponse.json()
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      )
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          message,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      )
    }

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'ai.omar.rehan@gmail.com',
        // CR/LF stripped so a name can't inject extra mail headers.
        subject: `New Contact Form Message from ${name.replace(/[\r\n]+/g, ' ')}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\r?\n/g, '<br>')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This message was sent from your portfolio contact form.</p>
        `,
        replyTo: email,
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the request if email fails, message is still saved in DB
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
