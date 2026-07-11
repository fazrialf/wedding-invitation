'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import Link from 'next/link'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconHeartHandshake, IconEye, IconEyeOff, IconTrash,
  IconMessage, IconCircleCheck, IconClock,
} from '@tabler/icons-react'

type Theme = 'light' | 'dark'

interface Wish {
  id: string
  guest_name: string
  message: string
  is_approved: boolean
  created_at: string
}

interface Invitation {
  id: string
  bride_name: string
  groom_name: string
  slug: string
}

const themeTokens = {
  light: {
    page: 'bg-[#FAF7F2]',
    card: 'bg-white border border-[#E8DCC8]',
    wishCard: 'bg-white border border-[#E8DCC8] hover:border-[#C8A96E] hover:shadow-sm',
    heading: 'text-[#2C1A0E]',
    subtext: 'text-[#6B3F2A]',
    muted: 'text-[#6B3F2A]/60',
    divider: 'border-[#E8DCC8]',
    badge: { approved: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700' },
    btnOutline: 'border border-[#C8A96E] text-[#6B3F2A] hover:bg-[#E8DCC8]',
    btnPrimary: 'bg-[#6B3F2A] hover:bg-[#2C1A0E] text-[#FAF7F2]',
    btnDanger: 'border border-red-200 text-red-500 hover:bg-red-50',
    iconBg: 'bg-[#E8DCC8] text-[#6B3F2A]',
    quoteMark: 'text-[#C8A96E]',
  },
  dark: {
    page: 'bg-[#1C0F07]',
    card: 'bg-[#3D2410] border border-[#4A2E18]',
    wishCard: 'bg-[#3D2410] border border-[#4A2E18] hover:border-[#C8A96E]/40',
    heading: 'text-[#E8DCC8]',
    subtext: 'text-[#C8A96E]',
    muted: 'text-[#C8A96E]/50',
    divider: 'border-[#4A2E18]',
    badge: { approved: 'bg-emerald-900/40 text-emerald-400', pending: 'bg-amber-900/40 text-amber-400' },
    btnOutline: 'border border-[#C8A96E]/50 text-[#C8A96E] hover:bg-[#6B3F2A]/20',
    btnPrimary: 'bg-[#C8A96E] hover:bg-[#E8DCC8] text-[#2C1A0E]',
    btnDanger: 'border border-red-900/40 text-red-400 hover:bg-red-900/20',
    iconBg: 'bg-[#6B3F2A]/30 text-[#C8A96E]',
    quoteMark: 'text-[#C8A96E]/40',
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

function useCountUp(target: number, duration = 600) {
  const [count, setCount] = useState(0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) { setCount(0); return }
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) raf.current = requestAnimationFrame(animate)
      else setCount(target)
    }
    raf.current = requestAnimationFrame(animate)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])

  return count
}

export default function WishesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [inv, setInv] = useState<Invitation | null>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
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
    if (!user || !id) return
    Promise.all([
      axios.get(`/api/invitations/by-id/${id}`),
      axios.get(`/api/wishes/all/${id}`),
    ])
      .then(([invRes, wishRes]) => {
        setInv(invRes.data)
        setWishes(wishRes.data)
      })
      .catch(() => toast.error('Gagal memuat ucapan'))
      .finally(() => setFetching(false))
  }, [user, id])

  async function toggleApproval(wish: Wish) {
    try {
      await axios.patch(`/api/wishes/${wish.id}`, { is_approved: !wish.is_approved })
      setWishes(prev => prev.map(w => w.id === wish.id ? { ...w, is_approved: !w.is_approved } : w))
      toast.success(wish.is_approved ? 'Ucapan disembunyikan' : 'Ucapan ditampilkan')
    } catch {
      toast.error('Gagal mengubah status ucapan')
    }
  }

  async function deleteWish(wishId: string) {
    try {
      await axios.delete(`/api/wishes/${wishId}`)
      setWishes(prev => prev.filter(w => w.id !== wishId))
      toast.success('Ucapan dihapus')
    } catch {
      toast.error('Gagal menghapus ucapan')
    }
  }

  if (loading || !user) return null

  const t = themeTokens[theme]
  const approved = wishes.filter(w => w.is_approved)
  const pending  = wishes.filter(w => !w.is_approved)

  const totalCount    = useCountUp(fetching ? 0 : wishes.length)
  const approvedCount = useCountUp(fetching ? 0 : approved.length)
  const pendingCount  = useCountUp(fetching ? 0 : pending.length)

  const stats = [
    { label: 'Total Ucapan', value: totalCount,    color: '#6B3F2A', icon: <IconMessage size={12} /> },
    { label: 'Ditampilkan',  value: approvedCount, color: '#15803d', icon: <IconCircleCheck size={12} /> },
    { label: 'Tersembunyi',  value: pendingCount,  color: '#C8A96E', icon: <IconClock size={12} /> },
  ]

  return (
    <div className={`flex min-h-screen ${t.page} transition-colors duration-300`}>
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-10 min-w-0">

        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 font-cinzel text-xs tracking-wider uppercase mb-6 ${t.muted}`}>
          <Link href="/dashboard/invitations" className="hover:opacity-100 transition-opacity">Undangan</Link>
          <span>/</span>
          <span>{inv ? `${inv.bride_name} & ${inv.groom_name}` : '...'}</span>
          <span>/</span>
          <span style={{ color: '#C8A96E' }}>Ucapan</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className={`font-playfair text-2xl lg:text-3xl font-semibold ${t.heading}`}>
            Ucapan & Doa
          </h1>
          {inv && (
            <p className={`font-lato text-sm mt-1 ${t.muted}`}>
              {inv.bride_name} & {inv.groom_name}
            </p>
          )}
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={cardVariants} className={`rounded-xl p-5 ${t.card}`}>
              <p className="font-playfair text-2xl font-semibold" style={{ color: s.color }}>
                {fetching ? '—' : s.value}
              </p>
              <p className={`font-lato text-xs mt-1 flex items-center gap-1.5 ${t.muted}`}>
                {s.icon}{s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Wishes Grid */}
        {fetching ? (
          <div className="p-8 text-center">
            <p className={`font-lato text-sm ${t.muted}`}>Memuat...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="py-20 text-center">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${t.iconBg}`}>
              <IconHeartHandshake size={22} />
            </div>
            <p className={`font-playfair text-lg font-semibold mb-2 ${t.heading}`}>Belum ada ucapan</p>
            <p className={`font-lato text-sm ${t.muted}`}>Ucapan dari tamu akan muncul di sini.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {wishes.map(w => (
                <motion.div
                  key={w.id}
                  variants={cardVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`rounded-xl p-5 transition-all duration-200 ${t.wishCard}`}
                >
                  {/* Quote mark */}
                  <span className={`font-playfair text-4xl leading-none ${t.quoteMark}`}>&ldquo;</span>

                  {/* Message */}
                  <p className={`font-lato text-sm leading-relaxed mt-1 mb-4 ${t.subtext}`}>
                    {w.message}
                  </p>

                  {/* Footer */}
                  <div className={`flex items-center justify-between pt-3 border-t ${t.divider}`}>
                    <div>
                      <p className={`font-cinzel text-xs font-semibold tracking-wide ${t.heading}`}>
                        {w.guest_name}
                      </p>
                      <p className={`font-lato text-[10px] mt-0.5 ${t.muted}`}>
                        {new Date(w.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Status badge */}
                      <span className={`px-2 py-0.5 rounded-full font-cinzel text-[9px] tracking-wider mr-1 ${w.is_approved ? t.badge.approved : t.badge.pending}`}>
                        {w.is_approved ? 'Tampil' : 'Tersembunyi'}
                      </span>

                      {/* Toggle visibility */}
                      <button
                        onClick={() => toggleApproval(w)}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${t.btnOutline}`}
                        title={w.is_approved ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        {w.is_approved
                          ? <IconEyeOff size={13} />
                          : <IconEye size={13} />
                        }
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteWish(w.id)}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${t.btnDanger}`}
                        title="Hapus"
                      >
                        <IconTrash size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  )
}
