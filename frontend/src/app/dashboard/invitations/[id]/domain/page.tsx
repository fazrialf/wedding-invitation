'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function CustomDomainPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [domain, setDomain]       = useState('')
  const [existing, setExisting]   = useState<any>(null)
  const [dnsInfo, setDnsInfo]     = useState<any>(null)
  const [saving, setSaving]       = useState(false)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user || !id) return
    axios.get(`/api/domains/${id}`)
      .then(r => { if (r.data) { setExisting(r.data); setDomain(r.data.domain) } })
      .catch(() => {})
  }, [user, id])

  const handleSave = async () => {
    if (!domain) return toast.error('Enter a domain')
    setSaving(true)
    try {
      const res = await axios.post(`/api/domains`, {
        invitation_id: id,
        domain,
      })
      setExisting(res.data.domain)
      setDnsInfo(res.data.dns_instructions)
      toast.success('Domain saved! Follow DNS instructions below.')
    } catch (err: any) {
      toast.error(err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.error || 'Failed to save domain')
    } finally {
      setSaving(false)
    }
  }

  const handleVerify = async () => {
    if (!existing) return
    setVerifying(true)
    try {
      const res = await axios.post(`/api/domains/verify/${existing.id}`)
      if (res.data.verified) {
        setExisting((e: any) => ({ ...e, verified: true }))
        toast.success('Domain verified! ✓')
      } else {
        toast.error(`DNS not pointing to ${res.data.expected_ip} yet. DNS changes can take up to 24h.`)
      }
    } catch {
      toast.error('Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  const handleRemove = async () => {
    try {
      await axios.delete(`/api/domains/${id}`)
      setExisting(null); setDomain(''); setDnsInfo(null)
      toast.success('Domain removed')
    } catch {
      toast.error('Failed to remove domain')
    }
  }

  if (loading || !user) return null

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Toaster position="top-right" />
      <DashboardSidebar />

      <main className="flex-1 p-10 max-w-2xl">
        <p className="font-cinzel text-xs tracking-widest text-stone-400 mb-1">STUDIO / SETTINGS</p>
        <h1 className="font-playfair text-3xl mb-2">Custom Domain</h1>
        <p className="font-lato text-sm text-stone-500 mb-8">
          Point your own domain (e.g. <code className="bg-stone-100 px-1">sarah-ahmad.com</code>) to this invitation.
        </p>

        {/* Domain input */}
        <div className="bg-white border border-stone-100 shadow-sm p-6 mb-6">
          <label className="font-cinzel text-xs tracking-widest text-stone-400 block mb-2">YOUR DOMAIN</label>
          <div className="flex gap-3">
            <input type="text" value={domain}
              onChange={e => setDomain(e.target.value.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, ''))}
              className="flex-1 border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-stone-400"
              placeholder="sarah-dan-ahmad.com" />
            <button onClick={handleSave} disabled={saving}
              className="bg-stone-900 hover:bg-stone-700 disabled:opacity-50 text-white font-cinzel text-xs tracking-widest px-5 py-3 transition-colors">
              {saving ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
          <p className="font-lato text-xs text-stone-400 mt-2">
            Do not include http:// or trailing slashes.
          </p>
        </div>

        {/* DNS instructions */}
        {(dnsInfo || existing) && (
          <div className="bg-white border border-stone-100 shadow-sm p-6 mb-6">
            <h2 className="font-playfair text-xl mb-4">DNS Setup Instructions</h2>
            <p className="font-lato text-sm text-stone-600 mb-4">
              In your domain registrar's DNS settings, add the following record:
            </p>
            <div className="bg-stone-900 text-stone-100 p-4 font-mono text-sm space-y-2 rounded">
              <p><span className="text-yellow-400">Type:</span>  A</p>
              <p><span className="text-yellow-400">Name:</span>  @ (root domain)</p>
              <p><span className="text-yellow-400">Value:</span> {dnsInfo?.value || '47.128.231.30'}</p>
              <p><span className="text-yellow-400">TTL:</span>   300</p>
            </div>
            <p className="font-lato text-xs text-stone-400 mt-3">
              Changes can take 5 minutes to 24 hours to propagate.
            </p>

            {/* Status + verify */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${existing?.verified ? 'bg-green-500' : 'bg-amber-400'}`} />
                <span className="font-cinzel text-xs text-stone-500">
                  {existing?.verified ? 'VERIFIED ✓' : 'PENDING VERIFICATION'}
                </span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleVerify} disabled={verifying}
                  className="font-cinzel text-xs border border-stone-300 text-stone-600 px-4 py-2 hover:bg-stone-100 disabled:opacity-50 transition-colors">
                  {verifying ? 'CHECKING...' : 'CHECK DNS'}
                </button>
                <button onClick={handleRemove}
                  className="font-cinzel text-xs border border-red-200 text-red-500 px-4 py-2 hover:bg-red-50 transition-colors">
                  REMOVE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="bg-stone-50 border border-stone-100 p-6">
          <h3 className="font-cinzel text-xs tracking-widest text-stone-500 mb-4">HOW IT WORKS</h3>
          <ol className="space-y-3 font-lato text-sm text-stone-600">
            {[
              'Enter your domain name above (e.g. sarah-dan-ahmad.com)',
              'Add an A record pointing to our server IP in your domain registrar',
              'Click "Check DNS" once the record has propagated',
              'Once verified, your invitation will be accessible at your custom domain',
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-cinzel text-xs text-stone-400 flex-shrink-0 mt-0.5">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="font-lato text-xs text-stone-400 mt-4">
            Popular registrars: GoDaddy, Namecheap, Google Domains, Cloudflare, Niagahoster, Rumahweb.
          </p>
        </div>
      </main>
    </div>
  )
}
