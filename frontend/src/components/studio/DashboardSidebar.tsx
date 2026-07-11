'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

// Inline SVG icons — no external package needed
const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  undangan: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
}

const navItems = [
  { href: '/dashboard',              label: 'Dashboard',  icon: Icons.dashboard },
  { href: '/dashboard/invitations',  label: 'Undangan',   icon: Icons.undangan },
  { href: '/dashboard/settings',     label: 'Pengaturan', icon: Icons.settings },
]

// Theme token maps
const light = {
  sidebar:      'bg-[#FAF7F2] border-r border-[#E8DCC8]',
  logo:         '#6B3F2A',
  logoSub:      '#6B3F2A',
  divider:      '#E8DCC8',
  userText:     '#2C1A0E',
  userMuted:    '#6B3F2A',
  badge:        'bg-[#E8DCC8] text-[#6B3F2A]',
  navDefault:   'text-[#6B3F2A] hover:bg-[#E8DCC8]/60',
  navActive:    'bg-[#E8DCC8] text-[#2C1A0E] border-l-2 border-[#6B3F2A]',
  toggleBg:     'bg-[#E8DCC8] hover:bg-[#ddd0bb]',
  toggleText:   '#6B3F2A',
  logoutText:   'text-[#8B1A1A] hover:bg-red-50',
  overlay:      'bg-[#2C1A0E]/40',
}
const dark = {
  sidebar:      'bg-[#2C1A0E] border-r border-[#3D2410]',
  logo:         '#C8A96E',
  logoSub:      '#E8DCC8',
  divider:      '#3D2410',
  userText:     '#E8DCC8',
  userMuted:    '#C8A96E',
  badge:        'bg-[#6B3F2A]/40 text-[#C8A96E]',
  navDefault:   'text-[#C8A96E]/70 hover:bg-[#6B3F2A]/20 hover:text-[#E8DCC8]',
  navActive:    'bg-[#6B3F2A]/30 text-[#C8A96E] border-l-2 border-[#C8A96E]',
  toggleBg:     'bg-[#3D2410] hover:bg-[#4A2E18]',
  toggleText:   '#C8A96E',
  logoutText:   'text-red-400 hover:bg-red-900/20',
  overlay:      'bg-black/50',
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
            {theme === 'light' ? Icons.moon : Icons.sun}
          </span>
          <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-lato text-sm transition-all duration-200 ${t.logoutText}`}
        >
          <span className="flex-shrink-0">{Icons.logout}</span>
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
        {mobileOpen ? Icons.close : Icons.menu}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <>
          <div
            className={`lg:hidden fixed inset-0 z-40 ${t.overlay}`}
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-40">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  )
}
