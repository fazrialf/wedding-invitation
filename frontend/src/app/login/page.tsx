'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import PelaminanOrnament from '@/components/studio/PelaminanOrnament'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch {
      toast.error('Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" />

      {/* LEFT — Brand Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2C1A0E 0%, #3D2410 60%, #4A2E18 100%)' }}
      >
        {/* Batik texture overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #C8A96E 0, #C8A96E 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Corner ornament accents */}
        <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-[#C8A96E] opacity-40 rounded-tl-sm" />
        <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-[#C8A96E] opacity-40 rounded-tr-sm" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-[#C8A96E] opacity-40 rounded-bl-sm" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-[#C8A96E] opacity-40 rounded-br-sm" />

        {/* Brand content */}
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* Logo */}
          <h1
            className="font-cormorant text-6xl font-semibold italic mb-2"
            style={{ color: '#C8A96E' }}
          >
            Pelaminan
          </h1>
          <p
            className="font-cinzel text-xs tracking-[0.4em] uppercase mb-10"
            style={{ color: '#E8DCC8', opacity: 0.6 }}
          >
            Digital Wedding Invitation
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8 w-48">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C8A96E)' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #C8A96E)' }} />
          </div>

          {/* Ornament */}
          <PelaminanOrnament width={260} height={260} className="opacity-35" />

          {/* Tagline */}
          <div className="mt-8 flex items-center gap-3 w-64">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C8A96E)' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #C8A96E)' }} />
          </div>
          <p
            className="font-cinzel text-sm tracking-widest mt-4 text-center"
            style={{ color: '#E8DCC8', opacity: 0.7 }}
          >
            Dari Hati, Untuk Selamanya
          </p>
        </div>
      </div>

      {/* RIGHT — Form Panel */}
      <div
        className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-12"
        style={{ background: '#FAF7F2' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-10">
          <h1 className="font-cormorant text-5xl font-semibold italic" style={{ color: '#6B3F2A' }}>Pelaminan</h1>
          <p className="font-cinzel text-xs tracking-[0.4em] uppercase mt-1" style={{ color: '#6B3F2A', opacity: 0.5 }}>Digital Wedding Invitation</p>
        </div>

        <div className="w-full max-w-md">
          {/* Back to home */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase transition-opacity hover:opacity-100" style={{ color: '#6B3F2A', opacity: 0.6 }}>
              ← Beranda
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-playfair text-3xl font-semibold" style={{ color: '#2C1A0E' }}>
              Selamat Datang
            </h2>
            <p className="font-lato text-sm mt-2" style={{ color: '#6B3F2A', opacity: 0.7 }}>
              Masuk ke akun Pelaminan Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block font-cinzel text-xs tracking-[0.2em] uppercase mb-2"
                style={{ color: '#6B3F2A' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg font-lato text-sm outline-none transition-all"
                style={{
                  background: '#fff',
                  border: '1.5px solid #E8DCC8',
                  color: '#2C1A0E',
                }}
                onFocus={e => e.target.style.borderColor = '#C8A96E'}
                onBlur={e => e.target.style.borderColor = '#E8DCC8'}
              />
            </div>

            <div>
              <label
                className="block font-cinzel text-xs tracking-[0.2em] uppercase mb-2"
                style={{ color: '#6B3F2A' }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg font-lato text-sm outline-none transition-all"
                style={{
                  background: '#fff',
                  border: '1.5px solid #E8DCC8',
                  color: '#2C1A0E',
                }}
                onFocus={e => e.target.style.borderColor = '#C8A96E'}
                onBlur={e => e.target.style.borderColor = '#E8DCC8'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 font-cinzel text-sm tracking-[0.25em] uppercase rounded-lg transition-all duration-200 disabled:opacity-60"
              style={{
                background: loading ? '#9B7A6A' : '#6B3F2A',
                color: '#FAF7F2',
              }}
              onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = '#2C1A0E' }}
              onMouseLeave={e => { if (!loading) (e.target as HTMLElement).style.background = '#6B3F2A' }}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E8DCC8]" />
            <div className="w-1 h-1 rounded-full bg-[#C8A96E]" />
            <div className="flex-1 h-px bg-[#E8DCC8]" />
          </div>

          <p className="font-lato text-sm text-center" style={{ color: '#6B3F2A', opacity: 0.7 }}>
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-semibold underline underline-offset-2 hover:opacity-100 transition-opacity"
              style={{ color: '#6B3F2A' }}
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
