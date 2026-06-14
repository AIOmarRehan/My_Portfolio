'use client'

import { memo, useCallback } from 'react'

interface CVDownloadButtonProps {
  buttonSize?: 'lg' | 'sm'
  cvUrl?: string
}

function CVDownloadButton({ buttonSize = 'lg', cvUrl }: CVDownloadButtonProps) {
  const handleDownloadCV = useCallback(() => {
    const url = cvUrl || '/cv/Omar_Rehan_CV.pdf'
    window.open(url, '_blank', 'noopener,noreferrer')
    const a = document.createElement('a')
    a.href = url
    a.download = url.split('/').pop() || 'CV.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [cvUrl])

  const sizeClasses =
    buttonSize === 'lg' ? 'w-full py-3.5 text-base' : 'w-full py-2.5 text-sm'

  return (
    <button
      onClick={handleDownloadCV}
      className={`neo-btn neo-btn-yellow ${sizeClasses} uppercase tracking-wide`}
      aria-label="Download CV"
    >
      <svg
        className={buttonSize === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download CV
    </button>
  )
}

export default memo(CVDownloadButton)
