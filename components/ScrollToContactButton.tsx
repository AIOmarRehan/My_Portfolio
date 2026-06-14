'use client'

import { memo, useCallback } from 'react'

function ScrollToContactButton() {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const contactCard = document.getElementById('contact-card')
    if (contactCard) {
      contactCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      contactCard.classList.add('highlight-pulse')
      setTimeout(() => contactCard.classList.remove('highlight-pulse'), 2000)
    }
  }, [])

  return (
    <a
      href="#contact"
      onClick={handleClick}
      className="neo-btn neo-btn-cyan px-8 py-3 uppercase tracking-wide"
    >
      Get in Touch →
    </a>
  )
}

export default memo(ScrollToContactButton)
