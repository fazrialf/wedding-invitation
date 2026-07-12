'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { getAllTemplates, themes } from '@/themes/config'
import { templatePalettes } from '@/themes/palettes'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconArrowRight, IconArrowLeft, IconPlus, IconTrash, IconPhone,
  IconMapPin, IconCalendar, IconClock, IconCheck,
} from '@tabler/icons-react'

const STEPS = ['Data Pasangan', 'Acara & Lokasi', 'Konten', 'Tema']
const CATEGORIES = [
  { slug: 'all', label: 'Semua' },
  { slug: 'minimalist', label: 'Minimalis' },
  { slug: 'floral', label: 'Floral' },
  { slug: 'nature', label: 'Alam' },
  { slug: 'fairytale', label: 'Dongeng' },
  { slug: 'adat', label: 'Adat' },
]

type TimelineItem = { time: string; title: string }

function getTheme() {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem('pelaminan-theme') || 'light'
}

const TK = {
  light: {
    page: 'bg-[#FAF7F2]',
    card: 'bg-white border border-[#E8DCC8]',
    heading: 'text-[#2C1A0E]',
    sub: 'text-[#6B3F2A]',
    muted: 'text-[#6B3F2A]/60',
    input: 'bg-white border border-[#E8DCC8] text-[#2C1A0E] focus:border-[#C8A96E] focus:outline-none placeholder:text-[#6B3F2A]/30',
    label: 'font-cinzel text-[10px] tracking-widest uppercase text-[#6B3F2A]',
    btnPrimary: 'bg-[#6B3F2A] hover:bg-[#2C1A0E] text-[#FAF7F2]',
    btnOutline: 'border border-[#C8A96E] text-[#6B3F2A] hover:bg-[#E8DCC8]',
    btnGhost: 'text-[#6B3F2A]/60 hover:text-[#6B3F2A] hover:bg-[#E8DCC8]/50',
    btnDanger: 'text-[#8B1A1A]/60 hover:text-[#8B1A1A] hover:bg-red-50',
    stepActive: 'bg-[#6B3F2A] text-white',
    stepDone: 'bg-[#E8DCC8] text-[#6B3F2A] cursor-pointer',
    stepPending: 'bg-white border border-[#E8DCC8] text-[#6B3F2A]/40',
    stepLineDone: 'bg-[#6B3F2A]',
    stepLine: 'bg-[#E8DCC8]',
    divider: 'border-[#E8DCC8]',
    toggleOn: 'bg-[#6B3F2A]',
    toggleOff: 'bg-[#E8DCC8]',
    tplSelected: 'border-2 border-[#6B3F2A] shadow-md',
    tplDefault: 'border-2 border-[#E8DCC8] hover:border-[#C8A96E]',
    catActive: 'bg-[#6B3F2A] text-white',
    catDefault: 'bg-white border border-[#E8DCC8] text-[#6B3F2A] hover:border-[#C8A96E]',
    infoBox: 'bg-[#E8DCC8]/40 border border-[#C8A96E]/30 text-[#6B3F2A]/80',
  },
  dark: {
    page: 'bg-[#1C0F07]',
    card: 'bg-[#3D2410] border border-[#4A2E18]',
    heading: 'text-[#E8DCC8]',
    sub: 'text-[#C8A96E]',
    muted: 'text-[#C8A96E]/50',
    input: 'bg-[#2C1A0E] border border-[#4A2E18] text-[#E8DCC8] focus:border-[#C8A96E] focus:outline-none placeholder:text-[#C8A96E]/30',
    label: 'font-cinzel text-[10px] tracking-widest uppercase text-[#C8A96E]',
    btnPrimary: 'bg-[#C8A96E] hover:bg-[#E8DCC8] text-[#2C1A0E]',
    btnOutline: 'border border-[#C8A96E]/50 text-[#C8A96E] hover:bg-[#6B3F2A]/20',
    btnGhost: 'text-[#C8A96E]/50 hover:text-[#C8A96E] hover:bg-[#4A2E18]',
    btnDanger: 'text-red-400/60 hover:text-red-400 hover:bg-red-900/20',
    stepActive: 'bg-[#C8A96E] text-[#2C1A0E]',
    stepDone: 'bg-[#4A2E18] text-[#C8A96E] cursor-pointer',
    stepPending: 'bg-[#3D2410] border border-[#4A2E18] text-[#C8A96E]/30',
    stepLineDone: 'bg-[#C8A96E]',
    stepLine: 'bg-[#4A2E18]',
    divider: 'border-[#4A2E18]',
    toggleOn: 'bg-[#C8A96E]',
    toggleOff: 'bg-[#4A2E18]',
    tplSelected: 'border-2 border-[#C8A96E] shadow-md',
    tplDefault: 'border-2 border-[#4A2E18] hover:border-[#C8A96E]',
    catActive: 'bg-[#C8A96E] text-[#2C1A0E]',
    catDefault: 'bg-[#3D2410] border border-[#4A2E18] text-[#C8A96E] hover:border-[#C8A96E]',
    infoBox: 'bg-[#4A2E18]/40 border border-[#C8A96E]/20 text-[#C8A96E]/70',
  },
}


function PhonePreview({ brideName, groomName, weddingDate, themeSlug, paletteSlug }: {
  brideName: string; groomName: string; weddingDate: string
  themeSlug: string; paletteSlug: string
}) {
  const t = themes[themeSlug] || themes['gold']
  const palettes = templatePalettes[themeSlug] || []
  const pal = palettes.find((p: any) => p.slug === paletteSlug)
  const primary = pal?.primaryHex || t.primaryHex || '#6B3F2A'
  const bg = pal?.bgPage || t.bgPage || '#FAF7F2'
  const dateStr = weddingDate ? new Date(weddingDate).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : 'Tanggal Pernikahan'

  return (
    <div className="flex flex-col items-center">
      <p className="font-cinzel text-[9px] tracking-widest uppercase text-[#6B3F2A]/60 mb-3">Pratinjau</p>
      <div className="relative w-[160px] h-[290px] rounded-[28px] border-[5px] border-stone-800 shadow-2xl overflow-hidden flex-shrink-0" style={{ background: bg }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-800 rounded-b-xl z-10" />
        <div className="w-full h-full flex flex-col items-center justify-center px-3 text-center gap-1">
          <div className="text-lg opacity-40" style={{ color: primary }}>{t.ornamentChar || '✦'}</div>
          <p className="font-cinzel text-[7px] tracking-widest uppercase opacity-50" style={{ color: primary }}>Undangan Pernikahan</p>
          <div className="w-8 border-t my-1 opacity-30" style={{ borderColor: primary }} />
          <p className="font-playfair text-[11px] font-semibold leading-tight" style={{ color: primary }}>
            {brideName || 'Nama Mempelai'}<br/>
            <span className="text-[8px] font-normal opacity-60">&</span><br/>
            {groomName || 'Nama Mempelai'}
          </p>
          <div className="w-8 border-t my-1 opacity-30" style={{ borderColor: primary }} />
          <p className="font-lato text-[7px] opacity-60" style={{ color: primary }}>{dateStr}</p>
          <div className="text-xs opacity-20 mt-1" style={{ color: primary }}>{t.ornamentChar || '✦'}</div>
        </div>
      </div>
    </div>
  )
}

export default function NewInvitationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [themeMode, setThemeMode] = useState<'light'|'dark'>('light')
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [catFilter, setCatFilter] = useState('all')

  // Step 1
  const [slug, setSlug] = useState('')
  const [brideName, setBrideName] = useState('')
  const [groomName, setGroomName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [contactNumber, setContactNumber] = useState('')

  // Step 2
  const [akadDate, setAkadDate] = useState('')
  const [akadTime, setAkadTime] = useState('')
  const [akadVenue, setAkadVenue] = useState('')
  const [receptionDate, setReceptionDate] = useState('')
  const [receptionTime, setReceptionTime] = useState('')
  const [receptionVenue, setReceptionVenue] = useState('')
  const [venueLat, setVenueLat] = useState('')
  const [venueLng, setVenueLng] = useState('')

  // Step 3
  const [showTimeline, setShowTimeline] = useState(false)
  const [timeline, setTimeline] = useState<TimelineItem[]>([{ time: '', title: '' }])

  // Step 4
  const [themeSlug, setThemeSlug] = useState('gold')
  const [paletteSlug, setPaletteSlug] = useState('')

  useEffect(() => {
    setThemeMode(getTheme() as 'light'|'dark')
    const handler = () => setThemeMode(getTheme() as 'light'|'dark')
    window.addEventListener('pelaminan-theme-change', handler)
    return () => window.removeEventListener('pelaminan-theme-change', handler)
  }, [])

  const tk = TK[themeMode]
  const allTemplates = getAllTemplates()
  const filtered = catFilter === 'all' ? allTemplates : allTemplates.filter((t: any) => t.category === catFilter)

  const goNext = () => { setDir(1); setStep(s => s + 1) }
  const goBack = () => { setDir(-1); setStep(s => s - 1) }
  const goTo = (n: number) => { if (n < step) { setDir(-1); setStep(n) } }

  const addTimelineItem = () => {
    if (timeline.length >= 10) return
    setTimeline(t => [...t, { time: '', title: '' }])
  }
  const removeTimelineItem = (i: number) => setTimeline(t => t.filter((_, idx) => idx !== i))
  const updateTimelineItem = (i: number, field: 'time'|'title', val: string) =>
    setTimeline(t => t.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  const handleSubmit = async () => {
    if (!slug || !brideName || !groomName || !weddingDate) {
      toast.error('Lengkapi data pasangan terlebih dahulu')
      return
    }
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations`, {
        slug,
        bride_full_name: brideName,
        groom_full_name: groomName,
        wedding_date: weddingDate,
        contact_number: contactNumber,
        akad_date: akadDate || null,
        akad_time: akadTime || null,
        akad_venue: akadVenue || null,
        reception_date: receptionDate || null,
        reception_time: receptionTime || null,
        reception_venue: receptionVenue || null,
        venue_lat: venueLat ? parseFloat(venueLat) : null,
        venue_lng: venueLng ? parseFloat(venueLng) : null,
        timeline: showTimeline ? timeline.filter(t => t.title) : null,
        theme_slug: themeSlug,
        palette_slug: paletteSlug || null,
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Undangan berhasil dibuat!')
      router.push('/dashboard/invitations')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membuat undangan')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !user) return null


  const variants = {
    enter: (d: number) => ({ x: d * 40, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.28 } },
    exit: (d: number) => ({ x: -d * 40, opacity: 0, transition: { duration: 0.2 } }),
  }

  return (
    <div className={`min-h-screen ${tk.page} transition-colors duration-300`}>
      <Toaster position="top-right" />
      <DashboardSidebar />
      <div className="lg:pl-64 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className={`font-playfair text-2xl font-bold ${tk.heading}`}>Buat Undangan Baru</h1>
            <p className={`font-lato text-sm mt-1 ${tk.muted}`}>Isi detail pernikahan selangkah demi selangkah</p>
          </div>
          <div className="flex items-center mb-8">
            {STEPS.map((label, i) => {
              const n = i + 1
              const isDone = step > n
              const isActive = step === n
              return (
                <div key={n} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => isDone ? goTo(n) : undefined}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isActive ? tk.stepActive : isDone ? tk.stepDone : tk.stepPending}`}>
                      {isDone ? <IconCheck size={14} /> : n}
                    </button>
                    <span className={`font-cinzel text-[8px] tracking-wide whitespace-nowrap ${isActive ? tk.sub : tk.muted}`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-[2px] mx-2 mb-4 transition-all ${step > n ? tk.stepLineDone : tk.stepLine}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              {step === 1 && (
                <motion.div key="s1" custom={dir} variants={variants} initial="enter" animate="center" exit="exit">
                  <div className={`rounded-2xl p-6 ${tk.card}`}>
                    <h2 className={`font-playfair text-lg font-semibold mb-5 ${tk.heading}`}>Data Pasangan</h2>
                    <div className="space-y-4">
                      <div>
                        <label className={`block mb-1 ${tk.label}`}>Slug URL *</label>
                        <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))}
                          placeholder="contoh: budi-dan-sari" className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${tk.input}`} />
                        <p className={`text-[11px] mt-1 ${tk.muted}`}>URL: <strong>{slug || 'slug-anda'}</strong></p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block mb-1 ${tk.label}`}>Nama Mempelai Wanita *</label>
                          <input value={brideName} onChange={e => setBrideName(e.target.value)}
                            placeholder="Nama lengkap" className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${tk.input}`} />
                        </div>
                        <div>
                          <label className={`block mb-1 ${tk.label}`}>Nama Mempelai Pria *</label>
                          <input value={groomName} onChange={e => setGroomName(e.target.value)}
                            placeholder="Nama lengkap" className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${tk.input}`} />
                        </div>
                      </div>
                      <div>
                        <label className={`block mb-1 ${tk.label}`}>Tanggal Pernikahan *</label>
                        <input type="date" value={weddingDate} onChange={e => setWeddingDate(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${tk.input}`} />
                      </div>
                      <div>
                        <label className={`block mb-1 ${tk.label}`}>Nomor Kontak</label>
                        <input value={contactNumber} onChange={e => setContactNumber(e.target.value)}
                          placeholder="+62812xxxx" className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${tk.input}`} />
                        <p className={`text-[11px] mt-1 ${tk.muted}`}>Ditampilkan di undangan untuk konfirmasi tamu</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <button onClick={goNext} disabled={!slug||!brideName||!groomName||!weddingDate}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${tk.btnPrimary}`}>
                        Selanjutnya <IconArrowRight size={16}/>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s2" custom={dir} variants={variants} initial="enter" animate="center" exit="exit">
                  <div className={`rounded-2xl p-6 ${tk.card}`}>
                    <h2 className={`font-playfair text-lg font-semibold mb-5 ${tk.heading}`}>Acara & Lokasi</h2>
                    <div className="space-y-4">
                      <p className={`font-cinzel text-[10px] tracking-widest uppercase ${tk.sub}`}>Akad Nikah</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block mb-1 ${tk.label}`}>Tanggal Akad</label>
                          <input type="date" value={akadDate} onChange={e => setAkadDate(e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                        </div>
                        <div>
                          <label className={`block mb-1 ${tk.label}`}>Waktu Akad</label>
                          <input type="time" value={akadTime} onChange={e => setAkadTime(e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                        </div>
                      </div>
                      <div>
                        <label className={`block mb-1 ${tk.label}`}>Lokasi Akad</label>
                        <input value={akadVenue} onChange={e => setAkadVenue(e.target.value)} placeholder="Nama gedung / masjid" className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                      </div>
                      <hr className={`border-t ${tk.divider}`}/>
                      <p className={`font-cinzel text-[10px] tracking-widest uppercase ${tk.sub}`}>Resepsi</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block mb-1 ${tk.label}`}>Tanggal Resepsi</label>
                          <input type="date" value={receptionDate} onChange={e => setReceptionDate(e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                        </div>
                        <div>
                          <label className={`block mb-1 ${tk.label}`}>Waktu Resepsi</label>
                          <input type="time" value={receptionTime} onChange={e => setReceptionTime(e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                        </div>
                      </div>
                      <div>
                        <label className={`block mb-1 ${tk.label}`}>Lokasi Resepsi</label>
                        <input value={receptionVenue} onChange={e => setReceptionVenue(e.target.value)} placeholder="Nama gedung / ballroom" className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                      </div>
                      <hr className={`border-t ${tk.divider}`}/>
                      <p className={`font-cinzel text-[10px] tracking-widest uppercase ${tk.sub}`}>Koordinat Maps (opsional)</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block mb-1 ${tk.label}`}>Latitude</label>
                          <input value={venueLat} onChange={e => setVenueLat(e.target.value)} placeholder="-6.200000" className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                        </div>
                        <div>
                          <label className={`block mb-1 ${tk.label}`}>Longitude</label>
                          <input value={venueLng} onChange={e => setVenueLng(e.target.value)} placeholder="106.816666" className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <button onClick={goBack} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tk.btnOutline}`}><IconArrowLeft size={16}/>Kembali</button>
                      <button onClick={goNext} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${tk.btnPrimary}`}>Selanjutnya<IconArrowRight size={16}/></button>
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="s3" custom={dir} variants={variants} initial="enter" animate="center" exit="exit">
                  <div className={`rounded-2xl p-6 ${tk.card}`}>
                    <h2 className={`font-playfair text-lg font-semibold mb-5 ${tk.heading}`}>Konten Tambahan</h2>
                    <div className={`rounded-xl border p-4 mb-4 ${tk.card}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className={`font-playfair text-sm font-semibold ${tk.heading}`}>Timeline / Rundown</p>
                          <p className={`text-[11px] ${tk.muted}`}>Tampilkan susunan acara di undangan</p>
                        </div>
                        <button onClick={() => setShowTimeline(v => !v)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${showTimeline ? tk.toggleOn : tk.toggleOff}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${showTimeline ? 'left-5' : 'left-0.5'}`}/>
                        </button>
                      </div>
                      <AnimatePresence>
                        {showTimeline && (
                          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                            <div className="mt-3 space-y-2">
                              {timeline.map((item, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                  <input value={item.time} onChange={e => updateTimelineItem(i,'time',e.target.value)}
                                    placeholder="08.00" className={`w-20 px-2 py-1.5 rounded-lg text-xs ${tk.input}`}/>
                                  <input value={item.title} onChange={e => updateTimelineItem(i,'title',e.target.value)}
                                    placeholder="Akad Nikah" className={`flex-1 px-2 py-1.5 rounded-lg text-xs ${tk.input}`}/>
                                  <button onClick={() => removeTimelineItem(i)} className={`p-1.5 rounded-lg transition-colors ${tk.btnDanger}`}>
                                    <IconTrash size={14}/>
                                  </button>
                                </div>
                              ))}
                              {timeline.length < 10 && (
                                <button onClick={addTimelineItem} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${tk.btnGhost}`}>
                                  <IconPlus size={13}/>Tambah Item
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className={`rounded-xl p-4 text-xs ${tk.infoBox}`}>
                      Transfer bank dapat ditambahkan setelah undangan dibuat, di halaman <strong>Edit Undangan</strong>.
                    </div>
                    <div className="flex justify-between mt-6">
                      <button onClick={goBack} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tk.btnOutline}`}><IconArrowLeft size={16}/>Kembali</button>
                      <button onClick={goNext} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${tk.btnPrimary}`}>Selanjutnya<IconArrowRight size={16}/></button>
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="s4" custom={dir} variants={variants} initial="enter" animate="center" exit="exit">
                  <div className="flex gap-6">
                    <div className={`flex-1 rounded-2xl p-6 ${tk.card}`}>
                      <h2 className={`font-playfair text-lg font-semibold mb-4 ${tk.heading}`}>Pilih Tema</h2>
                      <div className="flex gap-2 flex-wrap mb-4">
                        {CATEGORIES.map(c => (
                          <button key={c.slug} onClick={() => setCatFilter(c.slug)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${catFilter===c.slug ? tk.catActive : tk.catDefault}`}>
                            {c.label}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                        {filtered.map((t: any) => {
                          const pal = (templatePalettes[t.slug]||[])[0]
                          const bg = pal?.bgPage || t.bgPage || '#FAF7F2'
                          const primary = pal?.primaryHex || t.primaryHex || '#6B3F2A'
                          return (
                            <button key={t.slug} onClick={() => { setThemeSlug(t.slug); setPaletteSlug('') }}
                              className={`rounded-xl overflow-hidden transition-all ${themeSlug===t.slug ? tk.tplSelected : tk.tplDefault}`}>
                              <div className="h-16 flex flex-col items-center justify-center gap-1" style={{background:bg}}>
                                <span className="text-base opacity-60" style={{color:primary}}>{t.ornamentChar||'*'}</span>
                                <div className="flex gap-0.5">
                                  {(templatePalettes[t.slug]||[]).slice(0,4).map((p:any,pi:number) => (
                                    <div key={pi} className="w-2 h-2 rounded-full" style={{background:p.primaryHex}}/>
                                  ))}
                                </div>
                              </div>
                              <p className={`text-[9px] font-cinzel tracking-wide px-1 py-1 text-center truncate ${tk.muted}`}>{t.name}</p>
                            </button>
                          )
                        })}
                      </div>
                      {(templatePalettes[themeSlug]||[]).length > 0 && (
                        <div className="mt-4">
                          <label className={`block mb-2 ${tk.label}`}>Pilih Palet Warna</label>
                          <div className="flex gap-2 flex-wrap">
                            {templatePalettes[themeSlug].map((p: any) => (
                              <button key={p.slug} onClick={() => setPaletteSlug(p.slug)} title={p.name}
                                className={`w-7 h-7 rounded-full border-2 transition-all ${paletteSlug===p.slug ? 'border-[#6B3F2A] scale-110' : 'border-transparent hover:scale-105'}`}
                                style={{background:p.primaryHex}}/>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between mt-6">
                        <button onClick={goBack} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${tk.btnOutline}`}><IconArrowLeft size={16}/>Kembali</button>
                        <button onClick={handleSubmit} disabled={submitting}
                          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${tk.btnPrimary}`}>
                          {submitting ? 'Menyimpan...' : 'Buat Undangan'}<IconCheck size={16}/>
                        </button>
                      </div>
                    </div>
                    <div className="hidden lg:block flex-shrink-0 pt-4">
                      <PhonePreview brideName={brideName} groomName={groomName} weddingDate={weddingDate} themeSlug={themeSlug} paletteSlug={paletteSlug}/>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
