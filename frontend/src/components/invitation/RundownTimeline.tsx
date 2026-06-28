'use client'

import { useInView } from 'react-intersection-observer'
import type { ThemeConfig } from '@/themes/config'

interface RundownTimelineProps {
  theme: ThemeConfig
}

const events = [
  { time: '11:30 AM', label: 'Ketibaan Tetamu' },
  { time: '12:00 PM', label: 'Perarakan Masuk Pengantin' },
  { time: '12:30 PM', label: 'Jamuan Makan' },
  { time: '1:00 PM', label: 'Sesi Santai / Ramah Mesra' },
  { time: '1:30 PM', label: 'Sesi Bergambar' },
  { time: '4:00 PM', label: 'Majlis Selesai' },
]

export default function RundownTimeline({ theme }: RundownTimelineProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  return (
    <section
      ref={ref}
      className={`relative py-24 px-6 text-center overflow-hidden ${theme.bgSection2}`}
    >
      <div className="relative z-10 max-w-md mx-auto">
        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div
            className="h-px w-16"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryHex}40)` }}
          />
          <span
            className={`${theme.fontLabel} text-xs tracking-[0.3em]`}
            style={{ color: `${theme.primaryHex}60` }}
          >
            {theme.ornamentChar}
          </span>
          <div
            className="h-px w-16"
            style={{ background: `linear-gradient(90deg, ${theme.primaryHex}40, transparent)` }}
          />
        </div>

        {/* Title */}
        <p
          className={`
            ${theme.fontLabel} text-xs tracking-[0.4em] uppercase mb-3
            transition-all duration-1000 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ color: `${theme.primaryHex}80` }}
        >
          ATURCARA MAJLIS
        </p>
        <h2
          className={`
            ${theme.fontHeading} text-3xl md:text-4xl mb-12
            transition-all duration-1000 delay-100 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ color: theme.primaryHex }}
        >
          Rundown
        </h2>

        {/* Schedule list */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <div
              key={event.time}
              className={`
                flex items-baseline justify-center gap-3
                transition-all duration-700 ease-out
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
              `}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <p
                className={`${theme.fontLabel} text-xs tracking-[0.15em] whitespace-nowrap`}
                style={{ color: `${theme.primaryHex}90` }}
              >
                {event.time}
              </p>
              <span
                className="text-xs"
                style={{ color: `${theme.primaryHex}50` }}
              >
                :
              </span>
              <p
                className={`${theme.fontBody} text-sm md:text-base`}
                style={{ color: theme.textDark ? undefined : theme.primaryDark }}
              >
                {event.label}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom ornamental divider */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div
            className="h-px w-16"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryHex}40)` }}
          />
          <span
            className={`${theme.fontLabel} text-xs tracking-[0.3em]`}
            style={{ color: `${theme.primaryHex}60` }}
          >
            {theme.ornamentChar}
          </span>
          <div
            className="h-px w-16"
            style={{ background: `linear-gradient(90deg, ${theme.primaryHex}40, transparent)` }}
          />
        </div>
      </div>
    </section>
  )
}
