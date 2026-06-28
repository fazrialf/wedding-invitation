'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ThemeConfig } from '@/themes/config'

interface EnvelopeOpenerProps {
  onOpen:     () => void
  brideName:  string
  groomName:  string
  guestName?: string
  theme:      ThemeConfig
}

/* ─── Particle helpers ─────────────────────────────────── */

type Particle = {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  rotation: number
  shape: 'circle' | 'petal' | 'star' | 'diamond'
}

function generateParticles(slug: string): Particle[] {
  const count = 36
  const particles: Particle[] = []
  const shapeMap: Record<string, Particle['shape']> = {
    gold:    'star',
    silver:  'diamond',
    dark:    'star',
    floral:  'petal',
    minimal: 'circle',
  }
  const shape = shapeMap[slug] || 'circle'

  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 1.5,
      duration: 1.2 + Math.random() * 1.8,
      rotation: Math.random() * 360,
      shape,
    })
  }
  return particles
}

function ParticleSVG({ p, color }: { p: Particle; color: string }) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${p.x}%`,
    top: `${p.y}%`,
    width: p.size,
    height: p.size,
    animationDelay: `${p.delay}s`,
    animationDuration: `${p.duration}s`,
    transform: `rotate(${p.rotation}deg)`,
  }

  if (p.shape === 'petal') {
    return (
      <svg style={style} className="animate-particle-float" viewBox="0 0 20 20" fill={color}>
        <ellipse cx="10" cy="10" rx="5" ry="9" transform="rotate(30 10 10)" opacity="0.8" />
      </svg>
    )
  }
  if (p.shape === 'star') {
    return (
      <svg style={style} className="animate-particle-float" viewBox="0 0 20 20" fill={color}>
        <polygon points="10,1 12.5,7.5 19,7.5 14,12 16,19 10,15 4,19 6,12 1,7.5 7.5,7.5" opacity="0.7" />
      </svg>
    )
  }
  if (p.shape === 'diamond') {
    return (
      <svg style={style} className="animate-particle-float" viewBox="0 0 20 20" fill={color}>
        <polygon points="10,0 20,10 10,20 0,10" opacity="0.6" />
      </svg>
    )
  }
  // circle
  return (
    <div
      className="animate-particle-float rounded-full"
      style={{ ...style, backgroundColor: color, opacity: 0.5 }}
    />
  )
}

/* ─── Main component ───────────────────────────────────── */

export default function EnvelopeOpener({ onOpen, brideName, groomName, guestName, theme }: EnvelopeOpenerProps) {
  const [phase, setPhase] = useState<'idle' | 'seal-break' | 'flap-open' | 'slide-out' | 'done'>('idle')
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(generateParticles(theme.slug))
  }, [theme.slug])

  const handleOpen = useCallback(() => {
    if (phase !== 'idle') return

    // Phase 1: Seal breaks (0ms)
    setPhase('seal-break')

    // Phase 2: Flap opens (400ms)
    setTimeout(() => setPhase('flap-open'), 400)

    // Phase 3: Card slides out (900ms)
    setTimeout(() => setPhase('slide-out'), 900)

    // Phase 4: Done — notify parent (1800ms)
    setTimeout(() => {
      setPhase('done')
      onOpen()
    }, 1800)
  }, [phase, onOpen])

  const isAnimating = phase !== 'idle' && phase !== 'done'

  return (
    <>
      {/* Inject @keyframes via a style tag */}
      <style jsx global>{`
        @keyframes seal-crack {
          0%   { transform: scale(1) rotate(0deg); opacity: 1; }
          30%  { transform: scale(1.3) rotate(-5deg); opacity: 1; }
          60%  { transform: scale(1.5) rotate(8deg); opacity: 0.6; }
          100% { transform: scale(2.0) rotate(0deg); opacity: 0; filter: blur(4px); }
        }
        @keyframes seal-halves {
          0%   { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(var(--dx, 20px)) rotate(var(--rot, 15deg)); opacity: 0; }
        }
        @keyframes envelope-body-lift {
          0%   { transform: perspective(800px) rotateX(0deg) translateZ(0); }
          100% { transform: perspective(800px) rotateX(-5deg) translateZ(10px); }
        }
        @keyframes flap-open {
          0%   { transform: perspective(800px) rotateX(0deg); }
          100% { transform: perspective(800px) rotateX(-180deg); }
        }
        @keyframes card-slide {
          0%   { transform: translateY(0); opacity: 0.9; }
          40%  { transform: translateY(-60px); opacity: 1; }
          100% { transform: translateY(-130px); opacity: 1; }
        }
        @keyframes fade-away {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.08); filter: blur(6px); }
        }
        @keyframes particle-float {
          0%   { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20%  { opacity: 1; transform: translate(calc((var(--px, 0.5) - 0.5) * 80px), -20px) scale(1) rotate(60deg); }
          100% { opacity: 0; transform: translate(calc((var(--px, 0.5) - 0.5) * 200px), -160px) scale(0.4) rotate(240deg); }
        }
        @keyframes shimmer-line {
          0%   { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes envelope-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
          50%      { box-shadow: 0 0 24px 4px ${theme.primaryHex}33; }
        }
        .animate-seal-crack    { animation: seal-crack 0.4s ease-out forwards; }
        .animate-seal-half-l   { animation: seal-halves 0.5s ease-out forwards; --dx: -30px; --rot: -25deg; }
        .animate-seal-half-r   { animation: seal-halves 0.5s ease-out forwards; --dx: 30px; --rot: 25deg; }
        .animate-flap-open     { animation: flap-open 0.6s ease-in-out forwards; transform-origin: top center; }
        .animate-card-slide    { animation: card-slide 0.7s ease-out forwards; }
        .animate-fade-away     { animation: fade-away 0.5s ease-in forwards; }
        .animate-particle-float{ animation: particle-float 2s ease-out forwards; }
        .animate-float         { animation: envelope-float 3s ease-in-out infinite; }
        .animate-pulse-glow    { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <div className={`min-h-screen flex flex-col items-center justify-center px-6 ${theme.bgPage} overflow-hidden relative`}>
        {/* Label */}
        <p className={`${theme.fontLabel} text-xs tracking-[0.5em] ${theme.textAccent} mb-8 opacity-60 ${isAnimating || phase === 'done' ? 'animate-fade-away' : ''}`}>
          WEDDING INVITATION
        </p>

        {/* ─── 3D Envelope wrapper ──────────────────────── */}
        <div
          className={`relative select-none ${phase === 'done' ? 'animate-fade-away' : ''}`}
          style={{ width: 300, height: 220, perspective: 800 }}
        >
          {/* Envelope body */}
          <div
            className={`absolute inset-0 ${phase === 'idle' ? 'animate-float' : ''}`}
            style={phase === 'slide-out' || phase === 'done' ? { animation: 'envelope-body-lift 0.5s ease-out forwards' } : undefined}
          >
            {/* SVG envelope shape with decorative borders */}
            <svg viewBox="0 0 300 220" className="w-full h-full drop-shadow-xl">
              {/* Main body */}
              <rect x="2" y="2" width="296" height="216" rx="4" fill="white" stroke={theme.primaryHex} strokeWidth="1.5" />

              {/* Decorative border pattern */}
              <rect x="8" y="8" width="284" height="204" rx="2" fill="none" stroke={theme.primaryHex} strokeWidth="0.5" strokeDasharray="4 3" opacity="0.4" />
              <rect x="14" y="14" width="272" height="192" rx="2" fill="none" stroke={theme.primaryHex} strokeWidth="0.3" opacity="0.2" />

              {/* Corner ornaments */}
              <g opacity="0.3" stroke={theme.primaryHex} strokeWidth="0.8" fill="none">
                {/* Top-left */}
                <path d="M22,22 C22,22 30,22 35,28 M22,22 C22,22 22,30 28,35" />
                {/* Top-right */}
                <path d="M278,22 C278,22 270,22 265,28 M278,22 C278,22 278,30 272,35" />
                {/* Bottom-left */}
                <path d="M22,198 C22,198 30,198 35,192 M22,198 C22,198 22,190 28,185" />
                {/* Bottom-right */}
                <path d="M278,198 C278,198 270,198 265,192 M278,198 C278,198 278,190 272,185" />
              </g>

              {/* V-fold lines (inside the envelope) */}
              <line x1="0" y1="220" x2="150" y2="90" stroke={theme.primaryHex} strokeWidth="0.5" opacity="0.15" />
              <line x1="300" y1="220" x2="150" y2="90" stroke={theme.primaryHex} strokeWidth="0.5" opacity="0.15" />

              {/* Bottom fold accent */}
              <path d="M0,220 L150,140 L300,220" fill="none" stroke={theme.primaryHex} strokeWidth="0.4" opacity="0.2" />
            </svg>

            {/* Inner shading overlay for depth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent 30%, ${theme.primaryHex}08 100%)`,
                borderRadius: 4,
              }}
            />
          </div>

          {/* ─── Flap ─────────────────────────────────── */}
          <div
            className={`absolute top-0 left-0 w-full ${phase === 'flap-open' || phase === 'slide-out' || phase === 'done' ? 'animate-flap-open' : ''}`}
            style={{
              height: '50%',
              transformOrigin: 'top center',
              zIndex: 10,
              pointerEvents: phase === 'idle' ? 'auto' : 'none',
            }}
          >
            <svg viewBox="0 0 300 110" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
              <path
                d="M0,0 L300,0 L150,110 Z"
                fill="white"
                stroke={theme.primaryHex}
                strokeWidth="1.5"
              />
              {/* Decorative lines on flap */}
              <path d="M20,5 L150,90 L280,5" fill="none" stroke={theme.primaryHex} strokeWidth="0.4" opacity="0.25" />
              <path d="M35,5 L150,78 L265,5" fill="none" stroke={theme.primaryHex} strokeWidth="0.3" strokeDasharray="3 3" opacity="0.2" />
            </svg>
          </div>

          {/* ─── Wax seal ──────────────────────────────── */}
          {phase !== 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
              {phase === 'seal-break' ? (
                /* Break animation: two halves fly apart */
                <div className="relative" style={{ width: 56, height: 56 }}>
                  <div
                    className="absolute left-0 top-0 w-full h-full animate-seal-half-l"
                    style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
                  >
                    <SealSVG color={theme.primaryHex} ornament={theme.ornamentChar} />
                  </div>
                  <div
                    className="absolute left-0 top-0 w-full h-full animate-seal-half-r"
                    style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
                  >
                    <SealSVG color={theme.primaryHex} ornament={theme.ornamentChar} />
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {phase === 'idle' && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer animate-pulse-glow"
              style={{ zIndex: 20 }}
              onClick={handleOpen}
              onTouchEnd={(e) => { e.preventDefault(); handleOpen() }}
              role="button"
              aria-label="Open your invitation"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl border-2 shadow-lg transition-transform hover:scale-110 active:scale-95"
                style={{
                  borderColor: theme.primaryHex,
                  color: theme.primaryHex,
                  background: `radial-gradient(circle, white 40%, ${theme.primaryHex}18 100%)`,
                }}
              >
                {theme.ornamentChar}
              </div>
            </div>
          )}

          {/* ─── Card sliding out ─────────────────────── */}
          {(phase === 'slide-out' || phase === 'done') && (
            <div
              className="absolute left-1/2 -translate-x-1/2 animate-card-slide"
              style={{ bottom: 40, zIndex: 30, width: 240 }}
            >
              <div
                className="rounded-lg shadow-2xl p-6 text-center"
                style={{
                  background: 'white',
                  border: `1px solid ${theme.primaryHex}40`,
                }}
              >
                <p className={`${theme.fontLabel} text-[9px] tracking-[0.4em] ${theme.textMuted} uppercase mb-3`}>
                  Together with their families
                </p>
                <h2 className={`${theme.fontDisplay} text-2xl ${theme.textDark} leading-snug`}>
                  {brideName}
                </h2>
                <p className={`${theme.fontLabel} text-xs tracking-[0.3em] ${theme.textAccent} my-1`}>&amp;</p>
                <h2 className={`${theme.fontDisplay} text-2xl ${theme.textDark} leading-snug`}>
                  {groomName}
                </h2>
                <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${theme.primaryHex}20` }}>
                  <p className={`${theme.fontBody} text-[10px] ${theme.textMuted}`}>
                    request the pleasure of your company
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Couple names (below envelope, before open) ─── */}
        <div className={`mt-10 text-center transition-all duration-500 ${isAnimating || phase === 'done' ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
          <h1 className={`${theme.fontDisplay} text-5xl ${theme.textDark} leading-tight`}>
            {brideName}
          </h1>
          <p className={`${theme.fontLabel} text-sm tracking-[0.4em] ${theme.textAccent} my-2`}>&amp;</p>
          <h1 className={`${theme.fontDisplay} text-5xl ${theme.textDark} leading-tight`}>
            {groomName}
          </h1>
        </div>

        {/* Guest greeting */}
        {guestName && (
          <div className={`mt-6 text-center transition-all duration-500 ${isAnimating || phase === 'done' ? 'opacity-0 translate-y-4' : 'opacity-100'}`}>
            <p className={`${theme.fontBody} text-sm ${theme.textMuted}`}>Dear</p>
            <p className={`${theme.fontHeading} text-xl ${theme.textDark} mt-1`}>{guestName}</p>
          </div>
        )}

        {/* CTA */}
        {phase === 'idle' && (
          <button
            onClick={handleOpen}
            className={`mt-10 px-10 py-4 border ${theme.borderAccent} ${theme.fontLabel} text-xs tracking-[0.3em] ${theme.textAccent} hover:opacity-70 active:scale-95 transition-all duration-300`}
          >
            OPEN INVITATION
          </button>
        )}

        {phase === 'idle' && (
          <p className={`mt-4 ${theme.fontBody} text-xs ${theme.textMuted} opacity-50`}>
            tap the seal or button to open
          </p>
        )}

        {/* ─── Particles ──────────────────────────────── */}
        {(phase === 'slide-out' || phase === 'done') && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
            {particles.map((p) => (
              <ParticleSVG key={p.id} p={p} color={theme.primaryHex} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

/* ─── Seal SVG sub-component ────────────────────────────── */

function SealSVG({ color, ornament }: { color: string; ornament: string }) {
  return (
    <svg viewBox="0 0 56 56" className="w-full h-full">
      {/* Wax base with scalloped edge */}
      <circle cx="28" cy="28" r="26" fill={color} opacity="0.9" />
      <circle cx="28" cy="28" r="22" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
      <circle cx="28" cy="28" r="18" fill="none" stroke="white" strokeWidth="0.3" opacity="0.2" />
      {/* Highlight */}
      <ellipse cx="23" cy="22" rx="8" ry="5" fill="white" opacity="0.12" transform="rotate(-20 23 22)" />
      {/* Ornament text */}
      <text
        x="28"
        y="34"
        textAnchor="middle"
        fontSize="16"
        fill="white"
        opacity="0.9"
      >
        {ornament}
      </text>
    </svg>
  )
}
