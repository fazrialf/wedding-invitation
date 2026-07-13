'use client'

import { useEffect } from 'react'
import axios from 'axios'
import posthog from 'posthog-js'

interface ViewTrackerProps {
  invitationId: string
  guestName?:   string
}

export default function ViewTracker({ invitationId, guestName }: ViewTrackerProps) {
  useEffect(() => {
    // 1. Fire to our own backend (existing behaviour — preserved)
    axios.post(`/api/analytics/view`, {
      invitation_id: invitationId,
      guest_name:    guestName || null,
    }).catch(() => {})

    // 2. Fire to PostHog
    if (posthog.__loaded) {
      posthog.capture('invitation_viewed', {
        invitation_id: invitationId,
        guest_name:    guestName || null,
        // PostHog will auto-attach $current_url, $referrer, $device_type, etc.
      })

      // Tag every future event in this session with the invitation context
      posthog.register({
        active_invitation_id: invitationId,
        ...(guestName ? { active_guest_name: guestName } : {}),
      })
    }
  }, [invitationId, guestName])

  return null
}
