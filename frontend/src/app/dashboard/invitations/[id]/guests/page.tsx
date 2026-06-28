'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

interface GuestToken {
  name:        string
  url:         string
  whatsappUrl: string
}

export default function GuestTokensPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [inv, setInv] = useState<any>(null)
  const [guestInput, setGuestInput] = useState('')
  const [tokens, setTokens] = useState<GuestToken[]>([])

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user || !id) return
    axios.get(`/api/invitations/by-id/${id}`)
      .then(r => setInv(r.data))
      .catch(() => toast.error('Failed to load invitation'))
  }, [user, id])

  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${inv?.slug}`
    : ''

  const generateTokens = () => {
    const names = guestInput
      .split('\n')
      .map(n => n.trim())
      .filter(Boolean)

    if (!names.length) return toast.error('Enter at least one guest name')

    const generated: GuestToken[] = names.map(name => {
      const url = `${baseUrl}?to=${encodeURIComponent(name)}`
      const msg = `Yth. ${name},\n\nKami mengundang Anda untuk menghadiri pernikahan kami 💍\n\nBuka undangan digital Anda di sini:\n${url}`
      return {
        name,
        url,
        whatsappUrl: `https://wa.me/?text=${encodeURIComponent(msg)}`,
      }
    })
    setTokens(generated)
  }

  const copyAll = () => {
    const text = tokens.map(t => `${t.name}: ${t.url}`).join('\n')
    navigator.clipboard.writeText(text)
    toast.success('All links copied!')
  }

  if (loading || !user) return null

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className="flex-1 p-10">
        <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-1">DASHBOARD / INVITATIONS</p>
        <h1 className="font-playfair text-3xl mb-2">Guest Personalization</h1>
        <p className="font-lato text-sm text-stone-500 mb-8">
          Generate personalized invitation links for each guest. Each link shows their name on the opening screen.
        </p>

        {/* Input */}
        <div className="bg-white border border-stone-100 shadow-sm p-6 mb-6 max-w-2xl">
          <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">
            GUEST NAMES (one per line)
          </label>
          <textarea
            rows={8}
            value={guestInput}
            onChange={e => setGuestInput(e.target.value)}
            className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-400 resize-none"
            placeholder={"Pak Ahmad & Bu Siti\nKeluarga Besar Santoso\nDr. Budi Cahyono"}
          />
          <div className="flex gap-3 mt-4">
            <button onClick={generateTokens}
              className="bg-stone-900 hover:bg-stone-700 text-white font-cinzel text-xs tracking-widest px-6 py-3 transition-colors">
              GENERATE LINKS
            </button>
            {tokens.length > 0 && (
              <button onClick={copyAll}
                className="border border-stone-300 text-stone-600 font-cinzel text-xs tracking-widest px-6 py-3 hover:bg-stone-100 transition-colors">
                COPY ALL
              </button>
            )}
          </div>
        </div>

        {/* Generated tokens */}
        {tokens.length > 0 && (
          <div className="bg-white border border-stone-100 shadow-sm max-w-2xl">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-playfair text-xl">{tokens.length} Guest Links Generated</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {tokens.map((t, i) => (
                <div key={i} className="px-6 py-4">
                  <p className="font-cinzel text-xs tracking-widest text-stone-700 mb-1">{t.name}</p>
                  <p className="font-lato text-xs text-stone-400 truncate mb-3">{t.url}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { navigator.clipboard.writeText(t.url); toast.success('Copied!') }}
                      className="font-cinzel text-xs border border-stone-200 text-stone-500 px-3 py-1.5 hover:bg-stone-50 transition-colors">
                      COPY LINK
                    </button>
                    <a href={t.whatsappUrl} target="_blank"
                      className="font-cinzel text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 transition-colors">
                      SEND VIA WA
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
