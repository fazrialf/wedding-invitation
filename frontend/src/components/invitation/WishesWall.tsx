'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import type { ThemeConfig } from '@/themes/config'

interface Wish {
  id: string
  guest_name: string
  message: string
  created_at: string
}

interface WishesWallProps {
  invitationId: string
  theme: ThemeConfig
}

export default function WishesWall({ invitationId, theme }: WishesWallProps) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  useEffect(() => {
    axios.get(`/api/wishes/${invitationId}`)
      .then(r => setWishes(r.data))
      .catch(() => {})
  }, [invitationId])

  if (wishes.length === 0) return null

  return (
    <section ref={ref} className={`py-24 px-6 ${theme.bgSection2}`}>
      <div className="max-w-lg mx-auto text-center">
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
          UCAPAN
        </p>
        <h2
          className={`
            ${theme.fontHeading} text-3xl md:text-4xl mb-12
            transition-all duration-1000 delay-100 ease-out
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ color: theme.primaryHex }}
        >
          Wishes
        </h2>

        {/* Wishes list */}
        <div className="space-y-8">
          {wishes.map((wish, index) => (
            <div
              key={wish.id}
              className={`
                transition-all duration-700 ease-out
                ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
              `}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <p
                className={`${theme.fontBody} text-sm md:text-base italic leading-relaxed mb-3`}
                style={{ color: `${theme.primaryHex}90` }}
              >
                &ldquo;{wish.message}&rdquo;
              </p>
              <p
                className={`${theme.fontLabel} text-xs tracking-[0.2em] uppercase font-semibold`}
                style={{ color: theme.primaryHex }}
              >
                {wish.guest_name}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom ornament */}
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
