'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useIsDarkMode } from '@/lib/hooks'

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [showCaptchaWarning, setShowCaptchaWarning] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const isDarkMode = useIsDarkMode()

  // react-google-recaptcha caches its theme on mount; force remount on toggle
  const [captchaKey, setCaptchaKey] = useState(0)
  useEffect(() => setCaptchaKey((k) => k + 1), [isDarkMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaToken && !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      setShowCaptchaWarning(true)
      return
    }
    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken }),
      })
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setCaptchaToken(null)
        recaptchaRef.current?.reset()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 px-2 sm:px-6">
      <div>
        <label htmlFor="name" className="block text-xs font-extrabold uppercase tracking-wide mb-2">Name</label>
        <input
          type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
          className="neo-input" placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-extrabold uppercase tracking-wide mb-2">Email</label>
        <input
          type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
          className="neo-input" placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-extrabold uppercase tracking-wide mb-2">Message</label>
        <textarea
          id="message" name="message" value={formData.message} onChange={handleChange} required rows={4}
          className="neo-textarea resize-none" placeholder="Tell me about your project or idea..."
        />
      </div>

      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <div className="flex justify-center">
          <ReCAPTCHA
            key={captchaKey}
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            theme={isDarkMode ? 'dark' : 'light'}
            onChange={(token) => { setCaptchaToken(token); setShowCaptchaWarning(false) }}
            onExpired={() => setCaptchaToken(null)}
          />
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="neo-btn neo-btn-pink w-full py-3.5 uppercase tracking-wide">
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>

      {showCaptchaWarning && (
        <div className="neo-panel bg-neo-orange p-3 text-center font-bold text-sm">
          You have to click on CAPTCHA first
        </div>
      )}
      {submitStatus === 'success' && (
        <div className="neo-panel bg-neo-lime p-4 text-center font-bold">
          Message sent successfully! I&apos;ll get back to you soon.
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="neo-panel bg-neo-red p-4 text-center font-bold">
          Failed to send message. Please try again or contact me directly.
        </div>
      )}
    </form>
  )
}
