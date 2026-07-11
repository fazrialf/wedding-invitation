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
  const { slug, primaryHex, secondaryHex } = theme as ThemeConfig & { secondaryHex?: string }
  const isNature = slug.startsWith('nat-')
  const isFairytale = slug.startsWith('fai-')
  const isAdat = slug.startsWith('adt-')
  const isFloral = slug.startsWith('flo-')
  const isMinimal = slug.startsWith('min-')
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

  // Floral: roses and petals — rich botanical corner ornament
  const floralPath = (
    <g fill="none" stroke={primaryHex} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      {/* ── Large open rose centred at (40,40) ── */}
      {/* Petal 1 — top */}
      <path d="M40,40 C36,32 30,28 32,22 C34,16 42,16 44,22 C46,28 44,34 40,40Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="1.3" />
      {/* Petal 2 — top-right */}
      <path d="M40,40 C48,36 54,30 58,32 C64,34 62,42 56,44 C50,46 44,44 40,40Z"
        fill={primaryHex} fillOpacity="0.20" strokeWidth="1.3" />
      {/* Petal 3 — bottom-right */}
      <path d="M40,40 C46,48 46,56 42,60 C38,64 32,60 32,54 C32,48 36,44 40,40Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="1.3" />
      {/* Petal 4 — bottom-left */}
      <path d="M40,40 C32,46 24,46 20,42 C16,38 20,30 26,30 C32,30 36,34 40,40Z"
        fill={primaryHex} fillOpacity="0.22" strokeWidth="1.3" />
      {/* Petal 5 — top-left */}
      <path d="M40,40 C34,32 28,30 24,26 C20,22 24,14 30,15 C36,16 40,28 40,40Z"
        fill={primaryHex} fillOpacity="0.15" strokeWidth="1.3" />
      {/* Inner petal layer — tighter, slightly higher opacity */}
      <path d="M40,40 C38,34 35,30 37,26 C39,22 43,22 44,26 C45,30 42,36 40,40Z"
        fill={primaryHex} fillOpacity="0.25" strokeWidth="1.0" />
      <path d="M40,40 C46,38 50,35 52,37 C55,40 52,45 48,45 C44,45 41,43 40,40Z"
        fill={primaryHex} fillOpacity="0.22" strokeWidth="1.0" />
      <path d="M40,40 C38,46 37,50 34,52 C31,54 28,51 29,47 C30,43 34,41 40,40Z"
        fill={primaryHex} fillOpacity="0.20" strokeWidth="1.0" />
      {/* Rose centre stamens */}
      <circle cx="40" cy="40" r="5" fill={primaryHex} fillOpacity="0.35" strokeWidth="1.0" />
      <circle cx="40" cy="40" r="2.5" fill={primaryHex} fillOpacity="0.55" stroke="none" />
      <circle cx="38.5" cy="38.5" r="0.8" fill={primaryHex} fillOpacity="0.7" stroke="none" />
      <circle cx="41.5" cy="38" r="0.8" fill={primaryHex} fillOpacity="0.7" stroke="none" />
      <circle cx="41" cy="41.5" r="0.8" fill={primaryHex} fillOpacity="0.7" stroke="none" />

      {/* ── Flowing stems from rose ── */}
      {/* Stem sweeping toward top-left corner */}
      <path d="M33,32 C26,24 18,16 8,8" strokeWidth="1.4" strokeOpacity="0.65" />
      {/* Stem sweeping downward along left edge */}
      <path d="M34,48 C28,58 20,70 10,85" strokeWidth="1.3" strokeOpacity="0.6" />
      {/* Stem sweeping right along top edge */}
      <path d="M48,34 C60,26 74,18 90,10" strokeWidth="1.3" strokeOpacity="0.6" />
      {/* Delicate tendril from main stem, upper-left */}
      <path d="M22,20 C18,16 14,18 12,14" strokeWidth="0.8" strokeOpacity="0.45" />
      {/* Tendril lower stem */}
      <path d="M16,68 C12,66 8,70 7,76" strokeWidth="0.8" strokeOpacity="0.4" />
      {/* Tendril right stem */}
      <path d="M72,16 C76,12 80,14 82,10" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* ── Bud 1 — upper-left area ── */}
      <path d="M16,16 C14,12 12,10 14,8 C16,6 20,8 20,12 C20,16 18,18 16,16Z"
        fill={primaryHex} fillOpacity="0.22" strokeWidth="1.0" />
      <path d="M16,16 C18,12 22,10 22,14 C22,18 18,20 16,16Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="0.9" />
      <circle cx="16" cy="10" r="1.5" fill={primaryHex} fillOpacity="0.4" stroke="none" />

      {/* ── Bud 2 — lower-left area ── */}
      <path d="M14,76 C12,72 10,70 12,67 C14,64 18,66 18,70 C18,74 16,78 14,76Z"
        fill={primaryHex} fillOpacity="0.22" strokeWidth="1.0" />
      <circle cx="14" cy="68" r="1.5" fill={primaryHex} fillOpacity="0.38" stroke="none" />

      {/* ── Bud 3 — upper-right area ── */}
      <path d="M82,12 C80,8 78,6 80,4 C82,2 86,4 86,8 C86,12 84,14 82,12Z"
        fill={primaryHex} fillOpacity="0.20" strokeWidth="1.0" />
      <circle cx="82" cy="5" r="1.5" fill={primaryHex} fillOpacity="0.38" stroke="none" />

      {/* ── Leaf pairs along stems ── */}
      {/* Leaf pair A — upper-left stem */}
      <path d="M26,25 C22,18 16,18 16,24 C16,30 24,30 26,25Z"
        fill={primaryHex} fillOpacity="0.20" strokeWidth="1.0" />
      <path d="M26,25 C30,18 36,20 34,26 C32,32 26,30 26,25Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="1.0" />
      <line x1="26" y1="25" x2="20" y2="22" strokeWidth="0.5" strokeOpacity="0.4" />
      <line x1="26" y1="25" x2="30" y2="22" strokeWidth="0.5" strokeOpacity="0.4" />

      {/* Leaf pair B — lower-left stem */}
      <path d="M22,56 C16,52 10,54 12,60 C14,66 22,64 22,56Z"
        fill={primaryHex} fillOpacity="0.22" strokeWidth="1.0" />
      <path d="M22,56 C26,50 32,52 30,58 C28,64 22,62 22,56Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="1.0" />
      <line x1="22" y1="56" x2="14" y2="58" strokeWidth="0.5" strokeOpacity="0.38" />

      {/* Leaf pair C — upper-right stem */}
      <path d="M62,22 C58,16 52,16 54,22 C56,28 62,26 62,22Z"
        fill={primaryHex} fillOpacity="0.20" strokeWidth="1.0" />
      <path d="M62,22 C66,16 72,18 70,24 C68,30 62,28 62,22Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="1.0" />
      <line x1="62" y1="22" x2="56" y2="20" strokeWidth="0.5" strokeOpacity="0.38" />

      {/* Leaf pair D — mid right stem */}
      <path d="M78,14 C74,10 68,12 70,16 C72,20 78,18 78,14Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="0.9" />

      {/* ── Small scattered petals / florets ── */}
      <path d="M10,42 C8,38 8,34 11,34 C14,34 14,38 12,42 C11,44 10,44 10,42Z"
        fill={primaryHex} fillOpacity="0.15" strokeWidth="0.8" />
      <path d="M10,42 C12,38 16,38 16,42 C16,46 11,46 10,42Z"
        fill={primaryHex} fillOpacity="0.13" strokeWidth="0.8" />
      <circle cx="10" cy="42" r="1.2" fill={primaryHex} fillOpacity="0.4" stroke="none" />

      {/* Corner accent — tiny spiral curl */}
      <path d="M8,8 C10,6 14,7 13,10 C12,13 8,12 9,9" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
    </g>
  )

  // Nature: bamboo stalks, S-curve leaves, bird, moss — rich corner ornament
  const naturePath = (
    <g fill="none" stroke={primaryHex} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      {/* ── Bamboo stalk 1 — tallest, leftmost ── */}
      <line x1="12" y1="110" x2="12" y2="8" strokeWidth="2.2" strokeOpacity="0.6" />
      {/* Node rings — stalk 1 */}
      <ellipse cx="12" cy="88" rx="4" ry="1.8" strokeWidth="1.4" strokeOpacity="0.55" />
      <ellipse cx="12" cy="68" rx="4" ry="1.8" strokeWidth="1.4" strokeOpacity="0.55" />
      <ellipse cx="12" cy="48" rx="4" ry="1.8" strokeWidth="1.4" strokeOpacity="0.55" />
      <ellipse cx="12" cy="28" rx="4" ry="1.8" strokeWidth="1.4" strokeOpacity="0.55" />
      <ellipse cx="12" cy="12" rx="3.5" ry="1.5" strokeWidth="1.2" strokeOpacity="0.5" />

      {/* ── Bamboo stalk 2 — mid ── */}
      <line x1="26" y1="110" x2="26" y2="20" strokeWidth="1.8" strokeOpacity="0.45" />
      <ellipse cx="26" cy="90" rx="3.5" ry="1.6" strokeWidth="1.2" strokeOpacity="0.45" />
      <ellipse cx="26" cy="72" rx="3.5" ry="1.6" strokeWidth="1.2" strokeOpacity="0.45" />
      <ellipse cx="26" cy="54" rx="3.5" ry="1.6" strokeWidth="1.2" strokeOpacity="0.45" />
      <ellipse cx="26" cy="36" rx="3.5" ry="1.6" strokeWidth="1.2" strokeOpacity="0.45" />

      {/* ── Bamboo stalk 3 — thinnest, rightmost ── */}
      <line x1="40" y1="110" x2="40" y2="34" strokeWidth="1.4" strokeOpacity="0.35" />
      <ellipse cx="40" cy="92" rx="2.8" ry="1.4" strokeWidth="1.0" strokeOpacity="0.38" />
      <ellipse cx="40" cy="74" rx="2.8" ry="1.4" strokeWidth="1.0" strokeOpacity="0.38" />
      <ellipse cx="40" cy="56" rx="2.8" ry="1.4" strokeWidth="1.0" strokeOpacity="0.38" />

      {/* ── Bamboo leaves — S-curve long pointed shapes ── */}
      {/* Stalk 1, node at 48 — leaf right */}
      <path d="M12,48 C20,42 34,38 42,30 C38,36 28,44 12,48Z"
        fill={primaryHex} fillOpacity="0.22" strokeWidth="1.0" />
      {/* Stalk 1, node at 48 — leaf left (shorter) */}
      <path d="M12,48 C6,44 2,36 4,26 C6,34 8,42 12,48Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="0.9" />
      {/* Stalk 1, node at 28 — leaf right */}
      <path d="M12,28 C22,20 40,14 55,8 C44,16 28,22 12,28Z"
        fill={primaryHex} fillOpacity="0.25" strokeWidth="1.1" />
      {/* Stalk 1, node at 28 — leaf left */}
      <path d="M12,28 C4,22 0,14 2,6 C4,14 6,22 12,28Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="0.9" />
      {/* Stalk 1, node at 68 — leaf right */}
      <path d="M12,68 C20,62 32,58 44,54 C36,60 24,66 12,68Z"
        fill={primaryHex} fillOpacity="0.20" strokeWidth="1.0" />
      {/* Stalk 2, node at 54 — leaf right */}
      <path d="M26,54 C36,46 52,40 68,36 C56,42 40,50 26,54Z"
        fill={primaryHex} fillOpacity="0.22" strokeWidth="1.0" />
      {/* Stalk 2, node at 36 — leaf right */}
      <path d="M26,36 C38,26 58,18 78,12 C62,20 44,28 26,36Z"
        fill={primaryHex} fillOpacity="0.20" strokeWidth="1.0" />
      {/* Stalk 3, node at 56 — leaf right */}
      <path d="M40,56 C50,48 64,44 80,40 C68,46 54,52 40,56Z"
        fill={primaryHex} fillOpacity="0.18" strokeWidth="0.9" />
      {/* Stalk 3, node at 74 — leaf right */}
      <path d="M40,74 C52,68 66,64 82,60 C70,66 56,72 40,74Z"
        fill={primaryHex} fillOpacity="0.16" strokeWidth="0.9" />
      {/* Tip leaf at top of stalk 1 */}
      <path d="M12,12 C18,6 28,2 40,0 C32,4 20,8 12,12Z"
        fill={primaryHex} fillOpacity="0.28" strokeWidth="1.1" />

      {/* ── Leaf mid-veins ── */}
      <line x1="12" y1="48" x2="30" y2="38" strokeWidth="0.4" strokeOpacity="0.4" />
      <line x1="12" y1="28" x2="36" y2="16" strokeWidth="0.4" strokeOpacity="0.4" />
      <line x1="26" y1="54" x2="50" y2="44" strokeWidth="0.4" strokeOpacity="0.35" />

      {/* ── Small bird silhouette — perched on stalk tip ── */}
      {/* Body */}
      <ellipse cx="58" cy="22" rx="7" ry="4.5" strokeWidth="1.0" strokeOpacity="0.55"
        fill={primaryHex} fillOpacity="0.12" />
      {/* Head */}
      <circle cx="64" cy="19" r="3.2" strokeWidth="1.0" strokeOpacity="0.55"
        fill={primaryHex} fillOpacity="0.14" />
      {/* Beak */}
      <path d="M66.5,18.5 L71,17.5 L67,19.5Z"
        fill={primaryHex} fillOpacity="0.5" stroke="none" />
      {/* Wing — arc shape */}
      <path d="M52,22 C54,16 60,14 64,18" strokeWidth="1.0" strokeOpacity="0.5" />
      <path d="M52,22 C55,20 60,19 63,21" strokeWidth="0.7" strokeOpacity="0.35" />
      {/* Tail */}
      <path d="M51,23 C47,22 44,24 43,26" strokeWidth="1.0" strokeOpacity="0.5" />
      {/* Eye */}
      <circle cx="65" cy="18.5" r="0.9" fill={primaryHex} fillOpacity="0.7" stroke="none" />
      {/* Feet on stalk */}
      <line x1="58" y1="26" x2="57" y2="29" strokeWidth="0.7" strokeOpacity="0.45" />
      <line x1="60" y1="26" x2="61" y2="29" strokeWidth="0.7" strokeOpacity="0.45" />

      {/* ── Ground moss dots at base ── */}
      <circle cx="8"  cy="112" r="1.8" fill={primaryHex} fillOpacity="0.30" stroke="none" />
      <circle cx="14" cy="114" r="1.4" fill={primaryHex} fillOpacity="0.25" stroke="none" />
      <circle cx="20" cy="113" r="1.6" fill={primaryHex} fillOpacity="0.28" stroke="none" />
      <circle cx="27" cy="115" r="1.2" fill={primaryHex} fillOpacity="0.22" stroke="none" />
      <circle cx="33" cy="113" r="1.0" fill={primaryHex} fillOpacity="0.20" stroke="none" />
      <circle cx="39" cy="114" r="0.9" fill={primaryHex} fillOpacity="0.18" stroke="none" />
      <circle cx="5"  cy="115" r="1.0" fill={primaryHex} fillOpacity="0.20" stroke="none" />
      {/* Moss tufts — tiny upward strokes */}
      <path d="M10,112 C10,109 11,108 12,109" strokeWidth="0.6" strokeOpacity="0.35" />
      <path d="M22,113 C22,110 23,109 24,110" strokeWidth="0.6" strokeOpacity="0.35" />
      <path d="M30,114 C30,111 31,110 32,111" strokeWidth="0.6" strokeOpacity="0.30" />
    </g>
  )

  // Fairytale: crescent moon, 5-pt stars, sparkles, magic dust — rich corner ornament
  const fairytalePath = (
    <g fill="none" stroke={primaryHex} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      {/* ── Crescent moon — arc subtraction via path commands ── */}
      {/* Outer circle arc (convex side) + inner circle arc (concave bite) */}
      <path
        d="M28,8 A22,22 0 1,0 8,28 A16,16 0 0,1 28,8Z"
        fill={primaryHex} fillOpacity="0.28" strokeWidth="1.1" strokeOpacity="0.6"
      />
      {/* Moon glow ring */}
      <path
        d="M30,6 A24,24 0 1,0 6,30 A18,18 0 0,1 30,6Z"
        fill="none" strokeWidth="0.5" strokeOpacity="0.25"
      />

      {/* ── 8 five-pointed stars of varying sizes ── */}
      {/* Star 1 — large, upper right area */}
      <path d="M72,14 L74.4,21.4 L82,21.4 L76,25.8 L78.4,33.2 L72,28.8 L65.6,33.2 L68,25.8 L62,21.4 L69.6,21.4Z"
        fill={primaryHex} fillOpacity="0.38" strokeWidth="0.9" strokeOpacity="0.5" />
      {/* Star 2 — medium, right mid */}
      <path d="M95,42 L96.8,47.5 L102.5,47.5 L97.9,50.9 L99.7,56.4 L95,53 L90.3,56.4 L92.1,50.9 L87.5,47.5 L93.2,47.5Z"
        fill={primaryHex} fillOpacity="0.32" strokeWidth="0.8" strokeOpacity="0.45" />
      {/* Star 3 — small, top far right */}
      <path d="M108,12 L109,15.1 L112.2,15.1 L109.6,17 L110.6,20.1 L108,18.2 L105.4,20.1 L106.4,17 L103.8,15.1 L107,15.1Z"
        fill={primaryHex} fillOpacity="0.42" strokeWidth="0.7" />
      {/* Star 4 — small, mid-field */}
      <path d="M55,52 L56.2,55.7 L60,55.7 L57,57.8 L58.1,61.5 L55,59.4 L51.9,61.5 L53,57.8 L50,55.7 L53.8,55.7Z"
        fill={primaryHex} fillOpacity="0.35" strokeWidth="0.7" />
      {/* Star 5 — tiny, lower right */}
      <path d="M88,78 L88.8,80.4 L91.4,80.4 L89.3,81.8 L90.1,84.2 L88,82.8 L85.9,84.2 L86.7,81.8 L84.6,80.4 L87.2,80.4Z"
        fill={primaryHex} fillOpacity="0.30" strokeWidth="0.6" />
      {/* Star 6 — tiny, scattered */}
      <path d="M42,72 L42.6,74 L44.8,74 L43.1,75.2 L43.7,77.2 L42,76 L40.3,77.2 L40.9,75.2 L39.2,74 L41.4,74Z"
        fill={primaryHex} fillOpacity="0.28" strokeWidth="0.6" />
      {/* Star 7 — medium-small, upper band */}
      <path d="M85,20 L86.4,24.3 L90.9,24.3 L87.3,26.8 L88.7,31.1 L85,28.6 L81.3,31.1 L82.7,26.8 L79.1,24.3 L83.6,24.3Z"
        fill={primaryHex} fillOpacity="0.34" strokeWidth="0.75" />
      {/* Star 8 — tiny near moon */}
      <path d="M36,38 L36.6,40 L38.8,40 L37.1,41.2 L37.7,43.2 L36,42 L34.3,43.2 L34.9,41.2 L33.2,40 L35.4,40Z"
        fill={primaryHex} fillOpacity="0.30" strokeWidth="0.6" />

      {/* ── 3 Sparkle shapes — 4-pointed ✦ diamond crosses ── */}
      {/* Sparkle 1 — large */}
      <path d="M50,18 L51.4,22 L55.5,18 L51.4,14 Z M50,18 L54,19.4 L50,23.5 L46,19.4 Z"
        fill={primaryHex} fillOpacity="0.45" stroke="none" />
      <line x1="50" y1="12" x2="50" y2="24" strokeWidth="1.2" strokeOpacity="0.50" />
      <line x1="44" y1="18" x2="56" y2="18" strokeWidth="1.2" strokeOpacity="0.50" />
      <line x1="46" y1="14" x2="54" y2="22" strokeWidth="0.5" strokeOpacity="0.28" />
      <line x1="54" y1="14" x2="46" y2="22" strokeWidth="0.5" strokeOpacity="0.28" />
      <circle cx="50" cy="18" r="1.4" fill={primaryHex} fillOpacity="0.6" stroke="none" />

      {/* Sparkle 2 — medium */}
      <line x1="76" y1="54" x2="76" y2="64" strokeWidth="1.0" strokeOpacity="0.45" />
      <line x1="71" y1="59" x2="81" y2="59" strokeWidth="1.0" strokeOpacity="0.45" />
      <line x1="72.5" y1="55.5" x2="79.5" y2="62.5" strokeWidth="0.5" strokeOpacity="0.25" />
      <line x1="79.5" y1="55.5" x2="72.5" y2="62.5" strokeWidth="0.5" strokeOpacity="0.25" />
      <circle cx="76" cy="59" r="1.2" fill={primaryHex} fillOpacity="0.55" stroke="none" />

      {/* Sparkle 3 — small */}
      <line x1="100" y1="68" x2="100" y2="75" strokeWidth="0.8" strokeOpacity="0.40" />
      <line x1="96.5" y1="71.5" x2="103.5" y2="71.5" strokeWidth="0.8" strokeOpacity="0.40" />
      <line x1="97.5" y1="69" x2="102.5" y2="74" strokeWidth="0.4" strokeOpacity="0.22" />
      <line x1="102.5" y1="69" x2="97.5" y2="74" strokeWidth="0.4" strokeOpacity="0.22" />
      <circle cx="100" cy="71.5" r="0.9" fill={primaryHex} fillOpacity="0.5" stroke="none" />

      {/* ── Magic dust trail — dashed bezier from corner inward ── */}
      <path
        d="M8,8 C20,16 36,28 55,40 C68,48 84,58 105,72"
        strokeWidth="0.9" strokeOpacity="0.30"
        strokeDasharray="2.5 3.5"
      />
      {/* Second dust trail, offset */}
      <path
        d="M8,20 C22,30 40,44 58,58 C72,68 90,82 108,96"
        strokeWidth="0.6" strokeOpacity="0.18"
        strokeDasharray="1.5 4"
      />
      {/* Dust sparkle dots along trail */}
      <circle cx="22" cy="20" r="0.8" fill={primaryHex} fillOpacity="0.38" stroke="none" />
      <circle cx="38" cy="30" r="0.7" fill={primaryHex} fillOpacity="0.32" stroke="none" />
      <circle cx="58" cy="44" r="1.0" fill={primaryHex} fillOpacity="0.35" stroke="none" />
      <circle cx="76" cy="56" r="0.7" fill={primaryHex} fillOpacity="0.28" stroke="none" />
      <circle cx="94" cy="68" r="0.8" fill={primaryHex} fillOpacity="0.25" stroke="none" />
      <circle cx="110" cy="80" r="0.6" fill={primaryHex} fillOpacity="0.20" stroke="none" />

      {/* ── Accent dots scattered ── */}
      <circle cx="62" cy="8"  r="1.2" fill={primaryHex} fillOpacity="0.40" stroke="none" />
      <circle cx="104" cy="30" r="1.0" fill={primaryHex} fillOpacity="0.32" stroke="none" />
      <circle cx="28" cy="54" r="1.0" fill={primaryHex} fillOpacity="0.28" stroke="none" />
      <circle cx="114" cy="52" r="0.8" fill={primaryHex} fillOpacity="0.25" stroke="none" />
    </g>
  )

  // Adat/Traditional: batik-inspired stepped border, octagon medallion, diamond lattice, parang — rich corner ornament
  const adatPath = (
    <g fill="none" stroke={primaryHex} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      {/* ── Batik-inspired stepped border — staircase along top edge ── */}
      <path
        d="M8,8 L8,14 L14,14 L14,20 L20,20 L20,26 L26,26 L26,32 L32,32 L32,38 L38,38 L38,44 L44,44 L44,50 L50,50 L50,56 L56,56 L56,62 L62,62 L62,68 L68,68 L68,74 L74,74 L74,80 L80,80 L80,86 L86,86 L86,92 L92,92 L92,98 L98,98 L98,104 L104,104 L104,110"
        strokeWidth="1.4" strokeOpacity="0.55"
      />
      {/* Inner staircase — offset inward by 4px */}
      <path
        d="M12,12 L12,16 L16,16 L16,22 L22,22 L22,28 L28,28 L28,34 L34,34 L34,40 L40,40 L40,46 L46,46 L46,52 L52,52 L52,58 L58,58 L58,64 L64,64 L64,70 L70,70 L70,76 L76,76 L76,82 L82,82 L82,88 L88,88 L88,94 L94,94 L94,100 L100,100 L100,106"
        strokeWidth="0.7" strokeOpacity="0.30"
      />
      {/* Outermost border lines — tight to corner */}
      <path d="M4,4 L4,112" strokeWidth="1.8" strokeOpacity="0.18" />
      <path d="M4,4 L112,4" strokeWidth="1.8" strokeOpacity="0.18" />

      {/* ── Central octagon medallion at corner apex ── */}
      {/* Octagon centred at (22,22), radius ~10 */}
      <polygon
        points="22,12 29,15 32,22 29,29 22,32 15,29 12,22 15,15"
        strokeWidth="1.3" strokeOpacity="0.65"
        fill={secondaryHex || primaryHex} fillOpacity="0.18"
      />
      {/* Medallion inner ring */}
      <polygon
        points="22,15 27,17.5 29,22 27,26.5 22,29 17,26.5 15,22 17,17.5"
        strokeWidth="0.7" strokeOpacity="0.40"
        fill={secondaryHex || primaryHex} fillOpacity="0.10"
      />
      {/* Medallion centre dot */}
      <circle cx="22" cy="22" r="2.5"
        fill={secondaryHex || primaryHex} fillOpacity="0.45" stroke="none" />
      <circle cx="22" cy="22" r="1.0"
        fill={secondaryHex || primaryHex} fillOpacity="0.70" stroke="none" />
      {/* secondaryHex accent stroke on medallion */}
      {secondaryHex && (
        <polygon
          points="22,12 29,15 32,22 29,29 22,32 15,29 12,22 15,15"
          stroke={secondaryHex} strokeWidth="0.8" strokeOpacity="0.50" fill="none"
        />
      )}

      {/* ── Diamond lattice — 2×2 grid of rotated squares ── */}
      {/* Diamond A — top-left of grid */}
      <rect x="37" y="37" width="10" height="10"
        transform="rotate(45 42 42)"
        stroke={primaryHex} strokeWidth="1.0" strokeOpacity="0.50"
        fill={primaryHex} fillOpacity="0.08"
      />
      {/* Diamond B — top-right of grid */}
      <rect x="51" y="37" width="10" height="10"
        transform="rotate(45 56 42)"
        stroke={primaryHex} strokeWidth="1.0" strokeOpacity="0.42"
        fill="none"
      />
      {/* Diamond C — bottom-left of grid */}
      <rect x="37" y="51" width="10" height="10"
        transform="rotate(45 42 56)"
        stroke={primaryHex} strokeWidth="1.0" strokeOpacity="0.42"
        fill="none"
      />
      {/* Diamond D — bottom-right of grid */}
      <rect x="51" y="51" width="10" height="10"
        transform="rotate(45 56 56)"
        stroke={primaryHex} strokeWidth="0.8" strokeOpacity="0.32"
        fill="none"
      />
      {/* Inner smaller diamonds — concentric detail */}
      <rect x="40" y="40" width="4" height="4"
        transform="rotate(45 42 42)"
        stroke={primaryHex} strokeWidth="0.5" strokeOpacity="0.35" fill="none"
      />
      <rect x="54" y="40" width="4" height="4"
        transform="rotate(45 56 42)"
        stroke={primaryHex} strokeWidth="0.5" strokeOpacity="0.28" fill="none"
      />

      {/* ── Decorative dots at grid intersections ── */}
      <circle cx="42" cy="42" r="1.5" fill={primaryHex} fillOpacity="0.45" stroke="none" />
      <circle cx="56" cy="42" r="1.5" fill={primaryHex} fillOpacity="0.38" stroke="none" />
      <circle cx="42" cy="56" r="1.5" fill={primaryHex} fillOpacity="0.38" stroke="none" />
      <circle cx="56" cy="56" r="1.5" fill={primaryHex} fillOpacity="0.30" stroke="none" />
      {/* Mid-edge dots between diamonds */}
      <circle cx="49" cy="42" r="0.9" fill={primaryHex} fillOpacity="0.28" stroke="none" />
      <circle cx="42" cy="49" r="0.9" fill={primaryHex} fillOpacity="0.28" stroke="none" />
      <circle cx="56" cy="49" r="0.9" fill={primaryHex} fillOpacity="0.22" stroke="none" />
      <circle cx="49" cy="56" r="0.9" fill={primaryHex} fillOpacity="0.22" stroke="none" />
      <circle cx="49" cy="49" r="1.2" fill={primaryHex} fillOpacity="0.32" stroke="none" />

      {/* ── Parang-style diagonal lines ── */}
      <line x1="36" y1="6"  x2="6"  y2="36" strokeWidth="0.8" strokeOpacity="0.20" />
      <line x1="56" y1="6"  x2="6"  y2="56" strokeWidth="0.7" strokeOpacity="0.16" />
      <line x1="76" y1="6"  x2="6"  y2="76" strokeWidth="0.6" strokeOpacity="0.13" />
      <line x1="96" y1="6"  x2="6"  y2="96" strokeWidth="0.5" strokeOpacity="0.10" />

      {/* ── Additional batik motif — small petal/kawung cluster ── */}
      <circle cx="70" cy="70" r="7"  strokeWidth="0.8" strokeOpacity="0.22" />
      <circle cx="80" cy="70" r="7"  strokeWidth="0.7" strokeOpacity="0.18" />
      <circle cx="70" cy="80" r="7"  strokeWidth="0.7" strokeOpacity="0.18" />
      <circle cx="75" cy="75" r="4"  strokeWidth="0.6" strokeOpacity="0.25"
        fill={primaryHex} fillOpacity="0.06" />
      <circle cx="75" cy="75" r="1.5" fill={primaryHex} fillOpacity="0.28" stroke="none" />

      {/* ── Corner cross-connector lines ── */}
      <line x1="8"  y1="22" x2="12" y2="22" strokeWidth="0.6" strokeOpacity="0.38" />
      <line x1="22" y1="8"  x2="22" y2="12" strokeWidth="0.6" strokeOpacity="0.38" />
      <line x1="32" y1="22" x2="38" y2="22" strokeWidth="0.5" strokeOpacity="0.28" />
      <line x1="22" y1="32" x2="22" y2="38" strokeWidth="0.5" strokeOpacity="0.28" />
    </g>
  )

  // Minimal: clean L-brackets, arc, dots, diamond — rich geometric corner ornament
  const minimalPath = (
    <g fill="none" stroke={primaryHex} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
      {/* ── L-bracket 1 — along top edge ── */}
      {/* Outer top line */}
      <line x1="8" y1="8" x2="72" y2="8" strokeWidth="1.0" strokeOpacity="0.70" />
      {/* Short downward tick at far end */}
      <line x1="72" y1="8" x2="72" y2="16" strokeWidth="1.0" strokeOpacity="0.70" />

      {/* ── L-bracket 2 — along left edge ── */}
      {/* Outer left line */}
      <line x1="8" y1="8" x2="8" y2="72" strokeWidth="1.0" strokeOpacity="0.70" />
      {/* Short rightward tick at far end */}
      <line x1="8" y1="72" x2="16" y2="72" strokeWidth="1.0" strokeOpacity="0.70" />

      {/* Inner bracket — set 6px inside */}
      <line x1="14" y1="14" x2="58" y2="14" strokeWidth="0.5" strokeOpacity="0.30" />
      <line x1="14" y1="14" x2="14" y2="58" strokeWidth="0.5" strokeOpacity="0.30" />

      {/* ── Delicate arc connecting the two bracket far ends ── */}
      {/* Arc from (72,16) sweeping to (16,72) — large-radius quarter circle */}
      <path
        d="M72,16 Q72,72 16,72"
        strokeWidth="0.8" strokeOpacity="0.45"
      />
      {/* Faint second arc, slightly tighter */}
      <path
        d="M64,14 Q64,64 14,64"
        strokeWidth="0.4" strokeOpacity="0.22"
      />

      {/* ── 3 evenly-spaced dots along the arc ── */}
      {/* Approximate t=0.25, 0.5, 0.75 on the quadratic bezier from (72,16) to (16,72) ctrl(72,72) */}
      {/* t=0.25 → (66, 32)  t=0.5 → (54, 52)  t=0.75 → (36, 66) */}
      <circle cx="66" cy="32" r="1.8" strokeWidth="0.8" strokeOpacity="0.55" />
      <circle cx="52" cy="52" r="1.8" strokeWidth="0.8" strokeOpacity="0.55" />
      <circle cx="32" cy="66" r="1.8" strokeWidth="0.8" strokeOpacity="0.55" />
      {/* Tiny accent dots between main dots */}
      <circle cx="60" cy="40" r="0.8" strokeWidth="0.5" strokeOpacity="0.30" />
      <circle cx="42" cy="60" r="0.8" strokeWidth="0.5" strokeOpacity="0.30" />

      {/* ── Small diamond at the corner apex (8,8) ── */}
      {/* Rotated square centred at (8,8), half-width = 5 */}
      <path d="M8,3 L13,8 L8,13 L3,8 Z"
        strokeWidth="1.0" strokeOpacity="0.75"
      />
      {/* Inner diamond — concentric, half-width = 2.5 */}
      <path d="M8,5.5 L10.5,8 L8,10.5 L5.5,8 Z"
        strokeWidth="0.5" strokeOpacity="0.40"
      />
      {/* Centre dot of diamond */}
      <circle cx="8" cy="8" r="0.8" strokeWidth="0.5" strokeOpacity="0.50" />

      {/* ── Tick marks along the outer lines for elegance ── */}
      {/* Along top line */}
      <line x1="24" y1="8"  x2="24" y2="11"  strokeWidth="0.5" strokeOpacity="0.30" />
      <line x1="40" y1="8"  x2="40" y2="11"  strokeWidth="0.5" strokeOpacity="0.30" />
      <line x1="56" y1="8"  x2="56" y2="11"  strokeWidth="0.5" strokeOpacity="0.30" />
      {/* Along left line */}
      <line x1="8"  y1="24" x2="11" y2="24"  strokeWidth="0.5" strokeOpacity="0.30" />
      <line x1="8"  y1="40" x2="11" y2="40"  strokeWidth="0.5" strokeOpacity="0.30" />
      <line x1="8"  y1="56" x2="11" y2="56"  strokeWidth="0.5" strokeOpacity="0.30" />
    </g>
  )

  const ornamentMap: Record<string, React.ReactNode> = {
    gold: goldPath,
    silver: silverPath,
    dark: darkPath,
    floral: floralPath,
    minimal: minimalPath,
  }

  // Resolve path: prefix-based slugs take priority over exact map lookup
  const resolvedPath = isNature
    ? naturePath
    : isFairytale
    ? fairytalePath
    : isAdat
    ? adatPath
    : isFloral
    ? floralPath
    : isMinimal
    ? minimalPath
    : ornamentMap[slug] ?? ornamentMap.gold

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      style={{ transform: transforms[position], ...style }}
      aria-hidden="true"
    >
      {resolvedPath}
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
  const { slug, primaryHex, secondaryHex } = theme as ThemeConfig & { secondaryHex?: string }
  const isNature = slug.startsWith('nat-')
  const isFairytale = slug.startsWith('fai-')
  const isAdat = slug.startsWith('adt-')
  const isFloral = slug.startsWith('flo-')
  const isMinimal = slug.startsWith('min-')
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

  // Nature: horizontal branch with hanging leaves and berries
  const nature = (
    <g fill="none" stroke={primaryHex} strokeWidth="1" strokeLinecap="round">
      {/* Main horizontal branch */}
      <path d="M10,20 C40,17 80,23 100,20 C120,17 160,23 190,20" opacity="0.55" strokeWidth="1.3" />
      {/* Hanging leaf stems at intervals */}
      {[30, 60, 100, 140, 170].map((x, i) => (
        <g key={i}>
          {/* Drooping stem */}
          <path d={`M${x},20 C${x - 2},26 ${x + 2},30 ${x},34`} strokeWidth="0.8" opacity="0.5" />
          {/* Leaf pair */}
          <path
            d={`M${x},27 C${x + 6},23 ${x + 9},27 ${x + 7},31 C${x + 5},35 ${x},32 ${x},27Z`}
            fill={primaryHex} opacity="0.25"
          />
          <path
            d={`M${x},27 C${x - 6},23 ${x - 9},27 ${x - 7},31 C${x - 5},35 ${x},32 ${x},27Z`}
            fill={primaryHex} opacity="0.2"
          />
        </g>
      ))}
      {/* Small berries */}
      {[45, 85, 125, 155].map((x, i) => (
        <g key={`b-${i}`}>
          <circle cx={x} cy={18} r="2" fill={primaryHex} opacity="0.3" />
          <line x1={x} y1={20} x2={x} y2={18} strokeWidth="0.6" opacity="0.35" />
        </g>
      ))}
      {/* Bamboo node marks on branch */}
      {[70, 100, 130].map((x, i) => (
        <line key={`n-${i}`} x1={x} y1={17} x2={x} y2={23} strokeWidth="1.2" opacity="0.3" />
      ))}
    </g>
  )

  // Fairytale: stars and flowing ribbon across divider
  const fairytale = (
    <g fill="none" stroke={primaryHex} strokeWidth="1" strokeLinecap="round">
      {/* Flowing ribbon lines */}
      <path d="M10,20 C30,14 50,26 70,20 C90,14 110,26 130,20 C150,14 170,26 190,20" opacity="0.3" strokeWidth="1.2" />
      <path d="M10,20 C30,26 50,14 70,20 C90,26 110,14 130,20 C150,26 170,14 190,20" opacity="0.15" strokeWidth="0.7" />
      {/* Stars at wave peaks */}
      {[
        { cx: 10, cy: 20, r: 4 },
        { cx: 70, cy: 20, r: 5 },
        { cx: 100, cy: 20, r: 6 },
        { cx: 130, cy: 20, r: 5 },
        { cx: 190, cy: 20, r: 4 },
      ].map(({ cx, cy, r }, i) => {
        const pts = [0, 72, 144, 216, 288].map((a) => {
          const rad = (a - 90) * (Math.PI / 180)
          const irad = (a - 90 + 36) * (Math.PI / 180)
          return `${cx + Math.cos(rad) * r},${cy + Math.sin(rad) * r} ${cx + Math.cos(irad) * (r * 0.42)},${cy + Math.sin(irad) * (r * 0.42)}`
        })
        return (
          <polygon
            key={i}
            points={pts.join(' ')}
            fill={primaryHex}
            opacity={i === 2 ? 0.4 : 0.28}
            stroke={primaryHex}
            strokeWidth="0.5"
          />
        )
      })}
      {/* Sparkle crosses at intervals */}
      {[40, 160].map((x, i) => (
        <g key={`sp-${i}`}>
          <line x1={x} y1={15} x2={x} y2={25} strokeWidth="0.8" opacity="0.35" />
          <line x1={x - 5} y1={20} x2={x + 5} y2={20} strokeWidth="0.8" opacity="0.35" />
          <circle cx={x} cy={20} r="1.2" fill={primaryHex} opacity="0.45" />
        </g>
      ))}
      {/* Scattered sparkle dots */}
      {[55, 85, 115, 145].map((x, i) => (
        <circle key={`d-${i}`} cx={x} cy={i % 2 === 0 ? 16 : 24} r="1" fill={primaryHex} opacity="0.3" />
      ))}
    </g>
  )

  // Adat/Traditional: repeating geometric border — songket diamonds + stepped edge
  const adat = (
    <g fill="none" stroke={primaryHex} strokeWidth="1" strokeLinecap="round">
      {/* Top and bottom border lines */}
      <line x1="10" y1="12" x2="190" y2="12" opacity="0.35" strokeWidth="0.8" />
      <line x1="10" y1="28" x2="190" y2="28" opacity="0.35" strokeWidth="0.8" />
      {/* Diamond grid — repeating every 20px */}
      {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((cx, i) => (
        <g key={i}>
          {/* Large diamond */}
          <rect
            x={cx - 7} y={13}
            width="14" height="14"
            transform={`rotate(45 ${cx} 20)`}
            opacity={i === 4 ? 0.45 : 0.25}
            fill={i === 4 ? primaryHex : 'none'}
            fillOpacity={i === 4 ? 0.15 : 0}
            stroke={primaryHex}
          />
          {/* Inner small diamond */}
          <rect
            x={cx - 3} y={17}
            width="6" height="6"
            transform={`rotate(45 ${cx} 20)`}
            opacity="0.2"
            stroke={primaryHex}
          />
          {/* Centre dot */}
          <circle cx={cx} cy={20} r="1" fill={primaryHex} opacity={i === 4 ? 0.5 : 0.28} />
        </g>
      ))}
      {/* Secondary accent diamonds (between mains, offset) */}
      {secondaryHex && [30, 70, 110, 150].map((cx, i) => (
        <rect
          key={`sec-${i}`}
          x={cx - 4} y={16}
          width="8" height="8"
          transform={`rotate(45 ${cx} 20)`}
          stroke={secondaryHex}
          strokeOpacity="0.4"
          fill={secondaryHex}
          fillOpacity="0.1"
        />
      ))}
      {/* Parang diagonal accents — subtle */}
      <line x1="10" y1="28" x2="22" y2="12" strokeWidth="0.5" opacity="0.15" />
      <line x1="190" y1="28" x2="178" y2="12" strokeWidth="0.5" opacity="0.15" />
    </g>
  )

  const svgMap: Record<string, React.ReactNode> = { gold, silver, dark, floral, minimal }

  // Prefix-based resolution for new style families
  const resolved = isNature
    ? nature
    : isFairytale
    ? fairytale
    : isAdat
    ? adat
    : isFloral
    ? floral
    : isMinimal
    ? minimal
    : svgMap[slug] ?? svgMap.gold

  return (
    <div className={`flex justify-center my-6 ${className}`} style={style} aria-hidden="true">
      <svg
        width="100%"
        height={size}
        viewBox="0 0 200 40"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: 500 }}
      >
        {resolved}
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
  const { slug, primaryHex, secondaryHex } = theme as ThemeConfig & { secondaryHex?: string }
  const isNature = slug.startsWith('nat-')
  const isFairytale = slug.startsWith('fai-')
  const isAdat = slug.startsWith('adt-')
  const isFloral = slug.startsWith('flo-')
  const isMinimal = slug.startsWith('min-')

  // Border patterns per theme
  const getFrameStyle = (): React.CSSProperties => {
    if (isNature) return {
      border: `1.5px solid ${primaryHex}`,
      borderRadius: '8px',
      boxShadow: `0 0 0 3px ${primaryHex}18`,
      padding: '1.5rem',
    }
    if (isFairytale) return {
      border: `1px solid ${primaryHex}`,
      borderRadius: '16px',
      boxShadow: `0 0 12px ${primaryHex}22, 0 0 0 4px ${primaryHex}11`,
      padding: '1.5rem',
    }
    if (isAdat) return {
      border: `2px solid ${primaryHex}`,
      borderRadius: '0',
      outline: `1px solid ${secondaryHex ?? primaryHex}`,
      outlineOffset: '4px',
      boxShadow: `inset 0 0 0 1px ${primaryHex}22`,
      padding: '1.5rem',
    }
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

// ─────────────────────────────────────────────────────────────
// ImageCornerOrnament  (JPG watercolor corner asset)
// variant: 1–4 selects which numbered image (default: 1)
// position: same as CornerOrnament — image is CSS-flipped for
//           top-right / bottom-left / bottom-right positions
// ─────────────────────────────────────────────────────────────
interface ImageCornerOrnamentProps extends OrnamentBaseProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  variant?: 1 | 2 | 3 | 4
}

export const ImageCornerOrnament: React.FC<ImageCornerOrnamentProps> = ({
  theme,
  position,
  className = '',
  style,
  size = 200,
  variant = 1,
}) => {
  const { slug } = theme

  const folderMap: Record<string, string> = {
    'fai-': '/images/ornaments/fairytale/corner',
    'flo-': '/images/ornaments/floral/corner',
    'nat-': '/images/ornaments/nature/corner',
  }

  const folder = Object.entries(folderMap).find(([prefix]) =>
    slug.startsWith(prefix)
  )?.[1]

  // Fall back to SVG CornerOrnament if no image set for this theme
  if (!folder) {
    return <CornerOrnament theme={theme} position={position} className={className} style={style} size={size} />
  }

  const transforms: Record<string, string> = {
    'top-left':     '',
    'top-right':    'scaleX(-1)',
    'bottom-left':  'scaleY(-1)',
    'bottom-right': 'scale(-1)',
  }

  return (
    <img
      src={`${folder}/corner-${variant}.png`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        transform: transforms[position],
        display: 'block',
        ...style,
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// HeroOrnament  (JPG watercolor full-page background / hero asset)
// variant: 1–4 selects which numbered image (default: 1)
// ─────────────────────────────────────────────────────────────
interface HeroOrnamentProps {
  theme: ThemeConfig
  className?: string
  style?: React.CSSProperties
  variant?: 1 | 2 | 3 | 4
  /** How the image fills its container (default: cover) */
  fit?: 'cover' | 'contain' | 'fill'
}

export const HeroOrnament: React.FC<HeroOrnamentProps> = ({
  theme,
  className = '',
  style,
  variant = 1,
  fit = 'cover',
}) => {
  const { slug } = theme

  const folderMap: Record<string, string> = {
    'flo-': '/images/ornaments/floral/hero',
    'nat-': '/images/ornaments/nature/hero',
  }

  const folder = Object.entries(folderMap).find(([prefix]) =>
    slug.startsWith(prefix)
  )?.[1]

  if (!folder) return null

  return (
    <img
      src={`${folder}/hero-${variant}.jpg`}
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: fit,
        display: 'block',
        ...style,
      }}
    />
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
  ImageCornerOrnament,
  HeroOrnament,
}
