'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa'
import { SiHuggingface } from 'react-icons/si'
import TagBadge from './TagBadge'
import LazyVideo from './LazyVideo'
import SvgIcon from './icons/SvgIcon'

/* ------------------------------------------------------------------
   Shared types. Deliberately permissive: every section passes its raw
   Supabase row straight through, so no data is reshaped or dropped.
   ------------------------------------------------------------------ */
export type Accent = 'blue' | 'cyan' | 'orange' | 'lime' | 'yellow' | 'pink'
export type TagVariant = 'blue' | 'pink' | 'yellow' | 'gray' | 'green'

export interface PortfolioItem {
  id: number | string
  title: string
  description?: string
  image?: string
  demo_video?: string
  tags?: string[]
  // projects
  github_url?: string
  huggingface_url?: string
  // fullstack
  live_project_link?: string
  // analytics
  tableau_url?: string
  powerbi_url?: string
  // articles
  url?: string
  /** Optional admin-managed "Read Article" link on the three project sections. */
  article_url?: string
  // certificates
  issuer?: string
  issue_date?: string
  credential_url?: string
  // experience
  organization?: string
  location?: string
  start_date?: string
  end_date?: string
  highlights?: string[]
  created_at?: string
}

export const ACCENT: Record<Accent, { color: string; btn: string }> = {
  blue: { color: 'var(--neo-blue)', btn: 'neo-btn-blue' },
  cyan: { color: 'var(--neo-cyan)', btn: 'neo-btn-cyan' },
  orange: { color: 'var(--neo-orange)', btn: 'neo-btn-orange' },
  lime: { color: 'var(--neo-lime)', btn: 'neo-btn-lime' },
  yellow: { color: 'var(--neo-yellow)', btn: 'neo-btn-yellow' },
  pink: { color: 'var(--neo-pink)', btn: 'neo-btn-pink' },
}

export const GitHubMark = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0.5C5.5 0.5 0.5 5.5 0.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.8 1.6.8.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.5-.3-5.1-1.2-5.1-5.3 0-1.2.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 2.9 1.1.8-.2 1.7-.4 2.6-.4s1.8.1 2.6.4c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.6.1 2.9.7.7 1.1 1.6 1.1 2.8 0 4-2.6 5-5.1 5.3.4.4.8 1 .8 2v3c0 .3.2.7.8.6C20.7 21.4 24 17.1 24 12c0-6.5-5-11.5-12-11.5z" />
  </svg>
)

export const MediumMark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M9.025 8c0 2.485-2.02 4.5-4.513 4.5A4.506 4.506 0 0 1 0 8c0-2.486 2.02-4.5 4.512-4.5A4.506 4.506 0 0 1 9.025 8m4.95 0c0 2.34-1.01 4.236-2.256 4.236S9.463 10.339 9.463 8c0-2.34 1.01-4.236 2.256-4.236S13.975 5.661 13.975 8M16 8c0 2.096-.355 3.795-.794 3.795-.438 0-.793-1.7-.793-3.795 0-2.096.355-3.795.794-3.795.438 0 .793 1.699.793 3.795" />
  </svg>
)

const formatLongDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const formatMonthYear = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

interface ItemDetailModalProps {
  item: PortfolioItem
  accent: Accent
  categoryLabel: string
  tagVariant: TagVariant
  /** Full detail page route, for the three project sections. */
  detailHref?: string
  onClose: () => void
}

/**
 * Full-detail modal / mobile slide-over drawer.
 *
 * Renders 100% of an item: unclipped description, every highlight, the
 * complete tag list, image + demo video, and every external link the card
 * used to show. Portaled to <body> so it escapes <main>'s `relative z-10`
 * stacking context and covers the fixed header.
 */
export default function ItemDetailModal({
  item,
  accent,
  categoryLabel,
  tagVariant,
  detailHref,
  onClose,
}: ItemDetailModalProps) {
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const accentCfg = ACCENT[accent]

  useEffect(() => setMounted(true), [])

  // Esc to close
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  // Lock background scroll + wire Esc, restore focus on unmount
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.classList.add('neo-modal-open')
    document.addEventListener('keydown', onKeyDown)
    // Move focus into the dialog for keyboard + screen-reader users
    const raf = requestAnimationFrame(() => panelRef.current?.focus())
    return () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('neo-modal-open')
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onKeyDown])

  if (!mounted) return null

  const dateRange =
    item.start_date &&
    `${formatMonthYear(item.start_date)} - ${
      item.end_date === 'Present' || !item.end_date ? 'Present' : formatMonthYear(item.end_date)
    }`

  const hasLinks =
    item.github_url ||
    item.huggingface_url ||
    item.live_project_link ||
    item.tableau_url ||
    item.powerbi_url ||
    item.url ||
    item.article_url ||
    item.credential_url ||
    detailHref

  const content = (
    <div
      className="neo-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="neo-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${item.id}`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------- Header ---------- */}
        <div className="neo-modal-head">
          <div className="flex-1 min-w-0">
            <span
              className="inline-block mb-2 px-2.5 py-0.5 text-[0.62rem] font-extrabold uppercase tracking-widest border-2 rounded-full text-[#111]"
              style={{ background: accentCfg.color, borderColor: 'var(--neo-border)' }}
            >
              {categoryLabel}
            </span>
            <h2
              id={`modal-title-${item.id}`}
              className="text-xl sm:text-2xl font-extrabold break-words leading-snug"
            >
              {item.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="neo-btn neo-btn-red w-9 h-9 !p-0 flex-shrink-0"
            aria-label="Close details"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ---------- Body ---------- */}
        <div className="neo-modal-body">
          {/* Experience / certificate meta */}
          {(item.organization || item.issuer || dateRange || item.issue_date) && (
            <div className="mb-4 pb-4" style={{ borderBottom: '2px dashed var(--neo-border)' }}>
              {item.organization && (
                <p className="font-extrabold text-lg" style={{ color: accentCfg.color }}>
                  {item.organization}
                </p>
              )}
              {item.issuer && (
                <p className="font-extrabold text-sm" style={{ color: accentCfg.color }}>
                  {item.issuer}
                </p>
              )}
              {item.location && (
                <p className="text-sm font-medium text-[color:var(--neo-ink-soft)]">{item.location}</p>
              )}
              {dateRange && (
                <p className="text-sm font-semibold text-[color:var(--neo-ink-soft)] mt-1">{dateRange}</p>
              )}
              {item.issue_date && (
                <p className="text-xs font-semibold text-[color:var(--neo-ink-soft)] mt-1">
                  Issued {formatLongDate(item.issue_date)}
                </p>
              )}
            </div>
          )}

          {/* Media — image and video are both shown when both exist */}
          {item.image && (
            <div
              className="mb-4 overflow-hidden"
              style={{
                border: 'var(--neo-bw) solid var(--neo-border)',
                borderRadius: 'var(--neo-radius)',
              }}
            >
              <img
                src={item.image}
                alt={`${item.title} preview`}
                className="w-full h-auto object-cover block"
                decoding="async"
                loading="lazy"
              />
            </div>
          )}
          {item.demo_video && (
            <div
              className="mb-4 overflow-hidden"
              style={{
                border: 'var(--neo-bw) solid var(--neo-border)',
                borderRadius: 'var(--neo-radius)',
              }}
            >
              <LazyVideo src={item.demo_video} alt={`${item.title} demo video`} className="w-full h-auto" />
            </div>
          )}

          {/* Full, unclipped description */}
          {item.description && (
            <p className="text-sm sm:text-base leading-relaxed font-medium text-[color:var(--neo-ink-soft)] mb-4 whitespace-pre-line">
              {item.description}
            </p>
          )}

          {/* Every highlight (experience) */}
          {item.highlights && item.highlights.length > 0 && (
            <ul className="space-y-2 mb-4">
              {item.highlights.map((highlight, hIdx) => (
                <li key={hIdx} className="text-sm flex items-start gap-3 text-[color:var(--neo-ink-soft)]">
                  <span className="font-extrabold mt-0.5" style={{ color: accentCfg.color }}>
                    •
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Complete tag list, unclipped */}
          {item.tags && item.tags.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mb-4 pt-4"
              style={{ borderTop: '2px dashed var(--neo-border)' }}
            >
              {item.tags.map((tag, tIdx) => (
                <TagBadge key={tIdx} tag={tag} variant={tagVariant} />
              ))}
            </div>
          )}

          {/* Every external link */}
          {hasLinks && (
            <div
              className="flex flex-wrap gap-3 items-center pt-4"
              style={{ borderTop: 'var(--neo-bw) solid var(--neo-border)' }}
            >
              {detailHref && (
                <Link href={detailHref} prefetch className={`neo-btn ${accentCfg.btn} text-sm py-1.5 px-3`}>
                  Open full page →
                </Link>
              )}
              {item.github_url && (
                <a
                  href={item.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn neo-btn-ink text-sm py-1.5 px-3"
                  aria-label={`View ${item.title} repository`}
                >
                  <GitHubMark />
                  <span>Repo</span>
                </a>
              )}
              {item.huggingface_url && (
                <a
                  href={item.huggingface_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn neo-btn-yellow text-sm py-1.5 px-3"
                  aria-label={`View ${item.title} live project`}
                >
                  <SiHuggingface className="w-4 h-4" />
                  <span>Live Project</span>
                </a>
              )}
              {item.live_project_link && (
                <a
                  href={item.live_project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn neo-btn-lime text-sm py-1.5 px-3"
                  aria-label={`View ${item.title} live`}
                >
                  <FaExternalLinkAlt className="w-3.5 h-3.5" />
                  <span>Live Project</span>
                </a>
              )}
              {item.tableau_url && (
                <a
                  href={item.tableau_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-sm hover:opacity-70 px-1 transition-opacity"
                  aria-label={`View ${item.title} dashboard on Tableau Public`}
                >
                  <SvgIcon name="tableau" className="w-4 h-4" />
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #C8283E, #E8782E, #1D76BC)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Dashboard
                  </span>
                </a>
              )}
              {item.powerbi_url && (
                <a
                  href={item.powerbi_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-sm hover:opacity-70 px-1 transition-opacity"
                  aria-label={`View ${item.title} report on Power BI`}
                >
                  <SvgIcon name="powerbi" className="w-4 h-4" />
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #F2C811, #E6AD10, #C97D0E)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Power BI
                  </span>
                </a>
              )}
              {item.article_url && (
                <a
                  href={item.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn neo-btn-pink text-sm py-1.5 px-3"
                  aria-label={`Read the article about ${item.title}`}
                >
                  {item.article_url.includes('medium') ? <MediumMark /> : null}
                  <span>Read Article</span>
                </a>
              )}
              {item.url && !item.article_url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn neo-btn-pink text-sm py-1.5 px-3"
                  aria-label={`Read ${item.title} article`}
                >
                  {item.url.includes('medium') ? <MediumMark /> : null}
                  <span>Read Article</span>
                </a>
              )}
              {item.credential_url && (
                <a
                  href={item.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn neo-btn-yellow text-sm py-1.5 px-3"
                  aria-label={`View ${item.title} certification credential`}
                >
                  <span>View Certificate →</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
