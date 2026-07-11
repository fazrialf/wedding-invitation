'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import Link from 'next/link'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  IconMail, IconMailCheck, IconUsers, IconHeartHandshake,
  IconPlus, IconCalendar, IconTrophy, IconChecklist,
  IconArrowRight, IconCircleCheck,
} from '@tabler/icons-react'

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

function useCountUp(target: number, duration = 700) {
  const [count, setCount] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    if (target === 0) { setCount(0); return }
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) raf.current = requestAnimationFrame(animate)
      else setCount(target)
    }
    raf.current = requestAnimationFrame(animate)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])
  return count
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
    progressFill: 'bg-[#6B3F2A]',
    countdownBg:  'bg-gradient-to-br from-[#6B3F2A] to-[#2C1A0E]',
    tipDone:      'text-emerald-600',
    rowHover:     'hover:bg-[#FAF7F2]',
    chartColor:   '#C8A96E',
    chartBg:      '#FAF7F2',
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
    chartColor:   '#C8A96E',
    chartBg:      '#3D2410',
  },
}

// Animation variants
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }

// Build last-7-days RSVP chart data from activity feed
function buildChartData(activity: ActivityItem[]) {
  const days: { date: string; label: string; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    const key = d.toISOString().slice(0, 10)
    days.push({
      date: key,
      label: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      count: 0,
    })
  }
  activity.filter(a => a.type === 'rsvp').forEach(a => {
    const key = new Date(a.created_at).toISOString().slice(0, 10)
    const slot = days.find(d => d.date === key)
    if (slot) slot.count++
  })
  return days
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

        feeds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setActivity(feeds.slice(0, 10))
        setTotalRsvp(rsvpCount)
        setTotalWishes(wishCount)
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [user])

  if (loading || !user) return null

  const t = tk[theme]
  const plan = (user as any).plan || 'free'
  const planInfo = PLAN_LIMITS[plan] || PLAN_LIMITS.free
  const published = invitations.filter(i => i.is_published)
  const upcoming = invitations
    .filter(i => i.wedding_date && daysUntil(i.wedding_date) >= 0)
    .sort((a, b) => new Date(a.wedding_date).getTime() - new Date(b.wedding_date).getTime())
    .slice(0, 3)
  const tipsChecked = TIPS.filter(tip => tip.checkFn(invitations)).length
  const chartData = buildChartData(activity)

  // count-up values (hooks at top level via array — use individual hooks)
  const countInv     = useCountUp(fetching ? 0 : invitations.length)
  const countPub     = useCountUp(fetching ? 0 : published.length)
  const countRsvp    = useCountUp(fetching ? 0 : totalRsvp)
  const countWishes  = useCountUp(fetching ? 0 : totalWishes)

  const stats = [
    { label: 'Total Undangan', value: countInv,    color: '#6B3F2A', icon: <IconMail size={16} /> },
    { label: 'Dipublikasikan', value: countPub,    color: '#C8A96E', icon: <IconMailCheck size={16} /> },
    { label: 'Total RSVP',     value: countRsvp,   color: '#15803d', icon: <IconUsers size={16} /> },
    { label: 'Ucapan Masuk',   value: countWishes, color: '#8B1A1A', icon: <IconHeartHandshake size={16} /> },
  ]

  return (
    <div className={`flex min-h-screen ${t.page} transition-colors duration-300`}>
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-10 min-w-0">

        {/* ── Hero bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-2xl px-7 py-6 mb-8 text-white ${t.heroBg}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-cinzel text-xs tracking-widest uppercase opacity-70 mb-1">
                {getGreeting()},
              </p>
              <h1 className="font-playfair text-2xl lg:text-3xl font-semibold">
                {(user as any).name || (user as any).email?.split('@')[0] || 'Pengguna'} 👋
              </h1>
              <p className="font-lato text-sm opacity-70 mt-1">
                Kelola undangan digital Anda dari satu tempat.
              </p>
            </div>
            <Link
              href="/dashboard/invitations/new"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 font-cinzel text-xs tracking-wider uppercase transition-all duration-200 whitespace-nowrap"
            >
              <IconPlus size={14} />
              Buat Undangan
            </Link>
          </div>
        </motion.div>

        {/* ── Stat cards ── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} className={`rounded-xl p-5 ${t.card}`}>
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3`}
                style={{ background: s.color + '20', color: s.color }}>
                {s.icon}
              </div>
              <p className="font-playfair text-2xl font-semibold" style={{ color: s.color }}>
                {fetching ? '—' : s.value}
              </p>
              <p className={`font-lato text-xs mt-1 ${t.muted}`}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Two-column: Chart + Activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

          {/* RSVP Bar Chart — 3/5 */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className={`lg:col-span-3 rounded-xl p-6 ${t.card}`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className={`font-playfair text-base font-semibold ${t.heading}`}>RSVP 7 Hari Terakhir</h2>
                <p className={`font-lato text-xs mt-0.5 ${t.muted}`}>Respons yang masuk per hari</p>
              </div>
              <IconUsers size={18} style={{ color: '#C8A96E' }} />
            </div>
            {fetching ? (
              <div className="h-40 flex items-center justify-center">
                <p className={`font-lato text-sm ${t.muted}`}>Memuat...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <XAxis
                    dataKey="label"
                    tick={{ fontFamily: 'Lato', fontSize: 11, fill: theme === 'light' ? '#6B3F2A99' : '#C8A96E80' }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontFamily: 'Lato', fontSize: 10, fill: theme === 'light' ? '#6B3F2A99' : '#C8A96E80' }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: t.chartBg,
                      border: `1px solid ${theme === 'light' ? '#E8DCC8' : '#4A2E18'}`,
                      borderRadius: 8,
                      fontFamily: 'Lato',
                      fontSize: 12,
                      color: theme === 'light' ? '#2C1A0E' : '#E8DCC8',
                    }}
                    labelFormatter={(l) => `Hari: ${l}`}
                    formatter={(v: any) => [`${v} RSVP`, '']}
                    cursor={{ fill: theme === 'light' ? '#E8DCC820' : '#C8A96E10' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.count > 0 ? '#C8A96E' : (theme === 'light' ? '#E8DCC8' : '#4A2E18')}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Activity Feed — 2/5 */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className={`lg:col-span-2 rounded-xl overflow-hidden ${t.card}`}
          >
            <div className={`px-5 py-4 border-b ${t.divider} flex items-center justify-between`}>
              <h2 className={`font-playfair text-base font-semibold ${t.heading}`}>Aktivitas Terbaru</h2>
            </div>
            {fetching ? (
              <div className="p-6 text-center">
                <p className={`font-lato text-sm ${t.muted}`}>Memuat...</p>
              </div>
            ) : activity.length === 0 ? (
              <div className="p-8 text-center">
                <p className={`font-lato text-sm ${t.muted}`}>Belum ada aktivitas.</p>
              </div>
            ) : (
              <div className={`divide-y ${t.divideBg} max-h-[220px] overflow-y-auto`}>
                {activity.map((a, i) => (
                  <div key={i} className={`px-5 py-3 flex items-start gap-3 ${t.rowHover} transition-colors`}>
                    <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-cinzel tracking-wider uppercase shrink-0 ${a.type === 'rsvp' ? t.actRsvp : t.actWish}`}>
                      {a.type === 'rsvp' ? 'RSVP' : 'Ucapan'}
                    </span>
                    <div className="min-w-0">
                      <p className={`font-lato text-xs font-semibold truncate ${t.heading}`}>{a.guest_name}</p>
                      <p className={`font-lato text-[10px] truncate ${t.muted}`}>{a.invitation_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Bottom row: Plan info + Checklist + Countdowns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Plan info */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className={`rounded-xl p-6 ${t.card}`}>
            <div className="flex items-center gap-2 mb-4">
              <IconTrophy size={16} style={{ color: planInfo.color }} />
              <h2 className={`font-playfair text-base font-semibold ${t.heading}`}>Paket {planInfo.label}</h2>
            </div>
            <div className="mb-3">
              <div className="flex justify-between mb-1.5">
                <span className={`font-lato text-xs ${t.muted}`}>Undangan digunakan</span>
                <span className={`font-lato text-xs font-semibold ${t.sub}`}>
                  {invitations.length} / {planInfo.invitations}
                </span>
              </div>
              <div className={`h-1.5 rounded-full ${t.progress}`}>
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${t.progressFill}`}
                  style={{ width: `${Math.min((invitations.length / planInfo.invitations) * 100, 100)}%` }}
                />
              </div>
            </div>
            {planInfo.next && (
              <Link
                href="#"
                className={`mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 ${t.btnPrimary}`}
              >
                Upgrade ke {planInfo.next}
                <IconArrowRight size={13} />
              </Link>
            )}
          </motion.div>

          {/* Getting started checklist */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className={`rounded-xl p-6 ${t.card}`}>
            <div className="flex items-center gap-2 mb-4">
              <IconChecklist size={16} style={{ color: '#C8A96E' }} />
              <h2 className={`font-playfair text-base font-semibold ${t.heading}`}>
                Mulai ({tipsChecked}/{TIPS.length})
              </h2>
            </div>
            <div className="space-y-2.5">
              {TIPS.map((tip, i) => {
                const done = tip.checkFn(invitations)
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <IconCircleCheck
                      size={15}
                      style={{ color: done ? '#15803d' : (theme === 'light' ? '#C8A96E60' : '#C8A96E40'), flexShrink: 0 }}
                    />
                    {tip.link && !done ? (
                      <Link href={tip.link} className={`font-lato text-xs hover:underline ${done ? t.tipDone : t.sub}`}>
                        {tip.text}
                      </Link>
                    ) : (
                      <span className={`font-lato text-xs ${done ? t.tipDone : t.muted} ${done ? 'line-through' : ''}`}>
                        {tip.text}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Upcoming weddings */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className={`rounded-xl p-6 ${t.card}`}>
            <div className="flex items-center gap-2 mb-4">
              <IconCalendar size={16} style={{ color: '#C8A96E' }} />
              <h2 className={`font-playfair text-base font-semibold ${t.heading}`}>Hari Pernikahan</h2>
            </div>
            {upcoming.length === 0 ? (
              <p className={`font-lato text-sm ${t.muted}`}>Belum ada undangan dengan tanggal mendatang.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(inv => {
                  const days = daysUntil(inv.wedding_date)
                  return (
                    <div key={inv.id} className={`rounded-lg px-4 py-3 ${t.countdownBg} text-white`}>
                      <p className="font-cinzel text-[10px] tracking-wider uppercase opacity-70 mb-0.5">
                        {days === 0 ? 'Hari ini! 🎉' : `${days} hari lagi`}
                      </p>
                      <p className="font-playfair text-sm font-semibold truncate">
                        {inv.bride_name} & {inv.groom_name}
                      </p>
                      <p className="font-lato text-[10px] opacity-60 mt-0.5">
                        {new Date(inv.wedding_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Empty state: no invitations yet ── */}
        {!fetching && invitations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`mt-8 rounded-2xl p-12 text-center border-2 border-dashed ${t.divider}`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ background: '#C8A96E20', color: '#C8A96E' }}>
              <IconMail size={28} />
            </div>
            <h2 className={`font-playfair text-xl font-semibold mb-2 ${t.heading}`}>
              Belum ada undangan
            </h2>
            <p className={`font-lato text-sm mb-6 max-w-sm mx-auto ${t.muted}`}>
              Buat undangan digital pertama dan bagikan momen spesial Anda kepada orang-orang tercinta.
            </p>
            <Link
              href="/dashboard/invitations/new"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-cinzel text-xs tracking-wider uppercase transition-all ${t.btnPrimary}`}
            >
              <IconPlus size={14} />
              Buat Undangan Sekarang
            </Link>
          </motion.div>
        )}

      </main>
    </div>
  )
}
