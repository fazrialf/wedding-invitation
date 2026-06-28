'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

interface AnalyticsData {
  total_views:     number
  rsvp_attending:  number
  rsvp_declining:  number
  rsvp_total:      number
  conversion_rate: string
  top_guests:      { guest_name: string; opens: number }[]
  views_by_day:    { day: string; views: number }[]
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [data, setData]     = useState<AnalyticsData | null>(null)
  const [inv, setInv]       = useState<any>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user || !id) return
    Promise.all([
      axios.get(`/api/invitations/by-id/${id}`),
      axios.get(`/api/analytics/${id}`),
    ])
      .then(([invRes, analyticsRes]) => {
        setInv(invRes.data)
        setData(analyticsRes.data)
      })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setFetching(false))
  }, [user, id])

  if (loading || !user) return null

  const maxViews = data?.views_by_day?.length
    ? Math.max(...data.views_by_day.map(d => d.views), 1)
    : 1

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className="flex-1 p-10">
        <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-1">STUDIO / ANALYTICS</p>
        <h1 className="font-playfair text-3xl mb-2">
          {inv ? `${inv.bride_name} & ${inv.groom_name}` : 'Analytics'}
        </h1>
        <p className="font-lato text-sm text-stone-500 mb-8">Live stats for your invitation</p>

        {fetching ? (
          <p className="font-lato text-stone-400">Loading analytics...</p>
        ) : data ? (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
              {[
                { label: 'Total Views',      value: data.total_views,     color: 'text-stone-800' },
                { label: 'RSVP Responses',   value: data.rsvp_total,      color: 'text-stone-800' },
                { label: 'Attending',         value: data.rsvp_attending,  color: 'text-green-600' },
                { label: 'RSVP Conversion',  value: `${data.conversion_rate}%`, color: 'text-yellow-600' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white border border-stone-100 shadow-sm p-6">
                  <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-2">{label.toUpperCase()}</p>
                  <p className={`font-playfair text-4xl ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Views chart (bar chart using divs) */}
            {data.views_by_day.length > 0 && (
              <div className="bg-white border border-stone-100 shadow-sm p-6 mb-8">
                <h2 className="font-playfair text-xl mb-6">Views — Last 14 Days</h2>
                <div className="flex items-end gap-2 h-40">
                  {data.views_by_day.map(({ day, views }) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <p className="font-lato text-xs text-stone-400">{views}</p>
                      <div
                        className="w-full bg-yellow-400 rounded-sm transition-all duration-500"
                        style={{ height: `${(views / maxViews) * 120}px`, minHeight: '4px' }}
                      />
                      <p className="font-lato text-xs text-stone-400 rotate-45 origin-left mt-1">
                        {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* RSVP breakdown */}
              <div className="bg-white border border-stone-100 shadow-sm p-6">
                <h2 className="font-playfair text-xl mb-6">RSVP Breakdown</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Attending',     value: data.rsvp_attending, color: 'bg-green-400' },
                    { label: 'Not Attending', value: data.rsvp_declining, color: 'bg-red-300' },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <p className="font-cinzel text-xs tracking-widest text-stone-500">{label}</p>
                        <p className="font-lato text-sm text-stone-700">{value}</p>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full">
                        <div
                          className={`${color} h-2 rounded-full transition-all duration-700`}
                          style={{ width: data.rsvp_total > 0 ? `${(value / data.rsvp_total) * 100}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top guests */}
              <div className="bg-white border border-stone-100 shadow-sm p-6">
                <h2 className="font-playfair text-xl mb-6">Top Personalized Opens</h2>
                {data.top_guests.length === 0 ? (
                  <p className="font-lato text-sm text-stone-400">No personalized opens yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.top_guests.map(({ guest_name, opens }) => (
                      <div key={guest_name} className="flex items-center justify-between">
                        <p className="font-lato text-sm text-stone-700">{guest_name}</p>
                        <span className="font-cinzel text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded">
                          {opens} opens
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="font-lato text-stone-400">No analytics data yet. Share your invitation to start collecting views.</p>
        )}
      </main>
    </div>
  )
}
