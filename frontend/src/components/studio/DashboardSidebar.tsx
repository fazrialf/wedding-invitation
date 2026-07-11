'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useEffect, useState } from 'react'
import {
  IconLayoutDashboard,
  IconMail,
  IconSettings,
  IconSun,
  IconMoon,
  IconMenu2,
  IconX,
  IconLogout,
} from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'

type Theme = 'light' | 'dark'

const navItems = [
  { href: '/dashboard',             label: 'Dashboard',  icon: <IconLayoutDashboard size={18} /> },
  { href: '/dashboard/invitations', label: 'Undangan',   icon: <IconMail size={18} /> },
  { href: '/dashboard/settings',    label: 'Pengaturan', icon: <IconSettings size={18} /> },
]

// Theme token maps
const light = {
  sidebar:    'bg-[#FAF7F2] border-r border-[#E8DCC8]',
  logo:       '#6B3F2A',
  logoSub:    '#6B3F2A',
  divider:    '#E8DCC8',
  userText:   '#2C1A0E',
  userMuted:  '#6B3F2A',
  badge:      'bg-[#E8DCC8] text-[#6B3F2A]',
  navDefault: 'text-[#6B3F2A] hover:bg-[#E8DCC8]/60',
  navActive:  'bg-[#E8DCC8] text-[#2C1A0E] border-l-2 border-[#6B3F2A]',
  toggleBg:   'bg-[#E8DCC8] hover:bg-[#ddd0bb]',
  toggleText: '#6B3F2A',
  logoutText: 'text-[#8B1A1A] hover:bg-red-50',
  overlay:    'bg-[#2C1A0E]/40',
}
const dark = {
  sidebar:    'bg-[#2C1A0E] border-r border-[#3D2410]',
  logo:       '#C8A96E',
  logoSub:    '#E8DCC8',
  divider:    '#3D2410',
  userText:   '#E8DCC8',
  userMuted:  '#C8A96E',
  badge:      'bg-[#6B3F2A]/40 text-[#C8A96E]',
  navDefault: 'text-[#C8A96E]/70 hover:bg-[#6B3F2A]/20 hover:text-[#E8DCC8]',
  navActive:  'bg-[#6B3F2A]/30 text-[#C8A96E] border-l-2 border-[#C8A96E]',
  toggleBg:   'bg-[#3D2410] hover:bg-[#4A2E18]',
  toggleText: '#C8A96E',
  logoutText: 'text-red-400 hover:bg-red-900/20',
  overlay:    'bg-black/50',
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState<Theme>('light')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('pelaminan-theme') as Theme | null
    if (stored === 'light' || stored === 'dark') setTheme(stored)

    const handler = () => {
      const updated = localStorage.getItem('pelaminan-theme') as Theme | null
      if (updated === 'light' || updated === 'dark') setTheme(updated)
    }
    window.addEventListener('pelaminan-theme-change', handler)
    return () => window.removeEventListener('pelaminan-theme-change', handler)
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('pelaminan-theme', next)
    setTheme(next)
    window.dispatchEvent(new Event('pelaminan-theme-change'))
  }

  const t = theme === 'light' ? light : dark

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const SidebarContent = () => (
    <aside className={`w-64 min-h-screen flex flex-col ${t.sidebar} transition-colors duration-300`}>

      {/* Logo */}
      <div className="px-6 pt-7 pb-5" style={{ borderBottom: `1px solid ${t.divider}` }}>
        <h1 className="font-cormorant text-4xl font-semibold italic leading-tight" style={{ color: t.logo }}>
          Pelaminan
        </h1>
        <p className="font-cinzel text-[10px] tracking-[0.35em] uppercase mt-0.5" style={{ color: t.logoSub, opacity: 0.55 }}>
          Digital Wedding Invitation
        </p>
        {/* Gold divider */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${t.logo}, transparent)` }} />
          <div className="w-1 h-1 rounded-full" style={{ background: t.logo }} />
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${t.divider}` }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-cinzel text-sm flex-shrink-0"
            style={{ background: '#6B3F2A', color: '#E8DCC8' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-lato text-sm font-medium truncate" style={{ color: t.userText }}>
              {user?.name}
            </p>
            <p className="font-lato text-xs truncate" style={{ color: t.userMuted, opacity: 0.7 }}>
              {user?.email}
            </p>
          </div>
        </div>
        <span className={`inline-block mt-2.5 px-2 py-0.5 font-cinzel text-[10px] tracking-widest rounded ${t.badge}`}>
          {user?.plan?.toUpperCase() || 'FREE'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-lato text-sm transition-all duration-200 ${
                active ? t.navActive : t.navDefault
              }`}
            >
              <span className="flex-shrink-0">{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 space-y-1" style={{ borderTop: `1px solid ${t.divider}` }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-lato text-sm transition-all duration-200 ${t.toggleBg}`}
          style={{ color: t.toggleText }}
        >
          <span className="flex-shrink-0">
            {theme === 'light' ? <IconMoon size={16} /> : <IconSun size={16} />}
          </span>
          <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-lato text-sm transition-all duration-200 ${t.logoutText}`}
        >
          <span className="flex-shrink-0"><IconLogout size={18} /></span>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-md"
        style={{ background: theme === 'light' ? '#FAF7F2' : '#2C1A0E', color: theme === 'light' ? '#6B3F2A' : '#C8A96E' }}
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div
              className={`lg:hidden fixed inset-0 z-40 ${t.overlay}`}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="lg:hidden fixed inset-y-0 left-0 z-40"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
