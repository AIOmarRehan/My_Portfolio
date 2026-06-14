'use client'

import { memo } from 'react'

interface WhatsAppButtonProps {
  href?: string
}

function WhatsAppButton({ href = 'https://wa.me/971509669311' }: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="neo-btn neo-btn-lime w-full py-2.5 text-sm uppercase tracking-wide"
      aria-label="Open WhatsApp"
    >
      <img
        src="/svg-icons/whatsapp.svg"
        alt=""
        className="w-4 h-4"
        aria-hidden="true"
      />
      WhatsApp
    </a>
  )
}

export default memo(WhatsAppButton)
