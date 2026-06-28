'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import Link from 'next/link'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

interface Invitation {
  id: string
  slug: string
  bride_name: string
  groom_name: string
  wedding_date: string
  is_published: boolean
  theme_slug: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    axios.get(`/api/invitations`)
      .then(r => setInvitations(r.data))
      .catch(() => toast.error('Failed to load invitations'))
      .finally(() => setFetching(false))
  }, [user])

  if (loading || !user) return null

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-playfair text-3xl text-stone-800">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="font-lato text-stone-500 mt-1">Manage your wedding invitations</p>
          </div>
          <Link
            href="/dashboard/invitations/new"
            className="bg-stone-900 hover:bg-stone-700 text-white font-cinzel text-xs tracking-widest px-6 py-3 transition-colors duration-300"
          >
            + NEW INVITATION
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Invitations', value: invitations.length },
            { label: 'Published',         value: invitations.filter(i => i.is_published).length },
            { label: 'Drafts',            value: invitations.filter(i => !i.is_published).length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-stone-100 shadow-sm p-6">
              <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-2">{label.toUpperCase()}</p>
              <p className="font-playfair text-4xl text-stone-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Invitations list */}
        <div className="bg-white border border-stone-100 shadow-sm">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-playfair text-xl">Your Invitations</h2>
          </div>

          {fetching ? (
            <div className="p-12 text-center font-lato text-stone-400">Loading...</div>
          ) : invitations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-playfair text-2xl text-stone-400 mb-3">No invitations yet</p>
              <p className="font-lato text-stone-400 text-sm mb-6">Create your first wedding invitation</p>
              <Link
                href="/dashboard/invitations/new"
                className="bg-gold-500 hover:bg-gold-600 text-white font-cinzel text-xs tracking-widest px-8 py-3 transition-colors"
              >
                CREATE INVITATION
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {invitations.map(inv => (
                <div key={inv.id} className="px-6 py-5 flex items-center justify-between hover:bg-stone-50 transition-colors">
                  <div>
                    <p className="font-playfair text-lg text-stone-800">
                      {inv.bride_name} &amp; {inv.groom_name}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="font-lato text-xs text-stone-400">
                        {new Date(inv.wedding_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <span className="font-cinzel text-xs text-stone-400">/{inv.slug}</span>
                      <span className={`font-cinzel text-xs px-2 py-0.5 rounded ${inv.is_published ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-400'}`}>
                        {inv.is_published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/${inv.slug}`}
                      target="_blank"
                      className="font-cinzel text-xs text-stone-500 hover:text-stone-800 border border-stone-200 px-4 py-2 transition-colors"
                    >
                      PREVIEW
                    </Link>
                    <Link
                      href={`/dashboard/invitations/${inv.id}/edit`}
                      className="font-cinzel text-xs text-white bg-stone-800 hover:bg-stone-600 px-4 py-2 transition-colors"
                    >
                      EDIT
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
