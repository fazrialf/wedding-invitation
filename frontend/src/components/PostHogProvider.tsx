'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog } from '@/lib/posthog'
import { ZERO_STATE } from '@/lib/featureFlags'
import posthog from 'posthog-js'

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const initialized  = useRef(false)

  // Initialize once on mount + capture zero state when flags are ready
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    initPostHog()

    // Once PostHog has evaluated feature flags, capture the zero state.
    // This fires once per session and records exactly which features were
    // enabled/disabled at the moment the user arrived — your baseline.
    posthog.onFeatureFlags(() => {
      const flagSnapshot = Object.fromEntries(
        Object.entries(ZERO_STATE).map(([key]) => [
          key.replace(/-/g, '_'),                 // rsvp-enabled → rsvp_enabled
          !!posthog.isFeatureEnabled(key),
        ])
      )

      posthog.capture('feature_flags_evaluated', {
        ...flagSnapshot,
        evaluated_at: new Date().toISOString(),
      })
    })
  }, [])

  // Fire $pageview on every route change
  useEffect(() => {
    if (!posthog.__loaded) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return <>{children}</>
}
