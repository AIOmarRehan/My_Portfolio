'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const [showCaptchaWarning, setShowCaptchaWarning] = useState(false)

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
        headers: {
          'Content-Type': 'application/json',
        },
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 px-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder="Tell me about your project or idea..."
        />
      </div>

      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            theme={isDarkMode ? 'dark' : 'light'}
            onChange={(token) => { setCaptchaToken(token); setShowCaptchaWarning(false) }}
            onExpired={() => { setCaptchaToken(null) }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full font-semibold py-3 px-6 rounded-lg transition-transform duration-300 ease-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: isDarkMode
            ? 'linear-gradient(45deg, #93c5fd, #e9d5ff)'
            : 'linear-gradient(45deg, #00ffff, #ff00ff)',
          color: isDarkMode ? '#000000' : '#ffffff',
          boxShadow: isDarkMode
            ? '0 0 20px #93c5fd, 0 0 40px #e9d5ff, inset 0 0 20px rgba(147, 197, 253, 0.3)'
            : '0 0 20px #00ffff, 0 0 40px #ff00ff, inset 0 0 20px rgba(0, 255, 255, 0.3)',
        }}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {showCaptchaWarning && (
        <div className="text-red-500 text-sm text-center font-medium">
          You have to click on CAPTCHA first
        </div>
      )}

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center">
          Message sent successfully! I'll get back to you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
          Failed to send message. Please try again or contact me directly.
        </div>
      )}
    </form>
  )
}
