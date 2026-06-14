'use client'

import { useMemo, useState } from 'react'
import { techIcons } from '@/lib/techIcons'
import { iconRegistry } from '@/lib/iconRegistry'
import { useDebouncedValue } from '@/lib/hooks'
import SvgIcon from './icons/SvgIcon'

interface TagSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  inputId?: string
}

export default function TagSearchInput({
  value,
  onChange,
  placeholder,
  className,
  inputId
}: TagSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false)

  const allTags = useMemo(() => {
    const uniqueByLabel = new Map<string, { key: string; label: string; icon: string; color?: string }>()

    Object.entries(techIcons).forEach(([key, data]) => {
      const label = data.label || key
      const normalizedLabel = label.toLowerCase()
      if (!uniqueByLabel.has(normalizedLabel)) {
        uniqueByLabel.set(normalizedLabel, {
          key,
          label,
          icon: data.icon,
          color: data.color
        })
      }
    })

    return Array.from(uniqueByLabel.values()).sort((a, b) => a.label.localeCompare(b.label))
  }, [])

  const lastCommaIndex = value.lastIndexOf(',')
  const rawToken = lastCommaIndex >= 0 ? value.slice(lastCommaIndex + 1) : value
  const query = rawToken.trim()
  // Debounce the query so we don't re-filter the full tag list on every keystroke
  const debouncedQuery = useDebouncedValue(query, 150)

  const suggestions = useMemo(() => {
    if (!debouncedQuery) return []

    const q = debouncedQuery.toLowerCase()
    return allTags
      .filter((item) => item.label.toLowerCase().includes(q) || item.key.toLowerCase().includes(q))
      .slice(0, 8)
  }, [allTags, debouncedQuery])

  const handleSelect = (label: string) => {
    const prefix = lastCommaIndex >= 0 ? value.slice(0, lastCommaIndex + 1).trimEnd() + ' ' : ''
    onChange(`${prefix}${label}, `)
    setIsOpen(false)
  }

  const renderIcon = (iconRef: string, color?: string) => {
    const [iconPackage, iconName] = iconRef.split('/')

    if (iconPackage === 'svg') {
      return <SvgIcon name={iconName} className="w-4 h-4" style={color ? { color } : undefined} />
    }

    const IconComponent = iconRegistry[iconRef]
    if (!IconComponent) return null
    return <IconComponent className="w-4 h-4" style={color ? { color } : undefined} />
  }

  return (
    <div className="relative">
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          if (!isOpen) setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 120)
        }}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full neo-panel shadow-neo overflow-hidden">
          {suggestions.map((item) => (
            <button
              key={item.key}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(item.label)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-bold hover:bg-neo-yellow transition-colors"
            >
              {renderIcon(item.icon, item.color)}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
