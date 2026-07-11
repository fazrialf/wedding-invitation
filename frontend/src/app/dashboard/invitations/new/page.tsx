'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { getTemplatesByCategory, getAllTemplates, themes } from '@/themes/config'
import { templatePalettes } from '@/themes/palettes'

const CATEGORIES = [
  { slug: 'all',        label: 'All',              emoji: '🎨' },
  { slug: 'minimalist', label: 'Minimalist',        emoji: '✦'  },
  { slug: 'floral',     label: 'Floral',            emoji: '🌸' },
  { slug: 'nature',     label: 'Nature',            emoji: '🌿' },
  { slug: 'fairytale',  label: 'Fairytale',         emoji: '✨' },
  { slug: 'adat',       label: 'Adat/Traditional',  emoji: '🏛'  },
]

const CAT_DISPLAY: Record<string, string> = {
  minimalist: 'Minimalist',
  floral:     'Floral',
  nature:     'Nature',
  fairytale:  'Fairytale',
  adat:       'Adat',
}

// ── Phone frame live preview ───────────────────────────────────────────────
function PhonePreview({
  brideName,
  groomName,
  weddingDate,
  themeSlug,
  paletteSlug,
}: {
  brideName:   string
  groomName:   string
  weddingDate: string
  themeSlug:   string
  paletteSlug: string
}) {
  const theme   = themes[themeSlug]
  const palette = (templatePalettes[themeSlug] ?? []).find(p => p.slug === paletteSlug)

  const bg      = theme?.bgPage      ?? 'bg-white'
  const primary = palette?.primaryHex ?? theme?.primaryHex ?? '#b49a72'
  const fontH   = theme?.fontHeading  ?? 'font-playfair'
  const fontB   = theme?.fontBody     ?? 'font-lato'
  const ornChar = theme?.ornamentChar ?? '✦'

  const dateStr = weddingDate
    ? new Date(weddingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Your Wedding Date'

  return (
    // Outer phone shell
    <div className="relative mx-auto w-[220px] flex-shrink-0">
      {/* Phone border */}
      <div className="relative rounded-[32px] border-[6px] border-stone-800 shadow-2xl overflow-hidden bg-stone-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-800 rounded-b-xl z-20" />
        {/* Screen */}
        <div className={`${bg} w-full h-[420px] overflow-hidden relative flex flex-col`}>

          {/* Top ornament strip */}
          <div className="flex justify-center gap-1 pt-6 pb-1">
            {[0.3, 0.6, 1, 0.6, 0.3].map((op, i) => (
              <span key={i} style={{ color: primary, opacity: op, fontSize: 8 }}>{ornChar}</span>
            ))}
          </div>

          {/* Badge */}
          <div className="flex justify-center mt-1">
            <span
              className={`${fontB} text-[7px] tracking-widest px-2 py-0.5 border`}
              style={{ color: primary, borderColor: primary, opacity: 0.8 }}
            >
              WEDDING INVITATION
            </span>
          </div>

          {/* Couple names */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <p className={`${fontH} text-[9px] tracking-widest mb-1`} style={{ color: primary, opacity: 0.6 }}>
              THE WEDDING OF
            </p>
            <h2
              className={`${fontH} leading-tight mb-1`}
              style={{ color: primary, fontSize: brideName || groomName ? 18 : 14 }}
            >
              {brideName || 'Bride'}
            </h2>
            <span style={{ color: primary, opacity: 0.5, fontSize: 10 }}>&amp;</span>
            <h2
              className={`${fontH} leading-tight mt-1`}
              style={{ color: primary, fontSize: brideName || groomName ? 18 : 14 }}
            >
              {groomName || 'Groom'}
            </h2>

            {/* Divider */}
            <div className="flex items-center gap-1 my-3 w-full justify-center">
              <div className="flex-1 h-px max-w-[30px]" style={{ backgroundColor: primary, opacity: 0.3 }} />
              <span style={{ color: primary, opacity: 0.5, fontSize: 8 }}>{ornChar}</span>
              <div className="flex-1 h-px max-w-[30px]" style={{ backgroundColor: primary, opacity: 0.3 }} />
            </div>

            {/* Date */}
            <p className={`${fontB} text-[8px] tracking-wider`} style={{ color: primary, opacity: 0.7 }}>
              {dateStr}
            </p>
          </div>

          {/* Bottom ornament strip */}
          <div className="flex justify-center gap-1 pb-5">
            {[0.3, 0.6, 1, 0.6, 0.3].map((op, i) => (
              <span key={i} style={{ color: primary, opacity: op, fontSize: 8 }}>{ornChar}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="text-center font-cinzel text-xs tracking-widest text-stone-400 mt-3">
        LIVE PREVIEW
      </p>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function NewInvitationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [activeCat, setActiveCat] = useState('all')

  const [form, setForm] = useState({
    slug:             '',
    theme_slug:       'min-ivory',
    palette_slug:     '',
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

  // Derive filtered template list for Step 3
  const filteredTemplates = activeCat === 'all'
    ? getAllTemplates().filter(t => t.category)
    : getTemplatesByCategory(activeCat)

  const selectedTheme    = themes[form.theme_slug]
  const selectedPalettes = templatePalettes[form.theme_slug] ?? []

  // Step 3 uses a side-by-side layout with phone preview
  const isStep3 = step === 3

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className={`flex-1 p-10 ${isStep3 ? 'max-w-6xl' : 'max-w-3xl'}`}>
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
              onClick={() => i < step - 1 && setStep(i + 1)}
              className={`flex-1 py-3 font-cinzel text-xs tracking-widest border transition-colors ${
                step === i + 1
                  ? 'bg-stone-800 text-white border-stone-800'
                  : i < step - 1
                  ? 'bg-stone-100 text-stone-600 border-stone-300 cursor-pointer hover:bg-stone-200'
                  : 'bg-white text-stone-400 border-stone-200 cursor-default'
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {/* ── STEP 1: Couple Details ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-2">URL SLUG *</label>
              <input
                type="text"
                placeholder="e.g. budi-and-sari"
                value={form.slug}
                onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500"
              />
              <p className="font-lato text-xs text-stone-400 mt-1">Your invitation will be at: yourdomain.com/{form.slug || 'your-slug'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-2">BRIDE NAME *</label>
                <input type="text" placeholder="Bride's name" value={form.bride_name}
                  onChange={e => set('bride_name', e.target.value)}
                  className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
              </div>
              <div>
                <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-2">GROOM NAME *</label>
                <input type="text" placeholder="Groom's name" value={form.groom_name}
                  onChange={e => set('groom_name', e.target.value)}
                  className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
              </div>
            </div>
            <div>
              <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-2">WEDDING DATE *</label>
              <input type="date" value={form.wedding_date}
                onChange={e => set('wedding_date', e.target.value)}
                className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
            </div>
            <button onClick={() => {
              if (!form.slug || !form.bride_name || !form.groom_name || !form.wedding_date)
                return toast.error('Please fill in all required fields')
              setStep(2)
            }}
              className="w-full bg-stone-800 hover:bg-stone-900 text-white font-cinzel text-xs tracking-widest py-4 transition-colors">
              NEXT: EVENTS & VENUE →
            </button>
          </div>
        )}

        {/* ── STEP 2: Events & Venue ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-l-2 border-stone-800 pl-4">
              <p className="font-cinzel text-xs tracking-widest text-stone-500 mb-3">AKAD CEREMONY</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">DATE</label>
                  <input type="date" value={form.akad_date} onChange={e => set('akad_date', e.target.value)}
                    className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
                </div>
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">TIME</label>
                  <input type="time" value={form.akad_time} onChange={e => set('akad_time', e.target.value)}
                    className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
                </div>
              </div>
              <div className="mt-3">
                <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">VENUE</label>
                <input type="text" placeholder="Akad venue name" value={form.akad_venue} onChange={e => set('akad_venue', e.target.value)}
                  className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
              </div>
            </div>
            <div className="border-l-2 border-stone-400 pl-4">
              <p className="font-cinzel text-xs tracking-widest text-stone-500 mb-3">RECEPTION</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">DATE</label>
                  <input type="date" value={form.reception_date} onChange={e => set('reception_date', e.target.value)}
                    className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
                </div>
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">TIME</label>
                  <input type="time" value={form.reception_time} onChange={e => set('reception_time', e.target.value)}
                    className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
                </div>
              </div>
              <div className="mt-3">
                <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">VENUE</label>
                <input type="text" placeholder="Reception venue name" value={form.reception_venue} onChange={e => set('reception_venue', e.target.value)}
                  className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
              </div>
            </div>
            <div>
              <p className="font-cinzel text-xs tracking-widest text-stone-500 mb-3">GPS COORDINATES (optional)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">LATITUDE</label>
                  <input type="number" step="any" placeholder="-6.2088" value={form.venue_lat} onChange={e => set('venue_lat', e.target.value)}
                    className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
                </div>
                <div>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">LONGITUDE</label>
                  <input type="number" step="any" placeholder="106.8456" value={form.venue_lng} onChange={e => set('venue_lng', e.target.value)}
                    className="w-full border border-stone-300 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-stone-300 text-stone-600 font-cinzel text-xs tracking-widest py-4 hover:bg-stone-100 transition-colors">
                ← BACK
              </button>
              <button onClick={() => setStep(3)}
                className="flex-1 bg-stone-800 hover:bg-stone-900 text-white font-cinzel text-xs tracking-widest py-4 transition-colors">
                NEXT: CHOOSE THEME →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Theme + Live Preview ── */}
        {step === 3 && (
          <div className="flex gap-10 items-start">

            {/* Left: theme selector */}
            <div className="flex-1 space-y-6 min-w-0">

              {/* Category filter tabs */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCat(cat.slug)}
                    className={`px-3 py-1.5 font-cinzel text-xs tracking-widest transition-colors ${
                      activeCat === cat.slug
                        ? 'bg-stone-800 text-white'
                        : 'border border-stone-300 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>

              {/* Template grid */}
              <div className="grid grid-cols-3 gap-3">
                {filteredTemplates.map(t => (
                  <button
                    key={t.slug}
                    onClick={() => {
                      const palettes = templatePalettes[t.slug] ?? []
                      setForm(f => ({
                        ...f,
                        theme_slug:   t.slug,
                        palette_slug: palettes[0]?.slug ?? '',
                      }))
                    }}
                    className={`bg-white p-3 text-left transition-all ${
                      form.theme_slug === t.slug
                        ? 'ring-2 ring-stone-800'
                        : 'border border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {/* Color swatch */}
                    <div
                      className="w-8 h-8 rounded-full mb-2 flex-shrink-0"
                      style={{ backgroundColor: t.primaryHex }}
                    />
                    {/* Template name */}
                    <p className="font-cinzel text-xs tracking-wider text-stone-700 leading-tight mb-1">
                      {t.name}
                    </p>
                    {/* Category badge */}
                    {t.category && (
                      <span className="text-xs font-lato uppercase tracking-wider text-stone-400">
                        {CAT_DISPLAY[t.category] ?? t.category}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Palette picker */}
              {selectedPalettes.length > 0 && (
                <div>
                  <p className="font-cinzel text-xs tracking-widest text-stone-500 mb-3">COLOUR PALETTE</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedPalettes.map(p => (
                      <button
                        key={p.slug}
                        onClick={() => set('palette_slug', p.slug)}
                        className={`flex items-center gap-2 px-3 py-2 bg-white transition-all ${
                          form.palette_slug === p.slug
                            ? 'ring-2 ring-stone-700'
                            : 'border border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: p.primaryHex }}
                        />
                        <span className="font-lato text-xs text-stone-600">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected info bar */}
              <div className="border border-stone-200 bg-stone-50 p-4 font-lato text-sm text-stone-600">
                Selected: <strong className="font-cinzel">{selectedTheme?.name ?? form.theme_slug}</strong> theme
                {form.palette_slug && (
                  <span className="ml-2 text-stone-400">
                    · {selectedPalettes.find(p => p.slug === form.palette_slug)?.name}
                  </span>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-4">
                <button onClick={() => setStep(2)}
                  className="flex-1 border border-stone-300 text-stone-600 font-cinzel text-xs tracking-widest py-4 hover:bg-stone-100 transition-colors">
                  ← BACK
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 bg-stone-800 hover:bg-stone-900 disabled:opacity-60 text-white font-cinzel text-xs tracking-widest py-4 transition-colors"
                >
                  {saving ? 'CREATING...' : '✓ CREATE INVITATION'}
                </button>
              </div>
            </div>

            {/* Right: live phone preview — sticky */}
            <div className="sticky top-10 pt-2">
              <PhonePreview
                brideName={form.bride_name}
                groomName={form.groom_name}
                weddingDate={form.wedding_date}
                themeSlug={form.theme_slug}
                paletteSlug={form.palette_slug}
              />
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
