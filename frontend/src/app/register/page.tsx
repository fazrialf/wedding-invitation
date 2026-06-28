'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Registration failed')
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
        <h2 className="font-playfair text-2xl text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name',     label: 'FULL NAME',       type: 'text',     placeholder: 'Your full name' },
            { key: 'email',    label: 'EMAIL',            type: 'email',    placeholder: 'your@email.com' },
            { key: 'password', label: 'PASSWORD',         type: 'password', placeholder: '••••••••' },
            { key: 'confirm',  label: 'CONFIRM PASSWORD', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="font-cinzel text-xs tracking-widest text-stone-500 block mb-1">{label}</label>
              <input
                type={type} required
                value={(form as any)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-stone-200 px-4 py-3 font-lato text-sm focus:outline-none focus:border-gold-400 transition-colors"
                placeholder={placeholder}
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-700 disabled:opacity-60 text-white font-cinzel text-xs tracking-widest py-4 transition-colors duration-300 mt-2"
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p className="text-center font-lato text-sm text-stone-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-gold-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
