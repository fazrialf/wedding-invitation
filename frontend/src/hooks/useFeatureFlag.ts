'use client'

import { useState, useEffect } from 'react'
import posthog from 'posthog-js'
import type { FlagKey } from '@/lib/featureFlags'

/**
 * Returns the current value of a PostHog feature flag.
 * Defaults to false (zero state) until PostHog has loaded and evaluated flags.
 *
 * Usage:
 *   const rsvpEnabled = useFeatureFlag('rsvp-enabled')
 *   if (!rsvpEnabled) return null
 */
export function useFeatureFlag(flagKey: FlagKey): boolean {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!posthog.__loaded) return

    // Read immediately if flags are already loaded
    setEnabled(!!posthog.isFeatureEnabled(flagKey))

    // Re-evaluate if flags reload (e.g. after identify())
    posthog.onFeatureFlags(() => {
      setEnabled(!!posthog.isFeatureEnabled(flagKey))
    })
  }, [flagKey])

  return enabled
}
