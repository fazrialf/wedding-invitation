'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  plan: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const t = localStorage.getItem('wedding_token')
    const u = localStorage.getItem('wedding_user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await axios.post('/api/auth/login', { email, password })
    const { token: t, user: u } = res.data
    setToken(t); setUser(u)
    localStorage.setItem('wedding_token', t)
    localStorage.setItem('wedding_user', JSON.stringify(u))
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
    router.push('/dashboard')
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await axios.post('/api/auth/register', { name, email, password })
    const { token: t, user: u } = res.data
    setToken(t); setUser(u)
    localStorage.setItem('wedding_token', t)
    localStorage.setItem('wedding_user', JSON.stringify(u))
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
    router.push('/dashboard')
  }

  const logout = () => {
    setToken(null); setUser(null)
    localStorage.removeItem('wedding_token')
    localStorage.removeItem('wedding_user')
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
