'use client'

import { getTagIcon } from '@/lib/techIcons'
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

interface TagBadgeProps {
  tag: string
  variant?: 'blue' | 'pink' | 'yellow' | 'gray'
}

export default function TagBadge({ tag, variant = 'blue' }: TagBadgeProps) {
  const iconData = getTagIcon(tag)

  // Define variant styles
  const variantStyles: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-300',
      border: 'border-blue-500/30',
      hover: 'hover:bg-blue-500/30'
    },
    pink: {
      bg: 'bg-pink-500/20',
      text: 'text-pink-300',
      border: 'border-pink-500/30',
      hover: 'hover:bg-pink-500/30'
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-300',
      border: 'border-yellow-500/30',
      hover: 'hover:bg-yellow-500/30'
    },
    gray: {
      bg: 'bg-gray-700',
      text: 'text-gray-200',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-600'
    }
  }

  const styles = variantStyles[variant]

  let IconComponent: any = null

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

  if (iconData) {
    const [iconPackage, iconName] = iconData.icon.split('/')
    const library = iconLibraries[iconPackage]
    if (library) {
      IconComponent = library[iconName]
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${styles.bg} ${styles.text} text-xs font-medium border ${styles.border} ${styles.hover} transition`}
    >
      {IconComponent && (
        <IconComponent
          className="w-4 h-4 flex-shrink-0"
          style={{ color: iconData?.color }}
        />
      )}
      {tag}
    </span>
  )
}
