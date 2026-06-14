'use client'

import { useState, useEffect } from 'react'

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

  // Pick a random section color whenever the sentence changes
  useEffect(() => {
    setBgColor(SECTION_COLORS[Math.floor(Math.random() * SECTION_COLORS.length)])
  }, [currentSentenceIndex])

  useEffect(() => {
    const currentSentence = sentences[currentSentenceIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentSentence.length) {
          setCurrentText(currentSentence.substring(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentSentence.substring(0, currentText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentSentenceIndex, sentences, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <div className="mb-12 flex justify-center">
      <div
        className="neo-card inline-block px-6 py-5 -rotate-1"
        style={{ background: bgColor, transition: 'background 350ms ease' }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold min-h-[3.5rem] flex items-center text-[#111]">
          <span className="font-mono">{currentText}</span>
          <span className="inline-block w-3 h-7 ml-1 bg-[#111] align-middle animate-pulse" />
        </h1>
      </div>
    </div>
  )
}
