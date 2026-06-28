'use client'

import React from 'react'
import type { ThemeConfig } from '@/themes/config'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface SectionDividerProps {
  theme: ThemeConfig
  variant?: 'wave' | 'curve' | 'diagonal' | 'zigzag' | 'floral'
  flip?: boolean
  className?: string
  style?: React.CSSProperties
  /** Height of the divider in pixels */
  height?: number
  /** Override the "from" background color (hex). Defaults to theme bgSection1 mapped color. */
  colorFrom?: string
  /** Override the "to" background color (hex). Defaults to theme bgSection2 mapped color. */
  colorTo?: string
}

// Helper: map tailwind bg class to approximate hex for gradient blending
const tailwindBgToHex: Record<string, string> = {
  'bg-white': '#ffffff',
  'bg-stone-50': '#fafaf9',
  'bg-stone-900': '#1c1917',
  'bg-stone-950': '#0c0a09',
  'bg-slate-50': '#f8fafc',
  'bg-slate-800': '#1e293b',
  'bg-rose-50': '#fff1f2',
  'bg-rose-900': '#881337',
  'bg-black': '#000000',
}

function resolveBgColor(twClass: string): string {
  return tailwindBgToHex[twClass] || '#ffffff'
}

// ─────────────────────────────────────────────────────────────
// SVG path generators per variant
// ─────────────────────────────────────────────────────────────

/** Gentle sine wave */
function wavePath(width: number, height: number): string {
  const mid = height / 2
  const amp = height * 0.35
  return [
    `M0,${mid}`,
    `Q${width * 0.15},${mid - amp} ${width * 0.25},${mid}`,
    `Q${width * 0.35},${mid + amp} ${width * 0.5},${mid}`,
    `Q${width * 0.65},${mid - amp} ${width * 0.75},${mid}`,
    `Q${width * 0.85},${mid + amp} ${width},${mid}`,
    `L${width},${height}`,
    `L0,${height}`,
    'Z',
  ].join(' ')
}

/** Smooth S-curve */
function curvePath(width: number, height: number): string {
  const h = height
  return [
    `M0,${h * 0.6}`,
    `C${width * 0.25},${h * 0.2} ${width * 0.25},${h * 0.8} ${width * 0.5},${h * 0.4}`,
    `C${width * 0.75},${h * 0.0} ${width * 0.75},${h * 0.6} ${width},${h * 0.4}`,
    `L${width},${h}`,
    `L0,${h}`,
    'Z',
  ].join(' ')
}

/** Angled diagonal slash */
function diagonalPath(width: number, height: number): string {
  return [
    `M0,0`,
    `L${width},${height * 0.4}`,
    `L${width},${height}`,
    `L0,${height}`,
    'Z',
  ].join(' ')
}

/** Zigzag / triangle teeth */
function zigzagPath(width: number, height: number): string {
  const teeth = 12
  const step = width / teeth
  const top = `M0,${height * 0.3}`
  const segments: string[] = [top]
  for (let i = 0; i < teeth; i++) {
    const x1 = i * step + step / 2
    const x2 = (i + 1) * step
    segments.push(`L${x1},${height * 0.05}`)
    segments.push(`L${x2},${height * 0.3}`)
  }
  segments.push(`L${width},${height}`)
  segments.push(`L0,${height}`)
  segments.push('Z')
  return segments.join(' ')
}

/** Organic floral scallop with petal-like curves */
function floralPath(width: number, height: number): string {
  const mid = height * 0.45
  const r = width / 8
  let path = `M0,${mid}`
  for (let i = 0; i < 8; i++) {
    const cx1 = i * r * 2 + r * 0.5
    const cy1 = mid - height * 0.25
    const cx2 = i * r * 2 + r * 1.5
    const cy2 = mid - height * 0.25
    const x = (i + 1) * r * 2
    const y = mid
    path += ` C${cx1},${cy1} ${cx2},${cy2} ${x},${y}`
  }
  path += ` L${width},${height} L0,${height} Z`
  return path
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
const SectionDivider: React.FC<SectionDividerProps> = ({
  theme,
  variant = 'wave',
  flip = false,
  className = '',
  style,
  height = 80,
  colorFrom,
  colorTo,
}) => {
  const { slug, primaryHex, bgSection1, bgSection2 } = theme

  const fromColor = colorFrom || resolveBgColor(bgSection1)
  const toColor = colorTo || resolveBgColor(bgSection2)

  // Theme-specific variant overrides for character
  const effectiveVariant = (() => {
    if (variant !== 'wave') return variant
    // Use wave as default but with theme-specific feel via strokeWidth/decoration
    return variant
  })()

  const width = 1440 // viewBox width (responsive via 100% width)
  const viewHeight = 100

  const getPath = (): string => {
    switch (effectiveVariant) {
      case 'curve':
        return curvePath(width, viewHeight)
      case 'diagonal':
        return diagonalPath(width, viewHeight)
      case 'zigzag':
        return zigzagPath(width, viewHeight)
      case 'floral':
        return floralPath(width, viewHeight)
      case 'wave':
      default:
        return wavePath(width, viewHeight)
    }
  }

  // Some themes get extra decorative SVG elements on top of the shape
  const renderDecorations = () => {
    if (slug === 'gold' || slug === 'floral') {
      // Small ornamental dots along the top edge
      return Array.from({ length: 7 }).map((_, i) => (
        <circle
          key={i}
          cx={width * (0.1 + i * 0.13)}
          cy={viewHeight * 0.35}
          r={2}
          fill={primaryHex}
          opacity="0.3"
        />
      ))
    }
    if (slug === 'silver') {
      // Geometric tick marks
      return Array.from({ length: 9 }).map((_, i) => (
        <line
          key={i}
          x1={width * (0.08 + i * 0.11)}
          y1={viewHeight * 0.3}
          x2={width * (0.08 + i * 0.11)}
          y2={viewHeight * 0.42}
          stroke={primaryHex}
          strokeWidth="1"
          opacity="0.25"
        />
      ))
    }
    if (slug === 'dark') {
      // Dramatic small diamonds
      return Array.from({ length: 5 }).map((_, i) => {
        const cx = width * (0.15 + i * 0.18)
        const cy = viewHeight * 0.28
        return (
          <rect
            key={i}
            x={cx - 3}
            y={cy - 3}
            width={6}
            height={6}
            transform={`rotate(45 ${cx} ${cy})`}
            fill={primaryHex}
            opacity="0.35"
          />
        )
      })
    }
    // minimal: clean centered dot
    if (slug === 'minimal') {
      return <circle cx={width / 2} cy={viewHeight * 0.3} r={3} fill={primaryHex} opacity="0.3" />
    }
    return null
  }

  // Decorative stroke path on top of the fill (thinner accent line)
  const renderAccentLine = () => {
    if (slug === 'minimal') return null
    const path = getPath()
    return (
      <path
        d={path}
        fill="none"
        stroke={primaryHex}
        strokeWidth={slug === 'dark' ? 2 : 1}
        strokeOpacity={0.15}
        style={{ transform: 'translateY(-3px)' }}
      />
    )
  }

  return (
    <div
      className={`relative w-full overflow-hidden leading-[0] ${className}`}
      style={{
        height,
        transform: flip ? 'scaleY(-1)' : undefined,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Background fill that transitions from section 1 color */}
      <div
        className="w-full h-full"
        style={{ backgroundColor: fromColor }}
      />
      {/* SVG shape overlay that reveals section 2 color beneath */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${width} ${viewHeight}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Optional: slight gradient overlay on the divider shape */}
          <linearGradient id={`divider-grad-${slug}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryHex} stopOpacity="0.06" />
            <stop offset="100%" stopColor={toColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Main shape in "to" color */}
        <path d={getPath()} fill={toColor} />
        {/* Subtle gradient accent */}
        <path d={getPath()} fill={`url(#divider-grad-${slug})`} />
        {/* Accent stroke */}
        {renderAccentLine()}
        {/* Theme decorations */}
        {renderDecorations()}
      </svg>
    </div>
  )
}

export default SectionDivider
export { SectionDivider }
export type { SectionDividerProps }
