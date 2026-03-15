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

  // Strip XML prolog and comments that precede the <svg> tag
  modifiedSvg = modifiedSvg.replace(/^[\s\S]*?(?=<svg)/i, '')

  // Force the SVG to fill its container by removing explicit width/height
  // and ensuring it scales via CSS
  modifiedSvg = modifiedSvg.replace(
    /<svg([^>]*)>/,
    (match, attrs) => {
      // If no viewBox exists, synthesize one from the original width/height
      const hasViewBox = /viewBox/i.test(attrs)
      if (!hasViewBox) {
        const wMatch = attrs.match(/width\s*=\s*["']([\d.]+)/i)
        const hMatch = attrs.match(/height\s*=\s*["']([\d.]+)/i)
        if (wMatch && hMatch) {
          attrs += ` viewBox="0 0 ${wMatch[1]} ${hMatch[1]}"`
        }
      }
      // Strip width and height attributes so CSS controls sizing
      let cleaned = attrs
        .replace(/\s*width\s*=\s*["'][^"']*["']/gi, '')
        .replace(/\s*height\s*=\s*["'][^"']*["']/gi, '')
      return `<svg${cleaned} width="100%" height="100%">`
    }
  )

  // Replace hardcoded black fills/strokes with currentColor so icons
  // adapt to the badge text color instead of being invisible on dark backgrounds
  modifiedSvg = modifiedSvg
    .replace(/fill\s*=\s*"(#000000|#000|black)"/gi, 'fill="currentColor"')
    .replace(/stroke\s*=\s*"(#000000|#000|black)"/gi, 'stroke="currentColor"')

  // If root <svg> has no fill attribute, add fill="currentColor" so child
  // elements without explicit fills inherit a visible color instead of defaulting to black
  const svgOpenTag = modifiedSvg.match(/^(<svg\s[^>]*>)/i)
  if (svgOpenTag && !/\bfill\s*=/i.test(svgOpenTag[1])) {
    modifiedSvg = modifiedSvg.replace(/^<svg\s/, '<svg fill="currentColor" ')
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
