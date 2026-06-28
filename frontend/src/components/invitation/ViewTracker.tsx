'use client'

import { useEffect } from 'react'
import axios from 'axios'

interface ViewTrackerProps {
  invitationId: string
  guestName?:   string
}

export default function ViewTracker({ invitationId, guestName }: ViewTrackerProps) {
  useEffect(() => {
    // Fire-and-forget — don't block rendering
    axios.post(`/api/analytics/view`, {
      invitation_id: invitationId,
      guest_name:    guestName || null,
    }).catch(() => {})
  }, [invitationId, guestName])

  return null
}
