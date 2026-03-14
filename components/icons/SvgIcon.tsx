'use client'

import { useEffect, useState } from 'react'

interface SvgIconProps {
  name: string
  className?: string
  style?: React.CSSProperties
}

// Cache loaded SVGs
const svgCache: Record<string, string> = {}

// Loads SVGs from /public/svg-icons/ folder
export default function SvgIcon({ name, className = '', style = {} }: SvgIconProps) {
  const [svgContent, setSvgContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSvg = async () => {
      // Check cache
      if (svgCache[name]) {
        setSvgContent(svgCache[name])
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/svg-icons/${name}.svg`)
        const content = await response.text()
        svgCache[name] = content
        setSvgContent(content)
      } catch (error) {
        console.error(`Failed to load SVG: ${name}`, error)
      } finally {
        setLoading(false)
      }
    }

    loadSvg()
  }, [name])

  if (loading) return <div className={`inline-block ${className}`} style={{ width: '1em', height: '1em' }} />

  // Apply color styling to the SVG by modifying the content
  let modifiedSvg = svgContent

  // Force the SVG to fill its container by removing explicit width/height
  // and ensuring it scales via CSS
  modifiedSvg = modifiedSvg.replace(
    /<svg([^>]*)>/,
    (match, attrs) => {
      // Strip width and height attributes so CSS controls sizing
      let cleaned = attrs
        .replace(/\s*width\s*=\s*["'][^"']*["']/gi, '')
        .replace(/\s*height\s*=\s*["'][^"']*["']/gi, '')
      return `<svg${cleaned} width="100%" height="100%">`
    }
  )

  if (style?.color) {
    modifiedSvg = modifiedSvg.replace(
      '<svg',
      `<svg style="fill: ${style.color}; stroke: ${style.color};"`
    )
  }

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
      style={{
        width: '1em',
        height: '1em',
        overflow: 'hidden',
        ...style
      }}
    />
  )
}
