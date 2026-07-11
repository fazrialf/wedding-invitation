'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import Link from 'next/link'
import axios from 'axios'

type Theme = 'light' | 'dark'

interface Invitation {
  id: string
  slug: string
  bride_name: string
  groom_name: string
  wedding_date: string
  is_published: boolean
  theme_slug: string
}

interface ActivityItem {
  type: 'rsvp' | 'wish'
  guest_name: string
  message?: string
  attendance?: string
  created_at: string
  invitation_name: string
  invitation_id: string
}

const PLAN_LIMITS: Record<string, { invitations: number; label: string; color: string; next: string }> = {
  free:     { invitations: 1,  label: 'Gratis',   color: '#6B3F2A', next: 'Pro' },
  pro:      { invitations: 10, label: 'Pro',       color: '#C8A96E', next: 'Business' },
  business: { invitations: 50, label: 'Business',  color: '#8B1A1A', next: '' },
}

const TIPS = [
  { text: 'Buat undangan pertama Anda',  link: '/dashboard/invitations/new', checkFn: (invs: Invitation[]) => invs.length > 0 },
  { text: 'Unggah foto pengantin',        link: '',                            checkFn: () => false },
  { text: 'Pilih template dan warna',     link: '',                            checkFn: () => false },
  { text: 'Publikasikan undangan',        link: '',                            checkFn: (invs: Invitation[]) => invs.some(i => i.is_published) },
  { text: 'Bagikan link ke tamu',         link: '',                            checkFn: () => false },
]

function daysUntil(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d.getTime() - now.getTime()) / 86400000)
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  if (h < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

const tk = {
  light: {
    page:         'bg-[#FAF7F2]',
    card:         'bg-white border border-[#E8DCC8]',
    heading:      'text-[#2C1A0E]',
    sub:          'text-[#6B3F2A]',
    muted:        'text-[#6B3F2A]/60',
    divider:      'border-[#E8DCC8]',
    divideBg:     'divide-[#E8DCC8]',
    btnPrimary:   'bg-[#6B3F2A] hover:bg-[#2C1A0E] text-[#FAF7F2]',
    btnOutline:   'border border-[#C8A96E] text-[#6B3F2A] hover:bg-[#E8DCC8]',
    heroBg:       'bg-gradient-to-r from-[#6B3F2A] to-[#2C1A0E]',
    actRsvp:      'bg-emerald-100 text-emerald-700',
    actWish:      'bg-[#E8DCC8] text-[#6B3F2A]',
    progress:     'bg-[#E8DCC8]',
    progressFill: 'bg-[#C8A96E]',
    countdownBg:  'bg-gradient-to-br from-[#6B3F2A] to-[#2C1A0E]',
    tipDone:      'text-emerald-600',
    rowHover:     'hover:bg-[#FAF7F2]',
  },
  dark: {
    page:         'bg-[#1C0F07]',
    card:         'bg-[#3D2410] border border-[#4A2E18]',
    heading:      'text-[#E8DCC8]',
    sub:          'text-[#C8A96E]',
    muted:        'text-[#C8A96E]/50',
    divider:      'border-[#4A2E18]',
    divideBg:     'divide-[#4A2E18]',
    btnPrimary:   'bg-[#C8A96E] hover:bg-[#E8DCC8] text-[#2C1A0E]',
    btnOutline:   'border border-[#C8A96E]/50 text-[#C8A96E] hover:bg-[#6B3F2A]/20',
    heroBg:       'bg-gradient-to-r from-[#3D2410] to-[#1C0F07]',
    actRsvp:      'bg-emerald-900/40 text-emerald-400',
    actWish:      'bg-[#6B3F2A]/30 text-[#C8A96E]',
    progress:     'bg-[#4A2E18]',
    progressFill: 'bg-[#C8A96E]',
    countdownBg:  'bg-gradient-to-br from-[#3D2410] to-[#2C1A0E]',
    tipDone:      'text-emerald-400',
    rowHover:     'hover:bg-[#3D2410]/60',
  },
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [totalRsvp, setTotalRsvp] = useState(0)
  const [totalWishes, setTotalWishes] = useState(0)
  const [fetching, setFetching] = useState(true)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => { if (!loading && !user) router.push('/login') }, [user, loading, router])

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

  useEffect(() => {
    if (!user) return
    axios.get('/api/invitations')
      .then(async r => {
        const invs: Invitation[] = r.data
        setInvitations(invs)

        const feeds: ActivityItem[] = []
        let rsvpCount = 0
        let wishCount = 0

        await Promise.allSettled(invs.slice(0, 5).map(async inv => {
          const name = `${inv.bride_name} & ${inv.groom_name}`
          const [rv, wv] = await Promise.allSettled([
            axios.get(`/api/rsvp/${inv.id}`),
            axios.get(`/api/wishes/all/${inv.id}`),
          ])
          if (rv.status === 'fulfilled') {
            rsvpCount += rv.value.data.length
            rv.value.data.slice(0, 3).forEach((r: any) => feeds.push({
              type: 'rsvp',
              guest_name: r.guest_name,
              attendance: r.attendance,
              message: r.message,
              created_at: r.created_at,
              invitation_name: name,
              invitation_id: inv.id,
            }))
          }
          if (wv.status === 'fulfilled') {
            wishCount += wv.value.data.length
            wv.value.data.slice(0, 3).forEach((w: any) => feeds.push({
              type: 'wish',
              guest_name: w.guest_name,
              message: w.message,
              created_at: w.created_at,
              invitation_name: name,
              invitation_id: inv.id,
            }))
          }
        }))

        setTotalRsvp(rsvpCount)
        setTotalWishes(wishCount)
        feeds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setActivity(feeds.slice(0, 12))
      })
      .finally(() => setFetching(false))
  }, [user])

  if (loading || !user) return null

  const theme_tokens = tk[theme]
  const planKey = (user as any).plan || 'free'
  const plan = PLAN_LIMITS[planKey] || PLAN_LIMITS.free
  const totalPublished = invitations.filter(i => i.is_published).length
  const upcoming = invitations
    .filter(i => daysUntil(i.wedding_date) >= 0)
    .sort((a, b) => daysUntil(a.wedding_date) - daysUntil(b.wedding_date))
    .slice(0, 3)

  const tips = TIPS.map(tip => ({ ...tip, done: tip.checkFn(invitations) }))
  const tipsCompleted = tips.filter(t => t.done).length
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const usagePct = Math.min(100, (invitations.length / plan.invitations) * 100)

  return (
    <div className={`flex min-h-screen ${theme_tokens.page} transition-colors duration-300`}>
      <DashboardSidebar />

      <main className="flex-1 min-w-0 overflow-auto">

        {/* ── Hero welcome bar ── */}
        <div className={`${theme_tokens.heroBg} px-6 lg:px-10 py-8`}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-cinzel text-xs tracking-[0.25em] uppercase text-[#C8A96E] mb-1">{today}</p>
              <h1 className="font-cormorant text-2xl lg:text-3xl italic font-semibold text-[#FAF7F2]">
                {getGreeting()}, {(user as any).name?.split(' ')[0] || 'Pengguna'} 👋
              </h1>
              <p className="font-lato text-sm text-[#E8DCC8]/70 mt-1">
                Pantau semua aktivitas undangan digital Anda dari sini.
              </p>
            </div>
            <Link
              href="/dashboard/invitations/new"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-cinzel text-xs tracking-wider uppercase bg-[#C8A96E] hover:bg-[#E8DCC8] text-[#2C1A0E] transition-all duration-200 flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Buat Undangan
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-10 space-y-8">

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Undangan',  value: invitations.length, icon: '✉️', color: '#6B3F2A', link: '/dashboard/invitations' },
              { label: 'Dipublikasikan',  value: totalPublished,      icon: '🌐', color: '#15803d', link: '/dashboard/invitations' },
              { label: 'Total RSVP',      value: totalRsvp,           icon: '👥', color: '#C8A96E', link: '' },
              { label: 'Ucapan Masuk',    value: totalWishes,         icon: '💬', color: '#8B1A1A', link: '' },
            ].map((s, i) => (
              <div key={i} className={`rounded-xl p-5 ${theme_tokens.card}`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  {s.link && (
                    <Link href={s.link} className={`font-cinzel text-[10px] tracking-wider uppercase ${theme_tokens.muted} hover:opacity-100 transition-opacity`}>
                      Lihat →
                    </Link>
                  )}
                </div>
                <p className="font-playfair text-3xl font-semibold" style={{ color: s.color }}>
                  {fetching ? '—' : s.value}
                </p>
                <p className={`font-lato text-xs mt-1 ${theme_tokens.muted}`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Main 2-col grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Activity feed — 2/3 */}
            <div className={`lg:col-span-2 rounded-xl overflow-hidden ${theme_tokens.card}`}>
              <div className={`px-5 py-4 border-b ${theme_tokens.divider} flex items-center justify-between`}>
                <h2 className={`font-playfair text-base font-semibold ${theme_tokens.heading}`}>Aktivitas Terbaru</h2>
                <span className={`font-cinzel text-[10px] tracking-wider uppercase ${theme_tokens.muted}`}>Semua undangan</span>
              </div>

              {fetching ? (
                <div className="p-10 text-center">
                  <p className={`font-lato text-sm ${theme_tokens.muted}`}>Memuat aktivitas...</p>
                </div>
              ) : activity.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-3xl mb-3">🌸</p>
                  <p className={`font-playfair text-base font-semibold mb-1 ${theme_tokens.heading}`}>Belum ada aktivitas</p>
                  <p className={`font-lato text-xs ${theme_tokens.muted}`}>RSVP dan ucapan tamu akan muncul di sini setelah undangan dibagikan.</p>
                </div>
              ) : (
                <div className={`divide-y ${theme_tokens.divideBg}`}>
                  {activity.map((a, i) => (
                    <div key={i} className={`px-5 py-3.5 flex items-start gap-3 transition-colors ${theme_tokens.rowHover}`}>
                      <span className={`mt-0.5 px-2 py-0.5 rounded-full font-cinzel text-[10px] tracking-wider flex-shrink-0 ${
                        a.type === 'rsvp' ? theme_tokens.actRsvp : theme_tokens.actWish
                      }`}>
                        {a.type === 'rsvp' ? 'RSVP' : 'Ucapan'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-lato text-sm font-medium ${theme_tokens.heading}`}>
                          {a.guest_name}
                          {a.type === 'rsvp' && (
                            <span className={`ml-2 font-normal text-xs ${a.attendance === 'hadir' ? 'text-emerald-500' : 'text-red-400'}`}>
                              — {a.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                            </span>
                          )}
                        </p>
                        {a.message && (
                          <p className={`font-lato text-xs truncate mt-0.5 ${theme_tokens.muted}`}>"{a.message}"</p>
                        )}
                        <p className={`font-lato text-xs mt-0.5 ${theme_tokens.muted}`}>
                          {a.invitation_name} · {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/invitations/${a.invitation_id}/${a.type === 'rsvp' ? 'rsvp' : 'wishes'}`}
                        className={`flex-shrink-0 font-cinzel text-[10px] tracking-wider uppercase ${theme_tokens.muted} hover:opacity-100 transition-opacity`}
                      >
                        Detail →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column — 1/3 */}
            <div className="space-y-5">

              {/* Plan info */}
              <div className={`rounded-xl p-5 ${theme_tokens.card}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`font-playfair text-base font-semibold ${theme_tokens.heading}`}>Paket Saya</h2>
                  <span
                    className="px-2.5 py-1 rounded-full font-cinzel text-[10px] tracking-wider"
                    style={{ background: plan.color + '22', color: plan.color }}
                  >
                    {plan.label}
                  </span>
                </div>

                <div className="mb-1.5 flex justify-between">
                  <p className={`font-lato text-xs ${theme_tokens.muted}`}>Undangan digunakan</p>
                  <p className={`font-lato text-xs font-medium ${theme_tokens.sub}`}>{invitations.length} / {plan.invitations}</p>
                </div>
                <div className={`h-2 rounded-full mb-4 ${theme_tokens.progress}`}>
                  <div className={`h-2 rounded-full transition-all duration-700 ${theme_tokens.progressFill}`} style={{ width: `${usagePct}%` }} />
                </div>

                <div className={`space-y-1.5 font-lato text-xs mb-5 ${theme_tokens.muted}`}>
                  <p>✓ {plan.invitations} undangan maksimal</p>
                  <p>✓ Template tidak terbatas</p>
                  <p>✓ RSVP dan ucapan tidak terbatas</p>
                  {planKey === 'free' && <p className="text-amber-500">✗ Custom domain</p>}
                  {planKey === 'free' && <p className="text-amber-500">✗ Musik latar</p>}
                  {planKey === 'free' && <p className="text-amber-500">✗ Analitik lanjutan</p>}
                </div>

                {plan.next && (
                  <button className={`w-full py-2.5 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 ${theme_tokens.btnPrimary}`}>
                    Upgrade ke {plan.next} ✦
                  </button>
                )}
              </div>

              {/* Getting started */}
              <div className={`rounded-xl p-5 ${theme_tokens.card}`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className={`font-playfair text-base font-semibold ${theme_tokens.heading}`}>Mulai dari Sini</h2>
                  <span className={`font-cinzel text-[10px] tracking-wider uppercase ${theme_tokens.muted}`}>{tipsCompleted}/{tips.length}</span>
                </div>
                <div className={`h-1.5 rounded-full mb-4 ${theme_tokens.progress}`}>
                  <div className={`h-1.5 rounded-full transition-all duration-700 ${theme_tokens.progressFill}`} style={{ width: `${(tipsCompleted / tips.length) * 100}%` }} />
                </div>
                <div className="space-y-2.5">
                  {tips.map((tip, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-colors ${
                        tip.done ? 'bg-emerald-500 border-emerald-500' : theme_tokens.divider
                      }`}>
                        {tip.done && (
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="2 6 5 9 10 3"/>
                          </svg>
                        )}
                      </div>
                      {tip.link ? (
                        <Link href={tip.link} className={`font-lato text-xs transition-colors ${tip.done ? theme_tokens.tipDone + ' line-through opacity-60' : theme_tokens.sub} hover:opacity-80`}>
                          {tip.text}
                        </Link>
                      ) : (
                        <p className={`font-lato text-xs ${tip.done ? theme_tokens.tipDone + ' line-through opacity-60' : theme_tokens.muted}`}>{tip.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Upcoming countdowns ── */}
          {upcoming.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`font-playfair text-lg font-semibold ${theme_tokens.heading}`}>Hari Pernikahan Mendekat</h2>
                <Link href="/dashboard/invitations" className={`font-cinzel text-xs tracking-wider uppercase ${theme_tokens.muted} hover:opacity-100 transition-opacity`}>
                  Semua →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map(inv => {
                  const days = daysUntil(inv.wedding_date)
                  return (
                    <div key={inv.id} className={`rounded-xl p-5 relative overflow-hidden ${theme_tokens.countdownBg}`}>
                      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full border border-[#C8A96E]/20 pointer-events-none" />
                      <div className="absolute -right-2 -top-2 w-12 h-12 rounded-full border border-[#C8A96E]/10 pointer-events-none" />
                      <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#C8A96E]/70 mb-2">
                        {inv.is_published ? '🌐 Aktif' : '📝 Draft'}
                      </p>
                      <h3 className="font-cormorant text-lg italic font-semibold text-[#FAF7F2] leading-tight">{inv.bride_name}</h3>
                      <p className="font-cormorant text-sm text-[#C8A96E] italic mb-3">& {inv.groom_name}</p>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-playfair text-4xl font-bold text-[#FAF7F2]">{days === 0 ? '🎉' : days}</p>
                          <p className="font-lato text-xs text-[#E8DCC8]/60">{days === 0 ? 'Hari ini!' : 'hari lagi'}</p>
                        </div>
                        <Link
                          href={`/dashboard/invitations/${inv.id}/rsvp`}
                          className="font-cinzel text-[10px] tracking-wider uppercase px-3 py-2 rounded-lg bg-[#C8A96E]/20 hover:bg-[#C8A96E]/30 text-[#C8A96E] transition-all"
                        >
                          RSVP →
                        </Link>
                      </div>
                      <p className="font-lato text-xs mt-2 text-[#E8DCC8]/50">
                        {new Date(inv.wedding_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Empty state ── */}
          {!fetching && invitations.length === 0 && (
            <div className={`rounded-xl p-12 text-center border-2 border-dashed ${theme_tokens.divider}`}>
              <p className="text-4xl mb-4">💌</p>
              <h3 className={`font-playfair text-xl font-semibold mb-2 ${theme_tokens.heading}`}>Mulai perjalanan Anda</h3>
              <p className={`font-lato text-sm mb-6 max-w-sm mx-auto ${theme_tokens.muted}`}>
                Buat undangan digital pertama dan bagikan momen spesial Anda kepada orang-orang tercinta.
              </p>
              <Link
                href="/dashboard/invitations/new"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-cinzel text-xs tracking-wider uppercase transition-all ${theme_tokens.btnPrimary}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Buat Undangan Sekarang
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
