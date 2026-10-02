'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  sentences: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

// The 6 section colors
const SECTION_COLORS = [
  'var(--neo-blue)',
  'var(--neo-cyan)',
  'var(--neo-orange)',
  'var(--neo-lime)',
  'var(--neo-yellow)',
  'var(--neo-pink)',
]

export default function Typewriter({
  sentences,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypewriterProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [bgColor, setBgColor] = useState(SECTION_COLORS[0])
  // Typing only ticks while the hero is on screen and the tab is visible. Whenever it is
  // paused the text is out of view, so pausing has no visible effect.
  const [active, setActive] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let inView = true
    const update = () => setActive(inView && !document.hidden)

    let io: IntersectionObserver | undefined
    if (rootRef.current && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting
        update()
      })
      io.observe(rootRef.current)
    }
    document.addEventListener('visibilitychange', update)
    update()

    return () => {
      io?.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  // Pick a random section color whenever the sentence changes
  useEffect(() => {
    setBgColor(SECTION_COLORS[Math.floor(Math.random() * SECTION_COLORS.length)])
  }, [currentSentenceIndex])

  useEffect(() => {
    if (!active) return

    const currentSentence = sentences[currentSentenceIndex]
    const finishedTyping = !isDeleting && currentText.length >= currentSentence.length
    // Same timing as before: one typing tick, then the pause, before deleting starts.
    // (This used to be a nested setTimeout that cleanup could not cancel.)
    const delay = isDeleting
      ? deletingSpeed
      : finishedTyping
        ? typingSpeed + pauseDuration
        : typingSpeed

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (!finishedTyping) {
          setCurrentText(currentSentence.substring(0, currentText.length + 1))
        } else {
          setIsDeleting(true)
        }
      } else if (currentText.length > 0) {
        setCurrentText(currentSentence.substring(0, currentText.length - 1))
      } else {
        setIsDeleting(false)
        setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length)
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [active, currentText, isDeleting, currentSentenceIndex, sentences, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <div ref={rootRef} className="mb-12 flex justify-center">
      <div
        className="neo-card inline-block px-5 sm:px-6 py-5 -rotate-1 max-w-full"
        style={{ background: bgColor, transition: 'background 350ms ease' }}
      >
        {/* h2: the page's single h1 is HeroTitle's stable "Welcome to my Portfolio". */}
        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold min-h-[3.5rem] text-[#111] leading-snug break-words font-mono">
          {currentText}
          <span className="neo-caret" />
        </h2>
      </div>
    </div>
  )
}
