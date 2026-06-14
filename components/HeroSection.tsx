'use client'
import { memo } from 'react'

interface HeroTitleProps {
  description: string
}

function HeroTitle({ description }: HeroTitleProps) {
  return (
    <>
      <span className="neo-tag neo-tag-pink mb-4 w-fit">AI &amp; FULL-STACK ENGINEER</span>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-[1.05]">
        Welcome to my{' '}
        <span className="bg-neo-yellow px-2 border-neo border-neo-border shadow-neo-sm inline-block -rotate-1">
          Portfolio
        </span>
      </h1>
      <p className="text-base md:text-lg text-[color:var(--neo-ink-soft)] font-medium mb-8">
        {description}
      </p>
    </>
  )
}

export default memo(HeroTitle)
