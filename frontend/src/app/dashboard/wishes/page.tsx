'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

interface Wish {
  id: string
  guest_name: string
  message: string
  is_approved: boolean
  created_at: string
}

export default function WishesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [invitations, setInvitations] = useState<any[]>([])
  const [selectedInv, setSelectedInv] = useState<string>('')
  const [wishes, setWishes] = useState<Wish[]>([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    axios.get(`/api/invitations`)
      .then(r => { setInvitations(r.data); if (r.data.length > 0) setSelectedInv(r.data[0].id) })
      .catch(() => toast.error('Failed to load invitations'))
  }, [user])

  useEffect(() => {
    if (!selectedInv) return
    setFetching(true)
    axios.get(`/api/wishes/all/${selectedInv}`)
      .then(r => setWishes(r.data))
      .catch(() => toast.error('Failed to load wishes'))
      .finally(() => setFetching(false))
  }, [selectedInv])

  const toggleApproval = async (wish: Wish) => {
    try {
      await axios.put(`/api/wishes/${wish.id}`, {
        is_approved: !wish.is_approved
      })
      setWishes(ws => ws.map(w => w.id === wish.id ? { ...w, is_approved: !w.is_approved } : w))
      toast.success(wish.is_approved ? 'Hidden from wall' : 'Shown on wall')
    } catch {
      toast.error('Failed to update')
    }
  }

  const deleteWish = async (id: string) => {
    try {
      await axios.delete(`/api/wishes/${id}`)
      setWishes(ws => ws.filter(w => w.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading || !user) return null

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />
      <main className="flex-1 p-10">
        <div className="mb-8">
          <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-1">STUDIO</p>
          <h1 className="font-playfair text-3xl">Guest Wishes</h1>
        </div>

        {invitations.length > 1 && (
          <div className="mb-6">
            <select value={selectedInv} onChange={e => setSelectedInv(e.target.value)}
              className="border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 bg-white">
              {invitations.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.bride_name} & {inv.groom_name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-white border border-stone-100 shadow-sm">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-playfair text-xl">All Messages ({wishes.length})</h2>
            <span className="font-cinzel text-xs text-stone-400">
              {wishes.filter(w => w.is_approved).length} shown on wall
            </span>
          </div>

          {fetching ? (
            <div className="p-12 text-center font-lato text-stone-400">Loading...</div>
          ) : wishes.length === 0 ? (
            <div className="p-12 text-center font-lato text-stone-400">No wishes yet</div>
          ) : (
            <div className="divide-y divide-stone-50">
              {wishes.map(wish => (
                <div key={wish.id} className={`px-6 py-5 flex items-start gap-4 ${!wish.is_approved ? 'opacity-50' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-cinzel text-xs tracking-widest text-stone-700">{wish.guest_name}</p>
                      <span className={`font-cinzel text-xs px-2 py-0.5 rounded ${wish.is_approved ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-400'}`}>
                        {wish.is_approved ? 'VISIBLE' : 'HIDDEN'}
                      </span>
                    </div>
                    <p className="font-lato text-sm text-stone-600 italic">"{wish.message}"</p>
                    <p className="font-lato text-xs text-stone-400 mt-1">
                      {new Date(wish.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleApproval(wish)}
                      className={`font-cinzel text-xs px-3 py-2 border transition-colors ${
                        wish.is_approved
                          ? 'border-stone-200 text-stone-500 hover:bg-stone-100'
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}>
                      {wish.is_approved ? 'HIDE' : 'SHOW'}
                    </button>
                    <button onClick={() => deleteWish(wish.id)}
                      className="font-cinzel text-xs px-3 py-2 border border-red-100 text-red-400 hover:bg-red-50 transition-colors">
                      DELETE
                    </button>
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
