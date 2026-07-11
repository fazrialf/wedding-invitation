'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import Link from 'next/link'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
  IconHeart,
  IconCalendar,
  IconSearch,
  IconAlertTriangle,
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

const themeTokens = {
  light: {
    page: 'bg-[#FAF7F2]',
    card: 'bg-white border border-[#E8DCC8] hover:border-[#C8A96E] hover:shadow-md',
    heading: 'text-[#2C1A0E]',
    subtext: 'text-[#6B3F2A]',
    muted: 'text-[#6B3F2A]/60',
    divider: 'border-[#E8DCC8]',
    input: 'bg-white border-[#E8DCC8] text-[#2C1A0E] focus:border-[#C8A96E]',
    badge: { published: 'bg-emerald-100 text-emerald-700', draft: 'bg-amber-100 text-amber-700' },
    btnPrimary: 'bg-[#6B3F2A] hover:bg-[#2C1A0E] text-[#FAF7F2]',
    btnOutline: 'border border-[#C8A96E] text-[#6B3F2A] hover:bg-[#E8DCC8]',
    btnDanger: 'bg-[#8B1A1A] hover:bg-red-900 text-white',
    btnGhost: 'text-[#6B3F2A]/60 hover:text-[#6B3F2A] hover:bg-[#E8DCC8]',
    modalBg: 'bg-white',
    iconBg: 'bg-[#E8DCC8] text-[#6B3F2A]',
    emptyBg: 'bg-[#E8DCC8]/30 border-2 border-dashed border-[#C8A96E]/40',
    overlay: 'bg-black/40',
  },
  dark: {
    page: 'bg-[#1C0F07]',
    card: 'bg-[#3D2410] border border-[#4A2E18] hover:border-[#C8A96E]/40 hover:shadow-lg',
    heading: 'text-[#E8DCC8]',
    subtext: 'text-[#C8A96E]',
    muted: 'text-[#C8A96E]/50',
    divider: 'border-[#4A2E18]',
    input: 'bg-[#2C1A0E] border-[#4A2E18] text-[#E8DCC8] focus:border-[#C8A96E]',
    badge: { published: 'bg-emerald-900/40 text-emerald-400', draft: 'bg-amber-900/40 text-amber-400' },
    btnPrimary: 'bg-[#C8A96E] hover:bg-[#E8DCC8] text-[#2C1A0E]',
    btnOutline: 'border border-[#C8A96E]/50 text-[#C8A96E] hover:bg-[#6B3F2A]/20',
    btnDanger: 'bg-[#8B1A1A] hover:bg-red-900 text-white',
    btnGhost: 'text-[#C8A96E]/50 hover:text-[#C8A96E] hover:bg-[#6B3F2A]/20',
    modalBg: 'bg-[#2C1A0E]',
    iconBg: 'bg-[#6B3F2A]/30 text-[#C8A96E]',
    emptyBg: 'bg-[#3D2410]/50 border-2 border-dashed border-[#C8A96E]/20',
    overlay: 'bg-black/60',
  },
}

export default function InvitationsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [filtered, setFiltered] = useState<Invitation[]>([])
  const [fetching, setFetching] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [deleteTarget, setDeleteTarget] = useState<Invitation | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

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
      .then(r => {
        setInvitations(r.data)
        setFiltered(r.data)
      })
      .catch(() => toast.error('Gagal memuat undangan'))
      .finally(() => setFetching(false))
  }, [user])

  // Filter logic
  useEffect(() => {
    let result = invitations
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(i =>
        i.bride_name.toLowerCase().includes(q) ||
        i.groom_name.toLowerCase().includes(q) ||
        i.slug.toLowerCase().includes(q)
      )
    }
    if (statusFilter === 'published') result = result.filter(i => i.is_published)
    if (statusFilter === 'draft') result = result.filter(i => !i.is_published)
    setFiltered(result)
  }, [search, statusFilter, invitations])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await axios.delete(`/api/invitations/${deleteTarget.id}`)
      setInvitations(prev => prev.filter(i => i.id !== deleteTarget.id))
      toast.success('Undangan dihapus')
      setDeleteTarget(null)
    } catch {
      toast.error('Gagal menghapus undangan')
    } finally {
      setDeleting(false)
    }
  }

  if (loading || !user) return null

  const t = themeTokens[theme]

  return (
    <div className={`flex min-h-screen ${t.page} transition-colors duration-300`}>
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-10 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <p className={`font-cinzel text-xs tracking-[0.2em] uppercase mb-1 ${t.muted}`}>Kelola</p>
            <h1 className={`font-playfair text-2xl lg:text-3xl font-semibold ${t.heading}`}>
              Undangan Saya
            </h1>
          </div>
          <Link
            href="/dashboard/invitations/new"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 flex-shrink-0 ${t.btnPrimary}`}
          >
            <IconPlus size={16} />
            <span className="hidden sm:inline">Buat Undangan</span>
          </Link>
        </div>

        {/* Filters */}
        <div className={`flex flex-col sm:flex-row gap-3 mb-6 pb-6 border-b ${t.divider}`}>
          {/* Search */}
          <div className="relative flex-1">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.muted}`}>
              <IconSearch size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama pengantin atau slug..."
              className={`w-full pl-9 pr-4 py-2.5 rounded-lg border font-lato text-sm outline-none transition-all ${t.input}`}
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2.5 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 ${
                  statusFilter === f ? t.btnPrimary : t.btnOutline
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'published' ? 'Aktif' : 'Draft'}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className={`font-lato text-sm mb-4 ${t.muted}`}>
          {fetching ? 'Memuat...' : `${filtered.length} undangan ditemukan`}
        </p>

        {/* List */}
        {fetching ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className={`h-28 rounded-xl animate-pulse ${t.card}`} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={`rounded-xl p-12 flex flex-col items-center text-center ${t.emptyBg}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${t.iconBg}`}>
              <IconHeart size={16} />
            </div>
            <h3 className={`font-playfair text-lg font-semibold mb-2 ${t.heading}`}>
              {search || statusFilter !== 'all' ? 'Tidak ada hasil' : 'Belum ada undangan'}
            </h3>
            <p className={`font-lato text-sm mb-6 max-w-xs ${t.muted}`}>
              {search || statusFilter !== 'all'
                ? 'Coba ubah filter atau kata kunci pencarian.'
                : 'Buat undangan digital pertama Anda sekarang.'}
            </p>
            {!search && statusFilter === 'all' && (
              <Link
                href="/dashboard/invitations/new"
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 ${t.btnPrimary}`}
              >
                <IconPlus size={16} /> Buat Undangan
              </Link>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${search}-${statusFilter}`}
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map(inv => (
                <motion.div
                  key={inv.id}
                  variants={cardVariants}
                  className={`rounded-xl p-5 transition-all duration-200 ${t.card}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-cormorant text-xl italic font-semibold"
                      style={{ background: '#6B3F2A', color: '#E8DCC8' }}
                    >
                      {inv.bride_name?.[0] || '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-playfair text-base font-semibold truncate ${t.heading}`}>
                        {inv.bride_name} & {inv.groom_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className={`flex items-center gap-1 font-lato text-xs ${t.muted}`}>
                          <IconCalendar size={16} />
                          {new Date(inv.wedding_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className={`font-lato text-xs ${t.muted}`}>
                          /{inv.slug}
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`px-2.5 py-1 rounded-full font-cinzel text-[10px] tracking-wider flex-shrink-0 ${
                      inv.is_published ? t.badge.published : t.badge.draft
                    }`}>
                      {inv.is_published ? 'Aktif' : 'Draft'}
                    </span>
                  </div>

                  {/* Action row */}
                  <div className={`flex flex-wrap items-center gap-2 mt-4 pt-4 border-t ${t.divider}`}>
                    <Link
                      href={`/dashboard/invitations/${inv.id}/edit`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ${t.btnOutline}`}
                    >
                      <IconEdit size={16} /> Edit
                    </Link>
                    <Link
                      href={`/dashboard/invitations/${inv.id}/rsvp`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ${t.btnOutline}`}
                    >
                      <IconUsers size={16} /> RSVP
                    </Link>
                    <Link
                      href={`/dashboard/invitations/${inv.id}/wishes`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ${t.btnOutline}`}
                    >
                      <IconHeart size={16} /> Ucapan
                    </Link>
                    <Link
                      href={`/${inv.slug}`}
                      target="_blank"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ${t.btnPrimary}`}
                    >
                      <IconEye size={16} /> Lihat
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(inv)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ml-auto ${t.btnGhost} text-red-500 hover:bg-red-50 hover:text-red-700`}
                    >
                      <IconTrash size={16} /> Hapus
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${t.overlay}`}>
            <motion.div
              className={`rounded-2xl p-8 max-w-sm w-full shadow-2xl ${t.modalBg}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-100 text-red-600">
                <IconAlertTriangle size={22} />
              </div>
              <h3 className={`font-playfair text-xl font-semibold mb-2 ${t.heading}`}>
                Hapus Undangan?
              </h3>
              <p className={`font-lato text-sm mb-1 ${t.muted}`}>
                Anda akan menghapus undangan:
              </p>
              <p className={`font-playfair text-base font-medium mb-6 ${t.subtext}`}>
                {deleteTarget.bride_name} & {deleteTarget.groom_name}
              </p>
              <p className={`font-lato text-xs mb-6 ${t.muted}`}>
                Tindakan ini tidak dapat dibatalkan. Semua data RSVP dan ucapan akan ikut terhapus.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className={`flex-1 py-3 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 ${t.btnOutline}`}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`flex-1 py-3 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-60 ${t.btnDanger}`}
                >
                  {deleting ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
