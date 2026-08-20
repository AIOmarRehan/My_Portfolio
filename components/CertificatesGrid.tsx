'use client'

import { useState } from 'react'
import type { IconType } from 'react-icons'
import { FaCheck } from 'react-icons/fa'
import { getTagIcon } from '@/lib/techIcons'
import { iconRegistry } from '@/lib/iconRegistry'
import SvgIcon from './icons/SvgIcon'
import ItemDetailModal, { type PortfolioItem } from './ItemDetailModal'

/**
 * Best-effort issuer mark.
 *
 * The certificates table has no logo/image column, so rather than invent an
 * asset we resolve the issuer name against the existing tech icon registry
 * (AWS, Google Cloud, Microsoft, Coursera-style entries all match). When there
 * is no match we fall back to a monogram built from the issuer's initials.
 */
function IssuerMark({ issuer }: { issuer?: string }) {
  if (!issuer) return null

  const iconData = getTagIcon(issuer)
  let IconComponent: IconType | null = null
  let svgIconName = ''

  if (iconData) {
    const [pkg, name] = iconData.icon.split('/')
    if (pkg === 'svg') svgIconName = name
    else IconComponent = iconRegistry[iconData.icon] || null
  }

  const monogram = issuer
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <span
      className="flex items-center justify-center flex-shrink-0 w-9 h-9"
      style={{
        background: 'var(--neo-surface-2)',
        border: '2px solid var(--neo-border)',
        borderRadius: '4px',
      }}
      aria-hidden="true"
    >
      {svgIconName ? (
        <SvgIcon name={svgIconName} className="w-5 h-5" style={{ color: 'var(--neo-ink)' }} />
      ) : IconComponent ? (
        <IconComponent className="w-5 h-5" style={{ color: 'var(--neo-ink)' }} />
      ) : (
        <span className="text-[0.65rem] font-extrabold text-[color:var(--neo-ink)]">{monogram}</span>
      )}
    </span>
  )
}

const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

/**
 * Compact 4-column credential grid.
 *
 * Each micro-card shows only issuer mark, title, date and a verification
 * badge. Clicking opens the shared modal, which renders the full description,
 * the complete tag list and the credential link.
 */
export default function CertificatesGrid({ certificates }: { certificates: PortfolioItem[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  if (!certificates || certificates.length === 0) {
    return (
      <div className="neo-empty">
        <p>No certifications yet.</p>
      </div>
    )
  }

  const activeItem = activeIdx !== null ? certificates[activeIdx] : null

  return (
    <>
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 overflow-visible list-none p-0 m-0"
        role="list"
      >
        {certificates.map((cert, idx) => (
          <li key={String(cert.id)} className="flex">
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
              className="group neo-card acc-yellow neo-micro p-4"
              aria-label={`View full details for ${cert.title}`}
            >
              <div className="flex items-start gap-2.5">
                <IssuerMark issuer={cert.issuer} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold leading-snug break-words neo-clamp-3">
                    {cert.title}
                  </h3>
                </div>
              </div>

              {cert.issuer && (
                <p className="text-xs font-extrabold text-[color:var(--neo-yellow)] neo-clamp-1">
                  {cert.issuer}
                </p>
              )}

              <div className="mt-auto pt-3 flex items-center justify-between gap-2 flex-wrap">
                {cert.issue_date ? (
                  <span className="text-[0.68rem] font-semibold text-[color:var(--neo-ink-soft)]">
                    {formatShortDate(cert.issue_date)}
                  </span>
                ) : (
                  <span />
                )}
                {/* Shown on every credential, including ones added later. */}
                <span className="neo-badge-verified">
                  <FaCheck className="w-2.5 h-2.5" aria-hidden="true" />
                  Verified
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {activeItem && (
        <ItemDetailModal
          item={activeItem}
          accent="yellow"
          categoryLabel="Credential"
          tagVariant="yellow"
          onClose={() => setActiveIdx(null)}
        />
      )}
    </>
  )
}
