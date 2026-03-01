'use client'

import dynamic from 'next/dynamic'

const InteractiveBackground = dynamic(() => import('@/components/InteractiveBackground'), {
  ssr: false,
  loading: () => null,
})

export default function DynamicInteractiveBackground() {
  return <InteractiveBackground />
}
