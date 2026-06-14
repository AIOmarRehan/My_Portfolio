import { memo } from 'react'

/**
 * Neubrutalism skeleton placeholders — bold borders + hard shadow +
 * shimmer. Used as lazy-load fallbacks so the layout never collapses on
 * slow connections.
 */

export const NeoCardSkeleton = memo(function NeoCardSkeleton() {
  return (
    <div className="neo-card p-5 flex flex-col gap-4" aria-hidden="true">
      <div className="neo-skeleton h-40 w-full" />
      <div className="neo-skeleton-line w-3/4" />
      <div className="neo-skeleton-line w-full" />
      <div className="neo-skeleton-line w-5/6" />
      <div className="flex gap-2 mt-1">
        <div className="neo-skeleton-line w-16 h-6" />
        <div className="neo-skeleton-line w-16 h-6" />
      </div>
    </div>
  )
})

export const NeoCardGridSkeleton = memo(function NeoCardGridSkeleton({
  count = 3,
}: {
  count?: number
}) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <NeoCardSkeleton key={i} />
      ))}
    </div>
  )
})

export const NeoBlockSkeleton = memo(function NeoBlockSkeleton({
  className = '',
}: {
  className?: string
}) {
  return <div className={`neo-skeleton ${className}`} aria-hidden="true" />
})
