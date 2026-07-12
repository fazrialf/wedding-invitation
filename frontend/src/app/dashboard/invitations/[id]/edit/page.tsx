'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { themes, getAllTemplates } from '@/themes/config'
import { templatePalettes } from '@/themes/palettes'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconDeviceFloppy, IconEye, IconSend, IconBan,
  IconPhoto, IconMusic, IconPlus, IconTrash, IconPhone,
  IconMapPin, IconCalendar, IconClock, IconCopy, IconCheck,
  IconBrandWhatsapp, IconCreditCard,
} from '@tabler/icons-react'

type Tab = 'detail' | 'acara' | 'konten' | 'desain' | 'bagikan'
type TimelineItem = { time: string; title: string }
type BankAccount = { bank: string; number: string; name: string }

const TABS: { key: Tab; label: string }[] = [
  { key: 'detail',   label: 'Detail' },
  { key: 'acara',    label: 'Acara' },
  { key: 'konten',   label: 'Konten' },
  { key: 'desain',   label: 'Desain' },
  { key: 'bagikan',  label: 'Bagikan' },
]
const CATEGORIES = [
  { slug: 'all', label: 'Semua' },
  { slug: 'minimalist', label: 'Minimalis' },
  { slug: 'floral', label: 'Floral' },
  { slug: 'nature', label: 'Alam' },
  { slug: 'fairytale', label: 'Dongeng' },
  { slug: 'adat', label: 'Adat' },
]

function getTheme() {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem('pelaminan-theme') || 'light'
}

const TK = {
  light: {
    page: 'bg-[#FAF7F2]', card: 'bg-white border border-[#E8DCC8]',
    heading: 'text-[#2C1A0E]', sub: 'text-[#6B3F2A]', muted: 'text-[#6B3F2A]/60',
    input: 'bg-white border border-[#E8DCC8] text-[#2C1A0E] focus:border-[#C8A96E] focus:outline-none placeholder:text-[#6B3F2A]/30',
    label: 'font-cinzel text-[10px] tracking-widest uppercase text-[#6B3F2A]',
    btnPrimary: 'bg-[#6B3F2A] hover:bg-[#2C1A0E] text-[#FAF7F2]',
    btnOutline: 'border border-[#C8A96E] text-[#6B3F2A] hover:bg-[#E8DCC8]',
    btnGhost: 'text-[#6B3F2A]/60 hover:text-[#6B3F2A] hover:bg-[#E8DCC8]/50',
    btnDanger: 'text-[#8B1A1A]/60 hover:text-[#8B1A1A] hover:bg-red-50',
    btnGreen: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    btnRed: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
    tabActive: 'border-b-2 border-[#6B3F2A] text-[#2C1A0E]',
    tabDefault: 'border-b-2 border-transparent text-[#6B3F2A]/50 hover:text-[#6B3F2A]',
    divider: 'border-[#E8DCC8]', toggleOn: 'bg-[#6B3F2A]', toggleOff: 'bg-[#E8DCC8]',
    tplSelected: 'border-2 border-[#6B3F2A] shadow-md', tplDefault: 'border-2 border-[#E8DCC8] hover:border-[#C8A96E]',
    catActive: 'bg-[#6B3F2A] text-white', catDefault: 'bg-white border border-[#E8DCC8] text-[#6B3F2A] hover:border-[#C8A96E]',
    infoBox: 'bg-[#E8DCC8]/40 border border-[#C8A96E]/30 text-[#6B3F2A]/80',
    badge: 'bg-emerald-100 text-emerald-700', badgeDraft: 'bg-[#E8DCC8] text-[#6B3F2A]',
  },
  dark: {
    page: 'bg-[#1C0F07]', card: 'bg-[#3D2410] border border-[#4A2E18]',
    heading: 'text-[#E8DCC8]', sub: 'text-[#C8A96E]', muted: 'text-[#C8A96E]/50',
    input: 'bg-[#2C1A0E] border border-[#4A2E18] text-[#E8DCC8] focus:border-[#C8A96E] focus:outline-none placeholder:text-[#C8A96E]/30',
    label: 'font-cinzel text-[10px] tracking-widest uppercase text-[#C8A96E]',
    btnPrimary: 'bg-[#C8A96E] hover:bg-[#E8DCC8] text-[#2C1A0E]',
    btnOutline: 'border border-[#C8A96E]/50 text-[#C8A96E] hover:bg-[#6B3F2A]/20',
    btnGhost: 'text-[#C8A96E]/50 hover:text-[#C8A96E] hover:bg-[#4A2E18]',
    btnDanger: 'text-red-400/60 hover:text-red-400 hover:bg-red-900/20',
    btnGreen: 'bg-emerald-700 hover:bg-emerald-600 text-white',
    btnRed: 'bg-red-900/30 text-red-400 border border-red-800 hover:bg-red-900/50',
    tabActive: 'border-b-2 border-[#C8A96E] text-[#E8DCC8]',
    tabDefault: 'border-b-2 border-transparent text-[#C8A96E]/40 hover:text-[#C8A96E]',
    divider: 'border-[#4A2E18]', toggleOn: 'bg-[#C8A96E]', toggleOff: 'bg-[#4A2E18]',
    tplSelected: 'border-2 border-[#C8A96E] shadow-md', tplDefault: 'border-2 border-[#4A2E18] hover:border-[#C8A96E]',
    catActive: 'bg-[#C8A96E] text-[#2C1A0E]', catDefault: 'bg-[#3D2410] border border-[#4A2E18] text-[#C8A96E] hover:border-[#C8A96E]',
    infoBox: 'bg-[#4A2E18]/40 border border-[#C8A96E]/20 text-[#C8A96E]/70',
    badge: 'bg-emerald-900/40 text-emerald-400', badgeDraft: 'bg-[#4A2E18] text-[#C8A96E]',
  },
}


export default function EditInvitationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [inv, setInv] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [uploading, setUploading] = useState<'photo'|'music'|null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('detail')
  const [catFilter, setCatFilter] = useState('all')
  const [themeMode, setThemeMode] = useState<'light'|'dark'>('light')
  const [copied, setCopied] = useState(false)

  // Konten state
  const [showTimeline, setShowTimeline] = useState(false)
  const [timeline, setTimeline] = useState<TimelineItem[]>([{ time: '', title: '' }])
  const [showBank, setShowBank] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([{ bank: '', number: '', name: '' }])

  useEffect(() => {
    setThemeMode(getTheme() as 'light'|'dark')
    const handler = () => setThemeMode(getTheme() as 'light'|'dark')
    window.addEventListener('pelaminan-theme-change', handler)
    return () => window.removeEventListener('pelaminan-theme-change', handler)
  }, [])

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user || !id) return
    const token = localStorage.getItem('token')
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations/by-id/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => {
      setInv(r.data)
      if (r.data.timeline) { setShowTimeline(true); setTimeline(r.data.timeline) }
      if (r.data.gift_accounts?.length) { setShowBank(true); setBankAccounts(r.data.gift_accounts) }
    }).catch(() => toast.error('Gagal memuat undangan'))
  }, [user, id])

  const tk = TK[themeMode]
  const set = (k: string, v: any) => setInv((f: any) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${id}`, {
        ...inv,
        timeline: showTimeline ? timeline.filter(t => t.title) : null,
        gift_accounts: showBank ? bankAccounts.filter(b => b.bank) : null,
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Berhasil disimpan!')
    } catch { toast.error('Gagal menyimpan') }
    finally { setSaving(false) }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${id}`,
        { is_published: !inv.is_published },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setInv((f: any) => ({ ...f, is_published: !f.is_published }))
      toast.success(inv.is_published ? 'Undangan disembunyikan' : 'Undangan dipublikasikan!')
    } catch { toast.error('Gagal mengubah status') }
    finally { setPublishing(false) }
  }

  const handleUpload = async (file: File, type: 'photo'|'music') => {
    setUploading(type)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads/${type}`, fd,
        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } })
      set(type === 'photo' ? 'cover_photo_url' : 'music_url', res.data.url)
      toast.success(type === 'photo' ? 'Foto berhasil diunggah!' : 'Musik berhasil diunggah!')
    } catch { toast.error('Gagal mengunggah') }
    finally { setUploading(null) }
  }

  const addTimeline = () => { if (timeline.length < 10) setTimeline(t => [...t, { time: '', title: '' }]) }
  const removeTimeline = (i: number) => setTimeline(t => t.filter((_, idx) => idx !== i))
  const updateTimeline = (i: number, field: 'time'|'title', val: string) =>
    setTimeline(t => t.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  const addBank = () => { if (bankAccounts.length < 5) setBankAccounts(b => [...b, { bank: '', number: '', name: '' }]) }
  const removeBank = (i: number) => setBankAccounts(b => b.filter((_, idx) => idx !== i))
  const updateBank = (i: number, field: 'bank'|'number'|'name', val: string) =>
    setBankAccounts(b => b.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  const copyLink = () => {
    const url = `${window.location.origin}/${inv?.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const allTemplates = getAllTemplates()
  const filtered = catFilter === 'all' ? allTemplates : allTemplates.filter((t: any) => t.category === catFilter)

  if (loading || !user || !inv) return (
    <div className={`flex min-h-screen ${themeMode === 'dark' ? 'bg-[#1C0F07]' : 'bg-[#FAF7F2]'}`}>
      <DashboardSidebar />
      <main className="flex-1 flex items-center justify-center">
        <p className="font-lato text-[#6B3F2A]/40 animate-pulse">Memuat undangan...</p>
      </main>
    </div>
  )

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${inv.slug}`


  return (
    <div className={`min-h-screen ${tk.page} transition-colors duration-300`}>
      <Toaster position="top-right" />
      <DashboardSidebar />
      <div className="lg:pl-64 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className={`font-cinzel text-[10px] tracking-widest uppercase ${tk.muted}`}>Edit Undangan</p>
              <h1 className={`font-playfair text-2xl font-bold ${tk.heading}`}>
                {inv.bride_full_name || inv.bride_name} &amp; {inv.groom_full_name || inv.groom_name}
              </h1>
              <span className={`inline-block mt-1 text-[10px] font-cinzel tracking-widest px-2 py-0.5 rounded-full ${inv.is_published ? tk.badge : tk.badgeDraft}`}>
                {inv.is_published ? 'DIPUBLIKASI' : 'DRAFT'}
              </span>
            </div>
            <div className="flex gap-2">
              <a href={`/${inv.slug}`} target="_blank"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-cinzel tracking-widest transition-all ${tk.btnOutline}`}>
                <IconEye size={14}/>Lihat
              </a>
              <button onClick={handleSave} disabled={saving}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-cinzel tracking-widest transition-all disabled:opacity-50 ${tk.btnPrimary}`}>
                <IconDeviceFloppy size={14}/>{saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button onClick={handlePublish} disabled={publishing}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-cinzel tracking-widest transition-all disabled:opacity-50 ${inv.is_published ? tk.btnRed : tk.btnGreen}`}>
                {inv.is_published ? <><IconBan size={14}/>Sembunyikan</> : <><IconSend size={14}/>Publikasi</>}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex gap-0 mb-6 border-b ${tk.divider}`}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`font-cinzel text-[10px] tracking-widest px-5 py-3 transition-colors -mb-px ${activeTab===tab.key ? tk.tabActive : tk.tabDefault}`}>
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab: Detail */}
          {activeTab === 'detail' && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
              <div className={`rounded-2xl p-6 ${tk.card}`}>
                <h2 className={`font-playfair text-base font-semibold mb-4 ${tk.heading}`}>Data Pasangan</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-1 ${tk.label}`}>Nama Mempelai Wanita</label>
                    <input value={inv.bride_full_name||''} onChange={e=>set('bride_full_name',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                  <div>
                    <label className={`block mb-1 ${tk.label}`}>Nama Mempelai Pria</label>
                    <input value={inv.groom_full_name||''} onChange={e=>set('groom_full_name',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                  <div>
                    <label className={`block mb-1 ${tk.label}`}>Ayah Mempelai Wanita</label>
                    <input value={inv.bride_father||''} onChange={e=>set('bride_father',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                  <div>
                    <label className={`block mb-1 ${tk.label}`}>Ibu Mempelai Wanita</label>
                    <input value={inv.bride_mother||''} onChange={e=>set('bride_mother',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                  <div>
                    <label className={`block mb-1 ${tk.label}`}>Ayah Mempelai Pria</label>
                    <input value={inv.groom_father||''} onChange={e=>set('groom_father',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                  <div>
                    <label className={`block mb-1 ${tk.label}`}>Ibu Mempelai Pria</label>
                    <input value={inv.groom_mother||''} onChange={e=>set('groom_mother',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                </div>
                <div className="mt-4">
                  <label className={`block mb-1 ${tk.label}`}><IconPhone size={10} className="inline mr-1"/>Nomor Kontak</label>
                  <input value={inv.contact_number||''} onChange={e=>set('contact_number',e.target.value)} placeholder="+62812xxxx" className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  <p className={`text-[11px] mt-1 ${tk.muted}`}>Ditampilkan di undangan untuk konfirmasi tamu</p>
                </div>
                <div className="mt-4">
                  <label className={`block mb-1 ${tk.label}`}>Bio Mempelai Wanita</label>
                  <textarea value={inv.bride_bio||''} onChange={e=>set('bride_bio',e.target.value)} rows={2} className={`w-full px-3 py-2 rounded-lg text-sm resize-none ${tk.input}`}/>
                </div>
                <div className="mt-4">
                  <label className={`block mb-1 ${tk.label}`}>Bio Mempelai Pria</label>
                  <textarea value={inv.groom_bio||''} onChange={e=>set('groom_bio',e.target.value)} rows={2} className={`w-full px-3 py-2 rounded-lg text-sm resize-none ${tk.input}`}/>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: Acara */}
          {activeTab === 'acara' && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
              <div className={`rounded-2xl p-6 ${tk.card}`}>
                <h2 className={`font-playfair text-base font-semibold mb-4 ${tk.heading}`}>Acara & Lokasi</h2>
                <p className={`font-cinzel text-[10px] tracking-widest uppercase mb-3 ${tk.sub}`}>Akad Nikah</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={`block mb-1 ${tk.label}`}><IconCalendar size={10} className="inline mr-1"/>Tanggal</label>
                    <input type="date" value={inv.akad_date?.split('T')[0]||''} onChange={e=>set('akad_date',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                  <div>
                    <label className={`block mb-1 ${tk.label}`}><IconClock size={10} className="inline mr-1"/>Waktu</label>
                    <input type="time" value={inv.akad_time||''} onChange={e=>set('akad_time',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                </div>
                <div className="mb-4">
                  <label className={`block mb-1 ${tk.label}`}>Lokasi Akad</label>
                  <input value={inv.akad_venue||''} onChange={e=>set('akad_venue',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                </div>
                <hr className={`border-t ${tk.divider} mb-4`}/>
                <p className={`font-cinzel text-[10px] tracking-widest uppercase mb-3 ${tk.sub}`}>Resepsi</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={`block mb-1 ${tk.label}`}><IconCalendar size={10} className="inline mr-1"/>Tanggal</label>
                    <input type="date" value={inv.reception_date?.split('T')[0]||''} onChange={e=>set('reception_date',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                  <div>
                    <label className={`block mb-1 ${tk.label}`}><IconClock size={10} className="inline mr-1"/>Waktu</label>
                    <input type="time" value={inv.reception_time||''} onChange={e=>set('reception_time',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                </div>
                <div className="mb-4">
                  <label className={`block mb-1 ${tk.label}`}>Lokasi Resepsi</label>
                  <input value={inv.reception_venue||''} onChange={e=>set('reception_venue',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                </div>
                <hr className={`border-t ${tk.divider} mb-4`}/>
                <p className={`font-cinzel text-[10px] tracking-widest uppercase mb-3 ${tk.sub}`}><IconMapPin size={10} className="inline mr-1"/>Koordinat Maps</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block mb-1 ${tk.label}`}>Latitude</label>
                    <input value={inv.venue_lat||''} onChange={e=>set('venue_lat',e.target.value)} placeholder="-6.200000" className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                  <div>
                    <label className={`block mb-1 ${tk.label}`}>Longitude</label>
                    <input value={inv.venue_lng||''} onChange={e=>set('venue_lng',e.target.value)} placeholder="106.816666" className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                  </div>
                </div>
                <div className="mt-4">
                  <label className={`block mb-1 ${tk.label}`}><IconCalendar size={10} className="inline mr-1"/>Tanggal Pernikahan</label>
                  <input type="date" value={inv.wedding_date?.split('T')[0]||''} onChange={e=>set('wedding_date',e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm ${tk.input}`}/>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: Konten */}
          {activeTab === 'konten' && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
              {/* Timeline */}
              <div className={`rounded-2xl p-5 ${tk.card}`}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className={`font-playfair text-sm font-semibold ${tk.heading}`}>Timeline / Rundown</p>
                    <p className={`text-[11px] ${tk.muted}`}>Susunan acara yang ditampilkan di undangan</p>
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
                            <input value={item.time} onChange={e=>updateTimeline(i,'time',e.target.value)}
                              placeholder="08.00" className={`w-20 px-2 py-1.5 rounded-lg text-xs ${tk.input}`}/>
                            <input value={item.title} onChange={e=>updateTimeline(i,'title',e.target.value)}
                              placeholder="Akad Nikah" className={`flex-1 px-2 py-1.5 rounded-lg text-xs ${tk.input}`}/>
                            <button onClick={()=>removeTimeline(i)} className={`p-1.5 rounded-lg ${tk.btnDanger}`}><IconTrash size={14}/></button>
                          </div>
                        ))}
                        {timeline.length < 10 && (
                          <button onClick={addTimeline} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg ${tk.btnGhost}`}>
                            <IconPlus size={13}/>Tambah Item
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bank Transfer */}
              <div className={`rounded-2xl p-5 ${tk.card}`}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className={`font-playfair text-sm font-semibold ${tk.heading}`}><IconCreditCard size={14} className="inline mr-1"/>Transfer Bank / Hadiah</p>
                    <p className={`text-[11px] ${tk.muted}`}>Tampilkan rekening untuk amplop digital</p>
                  </div>
                  <button onClick={() => setShowBank(v => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${showBank ? tk.toggleOn : tk.toggleOff}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${showBank ? 'left-5' : 'left-0.5'}`}/>
                  </button>
                </div>
                <AnimatePresence>
                  {showBank && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                      <div className="mt-3 space-y-3">
                        {bankAccounts.map((acct, i) => (
                          <div key={i} className={`p-3 rounded-xl border ${tk.divider} space-y-2`}>
                            <div className="flex justify-between items-center">
                              <p className={`text-[10px] font-cinzel tracking-widest ${tk.muted}`}>Rekening {i+1}</p>
                              <button onClick={()=>removeBank(i)} className={`p-1 rounded ${tk.btnDanger}`}><IconTrash size={12}/></button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className={`block mb-1 ${tk.label}`}>Bank</label>
                                <input value={acct.bank} onChange={e=>updateBank(i,'bank',e.target.value)} placeholder="BCA" className={`w-full px-2 py-1.5 rounded-lg text-xs ${tk.input}`}/>
                              </div>
                              <div>
                                <label className={`block mb-1 ${tk.label}`}>No. Rekening</label>
                                <input value={acct.number} onChange={e=>updateBank(i,'number',e.target.value)} placeholder="1234567890" className={`w-full px-2 py-1.5 rounded-lg text-xs ${tk.input}`}/>
                              </div>
                              <div>
                                <label className={`block mb-1 ${tk.label}`}>Nama</label>
                                <input value={acct.name} onChange={e=>updateBank(i,'name',e.target.value)} placeholder="Nama pemilik" className={`w-full px-2 py-1.5 rounded-lg text-xs ${tk.input}`}/>
                              </div>
                            </div>
                          </div>
                        ))}
                        {bankAccounts.length < 5 && (
                          <button onClick={addBank} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg ${tk.btnGhost}`}>
                            <IconPlus size={13}/>Tambah Rekening
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Media */}
              <div className={`rounded-2xl p-5 ${tk.card}`}>
                <h2 className={`font-playfair text-sm font-semibold mb-4 ${tk.heading}`}>Media</h2>
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-2 ${tk.label}`}><IconPhoto size={10} className="inline mr-1"/>Foto Sampul</label>
                    {inv.cover_photo_url && <img src={inv.cover_photo_url} alt="cover" className="w-full h-32 object-cover rounded-xl mb-2"/>}
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs cursor-pointer transition-all w-fit ${tk.btnOutline}`}>
                      <IconPhoto size={14}/>{uploading==='photo' ? 'Mengunggah...' : 'Unggah Foto'}
                      <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files?.[0]) handleUpload(e.target.files[0],'photo') }}/>
                    </label>
                  </div>
                  <div>
                    <label className={`block mb-2 ${tk.label}`}><IconMusic size={10} className="inline mr-1"/>Musik Latar</label>
                    {inv.music_url && <p className={`text-xs mb-2 ${tk.muted}`}>{inv.music_url.split('/').pop()}</p>}
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs cursor-pointer transition-all w-fit ${tk.btnOutline}`}>
                      <IconMusic size={14}/>{uploading==='music' ? 'Mengunggah...' : 'Unggah Musik'}
                      <input type="file" accept="audio/*" className="hidden" onChange={e => { if(e.target.files?.[0]) handleUpload(e.target.files[0],'music') }}/>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: Desain */}
          {activeTab === 'desain' && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
              <div className={`rounded-2xl p-6 ${tk.card}`}>
                <h2 className={`font-playfair text-base font-semibold mb-4 ${tk.heading}`}>Tema & Desain</h2>
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
                    const isSelected = inv.theme_slug === t.slug
                    return (
                      <button key={t.slug} onClick={() => { set('theme_slug', t.slug); set('palette_slug', '') }}
                        className={`rounded-xl overflow-hidden transition-all ${isSelected ? tk.tplSelected : tk.tplDefault}`}>
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
                {(templatePalettes[inv.theme_slug]||[]).length > 0 && (
                  <div className="mt-4">
                    <label className={`block mb-2 ${tk.label}`}>Pilih Palet Warna</label>
                    <div className="flex gap-2 flex-wrap">
                      {templatePalettes[inv.theme_slug].map((p: any) => (
                        <button key={p.slug} onClick={() => set('palette_slug', p.slug)} title={p.name}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${inv.palette_slug===p.slug ? 'border-[#6B3F2A] scale-110' : 'border-transparent hover:scale-105'}`}
                          style={{background:p.primaryHex}}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab: Bagikan */}
          {activeTab === 'bagikan' && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
              <div className={`rounded-2xl p-6 ${tk.card}`}>
                <h2 className={`font-playfair text-base font-semibold mb-4 ${tk.heading}`}>Bagikan Undangan</h2>
                <div className={`flex items-center gap-2 p-3 rounded-xl border ${tk.divider} mb-4`}>
                  <span className={`flex-1 text-sm font-mono truncate ${tk.muted}`}>{shareUrl}</span>
                  <button onClick={copyLink} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all ${tk.btnOutline}`}>
                    {copied ? <><IconCheck size={13}/>Disalin!</> : <><IconCopy size={13}/>Salin</>}
                  </button>
                </div>
                <a href={`https://wa.me/?text=Kami%20mengundang%20Anda%20ke%20pernikahan%20kami.%20Lihat%20undangan%20di%3A%20${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all w-fit ${tk.btnGreen}`}>
                  <IconBrandWhatsapp size={16}/>Bagikan via WhatsApp
                </a>
                <div className={`mt-4 p-4 rounded-xl ${tk.infoBox} text-xs`}>
                  Status: <strong>{inv.is_published ? 'Dipublikasikan — tamu dapat mengakses undangan' : 'Draft — hanya Anda yang dapat melihat'}</strong>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
