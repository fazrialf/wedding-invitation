'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const THEMES = [
  { slug: 'gold',    name: 'Gold',    bg: 'from-yellow-800 to-yellow-600' },
  { slug: 'silver',  name: 'Silver',  bg: 'from-gray-500 to-gray-400' },
  { slug: 'dark',    name: 'Dark',    bg: 'from-stone-900 to-stone-700' },
  { slug: 'floral',  name: 'Floral',  bg: 'from-pink-300 to-rose-200' },
  { slug: 'minimal', name: 'Minimal', bg: 'from-stone-100 to-white' },
]

export default function NewInvitationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    slug:             '',
    theme_slug:       'gold',
    bride_name:       '',
    groom_name:       '',
    wedding_date:     '',
    akad_date:        '',
    akad_time:        '',
    akad_venue:       '',
    reception_date:   '',
    reception_time:   '',
    reception_venue:  '',
    venue_lat:        '',
    venue_lng:        '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.slug || !form.bride_name || !form.groom_name || !form.wedding_date) {
      return toast.error('Please fill in all required fields')
    }
    setSaving(true)
    try {
      const res = await axios.post(`/api/invitations`, {
        ...form,
        venue_lat: form.venue_lat ? parseFloat(form.venue_lat) : null,
        venue_lng: form.venue_lng ? parseFloat(form.venue_lng) : null,
      })
      toast.success('Invitation created!')
      router.push(`/dashboard/invitations/${res.data.id}/edit`)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to create invitation')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user) return null

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className="flex-1 p-10 max-w-3xl">
        {/* Breadcrumb */}
        <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-6">
          DASHBOARD / NEW INVITATION
        </p>
        <h1 className="font-playfair text-3xl mb-8">Create New Invitation</h1>

        {/* Step indicators */}
        <div className="flex gap-2 mb-10">
          {['Couple Details', 'Events & Venue', 'Theme'].map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              className={`flex-1 py-2 font-cinzel text-xs tracking-widest border transition-colors ${
                step === i + 1
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'text-stone-400 border-stone-200 hover:border-stone-400'
              }`}
            >
              {i + 1}. {label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Step 1: Couple Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'bride_name', label: 'BRIDE\'S NAME *', placeholder: 'e.g. Sarah' },
                { key: 'groom_name', label: 'GROOM\'S NAME *', placeholder: 'e.g. Ahmad' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-1">{label}</label>
                  <input
                    type="text" required
                    value={(form as any)[key]}
                    onChange={e => set(key, e.target.value)}
                    className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 transition-colors"
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-1">WEDDING DATE *</label>
              <input
                type="date" required
                value={form.wedding_date}
                onChange={e => set('wedding_date', e.target.value)}
                className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
            <div>
              <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-1">
                INVITATION URL SLUG * <span className="text-stone-400 font-lato normal-case tracking-normal">(e.g. sarah-dan-ahmad)</span>
              </label>
              <div className="flex items-center border border-stone-200 focus-within:border-gold-400 transition-colors">
                <span className="px-4 py-3 bg-stone-50 font-lato text-sm text-stone-400 border-r border-stone-200">
                  yourdomain.com/
                </span>
                <input
                  type="text" required
                  value={form.slug}
                  onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="flex-1 px-4 py-3 font-lato text-sm focus:outline-none"
                  placeholder="sarah-dan-ahmad"
                />
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!form.bride_name || !form.groom_name || !form.wedding_date || !form.slug}
              className="w-full bg-stone-900 hover:bg-stone-700 disabled:opacity-40 text-white font-cinzel text-xs tracking-widest py-4 transition-colors"
            >
              NEXT: EVENTS & VENUE →
            </button>
          </div>
        )}

        {/* Step 2: Events & Venue */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border border-stone-200 p-6">
              <h3 className="font-cinzel text-sm tracking-widest mb-4 text-stone-700">AKAD NIKAH</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">DATE</label>
                  <input type="text" value={form.akad_date} onChange={e => set('akad_date', e.target.value)}
                    className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400"
                    placeholder="Saturday, 12 July 2025" />
                </div>
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">TIME</label>
                  <input type="text" value={form.akad_time} onChange={e => set('akad_time', e.target.value)}
                    className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400"
                    placeholder="08.00 WIB" />
                </div>
              </div>
              <div className="mt-4">
                <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">VENUE</label>
                <input type="text" value={form.akad_venue} onChange={e => set('akad_venue', e.target.value)}
                  className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400"
                  placeholder="Masjid Al-Ikhlas, Jl. Sudirman No. 1, Jakarta" />
              </div>
            </div>

            <div className="border border-stone-200 p-6">
              <h3 className="font-cinzel text-sm tracking-widest mb-4 text-stone-700">RECEPTION</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">DATE</label>
                  <input type="text" value={form.reception_date} onChange={e => set('reception_date', e.target.value)}
                    className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400"
                    placeholder="Saturday, 12 July 2025" />
                </div>
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">TIME</label>
                  <input type="text" value={form.reception_time} onChange={e => set('reception_time', e.target.value)}
                    className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400"
                    placeholder="11.00 – 15.00 WIB" />
                </div>
              </div>
              <div className="mt-4">
                <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">VENUE</label>
                <input type="text" value={form.reception_venue} onChange={e => set('reception_venue', e.target.value)}
                  className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400"
                  placeholder="Hotel Grand Ballroom, Jakarta" />
              </div>
            </div>

            <div className="border border-stone-200 p-6">
              <h3 className="font-cinzel text-sm tracking-widest mb-4 text-stone-700">MAP COORDINATES (optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">LATITUDE</label>
                  <input type="text" value={form.venue_lat} onChange={e => set('venue_lat', e.target.value)}
                    className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400"
                    placeholder="-6.2088" />
                </div>
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">LONGITUDE</label>
                  <input type="text" value={form.venue_lng} onChange={e => set('venue_lng', e.target.value)}
                    className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400"
                    placeholder="106.8456" />
                </div>
              </div>
              <p className="font-lato text-xs text-stone-400 mt-2">
                Find coordinates at <a href="https://maps.google.com" target="_blank" className="text-gold-600 hover:underline">maps.google.com</a> → right-click your venue → copy coordinates
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-stone-300 text-stone-600 font-cinzel text-xs tracking-widest py-4 hover:bg-stone-100 transition-colors">
                ← BACK
              </button>
              <button onClick={() => setStep(3)}
                className="flex-1 bg-stone-900 hover:bg-stone-700 text-white font-cinzel text-xs tracking-widest py-4 transition-colors">
                NEXT: CHOOSE THEME →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Theme selector */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
              {THEMES.map(theme => (
                <button
                  key={theme.slug}
                  onClick={() => set('theme_slug', theme.slug)}
                  className={`relative aspect-[9/16] rounded overflow-hidden bg-gradient-to-b ${theme.bg} flex items-end p-3 transition-all ${
                    form.theme_slug === theme.slug
                      ? 'ring-2 ring-gold-500 ring-offset-2 scale-105'
                      : 'hover:scale-102 hover:ring-1 hover:ring-stone-300'
                  }`}
                >
                  {form.theme_slug === theme.slug && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className={`font-cinzel text-xs tracking-widest ${theme.slug === 'minimal' ? 'text-stone-600' : 'text-white'}`}>
                    {theme.name.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            <div className="border border-gold-200 bg-gold-50 p-4 font-lato text-sm text-stone-600">
              Selected: <strong className="font-cinzel">{THEMES.find(t => t.slug === form.theme_slug)?.name}</strong> theme
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)}
                className="flex-1 border border-stone-300 text-stone-600 font-cinzel text-xs tracking-widest py-4 hover:bg-stone-100 transition-colors">
                ← BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-cinzel text-xs tracking-widest py-4 transition-colors"
              >
                {saving ? 'CREATING...' : '✓ CREATE INVITATION'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
