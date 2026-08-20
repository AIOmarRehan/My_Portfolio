'use client'

import { useState } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import TagBadge from './TagBadge'
import type { PortfolioItem } from './ItemDetailModal'

/** Every position starts collapsed; the user expands what they want to read. */
const OPEN_BY_DEFAULT = 0

const formatMonthYear = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

const dateRangeOf = (exp: PortfolioItem) =>
  `${exp.start_date ? formatMonthYear(exp.start_date) : ''}${exp.start_date ? ' - ' : ''}${
    exp.end_date === 'Present' || !exp.end_date ? 'Present' : formatMonthYear(exp.end_date)
  }`

/**
 * Vertical timeline where every position is a collapsible slider.
 *
 * All roles start collapsed so the section stays compact; the user opens the
 * ones they care about. No content is removed — it is only folded away.
 */
export default function ExperienceTimeline({ experiences }: { experiences: PortfolioItem[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set((experiences || []).slice(0, OPEN_BY_DEFAULT).map((e) => String(e.id)))
  )

  if (!experiences || experiences.length === 0) {
    return (
      <div className="neo-empty">
        <p>No experience yet.</p>
      </div>
    )
  }

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="relative" role="list">
      {/* Vertical lime line — centered behind the dot column */}
      <div
        className="absolute top-0 bottom-0 w-[3px] rounded-full z-0"
        style={{ left: 'calc(14px - 1.5px)', background: 'var(--neo-lime)' }}
        aria-hidden="true"
      />

      {experiences.map((exp, idx) => {
        const isCurrent = exp.end_date === 'Present'
        const id = String(exp.id)
        const isOpen = openIds.has(id)
        const range = dateRangeOf(exp)

        return (
          <div key={id} className="flex gap-5 mb-6 last:mb-0" role="listitem">
            {/* Dot column */}
            <div className="relative w-7 flex-shrink-0 flex flex-col items-center">
              <div className="flex-1 min-h-[12px]" />
              <div
                className={`relative z-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCurrent ? 'w-6 h-6' : 'w-5 h-5'
                }`}
                style={{ background: 'var(--neo-bg)' }}
                aria-hidden="true"
              >
                <div
                  className={`rounded-full ${isCurrent ? 'w-4 h-4' : 'w-3 h-3'}`}
                  style={{
                    background: 'var(--neo-lime)',
                    border: 'var(--neo-bw) solid var(--neo-border)',
                    animation: isCurrent ? 'neoTimelinePulse 2.4s ease-in-out infinite' : 'none',
                  }}
                />
              </div>
              <div className="flex-1 min-h-[12px]" />
            </div>

            {/* Collapsible card */}
            <div className="flex-1 neo-card acc-lime px-5 py-4">
              <button
                type="button"
                onClick={() => toggle(id)}
                className="neo-acc-trigger"
                aria-expanded={isOpen}
                aria-controls={`exp-panel-${id}`}
              >
                <span className="card-num flex-shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
                  <span className="font-extrabold text-base text-white">{exp.title}</span>
                  <span className="opacity-40" aria-hidden="true">|</span>
                  <span className="font-semibold text-sm text-green-400">{exp.organization}</span>
                  <span className="opacity-40" aria-hidden="true">|</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{range}</span>
                </span>
                <svg
                  className={`neo-acc-chevron w-4 h-4 ${isOpen ? 'is-open' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div id={`exp-panel-${id}`} className={`neo-acc-body ${isOpen ? 'is-open' : ''}`}>
                <div className="neo-acc-inner">
                  <div className="pt-4">
                    {exp.location && (
                      <p className="text-sm mb-3 flex items-center gap-2 text-[color:var(--neo-ink-soft)]">
                        {/* Themed ink so the pin is black in light mode and
                            light in dark mode, instead of a fixed colour. */}
                        <FaMapMarkerAlt
                          className="w-3.5 h-3.5 flex-shrink-0"
                          style={{ color: 'var(--neo-ink)' }}
                          aria-hidden="true"
                        />
                        {exp.location}
                      </p>
                    )}

                    {exp.description && (
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">{exp.description}</p>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {exp.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="text-gray-400 text-sm flex items-start gap-3">
                            <span className="text-green-400 font-bold mt-0.5">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                        {exp.tags.map((tag, tIdx) => (
                          <TagBadge key={tIdx} tag={tag} variant="green" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
