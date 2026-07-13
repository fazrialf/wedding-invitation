import posthog from 'posthog-js'

export const POSTHOG_KEY  = process.env.NEXT_PUBLIC_POSTHOG_KEY  || ''
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com'

export function initPostHog() {
  if (typeof window === 'undefined') return
  if (!POSTHOG_KEY) return
  if (posthog.__loaded) return

  posthog.init(POSTHOG_KEY, {
    api_host:          POSTHOG_HOST,
    ui_host:           'https://eu.posthog.com',
    capture_pageview:  false, // fired manually per route in PostHogProvider
    capture_pageleave: true,
    persistence:       'localStorage+cookie',
    autocapture:       false, // custom events only — keeps the event list clean
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.debug()
    },
  })
}

export default posthog
