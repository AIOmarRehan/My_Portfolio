'use client'

import { useMemo, useState } from 'react'
import { techIcons } from '@/lib/techIcons'
import * as FaIcons from 'react-icons/fa'
import * as Fa6Icons from 'react-icons/fa6'
import * as SiIcons from 'react-icons/si'
import * as IoIcons from 'react-icons/io5'
import * as TbIcons from 'react-icons/tb'
import * as VscIcons from 'react-icons/vsc'
import * as RiIcons from 'react-icons/ri'
import * as BiIcons from 'react-icons/bi'
import * as DiIcons from 'react-icons/di'
import * as AiIcons from 'react-icons/ai'
import * as GrIcons from 'react-icons/gr'
import * as CiIcons from 'react-icons/ci'
import * as LiaIcons from 'react-icons/lia'
import * as GiIcons from 'react-icons/gi'
import * as LuIcons from 'react-icons/lu'

interface TagSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  inputId?: string
}

const iconLibraries: Record<string, Record<string, any>> = {
  fa: FaIcons,
  fa6: Fa6Icons,
  si: SiIcons,
  io5: IoIcons,
  tb: TbIcons,
  vsc: VscIcons,
  ri: RiIcons,
  bi: BiIcons,
  di: DiIcons,
  ai: AiIcons,
  gr: GrIcons,
  ci: CiIcons,
  lia: LiaIcons,
  gi: GiIcons,
  lu: LuIcons
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
    const uniqueByLabel = new Map<string, { key: string; label: string; icon: string; color: string }>()

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

  const suggestions = useMemo(() => {
    if (!query) return []

    const q = query.toLowerCase()
    return allTags
      .filter((item) => item.label.toLowerCase().includes(q) || item.key.toLowerCase().includes(q))
      .slice(0, 8)
  }, [allTags, query])

  const handleSelect = (label: string) => {
    const prefix = lastCommaIndex >= 0 ? value.slice(0, lastCommaIndex + 1).trimEnd() + ' ' : ''
    onChange(`${prefix}${label}, `)
    setIsOpen(false)
  }

  const renderIcon = (iconRef: string, color: string) => {
    const [iconPackage, iconName] = iconRef.split('/')
    const library = iconLibraries[iconPackage]
    const IconComponent = library ? library[iconName] : null

    if (!IconComponent) return null

    return <IconComponent className="w-4 h-4" style={{ color }} />
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
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((item) => (
            <button
              key={item.key}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(item.label)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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
