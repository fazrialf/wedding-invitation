'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import Link from 'next/link'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

type Theme = 'light' | 'dark'

interface Invitation {
  id: string
  slug: string
  bride_name: string
  groom_name: string
  wedding_date: string
  is_published: boolean
  theme_slug: string
  rsvp_count?: number
  wishes_count?: number
}

// Inline icons
const Icons = {
  undangan: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  rsvp: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  wishes: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  published: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  edit: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  eye: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
}

const themeTokens = {
  light: {
    page:        'bg-[#FAF7F2]',
    main:        'bg-[#FAF7F2]',
    card:        'bg-white border border-[#E8DCC8]',
    cardHover:   'hover:shadow-md hover:border-[#C8A96E]',
    heading:     'text-[#2C1A0E]',
    subtext:     'text-[#6B3F2A]',
    muted:       'text-[#6B3F2A]/60',
    statNum:     'text-[#2C1A0E]',
    iconBg:      'bg-[#E8DCC8]',
    iconColor:   'text-[#6B3F2A]',
    divider:     'border-[#E8DCC8]',
    badge:       { published: 'bg-emerald-100 text-emerald-700', draft: 'bg-amber-100 text-amber-700' },
    btnPrimary:  'bg-[#6B3F2A] hover:bg-[#2C1A0E] text-[#FAF7F2]',
    btnOutline:  'border border-[#C8A96E] text-[#6B3F2A] hover:bg-[#E8DCC8]',
    emptyBg:     'bg-[#E8DCC8]/30 border-2 border-dashed border-[#C8A96E]/40',
  },
  dark: {
    page:        'bg-[#1C0F07]',
    main:        'bg-[#1C0F07]',
    card:        'bg-[#3D2410] border border-[#4A2E18]',
    cardHover:   'hover:shadow-lg hover:border-[#C8A96E]/40',
    heading:     'text-[#E8DCC8]',
    subtext:     'text-[#C8A96E]',
    muted:       'text-[#C8A96E]/50',
    statNum:     'text-[#E8DCC8]',
    iconBg:      'bg-[#6B3F2A]/30',
    iconColor:   'text-[#C8A96E]',
    divider:     'border-[#4A2E18]',
    badge:       { published: 'bg-emerald-900/40 text-emerald-400', draft: 'bg-amber-900/40 text-amber-400' },
    btnPrimary:  'bg-[#C8A96E] hover:bg-[#E8DCC8] text-[#2C1A0E]',
    btnOutline:  'border border-[#C8A96E]/50 text-[#C8A96E] hover:bg-[#6B3F2A]/20',
    emptyBg:     'bg-[#3D2410]/50 border-2 border-dashed border-[#C8A96E]/20',
  },
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [fetching, setFetching] = useState(true)
  const [theme, setTheme] = useState<Theme>('light')

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  // Theme sync
  useEffect(() => {
    const stored = localStorage.getItem('pelaminan-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') setTheme(stored)
    const handler = () => {
      const updated = localStorage.getItem('pelaminan-theme') as Theme | null
      if (updated === 'light' || updated === 'dark') setTheme(updated)
    }
    window.addEventListener('pelaminan-theme-change', handler)
    return () => window.removeEventListener('pelaminan-theme-change', handler)
  }, [])

  // Fetch invitations
  useEffect(() => {
    if (!user) return
    axios.get('/api/invitations')
      .then(r => setInvitations(r.data))
      .catch(() => toast.error('Gagal memuat undangan'))
      .finally(() => setFetching(false))
  }, [user])

  if (loading || !user) return null

  const t = themeTokens[theme]
  const firstName = user.name.split(' ')[0]
  const published = invitations.filter(i => i.is_published)
  const totalRsvp = invitations.reduce((sum, i) => sum + (i.rsvp_count || 0), 0)
  const totalWishes = invitations.reduce((sum, i) => sum + (i.wishes_count || 0), 0)
  const recent = [...invitations].slice(0, 3)

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const statCards = [
    { label: 'Total Undangan', value: invitations.length, icon: Icons.undangan },
    { label: 'Total RSVP',     value: totalRsvp,          icon: Icons.rsvp },
    { label: 'Total Ucapan',   value: totalWishes,        icon: Icons.wishes },
    { label: 'Dipublikasi',    value: published.length,   icon: Icons.published },
  ]

  return (
    <div className={`flex min-h-screen ${t.page} transition-colors duration-300`}>
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className={`flex-1 p-6 lg:p-10 ${t.main} min-w-0`}>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className={`font-playfair text-2xl lg:text-3xl font-semibold ${t.heading}`}>
              Selamat datang, {firstName} 👋
            </h1>
            <p className={`font-cinzel text-xs tracking-widest mt-1.5 ${t.muted}`}>
              {today}
            </p>
          </div>
          <Link
            href="/dashboard/invitations/new"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 flex-shrink-0 ${t.btnPrimary}`}
          >
            {Icons.plus}
            <span className="hidden sm:inline">Buat Undangan</span>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((s, i) => (
            <div
              key={i}
              className={`rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 ${t.card} ${t.cardHover}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.iconBg} ${t.iconColor}`}>
                {s.icon}
              </div>
              <div>
                <p className={`font-playfair text-2xl font-semibold ${t.statNum}`}>
                  {fetching ? '—' : s.value}
                </p>
                <p className={`font-lato text-xs mt-0.5 ${t.muted}`}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Undangan Terbaru */}
        <div>
          <div className={`flex items-center justify-between mb-5 pb-3 border-b ${t.divider}`}>
            <h2 className={`font-playfair text-lg font-semibold ${t.heading}`}>
              Undangan Terbaru
            </h2>
            <Link
              href="/dashboard/invitations"
              className={`font-cinzel text-xs tracking-wider uppercase transition-opacity hover:opacity-80 ${t.subtext}`}
            >
              Lihat Semua →
            </Link>
          </div>

          {fetching ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-24 rounded-xl animate-pulse ${t.card}`} />
              ))}
            </div>
          ) : invitations.length === 0 ? (
            /* Empty state */
            <div className={`rounded-xl p-12 flex flex-col items-center text-center ${t.emptyBg}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${t.iconBg} ${t.iconColor}`}>
                {Icons.undangan}
              </div>
              <h3 className={`font-playfair text-lg font-semibold mb-2 ${t.heading}`}>
                Belum ada undangan
              </h3>
              <p className={`font-lato text-sm mb-6 max-w-xs ${t.muted}`}>
                Buat undangan digital pertama Anda dan bagikan momen spesial bersama orang tersayang.
              </p>
              <Link
                href="/dashboard/invitations/new"
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 ${t.btnPrimary}`}
              >
                {Icons.plus}
                Buat Undangan Pertama
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map(inv => (
                <div
                  key={inv.id}
                  className={`rounded-xl p-5 flex items-center gap-4 transition-all duration-200 ${t.card} ${t.cardHover}`}
                >
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-greatVibes text-lg"
                    style={{ background: '#6B3F2A', color: '#E8DCC8' }}
                  >
                    {inv.bride_name?.[0] || '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-playfair text-base font-medium truncate ${t.heading}`}>
                      {inv.bride_name} & {inv.groom_name}
                    </p>
                    <div className={`flex items-center gap-1.5 mt-1 font-lato text-xs ${t.muted}`}>
                      {Icons.calendar}
                      <span>
                        {new Date(inv.wedding_date).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`px-2.5 py-1 rounded-full font-cinzel text-[10px] tracking-wider flex-shrink-0 ${
                    inv.is_published ? t.badge.published : t.badge.draft
                  }`}>
                    {inv.is_published ? 'Aktif' : 'Draft'}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/dashboard/invitations/${inv.id}/edit`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ${t.btnOutline}`}
                    >
                      {Icons.edit} Edit
                    </Link>
                    <Link
                      href={`/${inv.slug}`}
                      target="_blank"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ${t.btnPrimary}`}
                    >
                      {Icons.eye} Lihat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
