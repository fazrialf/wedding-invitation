'use client'

import { useCallback, useEffect, useRef } from 'react'
import posthog from 'posthog-js'

/**
 * Central analytics hook for invitation section tracking.
 *
 * Usage:
 *   const { trackViewed, track } = useAnalytics('rsvp')
 *   trackViewed(inView)           // call whenever useInView's inView changes
 *   track('rsvp_submitted', {...}) // call on any user action
 */
export function useAnalytics(section: string) {
  const viewedFired = useRef(false)

  // Fire section_viewed once when the section scrolls into view
  const trackViewed = useCallback((inView: boolean) => {
    if (!inView || viewedFired.current || !posthog.__loaded) return
    viewedFired.current = true
    posthog.capture('section_viewed', { section })
  }, [section])

  // Fire any named event with optional extra properties
  const track = useCallback((event: string, properties?: Record<string, unknown>) => {
    if (!posthog.__loaded) return
    posthog.capture(event, { section, ...properties })
  }, [section])

  return { trackViewed, track }
}
