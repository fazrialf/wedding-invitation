'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WishesRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/dashboard/invitations') }, [router])
  return null
}
