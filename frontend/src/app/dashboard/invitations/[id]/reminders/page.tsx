'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function RemindersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [inv, setInv]           = useState<any>(null)
  const [recipientInput, setRecipientInput] = useState('')
  const [subject, setSubject]   = useState('')
  const [message, setMessage]   = useState('')
  const [mode, setMode]         = useState<'email'|'whatsapp'>('whatsapp')
  const [sending, setSending]   = useState(false)
  const [results, setResults]   = useState<any[]>([])
  const [history, setHistory]   = useState<any[]>([])

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user || !id) return
    axios.get(`/api/invitations/by-id/${id}`)
      .then(r => {
        setInv(r.data)
        setSubject(`Wedding Invitation — ${r.data.bride_name} & ${r.data.groom_name}`)
        setMessage(`We joyfully invite you to celebrate the wedding of ${r.data.bride_name} and ${r.data.groom_name}. Please open your personalized invitation via the link below.`)
      })
      .catch(() => toast.error('Failed to load invitation'))
    axios.get(`/api/reminders/${id}`)
      .then(r => setHistory(r.data))
      .catch(() => {})
  }, [user, id])

  const baseUrl = typeof window !== 'undefined' && inv
    ? `${window.location.origin}/${inv.slug}`
    : ''

  const parseRecipients = () => {
    return recipientInput
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        // Accept "Name | email@example.com" or "Name | +62812..." or just "Name"
        const parts = line.split('|').map(p => p.trim())
        return { name: parts[0], contact: parts[1] || '' }
      })
  }

  const handleSendEmail = async () => {
    const recipients = parseRecipients()
      .filter(r => r.contact.includes('@'))
      .map(r => ({ name: r.name, email: r.contact }))

    if (!recipients.length) return toast.error('No valid email addresses found. Format: Name | email@example.com')

    setSending(true)
    try {
      const res = await axios.post(`/api/reminders/email`, {
        invitation_id: id,
        recipients,
        subject,
        message,
      })
      setResults(res.data.results)
      toast.success(`Sent ${res.data.results.filter((r: any) => r.status === 'sent').length} emails!`)
      // Refresh history
      axios.get(`/api/reminders/${id}`).then(r => setHistory(r.data))
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to send emails')
    } finally {
      setSending(false)
    }
  }

  const generateWaLinks = () => {
    const recipients = parseRecipients()
    if (!recipients.length) return toast.error('Enter at least one guest name')

    const links = recipients.map(r => {
      const link = `${baseUrl}?to=${encodeURIComponent(r.name)}`
      const text = `Yth. ${r.name},\n\n${message}\n\n${link}`
      const waUrl = r.contact && !r.contact.includes('@')
        ? `https://wa.me/${r.contact.replace(/\D/g,'')}?text=${encodeURIComponent(text)}`
        : `https://wa.me/?text=${encodeURIComponent(text)}`
      return { ...r, link, waUrl }
    })
    setResults(links.map(l => ({ name: l.name, contact: l.contact, status: 'ready', waUrl: l.waUrl })))
  }

  if (loading || !user) return null

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className="flex-1 p-10 max-w-4xl">
        <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-1">STUDIO / REMINDERS</p>
        <h1 className="font-playfair text-3xl mb-2">Send Invitations</h1>
        <p className="font-lato text-sm text-stone-500 mb-8">
          Send personalized invitation reminders via Email or WhatsApp.
        </p>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          {(['whatsapp', 'email'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setResults([]) }}
              className={`font-cinzel text-xs tracking-widest px-5 py-3 border transition-colors ${
                mode === m ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-400 hover:border-stone-400'
              }`}>
              {m === 'whatsapp' ? '💬 WHATSAPP' : '📧 EMAIL'}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-5">
            <div className="bg-white border border-stone-100 shadow-sm p-6">
              <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">
                {mode === 'email'
                  ? 'GUESTS (Name | email@example.com — one per line)'
                  : 'GUESTS (Name | +628xxx optional — one per line)'}
              </label>
              <textarea rows={8} value={recipientInput}
                onChange={e => setRecipientInput(e.target.value)}
                className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none resize-none"
                placeholder={mode === 'email'
                  ? 'Pak Ahmad | ahmad@gmail.com\nBu Siti | siti@gmail.com'
                  : 'Pak Ahmad | +628****7890\nKeluarga Santoso'} />

              {mode === 'email' && (
                <>
                  <div className="mt-4">
                    <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">EMAIL SUBJECT</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                      className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none" />
                  </div>
                </>
              )}

              <div className="mt-4">
                <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-1">MESSAGE</label>
                <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none resize-none" />
              </div>

              <button
                onClick={mode === 'email' ? handleSendEmail : generateWaLinks}
                disabled={sending}
                className="w-full mt-4 bg-stone-900 hover:bg-stone-700 disabled:opacity-50 text-white font-cinzel text-xs tracking-widest py-4 transition-colors">
                {sending ? 'SENDING...' : mode === 'email' ? 'SEND EMAILS' : 'GENERATE WA LINKS'}
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            {results.length > 0 && (
              <div className="bg-white border border-stone-100 shadow-sm">
                <div className="px-6 py-4 border-b border-stone-100">
                  <h2 className="font-playfair text-lg">
                    {mode === 'whatsapp' ? `${results.length} Links Ready` : 'Send Results'}
                  </h2>
                </div>
                <div className="divide-y divide-stone-50 max-h-96 overflow-y-auto">
                  {results.map((r, i) => (
                    <div key={i} className="px-6 py-4">
                      <p className="font-cinzel text-xs tracking-widest text-stone-700 mb-1">{r.name}</p>
                      {r.contact && <p className="font-lato text-xs text-stone-400 mb-2">{r.contact}</p>}
                      {mode === 'email' ? (
                        <span className={`font-cinzel text-xs px-2 py-1 rounded ${
                          r.status === 'sent' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                        }`}>
                          {r.status === 'sent' ? '✓ SENT' : '✗ FAILED'}
                        </span>
                      ) : (
                        <a href={r.waUrl} target="_blank"
                          className="inline-flex items-center gap-2 font-cinzel text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 transition-colors">
                          📲 SEND VIA WHATSAPP
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white border border-stone-100 shadow-sm mt-4">
                <div className="px-6 py-4 border-b border-stone-100">
                  <h2 className="font-playfair text-lg">Sent History ({history.length})</h2>
                </div>
                <div className="divide-y divide-stone-50 max-h-48 overflow-y-auto">
                  {history.slice(0, 20).map(h => (
                    <div key={h.id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-lato text-sm text-stone-700">{h.recipient_name}</p>
                        <p className="font-lato text-xs text-stone-400">{h.recipient}</p>
                      </div>
                      <span className="font-cinzel text-xs text-stone-400">
                        {new Date(h.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
