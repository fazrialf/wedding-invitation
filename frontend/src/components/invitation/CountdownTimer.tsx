'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import type { ThemeConfig } from '@/themes/config'

interface CountdownTimerProps {
  weddingDate: string
  theme:       ThemeConfig
}

export default function CountdownTimer({ weddingDate, theme }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: false })

  useEffect(() => {
    const calc = () => {
      const now    = dayjs()
      const target = dayjs(weddingDate)
      const diff   = target.diff(now, 'second')

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: true })
        return
      }
      const days    = Math.floor(diff / 86400)
      const hours   = Math.floor((diff % 86400) / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60
      setTimeLeft({ days, hours, minutes, seconds, passed: false })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [weddingDate])

  const units = [
    { label: 'DAYS',    value: timeLeft.days },
    { label: 'HOURS',   value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ]

  return (
    <section className={`py-20 px-6 text-center ${theme.bgDark}`}>
      {timeLeft.passed ? (
        <div>
          <p className={`${theme.fontDisplay} text-5xl`} style={{ color: theme.primaryHex }}>
            We Are Married!
          </p>
        </div>
      ) : (
        <>
          <p className={`${theme.fontLabel} text-xs tracking-[0.4em] mb-2 opacity-60`}
            style={{ color: 'rgba(255,255,255,0.6)' }}>
            COUNTING DOWN
          </p>
          <h2 className={`${theme.fontHeading} text-3xl mb-12 ${theme.textDark === 'text-stone-100' ? 'text-stone-100' : 'text-white'}`}>
            Until The Big Day
          </h2>
          <div className="flex items-center justify-center gap-4 md:gap-10">
            {units.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className={`${theme.fontHeading} text-5xl md:text-7xl font-bold tabular-nums text-white`}>
                  {String(value).padStart(2, '0')}
                </div>
                <p className={`${theme.fontLabel} text-xs tracking-widest mt-2`}
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
