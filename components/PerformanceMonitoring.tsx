'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// gtag types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

// Track Web Vitals metrics
export function WebVitals() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Page view tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pathname + searchParams.toString(),
      })
    }
  }, [pathname, searchParams])

  useEffect(() => {
    const reportWebVitals = (metric: any) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 :metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }

      // Dev logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric.name, metric.value)
      }
    }

    // Web vitals import
    if (typeof window !== 'undefined') {
      import('web-vitals')
        .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
          onCLS(reportWebVitals)
          onFID(reportWebVitals)
          onFCP(reportWebVitals)
          onLCP(reportWebVitals)
          onTTFB(reportWebVitals)
        })
        .catch(() => {
          // Skip if not installed
          if (process.env.NODE_ENV === 'development') {
            console.log('web-vitals not installed. Run: npm install web-vitals')
          }
        })
    }
  }, [])

  return null
}

// Preconnect hints
export function ResourceHints() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <>
      {supabaseUrl && (
        <link rel="preconnect" href={supabaseUrl} crossOrigin="anonymous" />
      )}
      <link rel="dns-prefetch" href="https://accounts.google.com" />
    </>
  )
}
