'use client'

import dynamic from 'next/dynamic'
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

interface TechIconProps {
  tagName: string
  showLabel?: boolean
}

export default function TechIcon({
  tagName,
  showLabel = true
}: TechIconProps) {
  const iconData = getTagIcon(tagName)

  if (!iconData) {
    // Fallback: show just the tag name
    return (
      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
        {tagName}
      </span>
    )
  }

  // Parse icon name to get package and icon name
  const [iconPackage, iconName] = iconData.icon.split('/')
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

  const library = iconLibraries[iconPackage]
  if (library) {
    IconComponent = library[iconName]
  }

  if (!IconComponent) {
    return (
      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
        {tagName}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
      <IconComponent className="text-sm" style={{ color: iconData.color }} />
      {showLabel && <span>{tagName}</span>}
    </span>
  )
}
