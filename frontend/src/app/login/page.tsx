'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white shadow-sm border border-stone-100 p-10">
        <div className="text-center mb-8">
          <h1 className="font-greatVibes text-5xl text-stone-800 mb-1">Our Wedding</h1>
          <p className="font-cinzel text-xs tracking-[0.3em] text-stone-400">STUDIO</p>
        </div>
        <h2 className="font-playfair text-2xl text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-1">EMAIL</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-1">PASSWORD</label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-700 disabled:opacity-60 text-white font-cinzel text-xs tracking-widest py-4 transition-colors duration-300 mt-2"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        <p className="text-center font-lato text-sm text-stone-500 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-gold-600 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
