import { NextResponse } from 'next/server'

/**
 * Platform activity & stats aggregator.
 *
 * Server-side so we avoid CORS and can hit APIs that block browsers.
 * Every stat comes from a live endpoint — nothing is hardcoded.
 * If a platform (or a single stat) is unavailable, it is omitted and
 * the client simply renders fewer numbers.
 *
 * `revalidate` keeps the ISR cache fresh hourly while sparing the
 * GitHub rate limit (60 req/hr/IP unauthenticated).
 */
export const revalidate = 3600

const GITHUB_USER = 'AIOmarRehan'
const HF_USER = 'AIOmarRehan'
const MEDIUM_FEED = 'https://medium.com/feed/@ai.omar.rehan'

type StatsMap = Record<string, number | string>

async function fetchJson(url: string, init?: RequestInit): Promise<any | null> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        'User-Agent': 'omar-rehan-portfolio',
        Accept: 'application/json',
        ...(init?.headers || {}),
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/* GitHub contribution heatmap. GitHub renders its calendar client-side now,
   so we use the public contributions mirror (mirrors GitHub's own data) and
   bucket the flat day list into GitHub-style week columns (7 rows, Sun..Sat),
   each cell a 0-4 intensity level. */
async function githubHeatmap(): Promise<{ weeks: (number | null)[][]; total: number } | null> {
  const data = await fetchJson(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
  const days = data?.contributions
  if (!Array.isArray(days) || days.length === 0) return null

  const weeks: (number | null)[][] = []
  let cur: (number | null)[] = new Array(7).fill(null)
  for (const day of days) {
    const dow = new Date(`${day.date}T00:00:00Z`).getUTCDay() // 0 = Sunday
    if (dow === 0 && cur.some((v) => v !== null)) {
      weeks.push(cur)
      cur = new Array(7).fill(null)
    }
    cur[dow] = typeof day.level === 'number' ? day.level : 0
  }
  if (cur.some((v) => v !== null)) weeks.push(cur)

  const total = data?.total?.lastYear ?? days.reduce((s: number, d: any) => s + (d.count || 0), 0)
  return { weeks, total }
}

/* GitHub: public_repos / followers from the user endpoint; total stars summed
   from the owner's repo list (first 100 repos); last activity from the most
   recent push; plus the top starred non-fork repos for the repos view. */
async function githubData(): Promise<{ stats: StatsMap | null; top: { name: string; url: string; stars: number; language: string | null }[] }> {
  const [user, repos] = await Promise.all([
    fetchJson(`https://api.github.com/users/${GITHUB_USER}`),
    fetchJson(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner&sort=pushed`),
  ])
  if (!user) return { stats: null, top: [] }

  const stats: StatsMap = {}
  if (typeof user.public_repos === 'number') stats.repos = user.public_repos
  if (typeof user.followers === 'number' && user.followers > 0) stats.followers = user.followers
  if (Array.isArray(repos) && repos.length) {
    stats.stars = repos.reduce((sum: number, r: any) => sum + (r?.stargazers_count || 0), 0)
    const pushed = repos
      .map((r: any) => r?.pushed_at)
      .filter(Boolean)
      .sort()
      .reverse()[0]
    if (pushed) stats.lastActive = new Date(pushed).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const top = Array.isArray(repos)
    ? repos
        .filter((r: any) => !r?.fork)
        .sort((a: any, b: any) => (b?.stargazers_count || 0) - (a?.stargazers_count || 0))
        .slice(0, 10)
        .map((r: any) => ({
          name: r.name as string,
          url: r.html_url as string,
          stars: (r.stargazers_count || 0) as number,
          language: r.language ?? null,
        }))
    : []

  return { stats: Object.keys(stats).length ? stats : null, top }
}

/* Hugging Face: official profile-scoped list endpoints. Counts are array
   lengths; downloads/likes are summed across the author's models. */
async function huggingFaceStats(): Promise<StatsMap | null> {
  const [models, datasets, spaces] = await Promise.all([
    fetchJson(`https://huggingface.co/api/models?author=${HF_USER}`),
    fetchJson(`https://huggingface.co/api/datasets?author=${HF_USER}`),
    fetchJson(`https://huggingface.co/api/spaces?author=${HF_USER}`),
  ])
  if (!Array.isArray(models) && !Array.isArray(datasets) && !Array.isArray(spaces)) return null

  const stats: StatsMap = {}
  if (Array.isArray(models)) {
    stats.models = models.length
    stats.downloads = models.reduce((s: number, m: any) => s + (m?.downloads || 0), 0)
    stats.likes = models.reduce((s: number, m: any) => s + (m?.likes || 0), 0)
  }
  if (Array.isArray(datasets)) stats.datasets = datasets.length
  if (Array.isArray(spaces)) stats.spaces = spaces.length
  return Object.keys(stats).length ? stats : null
}

/* Medium: official RSS feed. It lists the 10 most recent posts — shown
   honestly as "recent" rather than pretending it is the total — plus the
   latest post title as a real, non-fabricated detail. */
async function mediumStats(): Promise<StatsMap | null> {
  try {
    const res = await fetch(MEDIUM_FEED, {
      headers: { 'User-Agent': 'omar-rehan-portfolio' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const xml = await res.text()
    const items = (xml.match(/<item>/g) || []).length
    if (items === 0) return null
    const stats: StatsMap = { recent: items }
    const titleMatch = xml.match(/<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)
    const latest = titleMatch?.[1]?.trim()
    if (latest) stats.latest = latest
    return stats
  } catch {
    return null
  }
}

export async function GET() {
  const [gh, githubHeat, huggingface, medium] = await Promise.all([
    githubData(),
    githubHeatmap(),
    huggingFaceStats(),
    mediumStats(),
  ])

  // Kaggle and LinkedIn expose no anonymous public API (both block or
  // require OAuth), so they render as profile-link slides — no fake numbers.
  return NextResponse.json({
    github: gh.stats,
    githubRepos: gh.top,
    githubHeat,
    huggingface,
    medium,
    updatedAt: Date.now(),
  })
}
