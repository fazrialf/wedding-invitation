'use client'

import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import type { ThemeConfig } from '@/themes/config'

interface HeroSectionProps {
  brideName:     string
  groomName:     string
  weddingDate:   string
  coverPhotoUrl?: string
  guestName?:    string
  theme:         ThemeConfig
}

/* ------------------------------------------------------------------ */
/*  Floating particle component                                       */
/* ------------------------------------------------------------------ */
function FloatingParticles({ count = 20, color }: { count?: number; color: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,          // 2-6 px
      delay: `${Math.random() * 8}s`,       // stagger start
      duration: `${6 + Math.random() * 8}s`, // 6-14 s float time
      opacity: 0.15 + Math.random() * 0.35,  // 0.15-0.5
    }))
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: p.left,
            bottom: '-8px',
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Inject keyframes once */}
      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: var(--particle-opacity, 0.3);
          }
          90% {
            opacity: var(--particle-opacity, 0.3);
          }
          100% {
            transform: translateY(-100vh) scale(0.4);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up linear infinite;
        }

        /* Staggered text reveal */
        @keyframes reveal-up {
          0% {
            opacity: 0;
            transform: translateY(24px) rotateX(40deg);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            filter: blur(0);
          }
        }
        .animate-reveal-up {
          animation: reveal-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Heartbeat for the ampersand */
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14%      { transform: scale(1.15); }
          28%      { transform: scale(1); }
          42%      { transform: scale(1.1); }
          56%      { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 2.4s ease-in-out infinite;
        }

        /* Elegant scroll cue */
        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%      { transform: translateY(8px); opacity: 1; }
        }
        .animate-gentle-bounce {
          animation: gentle-bounce 2.4s ease-in-out infinite;
        }

        /* Corner ornament fade-in */
        @keyframes corner-in {
          0%   { opacity: 0; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-corner-in {
          animation: corner-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Line expand for dividers */
        @keyframes line-expand {
          0%   { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        .animate-line-expand {
          animation: line-expand 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Decorative corner ornament (SVG)                                  */
/* ------------------------------------------------------------------ */
function CornerOrnament({
  position,
  color,
  delay = '0s',
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  color: string
  delay?: string
}) {
  const positionClasses = {
    'top-left':     'top-4 left-4 origin-top-left',
    'top-right':    'top-4 right-4 origin-top-right -scale-x-100',
    'bottom-left':  'bottom-4 left-4 origin-bottom-left -scale-y-100',
    'bottom-right': 'bottom-4 right-4 origin-bottom-right -scale-x-100 -scale-y-100',
  }

  return (
    <div
      className={`absolute ${positionClasses[position]} w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-0 animate-corner-in pointer-events-none`}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Ornate corner flourish */}
        <path
          d="M2 2 C2 2, 2 30, 2 40 Q2 55, 15 60 L40 70 Q55 75, 70 65 Q80 58, 75 40 C72 28, 60 20, 45 18 Q30 16, 20 25 Q12 32, 14 42"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M2 2 C2 2, 10 2, 20 2 Q35 2, 42 12 Q48 22, 38 32 Q30 40, 20 38 Q10 36, 8 26"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        {/* Small decorative dot at corner */}
        <circle cx="4" cy="4" r="2.5" fill={color} opacity="0.4" />
        {/* Leaf / scroll detail */}
        <path
          d="M8 8 Q18 4, 24 10 Q18 14, 8 8 Z"
          fill={color}
          opacity="0.12"
        />
        <path
          d="M8 8 Q4 18, 10 24 Q14 18, 8 8 Z"
          fill={color}
          opacity="0.12"
        />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Decorative divider with ornament                                  */
/* ------------------------------------------------------------------ */
function OrnamentalDivider({
  color,
  ornament,
  onPhoto,
  className = '',
}: {
  color: string
  ornament: string
  onPhoto: boolean
  className?: string
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div
        className="flex-1 h-px animate-line-expand origin-right"
        style={{
          background: `linear-gradient(90deg, transparent, ${onPhoto ? 'rgba(255,255,255,0.4)' : color + '40'})`,
        }}
      />
      <span
        className="text-sm opacity-50"
        style={{ color: onPhoto ? '#ffffff' : color }}
        aria-hidden="true"
      >
        {ornament}
      </span>
      <div
        className="flex-1 h-px animate-line-expand origin-left"
        style={{
          background: `linear-gradient(90deg, ${onPhoto ? 'rgba(255,255,255,0.4)' : color + '40'}, transparent)`,
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main HeroSection component                                        */
/* ------------------------------------------------------------------ */
export default function HeroSection({
  brideName,
  groomName,
  weddingDate,
  coverPhotoUrl,
  guestName,
  theme,
}: HeroSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (inView) {
      // Small delay so the section background fades in first
      const t = setTimeout(() => setShowContent(true), 200)
      return () => clearTimeout(t)
    }
  }, [inView])

  const dateStr = weddingDate
    ? new Date(weddingDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  /* Helper: is the hero using a cover photo (dark overlay)? */
  const onPhoto = !!coverPhotoUrl

  return (
    <section
      ref={ref}
      className={`relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 overflow-hidden ${theme.bgPage}`}
    >
      {/* ---- Multi-layer background gradient ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, ${theme.gradientFrom}30 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, ${theme.gradientTo}25 0%, transparent 60%),
            radial-gradient(ellipse at 0% 50%, ${theme.gradientFrom}15 0%, transparent 50%),
            radial-gradient(ellipse at 100% 50%, ${theme.gradientTo}15 0%, transparent 50%)
          `,
          opacity: onPhoto ? 0 : 1,
        }}
        aria-hidden="true"
      />

      {/* ---- Background pattern (subtle sparkle texture) ---- */}
      <div
        className="absolute inset-0 bg-pattern-sparkle pointer-events-none"
        style={{ opacity: theme.patternOpacity }}
        aria-hidden="true"
      />

      {/* ---- Secondary gradient overlay (angled) ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(160deg, ${theme.gradientFrom}88 0%, transparent 50%, ${theme.gradientTo}66 100%)`,
          opacity: onPhoto ? 0 : 0.2,
        }}
        aria-hidden="true"
      />

      {/* ---- Vignette soft edge effect ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.04)',
        }}
        aria-hidden="true"
      />

      {/* ---- Floating gold particles ---- */}
      <FloatingParticles count={24} color={theme.primaryHex} />

      {/* ---- Art graphics background ---- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Large decorative floral SVG pattern */}
        <svg className="absolute -top-20 -left-20 w-80 h-80 opacity-[0.06]" viewBox="0 0 200 200" fill="none">
          <path d="M100 20 C120 40, 160 40, 180 100 C160 160, 120 160, 100 180 C80 160, 40 160, 20 100 C40 40, 80 40, 100 20Z" stroke={theme.primaryHex} strokeWidth="1" fill="none"/>
          <path d="M100 40 C115 55, 145 55, 160 100 C145 145, 115 145, 100 160 C85 145, 55 145, 40 100 C55 55, 85 55, 100 40Z" stroke={theme.primaryHex} strokeWidth="0.5" fill="none"/>
          <circle cx="100" cy="100" r="15" stroke={theme.primaryHex} strokeWidth="0.5" fill="none"/>
          <circle cx="100" cy="100" r="5" fill={theme.primaryHex} opacity="0.1"/>
        </svg>
        <svg className="absolute -bottom-20 -right-20 w-80 h-80 opacity-[0.06]" viewBox="0 0 200 200" fill="none">
          <path d="M100 20 C120 40, 160 40, 180 100 C160 160, 120 160, 100 180 C80 160, 40 160, 20 100 C40 40, 80 40, 100 20Z" stroke={theme.primaryHex} strokeWidth="1" fill="none"/>
          <path d="M100 40 C115 55, 145 55, 160 100 C145 145, 115 145, 100 160 C85 145, 55 145, 40 100 C55 55, 85 55, 100 40Z" stroke={theme.primaryHex} strokeWidth="0.5" fill="none"/>
          <circle cx="100" cy="100" r="15" stroke={theme.primaryHex} strokeWidth="0.5" fill="none"/>
          <circle cx="100" cy="100" r="5" fill={theme.primaryHex} opacity="0.1"/>
        </svg>
        {/* Center decorative mandala */}
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.04]" viewBox="0 0 200 200" fill="none">
          {[0, 30, 60, 90, 120, 150].map(angle => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <path d="M100 30 Q110 65, 100 80 Q90 65, 100 30Z" fill={theme.primaryHex} opacity="0.3"/>
              <path d="M100 120 Q110 135, 100 170 Q90 135, 100 120Z" fill={theme.primaryHex} opacity="0.3"/>
            </g>
          ))}
          <circle cx="100" cy="100" r="25" stroke={theme.primaryHex} strokeWidth="0.5" fill="none"/>
          <circle cx="100" cy="100" r="50" stroke={theme.primaryHex} strokeWidth="0.3" fill="none"/>
          <circle cx="100" cy="100" r="75" stroke={theme.primaryHex} strokeWidth="0.2" fill="none"/>
        </svg>
      </div>

      {/* ---- Decorative corner ornaments ---- */}
      <CornerOrnament
        position="top-left"
        color={onPhoto ? '#ffffff' : theme.primaryHex}
        delay="0.8s"
      />
      <CornerOrnament
        position="top-right"
        color={onPhoto ? '#ffffff' : theme.primaryHex}
        delay="1.0s"
      />
      <CornerOrnament
        position="bottom-left"
        color={onPhoto ? '#ffffff' : theme.primaryHex}
        delay="1.2s"
      />
      <CornerOrnament
        position="bottom-right"
        color={onPhoto ? '#ffffff' : theme.primaryHex}
        delay="1.4s"
      />

      {/* ---- Main content ---- */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        {/* Top label */}
        <p
          className={`
            ${theme.fontLabel} text-xs tracking-[0.5em] mb-8
            ${onPhoto ? 'text-white/70' : theme.textAccent}
            opacity-0 ${showContent ? 'animate-reveal-up' : ''}
          `}
          style={{ animationDelay: '0.2s' }}
        >
          THE WEDDING OF
        </p>

        {/* Top ornamental divider */}
        <div
          className={`w-32 mb-8 opacity-0 ${showContent ? 'animate-reveal-up' : ''}`}
          style={{ animationDelay: '0.3s' }}
        >
          <OrnamentalDivider
            color={theme.primaryHex}
            ornament={theme.ornamentChar}
            onPhoto={onPhoto}
          />
        </div>

        {/* Bride name */}
        <h1
          className={`
            ${theme.fontDisplay} text-6xl md:text-7xl lg:text-8xl leading-tight
            ${onPhoto ? 'text-white' : theme.textDark}
            opacity-0 ${showContent ? 'animate-reveal-up' : ''}
          `}
          style={{ animationDelay: '0.45s' }}
        >
          {brideName}
        </h1>

        {/* Ampersand with heartbeat */}
        <p
          className={`
            ${theme.fontLabel} text-3xl tracking-[0.4em] my-4
            ${onPhoto ? 'text-white/80' : theme.textAccent}
            opacity-0 ${showContent ? 'animate-reveal-up animate-heartbeat' : ''}
          `}
          style={{ animationDelay: '0.7s' }}
        >
          &amp;
        </p>

        {/* Groom name */}
        <h1
          className={`
            ${theme.fontDisplay} text-6xl md:text-7xl lg:text-8xl leading-tight
            ${onPhoto ? 'text-white' : theme.textDark}
            opacity-0 ${showContent ? 'animate-reveal-up' : ''}
          `}
          style={{ animationDelay: '0.95s' }}
        >
          {groomName}
        </h1>

        {/* Bottom ornamental divider */}
        <div
          className={`w-32 mt-8 opacity-0 ${showContent ? 'animate-reveal-up' : ''}`}
          style={{ animationDelay: '1.05s' }}
        >
          <OrnamentalDivider
            color={theme.primaryHex}
            ornament={theme.ornamentChar}
            onPhoto={onPhoto}
          />
        </div>

        {/* Date section */}
        <div
          className={`mt-8 opacity-0 ${showContent ? 'animate-reveal-up' : ''}`}
          style={{ animationDelay: '1.2s' }}
        >
          {/* Decorative ornament character above date */}
          <p
            className={`text-lg mb-3 ${onPhoto ? 'text-white/40' : theme.textAccent}`}
            style={{ opacity: 0.5 }}
            aria-hidden="true"
          >
            {theme.ornamentChar}
          </p>

          <div
            className={`w-20 h-px mx-auto mb-4 ${
              onPhoto ? 'bg-white/50' : theme.borderAccent
            }`}
          />
          <p
            className={`${theme.fontLabel} text-xs tracking-[0.3em] ${
              onPhoto ? 'text-white/70' : theme.textMuted
            }`}
          >
            {dateStr.toUpperCase()}
          </p>
          <div
            className={`w-20 h-px mx-auto mt-4 ${
              onPhoto ? 'bg-white/50' : theme.borderAccent
            }`}
          />
        </div>

        {/* Guest greeting */}
        {guestName && (
          <div
            className={`mt-10 opacity-0 ${showContent ? 'animate-reveal-up' : ''}`}
            style={{ animationDelay: '1.45s' }}
          >
            <p
              className={`${theme.fontBody} text-sm ${
                onPhoto ? 'text-white/70' : theme.textMuted
              }`}
            >
              Dear,{' '}
              <span className={`${theme.fontHeading} italic font-medium`}>{guestName}</span>
            </p>
          </div>
        )}

        {/* ---- Elegant scroll cue ---- */}
        <div
          className={`mt-20 opacity-0 ${showContent ? 'animate-gentle-bounce' : ''}`}
          style={{ animationDelay: '1.8s' }}
        >
          <div className="flex flex-col items-center gap-1">
            {/* Thin vertical line leading to chevron */}
            <span
              className={`block w-px h-10 ${
                onPhoto ? 'bg-white/30' : 'bg-current ' + theme.textMuted
              }`}
              style={{ opacity: 0.4 }}
            />
            <svg
              className={`w-5 h-5 ${onPhoto ? 'text-white/50' : theme.textMuted}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
