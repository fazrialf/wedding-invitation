'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function EditInvitationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [inv, setInv] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [uploading, setUploading] = useState<'photo'|'music'|null>(null)
  const [activeTab, setActiveTab] = useState<'details'|'media'|'share'>('details')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user || !id) return
    axios.get(`/api/invitations/by-id/${id}`)
      .then(r => setInv(r.data))
      .catch(() => toast.error('Failed to load invitation'))
  }, [user, id])

  const set = (k: string, v: any) => setInv((f: any) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.put(`/api/invitations/${id}`, inv)
      toast.success('Saved successfully!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await axios.put(`/api/invitations/${id}`, {
        is_published: !inv.is_published
      })
      setInv((f: any) => ({ ...f, is_published: !f.is_published }))
      toast.success(inv.is_published ? 'Unpublished' : 'Published! 🎉')
    } catch {
      toast.error('Failed to update status')
    } finally {
      setPublishing(false)
    }
  }

  const handleUpload = async (file: File, type: 'photo' | 'music') => {
    setUploading(type)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await axios.post(
        `/api/uploads/${type}`,
        fd, { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      const field = type === 'photo' ? 'cover_photo_url' : 'music_url'
      set(field, res.data.url)
      toast.success(`${type === 'photo' ? 'Photo' : 'Music'} uploaded!`)
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(null)
    }
  }

  if (loading || !user || !inv) return (
    <div className="flex min-h-screen bg-stone-50">
      <DashboardSidebar />
      <main className="flex-1 p-10 flex items-center justify-center">
        <p className="font-lato text-stone-400">Loading...</p>
      </main>
    </div>
  )

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${inv.slug}`

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-1">EDITING INVITATION</p>
            <h1 className="font-playfair text-3xl">{inv.bride_name} & {inv.groom_name}</h1>
          </div>
          <div className="flex gap-3">
            <a href={`/${inv.slug}`} target="_blank"
              className="border border-stone-300 text-stone-600 font-cinzel text-xs tracking-widest px-5 py-3 hover:bg-stone-100 transition-colors">
              PREVIEW ↗
            </a>
            <button onClick={handleSave} disabled={saving}
              className="border border-stone-800 text-stone-800 font-cinzel text-xs tracking-widest px-5 py-3 hover:bg-stone-100 disabled:opacity-50 transition-colors">
              {saving ? 'SAVING...' : 'SAVE'}
            </button>
            <button onClick={handlePublish} disabled={publishing}
              className={`font-cinzel text-xs tracking-widest px-5 py-3 transition-colors ${
                inv.is_published
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}>
              {publishing ? '...' : inv.is_published ? 'UNPUBLISH' : 'PUBLISH'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-stone-200">
          {(['details', 'media', 'share'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`font-cinzel text-xs tracking-widest px-6 py-3 transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab: Details */}
        {activeTab === 'details' && (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'bride_name', label: "BRIDE'S NAME" },
                { key: 'groom_name', label: "GROOM'S NAME" },
                { key: 'akad_date',       label: 'AKAD DATE' },
                { key: 'akad_time',       label: 'AKAD TIME' },
                { key: 'reception_date',  label: 'RECEPTION DATE' },
                { key: 'reception_time',  label: 'RECEPTION TIME' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">{label}</label>
                  <input type="text" value={inv[key] || ''} onChange={e => set(key, e.target.value)}
                    className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 transition-colors" />
                </div>
              ))}
            </div>
            {[
              { key: 'akad_venue',      label: 'AKAD VENUE' },
              { key: 'reception_venue', label: 'RECEPTION VENUE' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">{label}</label>
                <input type="text" value={inv[key] || ''} onChange={e => set(key, e.target.value)}
                  className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 transition-colors" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'venue_lat', label: 'LATITUDE' },
                { key: 'venue_lng', label: 'LONGITUDE' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">{label}</label>
                  <input type="text" value={inv[key] || ''} onChange={e => set(key, e.target.value)}
                    className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 transition-colors" />
                </div>
              ))}
            </div>
            <button onClick={handleSave} disabled={saving}
              className="bg-stone-900 hover:bg-stone-700 disabled:opacity-50 text-white font-cinzel text-xs tracking-widest px-8 py-4 transition-colors">
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        )}

        {/* Tab: Media */}
        {activeTab === 'media' && (
          <div className="space-y-8 max-w-2xl">
            {/* Cover photo */}
            <div className="border border-stone-200 p-6">
              <h3 className="font-cinzel text-sm tracking-widest mb-4">COVER PHOTO</h3>
              {inv.cover_photo_url && (
                <div className="mb-4 w-32 h-32 rounded overflow-hidden border border-stone-200">
                  <img src={inv.cover_photo_url} alt="Cover" className="w-full h-full object-cover" />
                </div>
              )}
              <label className={`cursor-pointer inline-flex items-center gap-3 border-2 border-dashed border-stone-300 hover:border-gold-400 px-6 py-4 transition-colors ${uploading === 'photo' ? 'opacity-50 pointer-events-none' : ''}`}>
                <span className="font-cinzel text-xs tracking-widest text-stone-500">
                  {uploading === 'photo' ? 'UPLOADING...' : '+ UPLOAD PHOTO'}
                </span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'photo')} />
              </label>
              <p className="font-lato text-xs text-stone-400 mt-2">JPG, PNG or WebP. Max 10MB.</p>
            </div>

            {/* Background music */}
            <div className="border border-stone-200 p-6">
              <h3 className="font-cinzel text-sm tracking-widest mb-4">BACKGROUND MUSIC</h3>
              {inv.music_url && (
                <div className="mb-4 p-3 bg-stone-50 border border-stone-100 font-lato text-xs text-stone-500 truncate">
                  {inv.music_url}
                </div>
              )}
              <label className={`cursor-pointer inline-flex items-center gap-3 border-2 border-dashed border-stone-300 hover:border-gold-400 px-6 py-4 transition-colors ${uploading === 'music' ? 'opacity-50 pointer-events-none' : ''}`}>
                <span className="font-cinzel text-xs tracking-widest text-stone-500">
                  {uploading === 'music' ? 'UPLOADING...' : '+ UPLOAD MUSIC'}
                </span>
                <input type="file" accept="audio/mpeg,audio/mp3" className="hidden"
                  onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'music')} />
              </label>
              <p className="font-lato text-xs text-stone-400 mt-2">MP3 only. Max 10MB.</p>
              <div className="mt-4">
                <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">OR PASTE MUSIC URL</label>
                <input type="text" value={inv.music_url || ''} onChange={e => set('music_url', e.target.value)}
                  className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400"
                  placeholder="https://example.com/music.mp3" />
              </div>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="bg-stone-900 hover:bg-stone-700 disabled:opacity-50 text-white font-cinzel text-xs tracking-widest px-8 py-4 transition-colors">
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        )}

        {/* Tab: Share */}
        {activeTab === 'share' && (
          <div className="max-w-2xl space-y-6">
            <div className="border border-stone-200 p-6">
              <h3 className="font-cinzel text-sm tracking-widest mb-4">INVITATION LINK</h3>
              <div className="flex items-center gap-3">
                <input readOnly value={shareUrl}
                  className="flex-1 border border-stone-200 px-4 py-3 font-lato text-sm bg-stone-50" />
                <button
                  onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success('Copied!') }}
                  className="bg-stone-900 text-white font-cinzel text-xs tracking-widest px-5 py-3 hover:bg-stone-700 transition-colors">
                  COPY
                </button>
              </div>
            </div>

            <div className="border border-stone-200 p-6">
              <h3 className="font-cinzel text-sm tracking-widest mb-2">PERSONALIZED LINK</h3>
              <p className="font-lato text-sm text-stone-500 mb-4">
                Add <code className="bg-stone-100 px-1">?to=GuestName</code> to show a personalized greeting on the opening screen.
              </p>
              <div className="bg-stone-50 p-4 font-lato text-sm text-stone-600 border border-stone-100">
                {shareUrl}?to=<span className="text-gold-600">Pak+Ahmad</span>
              </div>
            </div>

            <div className="border border-stone-200 p-6">
              <h3 className="font-cinzel text-sm tracking-widest mb-4">SHARE VIA WHATSAPP</h3>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`You are invited to our wedding! Open your invitation here: ${shareUrl}`)}`}
                target="_blank"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-cinzel text-xs tracking-widest px-6 py-3 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                SHARE ON WHATSAPP
              </a>
            </div>

            <div className={`border p-4 font-lato text-sm ${inv.is_published ? 'border-green-200 bg-green-50 text-green-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
              {inv.is_published
                ? '✓ Your invitation is published and accessible to guests.'
                : '⚠ Your invitation is not yet published. Guests cannot view it until you publish it.'}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
