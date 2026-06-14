'use client'

import { memo } from 'react'
import type { IconType } from 'react-icons'
import { getTagIcon } from '@/lib/techIcons'
import { iconRegistry } from '@/lib/iconRegistry'
import SvgIcon from './icons/SvgIcon'

interface TagBadgeProps {
  tag: string
  variant?: 'blue' | 'pink' | 'yellow' | 'gray' | 'green'
}

function TagBadge({ tag, variant = 'blue' }: TagBadgeProps) {
  const iconData = getTagIcon(tag)

  // Map legacy variants onto the neubrutalism flat-block tag colors
  const variantClass: Record<string, string> = {
    blue: 'neo-tag-blue',
    pink: 'neo-tag-pink',
    yellow: 'neo-tag-yellow',
    green: 'neo-tag-lime',
    gray: 'neo-tag-cyan',
  }

  // Icons render in solid ink for max contrast against the flat block
  const iconColor = '#111111'

  let IconComponent: IconType | null = null
  let isSvgIcon = false
  let svgIconName = ''

  if (iconData) {
    const [iconPackage, iconName] = iconData.icon.split('/')
    if (iconPackage === 'svg') {
      isSvgIcon = true
      svgIconName = iconName
    } else {
      IconComponent = iconRegistry[iconData.icon] || null
    }
  }

  return (
    <span className={`neo-tag ${variantClass[variant]}`}>
      {isSvgIcon && svgIconName && (
        <SvgIcon name={svgIconName} className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} />
      )}
      {IconComponent && (
        <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} />
      )}
      {tag}
    </span>
  )
}

export default memo(TagBadge)
