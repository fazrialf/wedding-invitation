'use client'

import { useInView } from 'react-intersection-observer'
import type { ThemeConfig } from '@/themes/config'

interface Contact {
  name: string
  phone: string
}

interface ContactInfoProps {
  theme: ThemeConfig
  contacts?: Contact[]
}

const defaultContacts: Contact[] = [
  { name: 'AMIN', phone: '012 2971 1015' },
  { name: 'ZURAINEE', phone: '013 347 7587' },
  { name: 'MIRZA', phone: '019 294 4455' },
  { name: 'ISKANDAR', phone: '012 297 1670' },
]

export default function ContactInfo({ theme, contacts = defaultContacts }: ContactInfoProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  const handleCall = (phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, '')}`, '_self')
  }

  return (
    <section
      ref={ref}
      className={`relative py-20 px-6 text-center overflow-hidden`}
      style={{ backgroundColor: '#6B7F5E' }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 5l1.5 4.5L36 11l-4.5 1.5L30 17l-1.5-4.5L24 11l4.5-1.5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-md mx-auto">
        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div
            className="h-px w-16"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4))' }}
          />
          <span
            className={`${theme.fontLabel} text-xs tracking-[0.3em]`}
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {theme.ornamentChar}
          </span>
          <div
            className="h-px w-16"
            style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.4), transparent)' }}
          />
        </div>

        {/* Title */}
        <p
          className={`
            ${theme.fontLabel} text-xs tracking-[0.4em] uppercase mb-3
            transition-all duration-1000 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          HUBUNGI
        </p>

        <h2
          className={`
            ${theme.fontHeading} text-3xl md:text-4xl mb-4 text-white
            transition-all duration-1000 delay-100 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          Contact
        </h2>

        <p
          className={`
            ${theme.fontBody} text-sm italic mb-10 text-white/70
            transition-all duration-1000 delay-200 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          Bagi sebarang pertanyaan, sila hubungi
        </p>

        {/* Contact list — pill-shaped buttons */}
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <button
              key={contact.name}
              onClick={() => handleCall(contact.phone)}
              className={`
                w-full flex items-center justify-between
                px-6 py-4 rounded-full
                transition-all duration-700 ease-out
                hover:opacity-90 active:scale-[0.98]
                cursor-pointer
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
              `}
              style={{
                transitionDelay: `${300 + index * 100}ms`,
                backgroundColor: theme.primaryDark,
              }}
            >
              <p className={`${theme.fontDisplay} text-base md:text-lg text-white`}>
                {contact.name}
              </p>
              <p className={`${theme.fontLabel} text-xs tracking-[0.15em] text-white/80`}>
                {contact.phone}
              </p>
            </button>
          ))}
        </div>

        {/* Bottom ornament */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>{theme.ornamentChar}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{theme.ornamentChar}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>{theme.ornamentChar}</span>
        </div>
      </div>
    </section>
  )
}
