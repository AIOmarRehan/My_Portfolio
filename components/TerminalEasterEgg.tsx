'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ProfilesTerminalView, { ContributionHeatmap, type Heat } from './ProfilesTerminalView'

/* ------------------------------------------------------------------ */
/*  Palette — mirrors the existing dev-console styling exactly.        */
/* ------------------------------------------------------------------ */
const C = {
  grey: '#c8d6e5',
  dim: '#8b97a8',
  faint: '#5b6272',
  cyan: '#4cd4e8',
  yellow: '#ffd23f',
  green: '#9ae66e',
  pink: '#ff7eb6',
  orange: '#ff8a3d',
  blue: '#4d9bff',
  red: '#ff5a5f',
} as const

interface Line {
  text: string
  color?: string
  href?: string
  indent?: number
  bold?: boolean
  /** Renders the GitHub contribution grid instead of text. */
  heat?: Heat
}

/* ------------------------------------------------------------------ */
/*  Real profile facts. Everything below already exists on the site    */
/*  (hero copy, Footer links, ContactCard defaults, techIcons).        */
/*  Nothing is invented.                                               */
/* ------------------------------------------------------------------ */
const PROFILE = {
  github: 'AIOmarRehan',
  githubUrl: 'https://github.com/AIOmarRehan',
  hfUrl: 'https://huggingface.co/AIOmarRehan',
  kaggleUrl: 'https://kaggle.com/aiomarrehan',
  mediumUrl: 'https://medium.com/@ai.omar.rehan',
  tableauUrl: 'https://public.tableau.com/app/profile/omar.rehan',
  linkedinUrl: 'https://linkedin.com/in/omar-rehan-47b98636a',
  email: 'ai.omar.rehan@gmail.com',
  phone: '+971 50 966 9311',
  location: 'Ajman, UAE',
} as const

/* The original easter-egg blocks — preserved, now reachable via `demo`. */
interface CmdBlock {
  cmd: string
  lines: { text: string; color?: string }[]
}

const BLOCKS: CmdBlock[] = [
  {
    cmd: 'uname -a && whoami',
    lines: [
      { text: 'Darwin omar-rehan 24.1.0 Darwin Kernel', color: C.yellow },
      { text: 'User: omar-rehan (uid=2024)', color: C.yellow },
      { text: 'Shell: /bin/curiosity', color: C.green },
      { text: 'Uptime: 25+ years of building', color: C.green },
    ],
  },
  {
    cmd: 'neofetch',
    lines: [
      { text: 'OS: AI Engineer v24.04 LTS', color: C.yellow },
      { text: 'Host: Portfolio Server', color: C.cyan },
      { text: 'Kernel: 6.8.0-build-solve', color: C.cyan },
      { text: 'Packages: 42 (passion)', color: C.pink },
      { text: 'Resolution: 1920x1080 (vision)', color: C.orange },
    ],
  },
  {
    cmd: 'ps aux --sort=-%cpu | head -6',
    lines: [
      { text: 'PID   CMD                            CPU  MEM', color: C.yellow },
      { text: '4201  python3 train_model.py          94%  12%', color: C.cyan },
      { text: '3307  node server.js                   78%  8%', color: C.green },
      { text: '2103  jupyter-lab                      45%  15%', color: C.pink },
      { text: '9902  postgres -D /data               22%  30%', color: C.orange },
    ],
  },
  {
    cmd: 'curl -s https://api.quote.engineer',
    lines: [
      { text: '"The best way to predict the future', color: C.green },
      { text: ' is to build it."  - Alan Kay', color: C.yellow },
      { text: '', color: undefined },
      { text: '"Any sufficiently advanced technology', color: C.cyan },
      { text: ' is indistinguishable from magic."  - Arthur C. Clarke', color: C.yellow },
    ],
  },
  {
    cmd: 'python3 -c "import this"',
    lines: [
      { text: 'The Zen of Python, by Tim Peters', color: C.yellow },
      { text: 'Beautiful is better than ugly.', color: C.cyan },
      { text: 'Simple is better than complex.', color: C.green },
      { text: 'Explicit is better than implicit.', color: C.pink },
    ],
  },
]

const COMMANDS = [
  'help',
  'about',
  'stack',
  'projects',
  'github',
  'models',
  'experience',
  'contact',
  'demo',
  'clear',
] as const

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */
const num = (v: unknown) => (typeof v === 'number' ? v.toLocaleString() : undefined)

const cmdLine = (input: string): Line => ({
  text: `$ ${input}`,
  color: C.yellow,
  bold: true,
})

const heading = (text: string): Line => ({ text, color: C.green, bold: true })
const dim = (text: string, indent = 1): Line => ({ text, color: C.dim, indent })
const gap = (): Line => ({ text: '' })

interface ProjectRow {
  id: number
  title: string
  description?: string
  tags?: string[]
  category: string
  hrefBase: string
  github_url?: string | null
  huggingface_url?: string | null
  live_project_link?: string | null
  tableau_url?: string | null
  powerbi_url?: string | null
}

export default function TerminalEasterEgg() {
  const [lines, setLines] = useState<Line[]>(() => [
    { text: 'omar-rehan - dev console', color: C.cyan, bold: true },
    dim("type 'help' for commands, or 'show my profiles' below."),
    gap(),
  ])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'console' | 'profiles'>('console')
  const [profilesTab, setProfilesTab] = useState<'stats' | 'repos'>('stats')
  const [busy, setBusy] = useState(false)

  const [history, setHistory] = useState<string[]>([])
  const histIdx = useRef(0)
  const demoIdx = useRef(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const outRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cache = useRef<Record<string, unknown>>({})

  // Keep the output pinned to the newest line. The scroll box has a FIXED
  // height, so output never grows the terminal card.
  useEffect(() => {
    const el = outRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, mode, profilesTab])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const push = useCallback((incoming: Line[]) => {
    setLines((prev) => [...prev, ...incoming])
  }, [])

  /* ---------------- command output builders ---------------- */

  const helpLines = (): Line[] => [
    heading('COMMANDS'),
    { text: '  about       Who I am', color: C.grey },
    { text: '  stack       Languages I work with (from GitHub)', color: C.grey },
    { text: '  projects    Selected engineering work', color: C.grey },
    { text: '  github      Live GitHub activity', color: C.grey },
    { text: '  models      AI/ML models & experiments', color: C.grey },
    { text: '  experience  Engineering experience', color: C.grey },
    { text: '  contact     Get in touch', color: C.grey },
    { text: '  demo        Replay the console demo', color: C.grey },
    { text: '  clear       Clear terminal', color: C.grey },
    gap(),
    dim('projects <n> opens a project · ↑/↓ history · Tab completes'),
  ]

  const aboutLines = (): Line[] => [
    heading('ABOUT'),
    { text: 'AI, Full-Stack and Data Analyst engineer focused on building', color: C.grey },
    { text: 'smart, data-driven solutions end to end.', color: C.grey },
    gap(),
    { text: 'Working across:', color: C.dim },
    { text: '→ machine learning & deep learning', color: C.cyan, indent: 1 },
    { text: '→ AI infrastructure & model deployment', color: C.cyan, indent: 1 },
    { text: '→ full-stack engineering', color: C.cyan, indent: 1 },
    { text: '→ data analytics & visualization', color: C.cyan, indent: 1 },
    gap(),
    dim(`${PROFILE.location} · ${PROFILE.email}`),
  ]

  const stackLines = (d: any): Line[] => {
    const langs: { name: string; repos: number; percent: number }[] = d?.languages || []
    if (!langs.length) {
      return [heading('STACK'), dim('no language data returned by GitHub yet.')]
    }
    const total = langs.reduce((s, l) => s + l.repos, 0)
    const out: Line[] = [
      heading('STACK'),
      dim(`languages detected across ${total} GitHub repository${total === 1 ? '' : 'ies'}`),
      gap(),
    ]
    langs.forEach((l) => {
      out.push({
        text: `${l.name.padEnd(18, ' ')} ${String(l.repos).padStart(2, ' ')} repos   ${String(l.percent).padStart(2, ' ')}%`,
        color: C.grey,
        indent: 1,
      })
    })
    out.push(gap(), dim(`source: ${PROFILE.githubUrl.replace('https://', '')} · GitHub Linguist`))
    return out
  }

  const experienceLines = (rows: any[]): Line[] => {
    if (!rows.length) return [heading('EXPERIENCE'), dim('no entries returned by the API.')]
    const out: Line[] = [heading('EXPERIENCE'), gap()]
    rows.forEach((e, i) => {
      const start = e.start_date
        ? new Date(e.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : ''
      const end =
        !e.end_date || e.end_date === 'Present'
          ? 'Present'
          : new Date(e.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      out.push({ text: `[${String(i + 1).padStart(2, '0')}] ${e.title}`, color: C.grey, bold: true })
      out.push({ text: `     ${e.organization} · ${start} – ${end}`, color: C.green, indent: 0 })
      if (e.location) out.push({ text: `     ${e.location}`, color: C.dim, indent: 0 })
      out.push(gap())
    })
    return out
  }

  const projectsIndexLines = (rows: ProjectRow[]): Line[] => {
    if (!rows.length) return [heading('PROJECTS'), dim('no projects returned by the API.')]
    const out: Line[] = [heading('SELECTED PROJECTS'), gap()]
    rows.forEach((p, i) => {
      out.push({
        text: `[${String(i + 1).padStart(2, '0')}] ${p.title}`,
        color: C.grey,
        bold: true,
      })
      out.push({
        text: `     ${p.category}${p.tags?.length ? ` · ${p.tags.slice(0, 3).join(', ')}` : ''}`,
        color: C.dim,
        indent: 0,
      })
    })
    out.push(gap(), dim("type 'projects <number>' to inspect one.", 0))
    return out
  }

  const projectDetailLines = (p: ProjectRow, n: number): Line[] => {
    const out: Line[] = [
      heading(`[${String(n).padStart(2, '0')}] ${p.title}`),
      { text: `     ${p.category}`, color: C.green, indent: 0 },
      gap(),
    ]
    if (p.description) {
      out.push({ text: p.description, color: C.grey })
      out.push(gap())
    }
    if (p.tags?.length) {
      out.push({ text: `tags: ${p.tags.join(', ')}`, color: C.dim })
      out.push(gap())
    }
    const links: { label: string; href: string }[] = []
    if (p.github_url) links.push({ label: 'repository', href: p.github_url })
    if (p.huggingface_url) links.push({ label: 'live demo', href: p.huggingface_url })
    if (p.live_project_link) links.push({ label: 'live site', href: p.live_project_link })
    if (p.tableau_url) links.push({ label: 'tableau', href: p.tableau_url })
    if (p.powerbi_url) links.push({ label: 'power bi', href: p.powerbi_url })
    links.push({ label: 'full page', href: `${p.hrefBase}/${p.id}` })
    links.forEach((l) => {
      out.push({
        text: `→ ${l.label.padEnd(10, ' ')} ${l.href.replace('https://', '')}`,
        color: C.cyan,
        href: l.href,
      })
    })
    out.push(gap())
    return out
  }

  const githubLines = (d: any): Line[] => {
    const out: Line[] = [heading('GITHUB')]
    const gh = d?.github || {}
    const heat = d?.githubHeat
    out.push(
      { text: `  Repositories    ${num(gh.repos) ?? '-'}`, color: C.grey },
      { text: `  Stars           ${num(gh.stars) ?? '-'}`, color: C.grey },
      { text: `  Followers       ${num(gh.followers) ?? '-'}`, color: C.grey },
      { text: `  Contributions   ${heat ? num(heat.total) : '-'}`, color: C.grey },
      gap(),
      { text: 'Contribution graph · last year', color: C.yellow, bold: true },
      // The green squares, as one fluid full-width block (no scrollbar).
      ...(heat ? [{ text: '', heat }] : []),
      gap(),
      { text: 'Top repositories', color: C.yellow, bold: true },
    )
    const repos: any[] = d?.githubRepos || []
    if (!repos.length) out.push(dim('none returned.', 1))
    repos.forEach((r) => {
      out.push({
        text: `★ ${String(r.stars).padStart(3, ' ')}  ${r.name}${r.language ? `  · ${r.language}` : ''}`,
        color: C.grey,
        href: r.url,
        indent: 1,
      })
    })
    out.push(gap(), { text: `→ ${PROFILE.githubUrl.replace('https://', '')}`, color: C.cyan, href: PROFILE.githubUrl })
    return out
  }

  const modelsLines = (d: any): Line[] => {
    const hf = d?.huggingface || {}
    return [
      heading('HUGGING FACE'),
      { text: `  Models      ${num(hf.models) ?? '-'}`, color: C.grey },
      { text: `  Datasets    ${num(hf.datasets) ?? '-'}`, color: C.grey },
      { text: `  Spaces      ${num(hf.spaces) ?? '-'}`, color: C.grey },
      { text: `  Downloads   ${num(hf.downloads) ?? '-'}`, color: C.grey },
      { text: `  Likes       ${num(hf.likes) ?? '-'}`, color: C.grey },
      gap(),
      { text: `→ ${PROFILE.hfUrl.replace('https://', '')}`, color: C.cyan, href: PROFILE.hfUrl },
    ]
  }

  const contactLines = (): Line[] => [
    heading('CONTACT'),
    { text: `  GitHub        ${PROFILE.githubUrl.replace('https://', '')}`, color: C.grey, href: PROFILE.githubUrl },
    { text: `  Hugging Face  ${PROFILE.hfUrl.replace('https://', '')}`, color: C.grey, href: PROFILE.hfUrl },
    { text: `  Kaggle        ${PROFILE.kaggleUrl.replace('https://', '')}`, color: C.grey, href: PROFILE.kaggleUrl },
    { text: `  Medium        ${PROFILE.mediumUrl.replace('https://', '')}`, color: C.grey, href: PROFILE.mediumUrl },
    { text: `  Tableau Public  ${PROFILE.tableauUrl.replace('https://', '')}`, color: C.grey, href: PROFILE.tableauUrl },
    { text: `  LinkedIn      ${PROFILE.linkedinUrl.replace('https://', '')}`, color: C.grey, href: PROFILE.linkedinUrl },
    { text: `  Email         ${PROFILE.email}`, color: C.grey, href: `mailto:${PROFILE.email}` },
    { text: `  Phone         ${PROFILE.phone}`, color: C.grey, href: `tel:${PROFILE.phone.replace(/\s/g, '')}` },
  ]

  /* ---------------- data loading (cached per session) ---------------- */

  const getStats = useCallback(async () => {
    if (!cache.current.stats) {
      const r = await fetch('/api/activity-stats')
      if (!r.ok) throw new Error('stats')
      cache.current.stats = await r.json()
    }
    return cache.current.stats
  }, [])

  const getProjects = useCallback(async () => {
    if (!cache.current.projects) {
      const sources: { url: string; category: string; hrefBase: string }[] = [
        { url: '/api/projects', category: 'AI / ML', hrefBase: '/projects' },
        { url: '/api/fullstack-projects', category: 'Full Stack', hrefBase: '/fullstack-projects' },
        { url: '/api/data-analytics-projects', category: 'Analytics', hrefBase: '/data-analytics-projects' },
      ]
      const results = await Promise.all(
        sources.map(async (s) => {
          try {
            const r = await fetch(s.url)
            if (!r.ok) return []
            const data = await r.json()
            return (Array.isArray(data) ? data : []).map((p: any) => ({ ...p, category: s.category, hrefBase: s.hrefBase }))
          } catch {
            return []
          }
        })
      )
      cache.current.projects = results.flat() as ProjectRow[]
    }
    return cache.current.projects as ProjectRow[]
  }, [])

  const getExperience = useCallback(async () => {
    if (!cache.current.experience) {
      const r = await fetch('/api/experience')
      if (!r.ok) throw new Error('experience')
      cache.current.experience = await r.json()
    }
    return cache.current.experience as any[]
  }, [])

  /* ---------------- the animated demo (original easter egg) ---------------- */

  const runDemo = useCallback(() => {
    const block = BLOCKS[demoIdx.current % BLOCKS.length]
    demoIdx.current += 1
    push([cmdLine(block.cmd), gap()])
    block.lines.forEach((l, i) => {
      timers.current.push(
        setTimeout(() => push([{ text: l.text, color: l.color, indent: 1 }]), 170 * (i + 1))
      )
    })
  }, [push])

  /* ---------------- command dispatch ---------------- */

  const execute = useCallback(
    async (raw: string) => {
      const [cmd, ...args] = raw.toLowerCase().split(/\s+/)

      if (cmd === 'clear') {
        setLines([])
        return
      }
      if (cmd === 'help') return push(helpLines())
      if (cmd === 'about') return push(aboutLines())
      if (cmd === 'contact') return push(contactLines())
      if (cmd === 'demo') return runDemo()

      if (cmd === 'stack' || cmd === 'github' || cmd === 'models') {
        setBusy(true)
        const source = cmd === 'stack' || cmd === 'github' ? 'github api' : 'hugging face hub api'
        push([dim(`fetching live data from ${source}…`)])
        try {
          const d = await getStats()
          return push(cmd === 'stack' ? stackLines(d) : cmd === 'github' ? githubLines(d) : modelsLines(d))
        } catch {
          return push([{ text: 'stats service unreachable. try again shortly.', color: C.red }])
        } finally {
          setBusy(false)
        }
      }

      if (cmd === 'projects') {
        setBusy(true)
        try {
          const rows = await getProjects()
          const arg = args[0]
          if (arg) {
            const n = parseInt(arg, 10)
            const p = Number.isFinite(n) ? rows[n - 1] : undefined
            return push(p ? projectDetailLines(p, n) : [dim(`no project #${arg}. type 'projects' for the list.`)])
          }
          return push(projectsIndexLines(rows))
        } catch {
          return push([{ text: 'could not load projects right now.', color: C.red }])
        } finally {
          setBusy(false)
        }
      }

      if (cmd === 'experience') {
        setBusy(true)
        try {
          return push(experienceLines(await getExperience()))
        } catch {
          return push([{ text: 'could not load experience right now.', color: C.red }])
        } finally {
          setBusy(false)
        }
      }

      push([
        { text: `command not found: ${cmd}`, color: C.red },
        dim("type 'help' to see available commands."),
      ])
    },
    [getExperience, getProjects, getStats, push, runDemo]
  )

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const raw = input.trim()
      setMode('console')
      if (!raw) {
        push([cmdLine('')])
        return
      }
      setHistory((h) => [...h, raw])
      histIdx.current = history.length + 1
      push([cmdLine(raw)])
      setInput('')
      execute(raw)
    },
    [execute, history.length, input, push]
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (!history.length) return
        histIdx.current = Math.max(0, histIdx.current - 1)
        setInput(history[histIdx.current] ?? '')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        histIdx.current = Math.min(history.length, histIdx.current + 1)
        setInput(histIdx.current >= history.length ? '' : (history[histIdx.current] ?? ''))
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const frag = input.toLowerCase()
        if (!frag) return
        const match = COMMANDS.find((c) => c.startsWith(frag))
        if (match) setInput(match)
      }
    },
    [history, input]
  )

  /* ---------------- render ---------------- */

  return (
    <div
      className="w-full neo-card !p-0 !shadow-neo-sm overflow-hidden group focus-within:border-[color:var(--neo-blue)]"
      tabIndex={0}
      onClick={() => inputRef.current?.focus()}
    >
      {/* title bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b-[3px] border-[color:var(--neo-border)]" style={{ background: 'var(--neo-surface-2)' }}>
        <span className="w-3 h-3 rounded-full border-[2px] border-[color:var(--neo-border)]" style={{ background: '#ff5a5f' }} />
        <span className="w-3 h-3 rounded-full border-[2px] border-[color:var(--neo-border)]" style={{ background: '#ffd23f' }} />
        <span className="w-3 h-3 rounded-full border-[2px] border-[color:var(--neo-border)]" style={{ background: '#9ae66e' }} />
        <span className="ml-2 text-xs font-extrabold tracking-wider opacity-70" style={{ color: 'var(--neo-ink)' }}>
          {mode === 'console' ? 'dev console' : 'my profiles'}
        </span>
        <span className="ml-auto text-[10px] font-bold opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-widest" style={{ color: 'var(--neo-ink-soft)' }}>
          {mode === 'console' ? (busy ? 'working…' : 'type help') : 'scroll to browse'}
        </span>
      </div>

      <div className="px-3 py-2.5 sm:px-4 sm:py-3 font-mono text-xs leading-relaxed" style={{ background: '#0d0d1a' }}>
        {/* fixed-height output: never grows the card */}
        <div ref={outRef} className="h-[118px] overflow-y-auto" style={{ color: C.grey }}>
          {mode === 'profiles' ? (
            <ProfilesTerminalView active view={profilesTab} />
          ) : (
            <>
              {lines.map((l, i) =>
                l.heat ? (
                  <div key={i}>
                    <ContributionHeatmap heat={l.heat} />
                  </div>
                ) : (
                <div
                  key={i}
                  className={l.bold ? 'font-extrabold' : undefined}
                  style={{ color: l.color || C.grey, paddingLeft: l.indent ? `${l.indent}rem` : undefined, whiteSpace: 'pre-wrap' }}
                >
                  {l.href ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:opacity-75 break-all">
                      {l.text}
                    </a>
                  ) : (
                    l.text || '\u00A0'
                  )}
                </div>
                )
              )}
            </>
          )}
        </div>

        {/* prompt */}
        <form onSubmit={onSubmit} className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
          <span className="shrink-0 font-extrabold" style={{ color: C.cyan }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal command input"
            placeholder="help"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none p-0 font-mono text-xs"
            style={{ color: C.grey }}
          />
          {busy && (
            <span className="shrink-0 w-2 h-3 animate-pulse" style={{ background: C.cyan }} aria-hidden="true" />
          )}
        </form>

        {/* actions */}
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 flex-wrap">
          {mode === 'profiles' && (
            <button
              onClick={() => setProfilesTab((t) => (t === 'stats' ? 'repos' : 'stats'))}
              className="flex-1 min-w-0 text-[10px] font-extrabold uppercase tracking-widest py-1 border-2 transition-colors hover:opacity-80 cursor-pointer"
              style={{ background: 'var(--neo-surface-2)', color: C.yellow, borderColor: 'var(--neo-border)' }}
            >
              {profilesTab === 'stats' ? 'show GitHub repos' : 'show my stats'}
            </button>
          )}
          {mode === 'console' && (
            <button
              onClick={() => setLines([])}
              className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 border-2 transition-colors hover:opacity-80 cursor-pointer"
              style={{ background: 'var(--neo-surface-2)', color: C.dim, borderColor: 'var(--neo-border)' }}
            >
              clear
            </button>
          )}
          <button
            onClick={() => {
              setMode((m) => (m === 'console' ? 'profiles' : 'console'))
              setProfilesTab('stats')
            }}
            className="ml-auto shrink-0 text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 border-2 transition-colors hover:opacity-80 cursor-pointer"
            style={{
              background: 'var(--neo-surface-2)',
              color: mode === 'console' ? C.cyan : C.yellow,
              borderColor: 'var(--neo-border)',
            }}
          >
            {mode === 'console' ? 'show my profiles' : 'show console'}
          </button>
        </div>
      </div>
    </div>
  )
}
