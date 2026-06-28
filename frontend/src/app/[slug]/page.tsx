import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import axios from 'axios'
import { getTheme } from '@/themes/config'
import EnvelopeOpenerWrapper from './EnvelopeOpenerWrapper'

interface Props {
  params:      { slug: string }
  searchParams: { to?: string }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://backend:4000'
    const res = await axios.get(`${API}/api/invitations/${params.slug}`)
    const inv = res.data
    const title       = `${inv.bride_name} & ${inv.groom_name} Wedding`
    const description = `You are cordially invited to the wedding of ${inv.bride_name} and ${inv.groom_name} on ${inv.wedding_date}. ${inv.reception_venue || ''}`
    const image       = inv.cover_photo_url || 'https://placehold.co/1200x630/f5f5f4/78716c?text=Wedding+Invitation'

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type:   'website',
        locale: 'id_ID',
        images: [{ url: image, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card:        'summary_large_image',
        title,
        description,
        images:      [image],
      },
    }
  } catch {
    return { title: 'Wedding Invitation' }
  }
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://backend:4000'

  let inv: any
  try {
    const res = await axios.get(`${API}/api/invitations/${params.slug}`)
    inv = res.data
  } catch {
    notFound()
  }

  const theme    = getTheme(inv.theme_slug || 'gold')
  const guestName = searchParams.to ? decodeURIComponent(searchParams.to) : undefined

  return (
    <EnvelopeOpenerWrapper
      invitation={inv}
      theme={theme}
      guestName={guestName}
    />
  )
}
