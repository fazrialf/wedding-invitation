'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RsvpRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/dashboard/invitations') }, [router])
  return null
}
