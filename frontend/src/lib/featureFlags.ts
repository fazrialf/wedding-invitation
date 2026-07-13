/**
 * Feature flag keys — must match exactly what's defined in PostHog UI.
 * All flags default to FALSE (zero state) until explicitly enabled in PostHog.
 */
export const FLAGS = {
  RSVP:          'rsvp-enabled',
  WISHES:        'wishes-enabled',
  GIFT_REGISTRY: 'gift-registry-enabled',
  MUSIC_PLAYER:  'music-player-enabled',
  PHOTO_GALLERY: 'photo-gallery-enabled',
  LOVE_STORY:    'love-story-enabled',
  COUNTDOWN:     'countdown-enabled',
  DRESSCODE:     'dresscode-enabled',
  RUNDOWN:       'rundown-enabled',
  QURANIC_VERSE: 'quranic-verse-enabled',
  CONTACT_INFO:  'contact-info-enabled',
} as const

export type FlagKey = typeof FLAGS[keyof typeof FLAGS]

/**
 * All flags with their zero state (false = off by default).
 * Captured on every session start so we always know the baseline.
 */
export const ZERO_STATE: Record<FlagKey, boolean> = {
  'rsvp-enabled':          false,
  'wishes-enabled':        false,
  'gift-registry-enabled': false,
  'music-player-enabled':  false,
  'photo-gallery-enabled': false,
  'love-story-enabled':    false,
  'countdown-enabled':     false,
  'dresscode-enabled':     false,
  'rundown-enabled':       false,
  'quranic-verse-enabled': false,
  'contact-info-enabled':  false,
}
