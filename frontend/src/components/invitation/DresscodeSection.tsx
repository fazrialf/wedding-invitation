'use client'

import { useInView } from 'react-intersection-observer'
import type { ThemeConfig } from '@/themes/config'

interface DresscodeSectionProps {
  theme: ThemeConfig
}

const colorPalette = [
  { label: 'Family Mira', color: '#1B3A5C', borderColor: '#1B3A5C' },
  { label: 'Family Ibrahim', color: '#6B1D2A', borderColor: '#6B1D2A' },
  { label: 'Pengantin', color: '#89CFF0', borderColor: '#89CFF0' },
  { label: 'Hall Deco', color: '#FFFFFF', borderColor: '#E0E0E0' },
]

export default function DresscodeSection({ theme }: DresscodeSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  return (
    <section
      ref={ref}
      className={`py-24 px-6 text-center ${theme.bgSection1}`}
    >
      <div className="max-w-md mx-auto">
        {/* Title */}
        <p
          className={`
            ${theme.fontLabel} text-xs tracking-[0.4em] uppercase mb-3
            transition-all duration-1000 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ color: `${theme.primaryHex}80` }}
        >
          WHAT TO WEAR
        </p>
        <h2
          className={`
            ${theme.fontHeading} text-3xl md:text-4xl mb-16 ${theme.textDark}
            transition-all duration-1000 delay-100 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          Dresscode
        </h2>

        {/* Color circles */}
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
          {colorPalette.map((item, index) => (
            <div
              key={item.label}
              className={`
                flex flex-col items-center gap-4
                transition-all duration-700 ease-out
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
              `}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Color circle */}
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-sm"
                style={{
                  backgroundColor: item.color,
                  border: `1.5px solid ${item.borderColor}`,
                  boxShadow: `0 2px 12px ${item.color}20`,
                }}
              />
              {/* Label */}
              <p
                className={`${theme.fontBody} text-xs md:text-sm`}
                style={{ color: `${theme.textDark === 'text-[#2C2C2C]' ? '#2C2C2C' : theme.primaryHex}90` }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
