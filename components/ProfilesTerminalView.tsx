'use client'

import { useEffect, useState } from 'react'
import { FaGithub, FaKaggle, FaLinkedin } from 'react-icons/fa'
import { SiHuggingface } from 'react-icons/si'
import SvgIcon from './icons/SvgIcon'

/**
 * Terminal-native view of the profile stats. Rendered INSIDE the dev-console
 * output box (which is fixed-height with its own vertical scroll), toggled by
 * the "show my profiles" button — no separate window.
 *
 * Data comes from the same server-side aggregator (/api/activity-stats,
 * 1-hour cache). Only API-verified numbers are shown; platforms without a
 * public stats API (Kaggle, LinkedIn) render their profile link only.
 */

type StatValue = number | string

export interface Heat {
  weeks: (number | null)[][]
  total: number
}

interface Repo {
  name: string
  url: string
  stars: number
  language: string | null
}

interface StatsData {
  github?: Record<string, StatValue> | null
  githubRepos?: Repo[]
  githubHeat?: Heat | null
  huggingface?: Record<string, StatValue> | null
  medium?: Record<string, StatValue> | null
}

/* GitHub dark-theme contribution greens, keyed by level 0-4. */
export const HEAT_COLORS = ['rgba(255,255,255,0.08)', '#0e4429', '#006d32', '#26a641', '#39d353'] as const

const C = {
  grey: '#c8d6e5',
  dim: '#8b97a8',
  cyan: '#4cd4e8',
  yellow: '#ffd23f',
  green: '#9ae66e',
  pink: '#ff7eb6',
  orange: '#ff8a3d',
  blue: '#4d9bff',
} as const

const fmt = (v: StatValue | undefined): string | undefined =>
  typeof v === 'number' ? v.toLocaleString() : typeof v === 'string' ? v : undefined

/* Real Medium monogram (three circles), monochrome via currentColor. */
const MediumMark = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={className} fill="currentColor" aria-hidden="true">
    <ellipse cx="14" cy="20" rx="14" ry="20" />
    <ellipse cx="50" cy="20" rx="11" ry="20" />
    <ellipse cx="84" cy="20" rx="4" ry="20" />
  </svg>
)

function PlatformHeader({
  icon,
  name,
  href,
  color,
}: {
  icon: React.ReactNode
  name: string
  href: string
  color: string
}) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="shrink-0" style={{ color }}>
        {icon}
      </span>
      <span className="font-extrabold" style={{ color: C.green }}>
        ▸ {name}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate underline decoration-dotted hover:opacity-75"
        style={{ color: C.dim }}
      >
        {href.replace('https://', '')}
      </a>
    </div>
  )
}

function StatGroup({ items }: { items: { label: string; value?: string; color: string }[] }) {
  const shown = items.filter((i) => i.value !== undefined)
  if (shown.length === 0) return null
  return (
    <div className="pl-4 flex flex-wrap gap-x-4 gap-y-1">
      {shown.map((s) => (
        <span key={s.label} className="whitespace-nowrap">
          <b style={{ color: s.color }}>{s.value}</b>
          <span style={{ color: C.dim }}> {s.label}</span>
        </span>
      ))}
    </div>
  )
}

export function ContributionHeatmap({ heat }: { heat: Heat }) {
  return (
    <div
      className="mt-1 mb-1"
      title={`${heat.total.toLocaleString()} contributions in the last year`}
    >
      {/* Fluid full-width grid: every week column takes an equal share, so the
          whole year shows as one block with no horizontal scrollbar. */}
      <div className="flex gap-[2px] w-full">
        {heat.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[2px] flex-1 min-w-0">
            {week.map((level, di) => (
              <span
                key={di}
                className="w-full aspect-square rounded-[1px]"
                style={{
                  background: level === null ? 'rgba(255,255,255,0.04)' : HEAT_COLORS[level],
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ReposList({ repos }: { repos: Repo[] }) {
  return (
    <div>
      <p className="pl-4" style={{ color: C.dim }}>
        top repositories · sorted by stars
      </p>
      <ul className="mt-1 space-y-1">
        {repos.map((r) => (
          <li key={r.name} className="pl-4 flex items-baseline gap-2 min-w-0">
            <span className="shrink-0" style={{ color: C.yellow }}>
              ★ {r.stars}
            </span>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:opacity-75 underline decoration-dotted"
              style={{ color: C.grey }}
            >
              {r.name}
            </a>
            {r.language && (
              <span className="shrink-0 text-[10px]" style={{ color: C.cyan }}>
                {r.language}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ProfilesTerminalView({
  active,
  view = 'stats',
}: {
  active: boolean
  view?: 'stats' | 'repos'
}) {
  const [data, setData] = useState<StatsData | null>(null)
  const [error, setError] = useState(false)

  // Fetch once, the first time the view becomes active.
  useEffect(() => {
    if (!active || data || error) return
    let cancelled = false
    fetch('/api/activity-stats')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
  }, [active, data, error])

  if (active && !data && !error) {
    return <p className="pl-4" style={{ color: C.dim }}>fetching live stats…</p>
  }
  if (active && error) {
    return <p className="pl-4" style={{ color: C.pink }}>stats service unreachable. try again later.</p>
  }
  if (!data) return null

  if (view === 'repos') {
    return (
      <div className="space-y-1">
        <PlatformHeader
          icon={<FaGithub className="w-3.5 h-3.5" />}
          name="GitHub"
          href="https://github.com/AIOmarRehan"
          color={C.grey}
        />
        {data.githubRepos && data.githubRepos.length > 0 ? (
          <ReposList repos={data.githubRepos} />
        ) : (
          <p className="pl-4" style={{ color: C.dim }}>no repositories returned by the API.</p>
        )}
      </div>
    )
  }

  const gh = data.github
  const hf = data.huggingface
  const md = data.medium

  return (
    <div className="space-y-1">
      {/* GitHub */}
      <PlatformHeader
        icon={<FaGithub className="w-3.5 h-3.5" />}
        name="github"
        href="https://github.com/AIOmarRehan"
        color={C.grey}
      />
      <StatGroup
        items={[
          { label: 'repos', value: fmt(gh?.repos), color: C.cyan },
          { label: 'stars', value: fmt(gh?.stars), color: C.yellow },
          { label: 'followers', value: fmt(gh?.followers), color: C.pink },
        ]}
      />
      {data.githubHeat && <ContributionHeatmap heat={data.githubHeat} />}

      {/* Hugging Face */}
      <PlatformHeader
        icon={<SiHuggingface className="w-3.5 h-3.5" />}
        name="hugging face"
        href="https://huggingface.co/AIOmarRehan"
        color={C.yellow}
      />
      <StatGroup
        items={[
          { label: 'models', value: fmt(hf?.models), color: C.yellow },
          { label: 'datasets', value: fmt(hf?.datasets), color: C.orange },
          { label: 'spaces', value: fmt(hf?.spaces), color: C.cyan },
          { label: 'downloads', value: fmt(hf?.downloads), color: C.green },
          { label: 'likes', value: fmt(hf?.likes), color: C.pink },
        ]}
      />

      {/* Medium */}
      <PlatformHeader
        icon={<MediumMark />}
        name="medium"
        href="https://medium.com/@ai.omar.rehan"
        color={C.grey}
      />
      <StatGroup items={[{ label: 'recent posts', value: fmt(md?.recent), color: C.green }]} />
      {fmt(md?.latest) && (
        <p className="pl-4 truncate" style={{ color: C.dim }}>
          latest: <span style={{ color: C.grey }}>“{md?.latest}”</span>
        </p>
      )}

      {/* Link-only platforms (no anonymous stats API exists) */}
      <PlatformHeader
        icon={<SvgIcon name="tableau" className="w-3.5 h-3.5" />}
        name="tableau public"
        href="https://public.tableau.com/app/profile/omar.rehan"
        color={C.orange}
      />
      <PlatformHeader
        icon={<FaKaggle className="w-3.5 h-3.5" />}
        name="kaggle"
        href="https://kaggle.com/aiomarrehan"
        color={C.cyan}
      />
      <PlatformHeader
        icon={<FaLinkedin className="w-3.5 h-3.5" />}
        name="linkedin"
        href="https://linkedin.com/in/omar-rehan-47b98636a"
        color={C.blue}
      />
    </div>
  )
}
