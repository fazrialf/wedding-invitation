'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import Link from 'next/link'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

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

  const toggleApproval = async (wish: Wish) => {
    try {
      await axios.patch(`/api/wishes/${wish.id}`, { is_approved: !wish.is_approved })
      setWishes(prev => prev.map(w => w.id === wish.id ? { ...w, is_approved: !w.is_approved } : w))
      toast.success(wish.is_approved ? 'Ucapan disembunyikan' : 'Ucapan ditampilkan')
    } catch {
      toast.error('Gagal mengubah status ucapan')
    }
  }

  const deleteWish = async (wishId: string) => {
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
  const hidden = wishes.filter(w => !w.is_approved)

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
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className={`font-playfair text-2xl lg:text-3xl font-semibold ${t.heading}`}>
              Ucapan & Doa
            </h1>
            {inv && (
              <p className={`font-lato text-sm mt-1 ${t.muted}`}>
                {inv.bride_name} & {inv.groom_name}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Ucapan',   value: wishes.length,   color: '#6B3F2A' },
            { label: 'Ditampilkan',    value: approved.length, color: '#15803d' },
            { label: 'Disembunyikan',  value: hidden.length,   color: '#b45309' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl p-5 ${t.card}`}>
              <p className="font-playfair text-2xl font-semibold" style={{ color: s.color }}>
                {fetching ? '—' : s.value}
              </p>
              <p className={`font-lato text-xs mt-1 ${t.muted}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Wishes grid */}
        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className={`h-36 rounded-xl animate-pulse ${t.card}`} />)}
          </div>
        ) : wishes.length === 0 ? (
          <div className={`rounded-xl p-12 flex flex-col items-center text-center border-2 border-dashed ${t.divider}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${t.iconBg}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className={`font-playfair text-lg font-semibold mb-2 ${t.heading}`}>Belum ada ucapan</h3>
            <p className={`font-lato text-sm ${t.muted}`}>Ucapan dari tamu akan muncul di sini setelah undangan dibagikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishes.map(w => (
              <div key={w.id} className={`rounded-xl p-5 transition-all duration-200 ${t.wishCard}`}>
                {/* Quote mark */}
                <div className={`font-playfair text-5xl leading-none mb-2 ${t.quoteMark}`}>"</div>

                {/* Message */}
                <p className={`font-lato text-sm leading-relaxed mb-4 ${t.subtext}`}>
                  {w.message}
                </p>

                {/* Footer */}
                <div className={`flex items-center justify-between pt-3 border-t ${t.divider}`}>
                  <div>
                    <p className={`font-cinzel text-xs tracking-wider ${t.heading}`}>{w.guest_name}</p>
                    <p className={`font-lato text-xs mt-0.5 ${t.muted}`}>
                      {new Date(w.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full font-cinzel text-[10px] tracking-wider ${
                      w.is_approved ? t.badge.approved : t.badge.pending
                    }`}>
                      {w.is_approved ? 'Tampil' : 'Tersembunyi'}
                    </span>
                    <button
                      onClick={() => toggleApproval(w)}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${t.btnOutline}`}
                      title={w.is_approved ? 'Sembunyikan' : 'Tampilkan'}
                    >
                      {w.is_approved ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                    <button
                      onClick={() => deleteWish(w.id)}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${t.btnDanger}`}
                      title="Hapus"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
