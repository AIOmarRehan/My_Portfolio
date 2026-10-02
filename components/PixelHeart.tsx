import type { SVGProps } from 'react'

/*
 * Minecraft-style pixel hearts. Each grid cell is one pixel; cells of the same
 * colour are merged into a single path of 1x1 squares and drawn with
 * crispEdges, so the pixels stay sharp at any size.
 *   K = outline   R = body   D = shade   W = highlight   F = particle fill
 */
const HEART = [
  '.KK...KK.',
  'KWRK.KRRK',
  'KRRRKRRDK',
  'KRRRRRRDK',
  '.KRRRRDK.',
  '..KRRDK..',
  '...KDK...',
  '....K....',
]

const MINI_HEART = [
  '.KK.KK.',
  'KFFKFFK',
  'KFFFFFK',
  '.KFFFK.',
  '..KFK..',
  '...K...',
]

function toPaths(grid: string[]) {
  const d: Record<string, string> = {}
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = row[x]
      if (c !== '.') d[c] = `${d[c] || ''}M${x} ${y}h1v1h-1z`
    }
  })
  return d
}

const HEART_PATHS = toPaths(HEART)
const MINI_PATHS = toPaths(MINI_HEART)

type IconProps = Omit<SVGProps<SVGSVGElement>, 'viewBox' | 'children'>

/** The main pixel heart: #111 outline, --neo-red body, darker shade and a highlight pixel. */
export default function PixelHeart(props: IconProps) {
  return (
    <svg viewBox="0 0 9 8" shapeRendering="crispEdges" aria-hidden="true" focusable="false" {...props}>
      <path d={HEART_PATHS.K} fill="#111" />
      <path d={HEART_PATHS.R} style={{ fill: 'var(--neo-red)' }} />
      <path d={HEART_PATHS.D} fill="#c8383d" />
      <path d={HEART_PATHS.W} fill="#fff" />
    </svg>
  )
}

/** Small outlined heart used for the burst particles. */
export function MiniPixelHeart({ color, ...props }: IconProps & { color: string }) {
  return (
    <svg viewBox="0 0 7 6" shapeRendering="crispEdges" aria-hidden="true" focusable="false" {...props}>
      <path d={MINI_PATHS.K} fill="#111" />
      <path d={MINI_PATHS.F} style={{ fill: color }} />
    </svg>
  )
}
