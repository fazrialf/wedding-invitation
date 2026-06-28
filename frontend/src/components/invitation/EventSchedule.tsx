'use client'

import { useInView } from 'react-intersection-observer'
import type { ThemeConfig } from '@/themes/config'

interface EventScheduleProps {
  akadDate:      string
  akadTime:      string
  akadVenue:     string
  receptionDate: string
  receptionTime: string
  receptionVenue:string
  venueLat?:     number | null
  venueLng?:     number | null
  theme:         ThemeConfig
}

/* ── Animated SVG Icons ─────────────────────────────────── */

function RingsIcon({ color, delay }: { color: string; delay: number }) {
  return (
    <svg
      className="w-10 h-10"
      viewBox="0 0 64 64"
      fill="none"
      style={{
        animation: `icon-float 3s ease-in-out ${delay}s infinite`,
      }}
    >
      {/* Left ring */}
      <circle cx="26" cy="36" r="14" stroke={color} strokeWidth="2" fill="none"
        style={{ animation: `ring-pulse 2.5s ease-in-out ${delay}s infinite` }} />
      {/* Right ring */}
      <circle cx="38" cy="36" r="14" stroke={color} strokeWidth="2" fill="none"
        style={{ animation: `ring-pulse 2.5s ease-in-out ${delay + 0.3}s infinite` }} />
      {/* Small diamond accent */}
      <path d="M32 18l3 5-3 5-3-5z" fill={color} opacity="0.6"
        style={{ animation: `icon-sparkle 2s ease-in-out ${delay + 0.5}s infinite` }} />
    </svg>
  )
}

function CalendarIcon({ color, delay }: { color: string; delay: number }) {
  return (
    <svg
      className="w-10 h-10"
      viewBox="0 0 64 64"
      fill="none"
      style={{
        animation: `icon-float 3s ease-in-out ${delay}s infinite`,
      }}
    >
      {/* Calendar body */}
      <rect x="12" y="18" width="40" height="36" rx="4" stroke={color} strokeWidth="2" fill="none" />
      {/* Top bar */}
      <rect x="12" y="18" width="40" height="10" rx="4" fill={color} opacity="0.15" />
      {/* Hooks */}
      <line x1="24" y1="12" x2="24" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="12" x2="40" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Date dots */}
      <circle cx="24" cy="38" r="2" fill={color} opacity="0.5" />
      <circle cx="32" cy="38" r="2" fill={color} opacity="0.5" />
      <circle cx="40" cy="38" r="2" fill={color} opacity="0.5" />
      <circle cx="24" cy="46" r="2" fill={color} opacity="0.5" />
      <circle cx="32" cy="46" r="2" fill={color}
        style={{ animation: `icon-sparkle 2s ease-in-out ${delay + 0.5}s infinite` }} />
      <circle cx="40" cy="46" r="2" fill={color} opacity="0.5" />
    </svg>
  )
}

function PinIcon({ color }: { color: string }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ExternalLinkIcon({ color }: { color: string }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" />
      <path d="M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

/* ── Floating Decorative Elements ───────────────────────── */

function FloatingSparkles({ color, primaryLight }: { color: string; primaryLight: string }) {
  const sparkles = [
    { top: '8%',  left: '5%',  size: 6, delay: 0,   dur: 4 },
    { top: '15%', right: '8%', size: 4, delay: 1.2,  dur: 3.5 },
    { top: '35%', left: '3%',  size: 5, delay: 0.8,  dur: 4.5 },
    { top: '55%', right: '4%', size: 7, delay: 2,    dur: 3 },
    { top: '70%', left: '7%',  size: 4, delay: 0.5,  dur: 5 },
    { top: '80%', right: '6%', size: 5, delay: 1.5,  dur: 3.8 },
    { top: '45%', left: '92%', size: 3, delay: 2.5,  dur: 4.2 },
    { top: '25%', left: '2%',  size: 3, delay: 3,    dur: 3.2 },
  ]

  return (
    <>
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            animation: `sparkle-float ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          <svg width={s.size * 2} height={s.size * 2} viewBox="0 0 16 16">
            <path
              d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5Z"
              fill={color}
              opacity="0.4"
            />
          </svg>
        </div>
      ))}
    </>
  )
}

/* ── Decorative Frame ───────────────────────────────────── */

function DecorativeFrame({ color, ornamentChar }: { color: string; ornamentChar: string }) {
  const cornerClass = 'absolute w-8 h-8 pointer-events-none'
  const borderStyle = { borderColor: color }

  return (
    <>
      {/* Corner ornaments */}
      <div className={`${cornerClass} top-4 left-4 border-t-2 border-l-2`} style={borderStyle} />
      <div className={`${cornerClass} top-4 right-4 border-t-2 border-r-2`} style={borderStyle} />
      <div className={`${cornerClass} bottom-4 left-4 border-b-2 border-l-2`} style={borderStyle} />
      <div className={`${cornerClass} bottom-4 right-4 border-b-2 border-r-2`} style={borderStyle} />

      {/* Center ornaments on top/bottom edges */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none"
        style={{ color, opacity: 0.5 }}>
        {ornamentChar}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none"
        style={{ color, opacity: 0.5 }}>
        {ornamentChar}
      </div>

      {/* Side ornaments */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
        style={{ color, opacity: 0.3 }}>
        {ornamentChar}
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
        style={{ color, opacity: 0.3 }}>
        {ornamentChar}
      </div>
    </>
  )
}

/* ── Event Card (Timeline Item) ─────────────────────────── */

interface EventCardProps {
  label: string
  date: string
  time?: string
  venue?: string
  icon: 'rings' | 'calendar'
  index: number
  inView: boolean
  theme: ThemeConfig
}

function EventCard({ label, date, time, venue, icon, index, inView, theme }: EventCardProps) {
  const delayMs = index * 300
  const isEven = index % 2 === 0

  return (
    <div
      className="relative flex justify-center group"
      style={{
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        opacity: inView ? 1 : 0,
        transform: inView
          ? 'translateY(0) scale(1)'
          : `translateY(30px) scale(0.97)`,
      }}
    >
      {/* Card body */}
      <div
        className={`w-full max-w-md border ${theme.borderAccent} p-6 md:p-8 relative overflow-hidden transition-shadow duration-500 group-hover:shadow-lg`}
        style={{
          background: `linear-gradient(135deg, white 0%, ${theme.primaryLight}33 100%)`,
          boxShadow: inView ? `0 4px 24px ${theme.shadowColor}` : 'none',
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${theme.primaryHex}08 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Animated icon */}
          <div className="flex justify-center mb-4">
            {icon === 'rings' ? (
              <RingsIcon color={theme.primaryHex} delay={index * 0.5} />
            ) : (
              <CalendarIcon color={theme.primaryHex} delay={index * 0.5} />
            )}
          </div>

          {/* Label */}
          <p className={`${theme.fontLabel} text-xs tracking-[0.3em] ${theme.textAccent} mb-3`}>
            {label}
          </p>

          {/* Date */}
          <p className={`${theme.fontHeading} text-xl ${theme.textDark} mb-1`}>{date}</p>

          {/* Time */}
          {time && (
            <p className={`${theme.fontBody} text-sm ${theme.textMuted} mb-3`}>{time}</p>
          )}

          {/* Venue */}
          {venue && (
            <p className={`${theme.fontBody} text-sm ${theme.textMuted} leading-relaxed`}>{venue}</p>
          )}

          {/* Ornament underline */}
          <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
            <div className="h-px w-8" style={{ backgroundColor: theme.primaryHex }} />
            <span className="text-xs" style={{ color: theme.primaryHex }}>{theme.ornamentChar}</span>
            <div className="h-px w-8" style={{ backgroundColor: theme.primaryHex }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Component ─────────────────────────────────────── */

export default function EventSchedule({
  akadDate, akadTime, akadVenue,
  receptionDate, receptionTime, receptionVenue,
  venueLat, venueLng, theme,
}: EventScheduleProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const mapsUrl = venueLat && venueLng
    ? `https://maps.google.com/?q=${venueLat},${venueLng}`
    : null

  const events: Array<{
    label: string; date: string; time?: string; venue?: string; icon: 'rings' | 'calendar'
  }> = []

  if (receptionDate) {
    events.push({ label: 'RECEPTION', date: receptionDate, time: receptionTime, venue: receptionVenue, icon: 'calendar' })
  }

  return (
    <section
      ref={ref}
      className={`relative py-20 px-6 overflow-hidden ${theme.bgSection2}`}
      style={{
        background: `linear-gradient(180deg, ${theme.bgSection2 === 'bg-stone-50' ? '#fafaf9' : theme.gradientFrom} 0%, ${theme.bgSection2 === 'bg-stone-50' ? '#f5f5f4' : theme.gradientTo} 100%)`,
      }}
    >
      {/* Inline keyframes */}
      <style>{`
        @keyframes icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes ring-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.04); }
        }
        @keyframes icon-sparkle {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes sparkle-float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-8px) rotate(15deg); opacity: 0.7; }
          50% { transform: translateY(-4px) rotate(-10deg); opacity: 0.3; }
          75% { transform: translateY(-10px) rotate(5deg); opacity: 0.6; }
        }
        @keyframes btn-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Floating sparkles */}
      <FloatingSparkles color={theme.primaryHex} primaryLight={theme.primaryLight} />

      {/* Decorative frame wrapper */}
      <div className="relative max-w-2xl mx-auto p-8 md:p-12">
        <DecorativeFrame color={theme.primaryHex} ornamentChar={theme.ornamentChar} />

        {/* Header */}
        <div
          className="text-center mb-16 relative z-10"
          style={{
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(-10px)',
          }}
        >
          <p className={`${theme.fontLabel} text-xs tracking-[0.4em] ${theme.textAccent} mb-2`}>
            SAVE THE DATE
          </p>
          <h2 className={`${theme.fontHeading} text-4xl ${theme.textDark} mb-3`}>
            Event Details
          </h2>
          {/* Ornament divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: theme.primaryHex, opacity: 0.3 }} />
            <span className="text-lg" style={{ color: theme.primaryHex, opacity: 0.5 }}>
              {theme.ornamentChar}
            </span>
            <div className="h-px w-12" style={{ backgroundColor: theme.primaryHex, opacity: 0.3 }} />
          </div>
        </div>

        {/* Event cards (centered, no timeline) */}
        <div className="relative z-10 space-y-10">
          {events.map((event, i) => (
            <EventCard
              key={event.label}
              label={event.label}
              date={event.date}
              time={event.time}
              venue={event.venue}
              icon={event.icon}
              index={i}
              inView={inView}
              theme={theme}
            />
          ))}
        </div>

        {/* Map button */}
        {mapsUrl && (
          <div
            className="text-center mt-12 relative z-10"
            style={{
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(10px)',
            }}
          >
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 px-8 py-3.5 border-2 ${theme.borderAccent} ${theme.fontLabel} text-xs tracking-widest ${theme.textAccent} relative overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
              style={{
                background: `linear-gradient(135deg, white 0%, ${theme.primaryLight}40 100%)`,
                boxShadow: `0 2px 12px ${theme.shadowColor}`,
              }}
            >
              {/* Shimmer effect on hover */}
              <span
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${theme.primaryLight}60 50%, transparent 100%)`,
                  backgroundSize: '200% 100%',
                  animation: 'btn-shimmer 2s linear infinite',
                }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <PinIcon color={theme.primaryHex} />
                OPEN IN MAPS
                <ExternalLinkIcon color={theme.primaryHex} />
              </span>
            </a>
          </div>
        )}

        {/* Bottom ornament */}
        <div
          className="flex items-center justify-center gap-3 mt-16 relative z-10"
          style={{
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
            opacity: inView ? 0.4 : 0,
          }}
        >
          <div className="h-px w-16" style={{ backgroundColor: theme.primaryHex }} />
          <span className="text-xs" style={{ color: theme.primaryHex }}>{theme.ornamentChar}</span>
          <div className="h-px w-16" style={{ backgroundColor: theme.primaryHex }} />
        </div>
      </div>
    </section>
  )
}
