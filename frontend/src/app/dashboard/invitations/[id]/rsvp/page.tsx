'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import Link from 'next/link'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

type Theme = 'light' | 'dark'

interface RsvpEntry {
  id: string
  guest_name: string
  attendance: 'hadir' | 'tidak'
  guest_count: number
  message: string
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
    heading: 'text-[#2C1A0E]',
    subtext: 'text-[#6B3F2A]',
    muted: 'text-[#6B3F2A]/60',
    divider: 'border-[#E8DCC8]',
    badge: { hadir: 'bg-emerald-100 text-emerald-700', tidak: 'bg-red-100 text-red-600' },
    statCard: 'bg-white border border-[#E8DCC8]',
    iconBg: 'bg-[#E8DCC8] text-[#6B3F2A]',
    btnOutline: 'border border-[#C8A96E] text-[#6B3F2A] hover:bg-[#E8DCC8]',
    btnPrimary: 'bg-[#6B3F2A] hover:bg-[#2C1A0E] text-[#FAF7F2]',
    tableHead: 'bg-[#E8DCC8]/50',
    tableRow: 'border-b border-[#E8DCC8] hover:bg-[#FAF7F2]',
  },
  dark: {
    page: 'bg-[#1C0F07]',
    card: 'bg-[#3D2410] border border-[#4A2E18]',
    heading: 'text-[#E8DCC8]',
    subtext: 'text-[#C8A96E]',
    muted: 'text-[#C8A96E]/50',
    divider: 'border-[#4A2E18]',
    badge: { hadir: 'bg-emerald-900/40 text-emerald-400', tidak: 'bg-red-900/40 text-red-400' },
    statCard: 'bg-[#3D2410] border border-[#4A2E18]',
    iconBg: 'bg-[#6B3F2A]/30 text-[#C8A96E]',
    btnOutline: 'border border-[#C8A96E]/50 text-[#C8A96E] hover:bg-[#6B3F2A]/20',
    btnPrimary: 'bg-[#C8A96E] hover:bg-[#E8DCC8] text-[#2C1A0E]',
    tableHead: 'bg-[#4A2E18]/60',
    tableRow: 'border-b border-[#4A2E18] hover:bg-[#3D2410]',
  },
}

function downloadCSV(data: RsvpEntry[], filename: string) {
  const headers = ['Nama Tamu', 'Kehadiran', 'Jumlah Tamu', 'Pesan', 'Tanggal']
  const rows = data.map(r => [
    r.guest_name,
    r.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir',
    r.guest_count,
    r.message || '',
    new Date(r.created_at).toLocaleDateString('id-ID'),
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function RsvpPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [inv, setInv] = useState<Invitation | null>(null)
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([])
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
      axios.get(`/api/rsvp/${id}`),
    ])
      .then(([invRes, rsvpRes]) => {
        setInv(invRes.data)
        setRsvps(rsvpRes.data)
      })
      .catch(() => toast.error('Gagal memuat data RSVP'))
      .finally(() => setFetching(false))
  }, [user, id])

  if (loading || !user) return null

  const t = themeTokens[theme]
  const hadir = rsvps.filter(r => r.attendance === 'hadir')
  const tidak = rsvps.filter(r => r.attendance === 'tidak')
  const totalGuests = hadir.reduce((s, r) => s + r.guest_count, 0)

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
          <span style={{ color: '#C8A96E' }}>RSVP</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className={`font-playfair text-2xl lg:text-3xl font-semibold ${t.heading}`}>
              Daftar RSVP
            </h1>
            {inv && (
              <p className={`font-lato text-sm mt-1 ${t.muted}`}>
                {inv.bride_name} & {inv.groom_name}
              </p>
            )}
          </div>
          <button
            onClick={() => downloadCSV(rsvps, `rsvp-${inv?.slug || id}.csv`)}
            disabled={rsvps.length === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-cinzel text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-40 ${t.btnOutline}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Respons',   value: rsvps.length,    color: '#6B3F2A' },
            { label: 'Hadir',           value: hadir.length,    color: '#15803d' },
            { label: 'Tidak Hadir',     value: tidak.length,    color: '#b91c1c' },
            { label: 'Total Tamu',      value: totalGuests,     color: '#C8A96E' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl p-5 ${t.statCard}`}>
              <p className="font-playfair text-2xl font-semibold" style={{ color: s.color }}>
                {fetching ? '—' : s.value}
              </p>
              <p className={`font-lato text-xs mt-1 ${t.muted}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className={`rounded-xl overflow-hidden ${t.card}`}>
          <div className={`px-5 py-4 border-b ${t.divider}`}>
            <h2 className={`font-playfair text-base font-semibold ${t.heading}`}>Semua Respons</h2>
          </div>

          {fetching ? (
            <div className="p-8 text-center">
              <p className={`font-lato text-sm ${t.muted}`}>Memuat...</p>
            </div>
          ) : rsvps.length === 0 ? (
            <div className="p-12 text-center">
              <p className={`font-playfair text-lg font-semibold mb-2 ${t.heading}`}>Belum ada RSVP</p>
              <p className={`font-lato text-sm ${t.muted}`}>Respons tamu akan muncul di sini setelah undangan dibagikan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={t.tableHead}>
                    <th className={`px-5 py-3 text-left font-cinzel text-xs tracking-wider uppercase ${t.muted}`}>Nama Tamu</th>
                    <th className={`px-5 py-3 text-left font-cinzel text-xs tracking-wider uppercase ${t.muted}`}>Kehadiran</th>
                    <th className={`px-5 py-3 text-left font-cinzel text-xs tracking-wider uppercase ${t.muted}`}>Jml Tamu</th>
                    <th className={`px-5 py-3 text-left font-cinzel text-xs tracking-wider uppercase ${t.muted}`}>Pesan</th>
                    <th className={`px-5 py-3 text-left font-cinzel text-xs tracking-wider uppercase ${t.muted}`}>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map(r => (
                    <tr key={r.id} className={t.tableRow}>
                      <td className={`px-5 py-3.5 font-lato text-sm font-medium ${t.heading}`}>{r.guest_name}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full font-cinzel text-[10px] tracking-wider ${t.badge[r.attendance]}`}>
                          {r.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 font-lato text-sm ${t.muted}`}>{r.guest_count}</td>
                      <td className={`px-5 py-3.5 font-lato text-sm max-w-xs truncate ${t.muted}`}>{r.message || '—'}</td>
                      <td className={`px-5 py-3.5 font-lato text-xs ${t.muted}`}>
                        {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
