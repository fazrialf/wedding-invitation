'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'

const navItems = [
  { href: '/dashboard',             label: 'Overview',    icon: '⊞' },
  { href: '/dashboard/invitations', label: 'Invitations', icon: '✉' },
  { href: '/dashboard/rsvp',        label: 'RSVP',        icon: '✓' },
  { href: '/dashboard/wishes',      label: 'Wishes',      icon: '♡' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 min-h-screen bg-stone-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-stone-700">
        <h1 className="font-greatVibes text-4xl text-yellow-400">Our Wedding</h1>
        <p className="font-cinzel text-xs tracking-[0.3em] text-stone-400 mt-1">STUDIO</p>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-stone-700">
        <p className="font-lato text-sm text-stone-300">{user?.name}</p>
        <p className="font-lato text-xs text-stone-500">{user?.email}</p>
        <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 font-cinzel text-xs rounded">
          {user?.plan?.toUpperCase() || 'FREE'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 font-lato text-sm transition-colors duration-200 rounded ${
                active
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Quick links note */}
      <div className="px-6 py-3 border-t border-stone-700">
        <p className="font-cinzel text-xs text-stone-600 mb-2 tracking-widest">PER INVITATION</p>
        <p className="font-lato text-xs text-stone-500 leading-relaxed">
          Analytics · Reminders · Guests · Domain available from the Edit page
        </p>
      </div>

      {/* Logout */}
      <div className="px-6 py-6 border-t border-stone-700">
        <button
          onClick={logout}
          className="font-cinzel text-xs tracking-widest text-stone-500 hover:text-white transition-colors"
        >
          SIGN OUT
        </button>
      </div>
    </aside>
  )
}
