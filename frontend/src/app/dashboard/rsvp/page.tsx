'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

interface RsvpEntry {
  id: string
  guest_name: string
  attendance: 'hadir' | 'tidak'
  guest_count: number
  message: string
  created_at: string
}

export default function RsvpPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [invitations, setInvitations] = useState<any[]>([])
  const [selectedInv, setSelectedInv] = useState<string>('')
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    axios.get(`/api/invitations`)
      .then(r => {
        setInvitations(r.data)
        if (r.data.length > 0) setSelectedInv(r.data[0].id)
      })
      .catch(() => toast.error('Failed to load invitations'))
  }, [user])

  useEffect(() => {
    if (!selectedInv) return
    setFetching(true)
    axios.get(`/api/rsvp/${selectedInv}`)
      .then(r => setRsvps(r.data))
      .catch(() => toast.error('Failed to load RSVPs'))
      .finally(() => setFetching(false))
  }, [selectedInv])

  const attending    = rsvps.filter(r => r.attendance === 'hadir')
  const notAttending = rsvps.filter(r => r.attendance === 'tidak')
  const totalGuests  = attending.reduce((sum, r) => sum + (r.guest_count || 1), 0)

  const exportCsv = () => {
    const rows = [
      ['Name', 'Attendance', 'Guests', 'Message', 'Date'],
      ...rsvps.map(r => [
        r.guest_name,
        r.attendance === 'hadir' ? 'Attending' : 'Not Attending',
        r.guest_count,
        r.message || '',
        new Date(r.created_at).toLocaleDateString(),
      ])
    ]
    const csv = rows.map(r => r.map(String).map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'rsvp-list.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading || !user) return null

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-1">STUDIO</p>
            <h1 className="font-playfair text-3xl">RSVP Responses</h1>
          </div>
          {rsvps.length > 0 && (
            <button onClick={exportCsv}
              className="border border-stone-300 text-stone-600 font-cinzel text-xs tracking-widest px-5 py-3 hover:bg-stone-100 transition-colors">
              EXPORT CSV
            </button>
          )}
        </div>

        {/* Invitation selector */}
        {invitations.length > 1 && (
          <div className="mb-6">
            <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">SELECT INVITATION</label>
            <select value={selectedInv} onChange={e => setSelectedInv(e.target.value)}
              className="border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 bg-white">
              {invitations.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.bride_name} & {inv.groom_name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Responses', value: rsvps.length,         color: 'text-stone-800' },
            { label: 'Attending',       value: attending.length,     color: 'text-green-600' },
            { label: 'Total Guests',    value: totalGuests,           color: 'text-gold-600'  },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-stone-100 shadow-sm p-6">
              <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-2">{label.toUpperCase()}</p>
              <p className={`font-playfair text-4xl ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* RSVP Table */}
        <div className="bg-white border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-playfair text-xl">Guest List</h2>
          </div>
          {fetching ? (
            <div className="p-12 text-center font-lato text-stone-400">Loading...</div>
          ) : rsvps.length === 0 ? (
            <div className="p-12 text-center font-lato text-stone-400">No RSVPs yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    {['Guest Name', 'Attendance', 'Guests', 'Message', 'Date'].map(h => (
                      <th key={h} className="px-6 py-3 text-left font-cinzel text-xs tracking-widest text-stone-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {rsvps.map(r => (
                    <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-lato text-sm text-stone-800 font-medium">{r.guest_name}</td>
                      <td className="px-6 py-4">
                        <span className={`font-cinzel text-xs px-2 py-1 rounded ${r.attendance === 'hadir' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                          {r.attendance === 'hadir' ? 'ATTENDING' : 'NOT ATTENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-lato text-sm text-stone-600">{r.guest_count}</td>
                      <td className="px-6 py-4 font-lato text-sm text-stone-500 max-w-xs truncate">{r.message || '—'}</td>
                      <td className="px-6 py-4 font-lato text-xs text-stone-400">
                        {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
