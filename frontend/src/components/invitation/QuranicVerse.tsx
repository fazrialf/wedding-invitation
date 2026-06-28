'use client'

import { useInView } from 'react-intersection-observer'
import type { ThemeConfig } from '@/themes/config'

interface QuranicVerseProps {
  theme: ThemeConfig
}

export default function QuranicVerse({ theme }: QuranicVerseProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  return (
    <section
      ref={ref}
      className={`relative py-24 px-6 text-center overflow-hidden ${theme.bgSection2}`}
    >
      {/* Subtle top and bottom border lines */}
      <div className="max-w-lg mx-auto">
        {/* Top decorative border */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.primaryHex}40)`,
            }}
          />
          <span
            className={`${theme.fontLabel} text-xs tracking-[0.3em]`}
            style={{ color: `${theme.primaryHex}60` }}
          >
            {theme.ornamentChar}
          </span>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, ${theme.primaryHex}40, transparent)`,
            }}
          />
        </div>

        {/* Verse text */}
        <blockquote
          className={`
            ${theme.fontDisplay} text-xl md:text-2xl leading-relaxed italic
            transition-all duration-1000 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ color: theme.primaryHex }}
        >
          &ldquo;And among His signs is that He created for you mates from
          among yourselves, that you may dwell in tranquility with them, and
          He has put love and mercy between your hearts.&rdquo;
        </blockquote>

        {/* Arabic-style thin border frame around verse */}
        <div
          className="mt-8 mb-4 mx-auto"
          style={{
            width: '60%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${theme.primaryHex}25, transparent)`,
          }}
        />

        {/* Reference */}
        <p
          className={`
            ${theme.fontLabel} text-xs tracking-[0.35em] uppercase mt-6
            transition-all duration-1000 delay-300 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ color: `${theme.primaryHex}80` }}
        >
          (QS. Ar-Rum: 21)
        </p>

        {/* Bottom decorative border */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.primaryHex}40)`,
            }}
          />
          <span
            className={`${theme.fontLabel} text-xs tracking-[0.3em]`}
            style={{ color: `${theme.primaryHex}60` }}
          >
            {theme.ornamentChar}
          </span>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, ${theme.primaryHex}40, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  )
}
