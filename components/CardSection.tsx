'use client'

import { useRef, useState } from 'react'
import TagBadge from './TagBadge'
import ItemDetailModal, { type Accent, type PortfolioItem, type TagVariant } from './ItemDetailModal'

/** How many tags fit on a compact card before we collapse the rest into "+N". */
const MAX_CARD_TAGS = 3

interface CardSectionProps {
  items: PortfolioItem[]
  accent: Accent
  /** Pill text in the card header, e.g. "AI / ML". */
  categoryLabel: string
  tagVariant: TagVariant
  /** Route prefix for the full detail page, e.g. "/projects". Omit for articles. */
  hrefBase?: string
  /**
   * Cards visible before the "Show All" toggle. Omit to always render every
   * card (used by the 3-item Full-Stack / Data Analytics rows).
   */
  initialCount?: number
  /** Tailwind grid classes; defaults to the 1/2/3 responsive grid. */
  gridClassName?: string
  /** Plural noun for the toggle label, e.g. "Projects" / "Articles". */
  itemNoun?: string
  emptyMessage: string
}

/**
 * Compact, uniform-height card grid with an optional "Show All" toggle.
 *
 * Cards are preview-only: clamped title and description, first few tags, and no
 * action buttons. Every link lives in ItemDetailModal, which opens via
 * "View details →" (click or keyboard) and renders 100% of the item's content.
 */
export default function CardSection({
  items,
  accent,
  categoryLabel,
  tagVariant,
  hrefBase,
  initialCount,
  gridClassName = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  itemNoun = 'Items',
  emptyMessage,
}: CardSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  if (!items || items.length === 0) {
    return (
      <div className="neo-empty">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  const collapsible = typeof initialCount === 'number' && items.length > initialCount
  const visibleItems = collapsible && !expanded ? items.slice(0, initialCount) : items

  const handleToggle = () => {
    const next = !expanded
    setExpanded(next)
    // When collapsing, bring the section heading back into view so the user
    // isn't left staring at the whitespace the removed cards left behind.
    if (!next) {
      requestAnimationFrame(() => {
        rootRef.current?.closest('section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  const activeItem = activeIdx !== null ? items[activeIdx] : null

  return (
    <div ref={rootRef}>
      <ul className={`grid ${gridClassName} gap-6 w-full overflow-visible list-none p-0 m-0`} role="list">
        {visibleItems.map((item, idx) => (
          <li key={String(item.id)} className="flex">
            {/*
              role="button" rather than a real <button> because the card holds
              flow content (h3/p/div), which <button> does not permit. Keyboard
              activation is wired manually to keep it fully accessible.
            */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setActiveIdx(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveIdx(idx)
                }
              }}
              className={`group neo-card neo-tilt acc-${accent} neo-compact p-5 sm:p-6`}
              aria-label={`View full details for ${item.title}`}
            >
              <div className="card-top">
                <span className="card-num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="card-cat">{categoryLabel}</span>
              </div>

              {/* Media — same three branches as before: image, video, title fallback */}
              {item.image ? (
                <div className="neo-compact-media neo-skeleton">
                  <img
                    src={item.image}
                    alt={`Screenshot of ${item.title}`}
                    decoding="async"
                    loading={idx < 3 ? 'eager' : 'lazy'}
                    fetchPriority={idx < 3 ? 'high' : 'auto'}
                  />
                </div>
              ) : item.demo_video ? (
                <div className="neo-compact-media">
                  <svg className="w-12 h-12 text-[color:var(--neo-ink)]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              ) : (
                <div className="neo-compact-media" style={{ background: `var(--neo-${accent})` }}>
                  <span className="text-center px-4 font-extrabold neo-clamp-3">{item.title}</span>
                </div>
              )}

              <h3 className="text-lg font-extrabold break-words leading-snug mb-1.5 neo-clamp-2 transition-colors duration-200">
                {item.title}
              </h3>

              {/* Secondary line: organization / issuer when present */}
              {(item.organization || item.issuer) && (
                <p
                  className="text-xs font-extrabold mb-1.5 neo-clamp-1"
                  style={{ color: `var(--neo-${accent})` }}
                >
                  {item.organization || item.issuer}
                </p>
              )}

              {item.description && (
                <p className="text-gray-400 text-sm mb-3 neo-clamp-3">{item.description}</p>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.slice(0, MAX_CARD_TAGS).map((tag, tIdx) => (
                    <TagBadge key={tIdx} tag={tag} variant={tagVariant} />
                  ))}
                  {item.tags.length > MAX_CARD_TAGS && (
                    <span className="neo-tag-more">+{item.tags.length - MAX_CARD_TAGS} more</span>
                  )}
                </div>
              )}

              <div className="neo-compact-cta">
                <span>View details</span>
                <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {collapsible && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleToggle}
            className={`neo-btn neo-btn-${accent}`}
            aria-expanded={expanded}
          >
            {expanded ? (
              <>Show Less <span aria-hidden="true">↑</span></>
            ) : (
              <>Show All {items.length} {itemNoun} <span aria-hidden="true">↓</span></>
            )}
          </button>
        </div>
      )}

      {activeItem && (
        <ItemDetailModal
          item={activeItem}
          accent={accent}
          categoryLabel={categoryLabel}
          tagVariant={tagVariant}
          detailHref={hrefBase ? `${hrefBase}/${activeItem.id}` : undefined}
          onClose={() => setActiveIdx(null)}
        />
      )}
    </div>
  )
}
