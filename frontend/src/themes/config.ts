// Theme configuration for all invitation themes
export type ThemeConfig = {
  slug: string
  name: string
  // Colors
  primary: string        // main accent color (tailwind class)
  primaryHex: string     // for inline styles
  primaryLight: string   // lighter shade for backgrounds
  primaryDark: string    // darker shade for hover states
  bgPage: string         // page background
  bgSection1: string     // alternating section bg
  bgSection2: string     // alternating section bg
  bgDark: string         // dark section (countdown, footer)
  textDark: string       // heading color
  textMuted: string      // subtext color
  textAccent: string     // accent text
  borderAccent: string   // border color
  // Typography
  fontDisplay: string    // couple names font
  fontHeading: string    // section headings
  fontBody: string       // body text
  fontLabel: string      // small labels
  // Ornament
  ornamentChar: string   // decorative character
  // Visual enhancements
  gradientFrom: string   // gradient start color
  gradientTo: string     // gradient end color
  shadowColor: string    // shadow color for depth
  patternOpacity: number // background pattern opacity
  // Extended typography
  trackingDisplay?: string   // letter-spacing for display font
  trackingHeading?: string   // letter-spacing for headings
  trackingLabel?: string     // letter-spacing for labels
  // Decorative
  secondaryHex?: string      // secondary accent color for dual-tone themes
  patternType?: string       // preferred background pattern type
}

export const themes: Record<string, ThemeConfig> = {
  gold: {
    slug: 'gold',
    name: 'Gold',
    primary:        'text-yellow-600',
    primaryHex:     '#ca8a04',
    primaryLight:   '#fef3c7',
    primaryDark:    '#a16207',
    bgPage:         'bg-stone-50',
    bgSection1:     'bg-white',
    bgSection2:     'bg-stone-50',
    bgDark:         'bg-stone-900',
    textDark:       'text-stone-800',
    textMuted:      'text-stone-500',
    textAccent:     'text-yellow-600',
    borderAccent:   'border-yellow-200',
    fontDisplay:    'font-greatVibes',
    fontHeading:    'font-playfair',
    fontBody:       'font-lato',
    fontLabel:      'font-cinzel',
    ornamentChar:   '✦',
    gradientFrom:   '#fef3c7',
    gradientTo:     '#fde68a',
    shadowColor:    'rgba(202, 138, 4, 0.15)',
    patternOpacity: 0.03,
    trackingDisplay: 'normal',
    trackingHeading: '0.02em',
    trackingLabel:   '0.25em',
    patternType:    'sparkle',
  },
  silver: {
    slug: 'silver',
    name: 'Silver',
    primary:        'text-slate-500',
    primaryHex:     '#64748b',
    primaryLight:   '#f1f5f9',
    primaryDark:    '#475569',
    bgPage:         'bg-slate-50',
    bgSection1:     'bg-white',
    bgSection2:     'bg-slate-50',
    bgDark:         'bg-slate-800',
    textDark:       'text-slate-800',
    textMuted:      'text-slate-500',
    textAccent:     'text-slate-500',
    borderAccent:   'border-slate-200',
    fontDisplay:    'font-cormorant',
    fontHeading:    'font-cormorant',
    fontBody:       'font-lato',
    fontLabel:      'font-cinzel',
    ornamentChar:   '❋',
    gradientFrom:   '#f1f5f9',
    gradientTo:     '#e2e8f0',
    shadowColor:    'rgba(100, 116, 139, 0.15)',
    patternOpacity: 0.02,
    trackingDisplay: '0.02em',
    trackingHeading: '0.03em',
    trackingLabel:   '0.25em',
    patternType:    'linen',
  },
  dark: {
    slug: 'dark',
    name: 'Dark',
    primary:        'text-amber-400',
    primaryHex:     '#fbbf24',
    primaryLight:   '#fef3c7',
    primaryDark:    '#d97706',
    bgPage:         'bg-stone-950',
    bgSection1:     'bg-stone-900',
    bgSection2:     'bg-stone-950',
    bgDark:         'bg-black',
    textDark:       'text-stone-100',
    textMuted:      'text-stone-400',
    textAccent:     'text-amber-400',
    borderAccent:   'border-amber-900',
    fontDisplay:    'font-greatVibes',
    fontHeading:    'font-cinzel',
    fontBody:       'font-lato',
    fontLabel:      'font-cinzel',
    ornamentChar:   '✧',
    gradientFrom:   '#451a03',
    gradientTo:     '#1c1917',
    shadowColor:    'rgba(251, 191, 36, 0.1)',
    patternOpacity: 0.05,
    trackingDisplay: 'normal',
    trackingHeading: '0.05em',
    trackingLabel:   '0.3em',
    patternType:    'sparkle',
  },
  floral: {
    slug: 'floral',
    name: 'Floral',
    primary:        'text-rose-400',
    primaryHex:     '#fb7185',
    primaryLight:   '#ffe4e6',
    primaryDark:    '#e11d48',
    bgPage:         'bg-rose-50',
    bgSection1:     'bg-white',
    bgSection2:     'bg-rose-50',
    bgDark:         'bg-rose-900',
    textDark:       'text-rose-950',
    textMuted:      'text-rose-400',
    textAccent:     'text-rose-500',
    borderAccent:   'border-rose-200',
    fontDisplay:    'font-dancing',
    fontHeading:    'font-playfair',
    fontBody:       'font-lato',
    fontLabel:      'font-cinzel',
    ornamentChar:   '✿',
    gradientFrom:   '#ffe4e6',
    gradientTo:     '#fecdd3',
    shadowColor:    'rgba(251, 113, 133, 0.15)',
    patternOpacity: 0.03,
    trackingDisplay: 'normal',
    trackingHeading: '0.02em',
    trackingLabel:   '0.25em',
    patternType:    'floral',
  },
  minimal: {
    slug: 'minimal',
    name: 'Minimal',
    primary:        'text-stone-800',
    primaryHex:     '#292524',
    primaryLight:   '#f5f5f4',
    primaryDark:    '#1c1917',
    bgPage:         'bg-white',
    bgSection1:     'bg-white',
    bgSection2:     'bg-stone-50',
    bgDark:         'bg-stone-800',
    textDark:       'text-stone-900',
    textMuted:      'text-stone-400',
    textAccent:     'text-stone-700',
    borderAccent:   'border-stone-200',
    fontDisplay:    'font-cormorant',
    fontHeading:    'font-cormorant',
    fontBody:       'font-poppins',
    fontLabel:      'font-poppins',
    ornamentChar:   '—',
    gradientFrom:   '#f5f5f4',
    gradientTo:     '#e7e5e4',
    shadowColor:    'rgba(41, 37, 36, 0.1)',
    patternOpacity: 0.01,
    trackingDisplay: '0.04em',
    trackingHeading: '0.05em',
    trackingLabel:   '0.2em',
    patternType:    'paper',
  },
  // Mira & Ibrahim — Elegant Minimal
  // Family Mira: Dark Blue, Family Ibrahim: Maroon, Pengantin: Baby Blue, Hall: White
  'mira-ibrahim': {
    slug: 'mira-ibrahim',
    name: 'Elegant Minimal',
    primary:        'text-[#6B1D2A]',
    primaryHex:     '#6B1D2A',
    primaryLight:   '#fdf2f4',
    primaryDark:    '#4a1420',
    bgPage:         'bg-[#FFFAF5]',
    bgSection1:     'bg-white',
    bgSection2:     'bg-[#F8F4F0]',
    bgDark:         'bg-[#1B3A5C]',
    textDark:       'text-[#2C2C2C]',
    textMuted:      'text-[#8A8A8A]',
    textAccent:     'text-[#6B1D2A]',
    borderAccent:   'border-[#E8DDD5]',
    fontDisplay:    'font-cormorant',
    fontHeading:    'font-cormorant',
    fontBody:       'font-lato',
    fontLabel:      'font-cinzel',
    ornamentChar:   '✦',
    gradientFrom:   '#FFFAF5',
    gradientTo:     '#F0EBE5',
    shadowColor:    'rgba(107, 29, 42, 0.08)',
    patternOpacity: 0.015,
    trackingDisplay: '0.06em',
    trackingHeading: '0.08em',
    trackingLabel:   '0.35em',
    secondaryHex:   '#1B3A5C',
    patternType:    'linen',
  },
}

export function getTheme(slug: string): ThemeConfig {
  return themes[slug] || themes.gold
}
