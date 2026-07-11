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
}

const Icons = {
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  eye: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  rsvp: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  heart: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  warning: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
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
            {Icons.plus}
            <span className="hidden sm:inline">Buat Undangan</span>
          </Link>
        </div>

        {/* Filters */}
        <div className={`flex flex-col sm:flex-row gap-3 mb-6 pb-6 border-b ${t.divider}`}>
          {/* Search */}
          <div className="relative flex-1">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.muted}`}>{Icons.search}</span>
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
            {[1,2,3].map(i => <div key={i} className={`h-28 rounded-xl animate-pulse ${t.card}`} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={`rounded-xl p-12 flex flex-col items-center text-center ${t.emptyBg}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${t.iconBg}`}>
              {Icons.heart}
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
                {Icons.plus} Buat Undangan
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(inv => (
              <div
                key={inv.id}
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
                        {Icons.calendar}
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
                    {Icons.edit} Edit
                  </Link>
                  <Link
                    href={`/dashboard/invitations/${inv.id}/rsvp`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ${t.btnOutline}`}
                  >
                    {Icons.rsvp} RSVP
                  </Link>
                  <Link
                    href={`/dashboard/invitations/${inv.id}/wishes`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ${t.btnOutline}`}
                  >
                    {Icons.heart} Ucapan
                  </Link>
                  <Link
                    href={`/${inv.slug}`}
                    target="_blank"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ${t.btnPrimary}`}
                  >
                    {Icons.eye} Lihat
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(inv)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-lato text-xs transition-all duration-200 ml-auto ${t.btnGhost} text-red-500 hover:bg-red-50 hover:text-red-700`}
                  >
                    {Icons.trash} Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${t.overlay}`}>
          <div className={`rounded-2xl p-8 max-w-sm w-full shadow-2xl ${t.modalBg}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-100 text-red-600`}>
              {Icons.warning}
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
          </div>
        </div>
      )}
    </div>
  )
}
