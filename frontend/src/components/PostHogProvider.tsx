'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog } from '@/lib/posthog'
import posthog from 'posthog-js'

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const initialized  = useRef(false)

  // Initialize once on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    initPostHog()
  }, [])

  // Fire $pageview on every route change
  useEffect(() => {
    if (!posthog.__loaded) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return <>{children}</>
}
