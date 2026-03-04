'use client'

import { useState, useEffect } from 'react'

interface TypewriterProps {
  sentences: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export default function Typewriter({ 
  sentences, 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  pauseDuration = 2000 
}: TypewriterProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const currentSentence = sentences[currentSentenceIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentSentence.length) {
          setCurrentText(currentSentence.substring(0, currentText.length + 1))
        } else {
          // Finished typing, wait before deleting
          setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentSentence.substring(0, currentText.length - 1))
        } else {
          // Finished deleting, move to next sentence
          setIsDeleting(false)
          setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentSentenceIndex, sentences, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <div className="mb-16 text-center">
      <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold min-h-[5rem] py-4 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' 
          : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
      } bg-clip-text text-transparent`}>
        {currentText}
        <span className={`inline-block w-1 h-10 ml-1 ${
          isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
        } animate-pulse align-middle`}></span>
      </h1>
    </div>
  )
}
