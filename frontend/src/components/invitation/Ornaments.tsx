'use client'

import React from 'react'
import type { ThemeConfig } from '@/themes/config'

// ─────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────
interface OrnamentBaseProps {
  theme: ThemeConfig
  className?: string
  style?: React.CSSProperties
  size?: number
}

const px = (n: number) => `${n}px`

// ─────────────────────────────────────────────────────────────
// CornerOrnament
// ─────────────────────────────────────────────────────────────
interface CornerOrnamentProps extends OrnamentBaseProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const CornerOrnament: React.FC<CornerOrnamentProps> = ({
  theme,
  position,
  className = '',
  style,
  size = 120,
}) => {
  const { slug, primaryHex } = theme
  const transforms: Record<string, string> = {
    'top-left': '',
    'top-right': 'scaleX(-1)',
    'bottom-left': 'scaleY(-1)',
    'bottom-right': 'scale(-1)',
  }

  // Gold: elegant swirl/wheat curl
  const goldPath = (
    <g fill="none" stroke={primaryHex} strokeWidth="1.5" strokeLinecap="round">
      <path d="M5,5 C5,35 35,55 5,85" opacity="0.5" />
      <path d="M5,5 C25,5 45,25 55,5" opacity="0.5" />
      <path d="M15,5 C15,25 35,40 25,60 Q20,70 30,75" />
      <path d="M5,15 C15,15 25,25 35,25 Q45,25 40,40 C35,50 25,50 25,60" />
      <circle cx="30" cy="75" r="3" fill={primaryHex} />
      <circle cx="25" cy="60" r="2" fill={primaryHex} />
      {/* Small decorative leaves */}
      <path d="M20,30 C25,25 30,28 28,33 C26,38 20,35 20,30Z" fill={primaryHex} opacity="0.3" />
      <path d="M35,18 C40,13 45,16 43,21 C41,26 35,23 35,18Z" fill={primaryHex} opacity="0.3" />
    </g>
  )

  // Silver: art deco geometric
  const silverPath = (
    <g fill="none" stroke={primaryHex} strokeWidth="1.2" strokeLinecap="round">
      <path d="M5,5 L5,60" opacity="0.6" />
      <path d="M5,5 L60,5" opacity="0.6" />
      <path d="M12,5 L12,50" opacity="0.3" />
      <path d="M5,12 L50,12" opacity="0.3" />
      <path d="M5,5 L30,30" />
      <rect x="22" y="22" width="16" height="16" transform="rotate(45 30 30)" strokeWidth="1" />
      <circle cx="30" cy="30" r="4" fill={primaryHex} opacity="0.4" />
      {/* Art deco fan */}
      <path d="M5,5 Q20,5 25,15" opacity="0.5" />
      <path d="M5,5 Q15,10 20,20" opacity="0.5" />
      <path d="M5,5 Q10,15 15,25" opacity="0.5" />
      <line x1="5" y1="40" x2="40" y2="5" strokeWidth="0.5" opacity="0.2" />
    </g>
  )

  // Dark: dramatic angular flourishes
  const darkPath = (
    <g fill="none" stroke={primaryHex} strokeWidth="1.8" strokeLinecap="round">
      <path d="M5,5 L5,70" opacity="0.7" />
      <path d="M5,5 L70,5" opacity="0.7" />
      <path d="M5,5 L50,50" strokeWidth="0.8" opacity="0.4" />
      <path d="M15,5 L15,40 Q15,50 25,55" />
      <path d="M5,15 L40,15 Q50,15 55,25" />
      <path d="M25,55 L30,50 L20,50 Z" fill={primaryHex} opacity="0.6" />
      <path d="M55,25 L50,30 L50,20 Z" fill={primaryHex} opacity="0.6" />
      {/* Angular accent lines */}
      <line x1="8" y1="8" x2="35" y2="8" strokeWidth="3" opacity="0.3" />
      <line x1="8" y1="8" x2="8" y2="35" strokeWidth="3" opacity="0.3" />
    </g>
  )

  // Floral: roses and petals
  const floralPath = (
    <g fill="none" stroke={primaryHex} strokeWidth="1.2" strokeLinecap="round">
      {/* Main rose cluster */}
      <circle cx="25" cy="25" r="12" fill={primaryHex} opacity="0.15" />
      <path d="M25,18 C28,22 28,28 25,32 C22,28 22,22 25,18Z" fill={primaryHex} opacity="0.4" />
      <path d="M18,25 C22,22 28,22 32,25 C28,28 22,28 18,25Z" fill={primaryHex} opacity="0.3" />
      <circle cx="25" cy="25" r="4" fill={primaryHex} opacity="0.5" />
      {/* Vine/stem */}
      <path d="M25,37 C30,45 20,55 15,65 Q12,72 8,75" />
      <path d="M25,37 C35,40 45,35 50,30 Q55,25 60,22" />
      {/* Small buds on vine */}
      <circle cx="42" cy="33" r="3" fill={primaryHex} opacity="0.3" />
      <circle cx="12" cy="68" r="2.5" fill={primaryHex} opacity="0.3" />
      {/* Leaves */}
      <path d="M35,42 C40,38 44,40 42,45 C40,50 35,47 35,42Z" fill={primaryHex} opacity="0.25" />
      <path d="M15,58 C12,54 8,56 10,60 C12,64 16,62 15,58Z" fill={primaryHex} opacity="0.25" />
    </g>
  )

  // Minimal: clean dots and lines
  const minimalPath = (
    <g fill="none" stroke={primaryHex} strokeWidth="1" strokeLinecap="round">
      <line x1="5" y1="5" x2="5" y2="50" opacity="0.4" />
      <line x1="5" y1="5" x2="50" y2="5" opacity="0.4" />
      <circle cx="5" cy="5" r="2.5" fill={primaryHex} opacity="0.6" />
      <circle cx="5" cy="20" r="1.5" fill={primaryHex} opacity="0.3" />
      <circle cx="5" cy="35" r="1.5" fill={primaryHex} opacity="0.3" />
      <circle cx="20" cy="5" r="1.5" fill={primaryHex} opacity="0.3" />
      <circle cx="35" cy="5" r="1.5" fill={primaryHex} opacity="0.3" />
    </g>
  )

  const ornamentMap: Record<string, React.ReactNode> = {
    gold: goldPath,
    silver: silverPath,
    dark: darkPath,
    floral: floralPath,
    minimal: minimalPath,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      style={{ transform: transforms[position], ...style }}
      aria-hidden="true"
    >
      {ornamentMap[slug] || ornamentMap.gold}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// DividerOrnament  (horizontal ornamental divider between sections)
// ─────────────────────────────────────────────────────────────
export const DividerOrnament: React.FC<OrnamentBaseProps> = ({
  theme,
  className = '',
  style,
  size = 40,
}) => {
  const { slug, primaryHex } = theme

  // Gold: ornate line with flourish
  const gold = (
    <g fill="none" stroke={primaryHex} strokeWidth="1" strokeLinecap="round">
      <line x1="10" y1="20" x2="180" y2="20" opacity="0.4" />
      {/* Center flourish */}
      <path d="M85,20 C90,10 95,10 100,15 C105,20 100,25 95,20" />
      <path d="M95,20 C100,10 105,10 110,15" />
      <path d="M105,20 C100,30 95,30 90,25" />
      <circle cx="100" cy="20" r="2" fill={primaryHex} />
      {/* End caps */}
      <circle cx="10" cy="20" r="2" fill={primaryHex} opacity="0.5" />
      <circle cx="190" cy="20" r="2" fill={primaryHex} opacity="0.5" />
      {/* Side flourishes */}
      <path d="M30,20 C35,15 40,15 45,20 C40,25 35,25 30,20Z" fill={primaryHex} opacity="0.15" />
      <path d="M155,20 C160,15 165,15 170,20 C165,25 160,25 155,20Z" fill={primaryHex} opacity="0.15" />
    </g>
  )

  // Silver: art deco geometric
  const silver = (
    <g fill="none" stroke={primaryHex} strokeWidth="1" strokeLinecap="round">
      <line x1="10" y1="20" x2="80" y2="20" opacity="0.3" />
      <line x1="120" y1="20" x2="190" y2="20" opacity="0.3" />
      {/* Center diamond chain */}
      {[85, 92, 99, 106, 113].map((x, i) => (
        <rect
          key={i}
          x={x - 3}
          y={17}
          width={6}
          height={6}
          transform={`rotate(45 ${x} 20)`}
          fill={i === 2 ? primaryHex : 'none'}
          opacity={i === 2 ? 0.5 : 0.4}
        />
      ))}
      <line x1="80" y1="16" x2="80" y2="24" opacity="0.3" />
      <line x1="120" y1="16" x2="120" y2="24" opacity="0.3" />
    </g>
  )

  // Dark: dramatic double line with angular accents
  const dark = (
    <g fill="none" stroke={primaryHex} strokeWidth="1.5" strokeLinecap="round">
      <line x1="10" y1="18" x2="85" y2="18" opacity="0.4" />
      <line x1="10" y1="22" x2="85" y2="22" opacity="0.4" />
      <line x1="115" y1="18" x2="190" y2="18" opacity="0.4" />
      <line x1="115" y1="22" x2="190" y2="22" opacity="0.4" />
      {/* Center angular accent */}
      <path d="M85,20 L95,12 L100,20 L105,12 L115,20" />
      <circle cx="100" cy="20" r="3" fill={primaryHex} opacity="0.6" />
      <path d="M85,20 L95,28 L100,20 L105,28 L115,20" opacity="0.5" />
    </g>
  )

  // Floral: vine divider with small flowers
  const floral = (
    <g fill="none" stroke={primaryHex} strokeWidth="1" strokeLinecap="round">
      <path d="M10,20 C30,15 50,25 70,20 C90,15 110,25 130,20 C150,15 170,25 190,20" opacity="0.4" />
      {/* Flowers at intervals */}
      {[50, 100, 150].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={20} r={6} fill={primaryHex} opacity="0.12" />
          <circle cx={cx} cy={20} r={3} fill={primaryHex} opacity="0.3" />
          {[0, 60, 120, 180, 240, 300].map((angle, j) => (
            <ellipse
              key={j}
              cx={cx + Math.cos((angle * Math.PI) / 180) * 5}
              cy={20 + Math.sin((angle * Math.PI) / 180) * 5}
              rx="2"
              ry="1.5"
              fill={primaryHex}
              opacity="0.2"
              transform={`rotate(${angle} ${cx + Math.cos((angle * Math.PI) / 180) * 5} ${20 + Math.sin((angle * Math.PI) / 180) * 5})`}
            />
          ))}
        </g>
      ))}
      {/* Small leaves along vine */}
      <path d="M30,17 C33,14 36,15 35,18 C34,21 30,20 30,17Z" fill={primaryHex} opacity="0.2" />
      <path d="M70,22 C73,25 76,24 75,21 C74,18 70,19 70,22Z" fill={primaryHex} opacity="0.2" />
      <path d="M130,17 C133,14 136,15 135,18 C134,21 130,20 130,17Z" fill={primaryHex} opacity="0.2" />
      <path d="M170,22 C173,25 176,24 175,21 C174,18 170,19 170,22Z" fill={primaryHex} opacity="0.2" />
    </g>
  )

  // Minimal: clean dots with line
  const minimal = (
    <g fill={primaryHex} stroke="none">
      <rect x="10" y="19.5" width="75" height="1" opacity="0.2" />
      <rect x="115" y="19.5" width="75" height="1" opacity="0.2" />
      {[90, 95, 100, 105, 110].map((x, i) => (
        <circle key={i} cx={x} cy={20} r={i === 2 ? 3 : 1.5} opacity={i === 2 ? 0.5 : 0.3} />
      ))}
    </g>
  )

  const svgMap: Record<string, React.ReactNode> = { gold, silver, dark, floral, minimal }

  return (
    <div className={`flex justify-center my-6 ${className}`} style={style} aria-hidden="true">
      <svg
        width="100%"
        height={size}
        viewBox="0 0 200 40"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: 500 }}
      >
        {svgMap[slug] || svgMap.gold}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FrameOrnament  (decorative frame for photos / content)
// ─────────────────────────────────────────────────────────────
export const FrameOrnament: React.FC<OrnamentBaseProps & { children?: React.ReactNode }> = ({
  theme,
  className = '',
  style,
  children,
}) => {
  const { slug, primaryHex } = theme

  // Border patterns per theme
  const getFrameStyle = (): React.CSSProperties => {
    switch (slug) {
      case 'gold':
        return {
          border: `2px solid ${primaryHex}`,
          borderRadius: '4px',
          boxShadow: `0 0 0 4px transparent, 0 0 0 5px ${primaryHex}33`,
          padding: '1.5rem',
        }
      case 'silver':
        return {
          border: `1px solid ${primaryHex}`,
          borderRadius: '0',
          outline: `2px solid ${primaryHex}33`,
          outlineOffset: '6px',
          padding: '1.5rem',
        }
      case 'dark':
        return {
          border: `3px solid ${primaryHex}`,
          borderRadius: '2px',
          boxShadow: `inset 0 0 30px ${primaryHex}11`,
          padding: '1.5rem',
        }
      case 'floral':
        return {
          border: `1.5px solid ${primaryHex}`,
          borderRadius: '12px',
          padding: '1.5rem',
        }
      case 'minimal':
        return {
          border: `1px solid ${primaryHex}33`,
          borderRadius: '0',
          padding: '1.5rem',
        }
      default:
        return { border: `1px solid ${primaryHex}`, padding: '1.5rem' }
    }
  }

  return (
    <div className={`relative ${className}`} style={{ ...getFrameStyle(), ...style }}>
      {/* Corner accents */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
        <div
          key={pos}
          className={`absolute ${
            pos === 'top-left' ? 'top-0 left-0' :
            pos === 'top-right' ? 'top-0 right-0' :
            pos === 'bottom-left' ? 'bottom-0 left-0' :
            'bottom-0 right-0'
          }`}
          style={{ transform: pos.includes('right') ? (pos.includes('bottom') ? 'scale(-1)' : 'scaleX(-1)') : pos.includes('bottom') ? 'scaleY(-1)' : undefined }}
        >
          <CornerOrnament theme={theme} position="top-left" size={40} />
        </div>
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FloralOrnament  (standalone floral SVG motif)
// ─────────────────────────────────────────────────────────────
export const FloralOrnament: React.FC<OrnamentBaseProps & { variant?: 'rose' | 'peony' | 'lily' }> = ({
  theme,
  className = '',
  style,
  size = 80,
  variant = 'rose',
}) => {
  const { primaryHex } = theme

  const rose = (
    <g>
      {/* Outer petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx={40 + Math.cos((angle * Math.PI) / 180) * 14}
          cy={40 + Math.sin((angle * Math.PI) / 180) * 14}
          rx="10"
          ry="6"
          fill={primaryHex}
          opacity={0.2 + (i % 2) * 0.1}
          transform={`rotate(${angle + 20} ${40 + Math.cos((angle * Math.PI) / 180) * 14} ${40 + Math.sin((angle * Math.PI) / 180) * 14})`}
        />
      ))}
      {/* Inner petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={`inner-${i}`}
          cx={40 + Math.cos(((angle + 36) * Math.PI) / 180) * 7}
          cy={40 + Math.sin(((angle + 36) * Math.PI) / 180) * 7}
          rx="6"
          ry="4"
          fill={primaryHex}
          opacity={0.35}
          transform={`rotate(${angle + 50} ${40 + Math.cos(((angle + 36) * Math.PI) / 180) * 7} ${40 + Math.sin(((angle + 36) * Math.PI) / 180) * 7})`}
        />
      ))}
      <circle cx="40" cy="40" r="5" fill={primaryHex} opacity="0.5" />
    </g>
  )

  const peony = (
    <g>
      {/* Large layered petals */}
      {[0, 51, 102, 153, 204, 255, 306].map((angle, i) => (
        <path
          key={i}
          d={`M40,40 Q${40 + Math.cos(((angle - 15) * Math.PI) / 180) * 20},${40 + Math.sin(((angle - 15) * Math.PI) / 180) * 20} ${40 + Math.cos((angle * Math.PI) / 180) * 24},${40 + Math.sin((angle * Math.PI) / 180) * 24} Q${40 + Math.cos(((angle + 15) * Math.PI) / 180) * 20},${40 + Math.sin(((angle + 15) * Math.PI) / 180) * 20} 40,40`}
          fill={primaryHex}
          opacity={0.15 + (i % 3) * 0.05}
        />
      ))}
      {[0, 90, 180, 270].map((angle, i) => (
        <ellipse
          key={`inner-${i}`}
          cx={40 + Math.cos(((angle + 45) * Math.PI) / 180) * 10}
          cy={40 + Math.sin(((angle + 45) * Math.PI) / 180) * 10}
          rx="8"
          ry="5"
          fill={primaryHex}
          opacity="0.3"
          transform={`rotate(${angle + 45} ${40 + Math.cos(((angle + 45) * Math.PI) / 180) * 10} ${40 + Math.sin(((angle + 45) * Math.PI) / 180) * 10})`}
        />
      ))}
      <circle cx="40" cy="40" r="6" fill={primaryHex} opacity="0.4" />
    </g>
  )

  const lily = (
    <g>
      {/* Long elegant petals */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <path
          key={i}
          d={`M40,40 Q${40 + Math.cos(((angle - 10) * Math.PI) / 180) * 15},${40 + Math.sin(((angle - 10) * Math.PI) / 180) * 15} ${40 + Math.cos((angle * Math.PI) / 180) * 28},${40 + Math.sin((angle * Math.PI) / 180) * 28} Q${40 + Math.cos(((angle + 10) * Math.PI) / 180) * 15},${40 + Math.sin(((angle + 10) * Math.PI) / 180) * 15} 40,40`}
          fill={primaryHex}
          opacity="0.2"
          stroke={primaryHex}
          strokeWidth="0.5"
          strokeOpacity="0.4"
        />
      ))}
      <circle cx="40" cy="40" r="4" fill={primaryHex} opacity="0.5" />
      {/* Stamens */}
      {[30, 90, 150, 210, 270, 330].map((angle, i) => (
        <line
          key={`s-${i}`}
          x1="40"
          y1="40"
          x2={40 + Math.cos((angle * Math.PI) / 180) * 12}
          y2={40 + Math.sin((angle * Math.PI) / 180) * 12}
          stroke={primaryHex}
          strokeWidth="0.5"
          opacity="0.4"
        />
      ))}
    </g>
  )

  const variants: Record<string, React.ReactNode> = { rose, peony, lily }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {variants[variant] || rose}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// LeafOrnament
// ─────────────────────────────────────────────────────────────
export const LeafOrnament: React.FC<OrnamentBaseProps & { variant?: 'single' | 'branch' | 'wreath' }> = ({
  theme,
  className = '',
  style,
  size = 60,
  variant = 'branch',
}) => {
  const { primaryHex } = theme

  const single = (
    <g fill={primaryHex} opacity="0.4" stroke={primaryHex} strokeWidth="0.5" strokeOpacity="0.3">
      <path d="M30,60 C20,45 15,25 30,10 C45,25 40,45 30,60Z" />
      <line x1="30" y1="60" x2="30" y2="15" strokeOpacity="0.5" strokeWidth="0.8" />
      {/* Veins */}
      <line x1="30" y1="25" x2="22" y2="30" strokeWidth="0.3" />
      <line x1="30" y1="35" x2="20" y2="40" strokeWidth="0.3" />
      <line x1="30" y1="25" x2="38" y2="30" strokeWidth="0.3" />
      <line x1="30" y1="35" x2="40" y2="40" strokeWidth="0.3" />
    </g>
  )

  const branch = (
    <g fill={primaryHex} stroke={primaryHex} strokeWidth="0.5" strokeLinecap="round">
      <path d="M10,50 C25,45 40,30 70,20" fill="none" strokeWidth="1.2" opacity="0.5" />
      {/* Leaves along branch */}
      {[
        { x: 20, y: 47, r: -30 },
        { x: 30, y: 42, r: -20 },
        { x: 40, y: 36, r: -15 },
        { x: 50, y: 30, r: -10 },
        { x: 58, y: 25, r: -5 },
      ].map(({ x, y, r }, i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x} cy={y - 5} rx="5" ry="3" fill={primaryHex} opacity={0.2 + i * 0.04} />
          <ellipse cx={x} cy={y + 5} rx="5" ry="3" fill={primaryHex} opacity={0.2 + i * 0.04} />
        </g>
      ))}
    </g>
  )

  const wreath = (
    <g fill="none" stroke={primaryHex} strokeWidth="0.8" strokeLinecap="round">
      {/* Circular arrangement of leaves */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16
        const rad = (angle * Math.PI) / 180
        const cx = 40 + Math.cos(rad) * 25
        const cy = 40 + Math.sin(rad) * 25
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="8"
            ry="4"
            fill={primaryHex}
            opacity={0.15 + (i % 3) * 0.05}
            transform={`rotate(${angle + 90} ${cx} ${cy})`}
          />
        )
      })}
      <circle cx="40" cy="40" r="25" strokeOpacity="0.1" fill="none" />
    </g>
  )

  const variants: Record<string, React.ReactNode> = { single, branch, wreath }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {variants[variant] || branch}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// BirdOrnament  (dove / swallow for wedding themes)
// ─────────────────────────────────────────────────────────────
export const BirdOrnament: React.FC<OrnamentBaseProps & { variant?: 'dove' | 'swallow' }> = ({
  theme,
  className = '',
  style,
  size = 60,
  variant = 'dove',
}) => {
  const { primaryHex } = theme

  const dove = (
    <g fill={primaryHex} stroke={primaryHex} strokeWidth="0.5" opacity="0.5">
      {/* Body */}
      <ellipse cx="40" cy="45" rx="8" ry="5" opacity="0.6" />
      {/* Head */}
      <circle cx="48" cy="40" r="3.5" opacity="0.6" />
      {/* Beak */}
      <path d="M51,40 L56,39 L51,38Z" fill={primaryHex} opacity="0.5" />
      {/* Wing */}
      <path d="M35,42 C25,30 20,20 30,15 C35,20 32,30 38,40" fill={primaryHex} opacity="0.3" />
      <path d="M33,40 C28,32 22,22 28,18 C32,22 30,32 35,38" fill={primaryHex} opacity="0.2" />
      {/* Tail */}
      <path d="M32,44 C25,42 20,45 18,50 C22,48 27,46 32,46" fill={primaryHex} opacity="0.3" />
      {/* Eye */}
      <circle cx="49" cy="39" r="0.8" fill={primaryHex} opacity="0.8" />
    </g>
  )

  const swallow = (
    <g fill="primary" stroke={primaryHex} strokeWidth="0.5" opacity="0.5">
      {/* Sleek body */}
      <path d="M20,40 Q30,35 45,38 Q50,40 45,42 Q30,45 20,40Z" fill={primaryHex} opacity="0.5" />
      {/* Upper wing */}
      <path d="M30,38 C22,25 18,15 28,10 C32,18 28,28 34,36" fill={primaryHex} opacity="0.35" />
      {/* Lower wing */}
      <path d="M32,42 C28,50 25,55 30,58 C33,52 30,47 35,43" fill={primaryHex} opacity="0.3" />
      {/* Forked tail */}
      <path d="M20,40 L8,32 L15,40 L8,48 Z" fill={primaryHex} opacity="0.3" />
      {/* Head detail */}
      <circle cx="47" cy="39" r="2.5" fill={primaryHex} opacity="0.5" />
      <path d="M49,39 L54,38 L49,37" fill={primaryHex} opacity="0.5" />
    </g>
  )

  const variants: Record<string, React.ReactNode> = { dove, swallow }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {variants[variant] || dove}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// GeometricPattern  (repeating geometric accent)
// ─────────────────────────────────────────────────────────────
export const GeometricPattern: React.FC<OrnamentBaseProps & {
  variant?: 'diamonds' | 'dots' | 'lines' | 'chevron' | 'hexagon'
}> = ({
  theme,
  className = '',
  style,
  size = 40,
  variant = 'dots',
}) => {
  const { primaryHex } = theme

  const dots = (
    <g fill={primaryHex}>
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={5 + col * 8}
            cy={5 + row * 8}
            r={1}
            opacity={0.15 + ((row + col) % 3) * 0.08}
          />
        ))
      )}
    </g>
  )

  const diamonds = (
    <g fill="none" stroke={primaryHex} strokeWidth="0.6">
      {Array.from({ length: 6 }).map((_, i) => (
        <rect
          key={i}
          x={5 + i * 14}
          y="12"
          width="10"
          height="10"
          transform={`rotate(45 ${10 + i * 14} 17)`}
          opacity={0.2 + (i % 2) * 0.1}
        />
      ))}
    </g>
  )

  const lines = (
    <g stroke={primaryHex} strokeWidth="0.8">
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={5 + i * 12}
          y1="5"
          x2={5 + i * 12}
          y2="35"
          opacity={0.1 + (i % 3) * 0.08}
        />
      ))}
    </g>
  )

  const chevron = (
    <g fill="none" stroke={primaryHex} strokeWidth="0.8" strokeLinecap="round">
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <path
            d={`M${10 + i * 16},30 L${18 + i * 16},10 L${26 + i * 16},30`}
            opacity={0.2 + (i % 2) * 0.1}
          />
        </g>
      ))}
    </g>
  )

  const hexagon = (
    <g fill="none" stroke={primaryHex} strokeWidth="0.5">
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => {
          const offset = row % 2 === 0 ? 0 : 9
          const cx = 10 + col * 18 + offset
          const cy = 10 + row * 16
          const r = 8
          const points = Array.from({ length: 6 })
            .map((_, i) => {
              const a = (60 * i - 30) * (Math.PI / 180)
              return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
            })
            .join(' ')
          return (
            <polygon
              key={`${row}-${col}`}
              points={points}
              opacity={0.1 + ((row + col) % 3) * 0.05}
            />
          )
        })
      )}
    </g>
  )

  const variants: Record<string, React.ReactNode> = { dots, diamonds, lines, chevron, hexagon }

  return (
    <svg
      width="100%"
      height={size}
      viewBox="0 0 80 40"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {variants[variant] || dots}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// VineOrnament  (long decorative vine for side borders)
// ─────────────────────────────────────────────────────────────
export const VineOrnament: React.FC<OrnamentBaseProps & { side?: 'left' | 'right' }> = ({
  theme,
  className = '',
  style,
  size = 40,
  side = 'left',
}) => {
  const { primaryHex } = theme

  return (
    <svg
      width={size}
      height="100%"
      viewBox="0 0 40 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined, ...style }}
      aria-hidden="true"
    >
      <g fill={primaryHex} stroke={primaryHex} strokeWidth="0.8" strokeLinecap="round">
        {/* Main vine */}
        <path
          d="M20,0 C25,30 15,60 20,90 C25,120 15,150 20,180 C22,190 20,200 20,200"
          fill="none"
          opacity="0.4"
        />
        {/* Leaves along vine */}
        {[20, 50, 80, 110, 140, 170].map((y, i) => {
          const dir = i % 2 === 0 ? 1 : -1
          const cx = 20 + dir * 10
          return (
            <g key={i}>
              <path
                d={`M20,${y} C${cx},${y - 5} ${cx + dir * 5},${y - 2} ${cx},${y + 3} C${cx - dir * 2},${y + 6} 20,${y + 3} 20,${y}Z`}
                opacity="0.25"
              />
              {/* Small bud */}
              <circle cx={cx} cy={y} r="1.5" opacity="0.3" />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// HeartOrnament
// ─────────────────────────────────────────────────────────────
export const HeartOrnament: React.FC<OrnamentBaseProps> = ({
  theme,
  className = '',
  style,
  size = 40,
}) => {
  const { primaryHex } = theme

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M20,35 C15,28 5,22 5,14 C5,8 10,5 15,5 C18,5 20,7 20,10 C20,7 22,5 25,5 C30,5 35,8 35,14 C35,22 25,28 20,35Z"
        fill={primaryHex}
        opacity="0.25"
        stroke={primaryHex}
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// RingOrnament (wedding rings motif)
// ─────────────────────────────────────────────────────────────
export const RingOrnament: React.FC<OrnamentBaseProps> = ({
  theme,
  className = '',
  style,
  size = 50,
}) => {
  const { primaryHex } = theme

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 40"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <g fill="none" stroke={primaryHex} strokeWidth="1.5" opacity="0.5">
        <circle cx="18" cy="22" r="10" />
        <circle cx="32" cy="22" r="10" />
        {/* Small diamond on left ring */}
        <path d="M18,12 L20,10 L22,12 L20,14Z" fill={primaryHex} opacity="0.4" />
      </g>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// StarBurstOrnament (sparkle/star accent)
// ─────────────────────────────────────────────────────────────
export const StarBurstOrnament: React.FC<OrnamentBaseProps> = ({
  theme,
  className = '',
  style,
  size = 30,
}) => {
  const { primaryHex } = theme
  const points = Array.from({ length: 8 })
    .map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180
      const r = i % 2 === 0 ? 14 : 6
      return `${20 + r * Math.cos(angle)},${20 + r * Math.sin(angle)}`
    })
    .join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <polygon points={points} fill={primaryHex} opacity="0.3" />
      <circle cx="20" cy="20" r="3" fill={primaryHex} opacity="0.5" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// MonogramFrame (circular frame for initials)
// ─────────────────────────────────────────────────────────────
export const MonogramFrame: React.FC<OrnamentBaseProps & { children?: React.ReactNode }> = ({
  theme,
  className = '',
  style,
  size = 120,
  children,
}) => {
  const { slug, primaryHex } = theme
  const r = 50

  const getOuterDecoration = () => {
    switch (slug) {
      case 'gold':
        return (
          <g>
            <circle cx="60" cy="60" r={r} fill="none" stroke={primaryHex} strokeWidth="1" opacity="0.4" />
            <circle cx="60" cy="60" r={r - 5} fill="none" stroke={primaryHex} strokeWidth="0.5" opacity="0.3" />
            {/* Laurel accents */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180
              const cx = 60 + Math.cos(angle) * (r + 5)
              const cy = 60 + Math.sin(angle) * (r + 5)
              return <circle key={i} cx={cx} cy={cy} r="1.5" fill={primaryHex} opacity="0.3" />
            })}
          </g>
        )
      case 'silver':
        return (
          <g>
            <circle cx="60" cy="60" r={r} fill="none" stroke={primaryHex} strokeWidth="1.5" opacity="0.3" />
            {/* Art deco lines */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180
              return (
                <line
                  key={i}
                  x1={60 + Math.cos(angle) * (r - 3)}
                  y1={60 + Math.sin(angle) * (r - 3)}
                  x2={60 + Math.cos(angle) * (r + 3)}
                  y2={60 + Math.sin(angle) * (r + 3)}
                  stroke={primaryHex}
                  strokeWidth="1"
                  opacity="0.4"
                />
              )
            })}
          </g>
        )
      default:
        return <circle cx="60" cy="60" r={r} fill="none" stroke={primaryHex} strokeWidth="1" opacity="0.3" />
    }
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size, ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 120 120" className="absolute inset-0" aria-hidden="true">
        {getOuterDecoration()}
      </svg>
      <div className="relative z-10 flex items-center justify-center w-full h-full">{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// All-in-one preset: FourCorners renders corner ornaments around a container
// ─────────────────────────────────────────────────────────────
export const FourCorners: React.FC<OrnamentBaseProps & { children?: React.ReactNode; cornerSize?: number }> = ({
  theme,
  className = '',
  style,
  children,
  cornerSize = 80,
}) => {
  return (
    <div className={`relative ${className}`} style={style}>
      <div className="absolute top-0 left-0" style={{ margin: -cornerSize / 4 }}>
        <CornerOrnament theme={theme} position="top-left" size={cornerSize} />
      </div>
      <div className="absolute top-0 right-0" style={{ margin: -cornerSize / 4 }}>
        <CornerOrnament theme={theme} position="top-right" size={cornerSize} />
      </div>
      <div className="absolute bottom-0 left-0" style={{ margin: -cornerSize / 4 }}>
        <CornerOrnament theme={theme} position="bottom-left" size={cornerSize} />
      </div>
      <div className="absolute bottom-0 right-0" style={{ margin: -cornerSize / 4 }}>
        <CornerOrnament theme={theme} position="bottom-right" size={cornerSize} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default {
  CornerOrnament,
  DividerOrnament,
  FrameOrnament,
  FloralOrnament,
  LeafOrnament,
  BirdOrnament,
  GeometricPattern,
  VineOrnament,
  HeartOrnament,
  RingOrnament,
  StarBurstOrnament,
  MonogramFrame,
  FourCorners,
}
