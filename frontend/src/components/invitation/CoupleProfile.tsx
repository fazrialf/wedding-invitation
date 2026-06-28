'use client'

import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import type { ThemeConfig } from '@/themes/config'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface ProfileData {
  name: string
  fullName?: string
  title?: string       // e.g. "Bride" or "Groom"
  photoUrl?: string
  description?: string
  bio?: string
  parents?: string
}

interface CoupleProfileProps {
  theme: ThemeConfig
  // New nested profile props (preferred)
  bride?: ProfileData
  groom?: ProfileData
  sectionLabel?: string
  showDivider?: boolean
  // Legacy flat props (backward compatible)
  brideName?: string
  brideFullName?: string
  brideBio?: string
  bridePhotoUrl?: string
  groomName?: string
  groomFullName?: string
  groomBio?: string
  groomPhotoUrl?: string
}

// ─────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────

const DEFAULT_BRIDE: ProfileData = {
  name: 'Putri',
  fullName: 'Putri',
  title: 'The Bride',
  photoUrl: '/images/bride.jpg',
  bio: 'A beautiful soul with a heart full of love, grace, and endless warmth.',
  parents: 'Daughter of Mr. & Mrs. Smith',
}

const DEFAULT_GROOM: ProfileData = {
  name: 'Andi',
  fullName: 'Andi',
  title: 'The Groom',
  photoUrl: '/images/groom.jpg',
  bio: 'A kind-hearted gentleman whose love and devotion know no bounds.',
  parents: 'Son of Mr. & Mrs. Johnson',
}

// ─────────────────────────────────────────────────────────────
// SVG: Ornate Photo Frame (gold border with corner flourishes)
// ─────────────────────────────────────────────────────────────

function OrnateFrame({ primaryHex, primaryDark }: { primaryHex: string; primaryDark: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 300 380"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="frame-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryHex} stopOpacity="0.9" />
          <stop offset="50%" stopColor="#fde68a" stopOpacity="1" />
          <stop offset="100%" stopColor={primaryDark} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Outer decorative border */}
      <rect
        x="4" y="4"
        width="292" height="372"
        rx="8" ry="8"
        fill="none"
        stroke="url(#frame-gold-grad)"
        strokeWidth="2.5"
      />

      {/* Inner decorative border */}
      <rect
        x="12" y="12"
        width="276" height="356"
        rx="5" ry="5"
        fill="none"
        stroke={primaryHex}
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />

      {/* Top-left corner flourish */}
      <g fill={primaryHex} stroke={primaryHex} strokeWidth="0.8" opacity="0.7">
        <path d="M4,40 C4,20 20,4 40,4" fill="none" strokeWidth="1.5" />
        <path d="M12,36 C12,22 22,12 36,12" fill="none" strokeWidth="0.8" opacity="0.5" />
        <circle cx="40" cy="4" r="3" />
        <circle cx="4" cy="40" r="3" />
        <path d="M8,20 C14,14 20,8 28,6 Q22,14 16,18 C10,22 8,20 8,20Z" opacity="0.4" />
        <circle cx="20" cy="20" r="2" opacity="0.5" />
      </g>

      {/* Top-right corner flourish */}
      <g fill={primaryHex} stroke={primaryHex} strokeWidth="0.8" opacity="0.7" transform="translate(300,0) scale(-1,1)">
        <path d="M4,40 C4,20 20,4 40,4" fill="none" strokeWidth="1.5" />
        <path d="M12,36 C12,22 22,12 36,12" fill="none" strokeWidth="0.8" opacity="0.5" />
        <circle cx="40" cy="4" r="3" />
        <circle cx="4" cy="40" r="3" />
        <path d="M8,20 C14,14 20,8 28,6 Q22,14 16,18 C10,22 8,20 8,20Z" opacity="0.4" />
        <circle cx="20" cy="20" r="2" opacity="0.5" />
      </g>

      {/* Bottom-left corner flourish */}
      <g fill={primaryHex} stroke={primaryHex} strokeWidth="0.8" opacity="0.7" transform="translate(0,380) scale(1,-1)">
        <path d="M4,40 C4,20 20,4 40,4" fill="none" strokeWidth="1.5" />
        <path d="M12,36 C12,22 22,12 36,12" fill="none" strokeWidth="0.8" opacity="0.5" />
        <circle cx="40" cy="4" r="3" />
        <circle cx="4" cy="40" r="3" />
        <path d="M8,20 C14,14 20,8 28,6 Q22,14 16,18 C10,22 8,20 8,20Z" opacity="0.4" />
        <circle cx="20" cy="20" r="2" opacity="0.5" />
      </g>

      {/* Bottom-right corner flourish */}
      <g fill={primaryHex} stroke={primaryHex} strokeWidth="0.8" opacity="0.7" transform="translate(300,380) scale(-1,-1)">
        <path d="M4,40 C4,20 20,4 40,4" fill="none" strokeWidth="1.5" />
        <path d="M12,36 C12,22 22,12 36,12" fill="none" strokeWidth="0.8" opacity="0.5" />
        <circle cx="40" cy="4" r="3" />
        <circle cx="4" cy="40" r="3" />
        <path d="M8,20 C14,14 20,8 28,6 Q22,14 16,18 C10,22 8,20 8,20Z" opacity="0.4" />
        <circle cx="20" cy="20" r="2" opacity="0.5" />
      </g>

      {/* Top center ornament */}
      <g fill="none" stroke={primaryHex} strokeWidth="0.8" opacity="0.5">
        <path d="M130,4 C140,-2 160,-2 170,4" />
        <circle cx="150" cy="2" r="2" fill={primaryHex} />
        <path d="M140,4 Q150,12 160,4" />
      </g>

      {/* Bottom center ornament */}
      <g fill="none" stroke={primaryHex} strokeWidth="0.8" opacity="0.5">
        <path d="M130,376 C140,382 160,382 170,376" />
        <circle cx="150" cy="378" r="2" fill={primaryHex} />
        <path d="M140,376 Q150,368 160,376" />
      </g>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// SVG: Heart Ornament Divider
// ─────────────────────────────────────────────────────────────

function HeartDivider({ primaryHex }: { primaryHex: string }) {
  return (
    <div className="flex items-center justify-center my-8" aria-hidden="true">
      <svg width="280" height="40" viewBox="0 0 280 40" className="w-full max-w-xs">
        {/* Left line */}
        <line x1="10" y1="20" x2="115" y2="20" stroke={primaryHex} strokeWidth="0.8" strokeOpacity="0.4" />
        {/* Left decorative dots */}
        <circle cx="30" cy="20" r="1.5" fill={primaryHex} opacity="0.3" />
        <circle cx="50" cy="20" r="1" fill={primaryHex} opacity="0.2" />
        <circle cx="70" cy="20" r="1.5" fill={primaryHex} opacity="0.3" />
        <circle cx="90" cy="20" r="1" fill={primaryHex} opacity="0.2" />

        {/* Center heart */}
        <g transform="translate(140, 20)">
          <path
            d="M0,-6 C0,-10 5,-12 7,-9 C9,-6 7,-2 0,6 C-7,-2 -9,-6 -7,-9 C-5,-12 0,-10 0,-6Z"
            fill={primaryHex}
            opacity="0.6"
          />
          <path
            d="M0,-4 C0,-7 3,-8 4,-6.5 C5.5,-5 4,-2 0,3.5 C-4,-2 -5.5,-5 -4,-6.5 C-3,-8 0,-7 0,-4Z"
            fill="none"
            stroke={primaryHex}
            strokeWidth="0.5"
            opacity="0.8"
          />
        </g>

        {/* Right line */}
        <line x1="165" y1="20" x2="270" y2="20" stroke={primaryHex} strokeWidth="0.8" strokeOpacity="0.4" />
        {/* Right decorative dots */}
        <circle cx="190" cy="20" r="1" fill={primaryHex} opacity="0.2" />
        <circle cx="210" cy="20" r="1.5" fill={primaryHex} opacity="0.3" />
        <circle cx="230" cy="20" r="1" fill={primaryHex} opacity="0.2" />
        <circle cx="250" cy="20" r="1.5" fill={primaryHex} opacity="0.3" />

        {/* Small leaf flourishes near heart */}
        <g fill={primaryHex} opacity="0.25">
          <path d="M118,16 C122,12 126,14 124,18 C122,22 118,20 118,16Z" />
          <path d="M162,16 C158,12 154,14 156,18 C158,22 162,20 162,16Z" />
        </g>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SVG: Floating Floral Decorations
// ─────────────────────────────────────────────────────────────

function FloatingFloral({ primaryHex, position }: { primaryHex: string; position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positionClasses: Record<string, string> = {
    'top-left': 'top-4 left-4 md:top-8 md:left-8',
    'top-right': 'top-4 right-4 md:top-8 md:right-8',
    'bottom-left': 'bottom-4 left-4 md:bottom-8 md:left-8',
    'bottom-right': 'bottom-4 right-4 md:bottom-8 md:right-8',
  }

  const rotation: Record<string, string> = {
    'top-left': 'rotate(0)',
    'top-right': 'scaleX(-1)',
    'bottom-left': 'scaleY(-1)',
    'bottom-right': 'scale(-1)',
  }

  return (
    <div
      className={`absolute ${positionClasses[position]} pointer-events-none hidden md:block`}
      aria-hidden="true"
    >
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        className="animate-float"
        style={{ transform: rotation[position] }}
      >
        {/* Main flower */}
        <g>
          {/* Outer petals */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse
              key={i}
              cx={30 + Math.cos((angle * Math.PI) / 180) * 15}
              cy={30 + Math.sin((angle * Math.PI) / 180) * 15}
              rx="10"
              ry="5"
              fill={primaryHex}
              opacity={0.15 + (i % 2) * 0.05}
              transform={`rotate(${angle + 30} ${30 + Math.cos((angle * Math.PI) / 180) * 15} ${30 + Math.sin((angle * Math.PI) / 180) * 15})`}
            />
          ))}
          {/* Inner petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse
              key={`inner-${i}`}
              cx={30 + Math.cos(((angle + 36) * Math.PI) / 180) * 8}
              cy={30 + Math.sin(((angle + 36) * Math.PI) / 180) * 8}
              rx="6"
              ry="3.5"
              fill={primaryHex}
              opacity="0.25"
              transform={`rotate(${angle + 50} ${30 + Math.cos(((angle + 36) * Math.PI) / 180) * 8} ${30 + Math.sin(((angle + 36) * Math.PI) / 180) * 8})`}
            />
          ))}
          <circle cx="30" cy="30" r="5" fill={primaryHex} opacity="0.35" />
        </g>

        {/* Stem and leaves */}
        <g fill={primaryHex} stroke={primaryHex} strokeWidth="0.5" opacity="0.3">
          <path d="M30,45 C35,55 30,65 25,75" fill="none" strokeWidth="1" opacity="0.4" />
          <path d="M32,52 C38,48 42,50 40,55 C38,60 32,57 32,52Z" />
          <path d="M28,62 C22,58 18,60 20,65 C22,70 28,67 28,62Z" />
        </g>

        {/* Small buds */}
        <circle cx="55" cy="18" r="3" fill={primaryHex} opacity="0.2" />
        <circle cx="60" cy="22" r="2" fill={primaryHex} opacity="0.15" />
        <path d="M53,14 C56,10 59,12 57,16 C55,20 53,18 53,14Z" fill={primaryHex} opacity="0.2" />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Profile Card (single person)
// ─────────────────────────────────────────────────────────────

function ProfileCard({
  profile,
  theme,
  inView,
  delay,
  side,
}: {
  profile: ProfileData
  theme: ThemeConfig
  inView: boolean
  delay: number
  side: 'left' | 'right'
}) {
  const {
    primaryHex,
    primaryDark,
    fontDisplay,
    fontHeading,
    fontBody,
    fontLabel,
    textDark,
    textMuted,
    textAccent,
    shadowColor,
  } = theme

  const slideClass = side === 'left' ? 'animate-fadeInLeft' : 'animate-fadeInRight'

  return (
    <div
      className={`flex-1 flex flex-col items-center text-center opacity-0 ${
        inView ? slideClass : ''
      }`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Photo with ornate frame */}
      <div className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-72 md:h-[22rem] mb-8 group">
        <OrnateFrame primaryHex={primaryHex} primaryDark={primaryDark} />

        {/* Photo container with hover effects */}
        <div
          className="absolute inset-[16px] rounded-md overflow-hidden transition-all duration-700 ease-out group-hover:scale-[1.03]"
          style={{
            boxShadow: `0 8px 32px ${shadowColor}`,
          }}
        >
          <div className="relative w-full h-full transition-shadow duration-700 group-hover:shadow-2xl">
            {profile.photoUrl ? (
              <Image
                src={profile.photoUrl}
                alt={profile.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 224px, 288px"
                priority
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryHex}15` }}
              >
                <svg className="w-16 h-16 opacity-30" fill={primaryHex} viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}

            {/* Hover overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(to top, ${primaryHex}20, transparent 50%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Title label */}
      {profile.title && (
        <p
          className={`${fontLabel} text-xs tracking-[0.35em] uppercase mb-3`}
          style={{ color: primaryHex }}
        >
          {profile.title}
        </p>
      )}

      {/* Name */}
      <h3 className={`${fontDisplay} text-4xl sm:text-5xl mb-3`} style={{ color: primaryHex }}>
        {profile.name}
      </h3>

      {/* Description / Bio */}
      {(profile.bio || profile.description) && (
        <p className={`${fontBody} text-sm ${textMuted} max-w-[240px] mb-4 leading-relaxed`}>
          {profile.bio || profile.description}
        </p>
      )}

      {/* Parents */}
      {profile.parents && (
        <p className={`${fontBody} text-xs ${textMuted} italic`}>
          {profile.parents}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Decorative Section Header
// ─────────────────────────────────────────────────────────────

function SectionHeader({ theme, label }: { theme: ThemeConfig; label: string }) {
  const { primaryHex, fontLabel, fontHeading, textDark } = theme

  return (
    <div className="text-center mb-16">
      {/* Label */}
      <p className={`${fontLabel} text-xs tracking-[0.4em] uppercase mb-3`} style={{ color: primaryHex }}>
        {label}
      </p>

      {/* Heading */}
      <h2 className={`${fontHeading} text-4xl sm:text-5xl mb-6`} style={{ color: primaryHex }}>
        Bride & Groom
      </h2>

      {/* Decorative underline */}
      <div className="flex items-center justify-center gap-3" aria-hidden="true">
        {/* Left flourish line */}
        <svg width="80" height="12" viewBox="0 0 80 12" className="w-16 sm:w-20">
          <line x1="0" y1="6" x2="60" y2="6" stroke={primaryHex} strokeWidth="0.8" strokeOpacity="0.4" />
          <circle cx="65" cy="6" r="2" fill={primaryHex} opacity="0.4" />
          <circle cx="72" cy="6" r="1.5" fill={primaryHex} opacity="0.3" />
          <circle cx="77" cy="6" r="1" fill={primaryHex} opacity="0.2" />
        </svg>

        {/* Center ornament */}
        <svg width="24" height="24" viewBox="0 0 24 24">
          <g fill={primaryHex} opacity="0.6">
            <path d="M12,4 L14,10 L20,10 L15,14 L17,20 L12,16 L7,20 L9,14 L4,10 L10,10 Z" />
          </g>
        </svg>

        {/* Right flourish line */}
        <svg width="80" height="12" viewBox="0 0 80 12" className="w-16 sm:w-20">
          <circle cx="3" cy="6" r="1" fill={primaryHex} opacity="0.2" />
          <circle cx="8" cy="6" r="1.5" fill={primaryHex} opacity="0.3" />
          <circle cx="15" cy="6" r="2" fill={primaryHex} opacity="0.4" />
          <line x1="20" y1="6" x2="80" y2="6" stroke={primaryHex} strokeWidth="0.8" strokeOpacity="0.4" />
        </svg>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function CoupleProfile({
  theme,
  bride: brideProp,
  groom: groomProp,
  sectionLabel = 'THE COUPLE',
  showDivider = true,
  // Legacy flat props
  brideName,
  brideFullName,
  brideBio,
  bridePhotoUrl,
  groomName,
  groomFullName,
  groomBio,
  groomPhotoUrl,
}: CoupleProfileProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  // Resolve bride profile: prefer nested prop, fall back to legacy flat props, then defaults
  const bride: ProfileData = brideProp ?? {
    name: brideName || DEFAULT_BRIDE.name,
    fullName: brideFullName || brideName || DEFAULT_BRIDE.fullName,
    title: 'The Bride',
    photoUrl: bridePhotoUrl || DEFAULT_BRIDE.photoUrl,
    bio: brideBio ?? DEFAULT_BRIDE.bio,
    parents: DEFAULT_BRIDE.parents,
  }

  // Resolve groom profile: prefer nested prop, fall back to legacy flat props, then defaults
  const groom: ProfileData = groomProp ?? {
    name: groomName || DEFAULT_GROOM.name,
    fullName: groomFullName || groomName || DEFAULT_GROOM.fullName,
    title: 'The Groom',
    photoUrl: groomPhotoUrl || DEFAULT_GROOM.photoUrl,
    bio: groomBio ?? DEFAULT_GROOM.bio,
    parents: DEFAULT_GROOM.parents,
  }

  return (
    <section
      ref={ref}
      className={`relative py-24 px-6 overflow-hidden ${theme.bgSection2} bg-texture-linen`}
    >
      {/* Floating floral decorations */}
      <FloatingFloral primaryHex={theme.primaryHex} position="top-left" />
      <FloatingFloral primaryHex={theme.primaryHex} position="top-right" />
      <FloatingFloral primaryHex={theme.primaryHex} position="bottom-left" />
      <FloatingFloral primaryHex={theme.primaryHex} position="bottom-right" />

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.primaryHex}05, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header with decorative underline */}
        <SectionHeader theme={theme} label={sectionLabel} />

        {/* Couple cards */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-16 lg:gap-24">
          {/* Bride */}
          <ProfileCard
            profile={bride}
            theme={theme}
            inView={inView}
            delay={0}
            side="left"
          />

          {/* Heart divider (visible on desktop between cards) */}
          {showDivider && (
            <div className="hidden md:flex items-center justify-center self-center">
              <div className="flex flex-col items-center gap-2">
                {/* Top decorative line */}
                <div
                  className="w-px h-16"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${theme.primaryHex}40, transparent)`,
                  }}
                />
                {/* Heart ornament */}
                <svg width="28" height="28" viewBox="0 0 24 24" className="animate-heartbeat">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill={theme.primaryHex}
                    opacity="0.6"
                  />
                </svg>
                {/* Bottom decorative line */}
                <div
                  className="w-px h-16"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${theme.primaryHex}40, transparent)`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Mobile heart divider (hidden on desktop where vertical heart is shown) */}
          {showDivider && (
            <div className="md:hidden">
              <HeartDivider primaryHex={theme.primaryHex} />
            </div>
          )}

          {/* Groom */}
          <ProfileCard
            profile={groom}
            theme={theme}
            inView={inView}
            delay={250}
            side="right"
          />
        </div>
      </div>
    </section>
  )
}
