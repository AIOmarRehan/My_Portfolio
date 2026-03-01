'use client'

import { useEffect, useState } from 'react'

interface SvgIconProps {
  name: string
  className?: string
  style?: React.CSSProperties
}

// Simple cache for SVG content
const svgCache: Record<string, string> = {}

/**
 * Generic SVG Icon loader that dynam1cally inlines SVGs
 * Loads any SVG from /public/svg-icons/ folder
 * Allows color styling via the style prop
 * 
 * Usage:
 * <SvgIcon name="gradio" className="w-4 h-4" style={{ color: '#FF7C00' }} />
 * 
 * Just add .svg files to /public/svg-icons/ and reference by filename!
 */
export default function SvgIcon({ name, className = '', style = {} }: SvgIconProps) {
  const [svgContent, setSvgContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSvg = async () => {
      // Check cache first
      if (svgCache[name]) {
        setSvgContent(svgCache[name])
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/svg-icons/${name}.svg`)
        const content = await response.text()
        svgCache[name] = content // Cache for future use
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
  if (style?.color) {
    // Add fill and color to the root SVG element
    modifiedSvg = svgContent.replace(
      '<svg',
      `<svg style="fill: ${style.color}; stroke: ${style.color};"`
    )
  }

  return (
    <div
      className={`inline-block flex-shrink-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
      style={{
        width: '1em',
        height: '1em',
        ...style
      }}
    />
  )
}
