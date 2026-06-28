'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ThemeConfig } from '@/themes/config'

// Lazy-load heavy components
const ViewTracker    = dynamic(() => import('@/components/invitation/ViewTracker'))
const QuranicVerse   = dynamic(() => import('@/components/invitation/QuranicVerse'))
const HeroSection    = dynamic(() => import('@/components/invitation/HeroSection'))
const CoupleProfile  = dynamic(() => import('@/components/invitation/CoupleProfile'))
const EventSchedule  = dynamic(() => import('@/components/invitation/EventSchedule'))
const CountdownTimer = dynamic(() => import('@/components/invitation/CountdownTimer'))
const ContactInfo     = dynamic(() => import('@/components/invitation/ContactInfo'))
const PhotoGallery   = dynamic(() => import('@/components/invitation/PhotoGallery'))
const LoveStory      = dynamic(() => import('@/components/invitation/LoveStory'))
const RundownTimeline = dynamic(() => import('@/components/invitation/RundownTimeline'))
const RsvpForm       = dynamic(() => import('@/components/invitation/RsvpForm'))
const WishesWall     = dynamic(() => import('@/components/invitation/WishesWall'))
const MusicPlayer    = dynamic(() => import('@/components/invitation/MusicPlayer'))
const EnvelopeOpener = dynamic(() => import('@/components/invitation/EnvelopeOpener'))

const SectionDivider = dynamic(() => import('@/components/invitation/SectionDivider'))
const AnimateOnScroll = dynamic(() => import('@/components/invitation/AnimateOnScroll'))

interface Props {
  invitation: any
  theme:      ThemeConfig
  guestName?: string
}

export default function EnvelopeOpenerWrapper({ invitation, theme, guestName }: Props) {
  const [opened, setOpened] = useState(false)

  if (!opened) {
    return (
      <EnvelopeOpener
        onOpen={() => setOpened(true)}
        brideName={invitation.bride_name}
        groomName={invitation.groom_name}
        guestName={guestName}
        theme={theme}
      />
    )
  }

  const gallery: string[] = invitation.gallery_photos
    ? (typeof invitation.gallery_photos === 'string'
        ? JSON.parse(invitation.gallery_photos)
        : invitation.gallery_photos)
    : []

  // Love story milestones (demo data if none provided)
  const stories = invitation.love_story
    ? (typeof invitation.love_story === 'string'
        ? JSON.parse(invitation.love_story)
        : invitation.love_story)
    : undefined

  // Gift registry data
  const gifts = invitation.gift_accounts
    ? (typeof invitation.gift_accounts === 'string'
        ? JSON.parse(invitation.gift_accounts)
        : invitation.gift_accounts)
    : undefined

  return (
    <main className={`${theme.bgPage} min-h-screen overflow-hidden`}>
      <ViewTracker invitationId={invitation.id} guestName={guestName} />
      {invitation.music_url && <MusicPlayer musicUrl={invitation.music_url} theme={theme} />}

      {/* ── Quranic Verse ───────────────────────────────────── */}
      <AnimateOnScroll animation="fade-up" duration={1200}>
        <QuranicVerse theme={theme} />
      </AnimateOnScroll>

      <SectionDivider variant="wave" theme={theme} />

      {/* ── Hero Section ───────────────────────────────────── */}
      <AnimateOnScroll animation="fade-up" duration={1200}>
        <HeroSection
          brideName={invitation.bride_name}
          groomName={invitation.groom_name}
          weddingDate={invitation.wedding_date}
          theme={theme}
          guestName={guestName}
        />
      </AnimateOnScroll>

      <SectionDivider variant="curve" theme={theme} flip />

      {/* ── Couple Profile ─────────────────────────────────── */}
      <AnimateOnScroll animation="fade-up" duration={1000}>
        <CoupleProfile
          bride={{
            name: invitation.bride_name,
            fullName: invitation.bride_full_name || invitation.bride_name,
            title: 'The Bride',
            photoUrl: invitation.bride_photo_url || '',
            bio: invitation.bride_bio || '',
            parents: invitation.bride_father
              ? `Daughter of ${invitation.bride_father}`
              : '',
          }}
          groom={{
            name: invitation.groom_name,
            fullName: invitation.groom_full_name || invitation.groom_name,
            title: 'The Groom',
            photoUrl: invitation.groom_photo_url || '',
            bio: invitation.groom_bio || '',
            parents: invitation.groom_father
              ? `Son of ${invitation.groom_father}`
              : '',
          }}
          theme={theme}
        />
      </AnimateOnScroll>

      <SectionDivider variant="floral" theme={theme} />

      {/* ── Event Schedule ─────────────────────────────────── */}
      <AnimateOnScroll animation="fade-up" duration={1000} delay={100}>
        <EventSchedule
          akadDate={invitation.akad_date || ''}
          akadTime={invitation.akad_time || ''}
          akadVenue={invitation.akad_venue || ''}
          receptionDate={invitation.reception_date || ''}
          receptionTime={invitation.reception_time || ''}
          receptionVenue={invitation.reception_venue || ''}
          venueLat={invitation.venue_lat}
          venueLng={invitation.venue_lng}
          theme={theme}
        />
      </AnimateOnScroll>

      <SectionDivider variant="diagonal" theme={theme} />

      {/* ── Countdown Timer ────────────────────────────────── */}
      <AnimateOnScroll animation="zoom-in" duration={1000}>
        <CountdownTimer weddingDate={invitation.wedding_date} theme={theme} />
      </AnimateOnScroll>

      <SectionDivider variant="wave" theme={theme} flip />


      {/* ── Love Story Carousel ────────────────────────────── */}
      <AnimateOnScroll animation="fade-up" duration={1000} delay={100}>
        <LoveStory theme={theme} stories={stories} />
      </AnimateOnScroll>

      <SectionDivider variant="diagonal" theme={theme} flip />

      {/* ── Rundown Timeline ───────────────────────────────── */}
      <AnimateOnScroll animation="fade-up" duration={1000} delay={100}>
        <RundownTimeline theme={theme} />
      </AnimateOnScroll>

      <SectionDivider variant="floral" theme={theme} />

      {/* ── Photo Gallery ──────────────────────────────────── */}
      {gallery.length > 0 && (
        <AnimateOnScroll animation="fade-up" duration={1000} delay={100}>
          <PhotoGallery photos={gallery} theme={theme} />
        </AnimateOnScroll>
      )}

      <SectionDivider variant="wave" theme={theme} />

      {/* ── Ucapan / Wishes Wall ───────────────────────────── */}
      <AnimateOnScroll animation="fade-up" duration={1000} delay={100}>
        <WishesWall invitationId={invitation.id} theme={theme} />
      </AnimateOnScroll>

      <SectionDivider variant="curve" theme={theme} flip />

      {/* ── RSVP Form ──────────────────────────────────────── */}
      <AnimateOnScroll animation="fade-up" duration={1000} delay={100}>
        <RsvpForm invitationId={invitation.id} guestName={guestName} theme={theme} />
      </AnimateOnScroll>

      {/* ── Contact Info ───────────────────────────────────── */}
      <AnimateOnScroll animation="fade-up" duration={1000} delay={100}>
        <ContactInfo theme={theme} />
      </AnimateOnScroll>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className={`relative py-20 px-6 text-center overflow-hidden ${theme.bgDark}`}>
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(theme.primaryHex)}' fill-opacity='1'%3E%3Cpath d='M40 10l2 6 6 2-6 2-2 6-2-6-6-2 6-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.primaryHex}08 0%, transparent 70%)`,
          }}
        />

        <AnimateOnScroll animation="fade-up" duration={1000}>
          <div className="relative z-10 max-w-lg mx-auto">
            {/* Couple names */}
            <p className={`${theme.fontDisplay} text-5xl md:text-6xl mb-4 text-white`}>
              {invitation.bride_name} &amp; {invitation.groom_name}
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-px" style={{
                background: `linear-gradient(90deg, transparent, ${theme.primaryHex}60, transparent)`
              }} />
              <span className={`${theme.fontLabel} text-lg text-white/60`}>
                {theme.ornamentChar}
              </span>
              <div className="w-20 h-px" style={{
                background: `linear-gradient(90deg, transparent, ${theme.primaryHex}60, transparent)`
              }} />
            </div>

            {/* Thank you message */}
            <p className={`${theme.fontLabel} text-sm tracking-[0.5em] mb-3`} style={{ color: 'rgba(255,255,255,0.7)' }}>
              THANK YOU
            </p>
            <p className={`${theme.fontBody} text-base italic mb-2`} style={{ color: 'rgba(255,255,255,0.5)' }}>
              For sharing in our joy and blessing our union
            </p>

            {/* Wedding date */}
            <p className={`${theme.fontBody} text-sm mt-6`} style={{ color: 'rgba(255,255,255,0.4)' }}>
              {invitation.wedding_date
                ? new Date(invitation.wedding_date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })
                : ''}
            </p>

            {/* Bottom ornament */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>{theme.ornamentChar}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>{theme.ornamentChar}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>{theme.ornamentChar}</span>
            </div>
          </div>
        </AnimateOnScroll>
      </footer>
    </main>
  )
}
