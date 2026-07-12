'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import PelaminanOrnament from '@/components/studio/PelaminanOrnament'

// Floating mock invitation card
function MockInvitationCard() {
  return (
    <div className="relative w-72 mx-auto">
      {/* Glow behind card */}
      <div className="absolute inset-0 blur-2xl opacity-30 rounded-2xl" style={{ background: 'radial-gradient(ellipse, #C8A96E 0%, transparent 70%)' }} />
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#C8A96E]/30"
        style={{ background: 'linear-gradient(160deg, #2C1A0E 0%, #3D2410 60%, #1a0f07 100%)' }}
      >
        {/* Top ornament bar */}
        <div className="flex justify-center pt-6 pb-2">
          <PelaminanOrnament width={80} height={80} className="opacity-60" />
        </div>

        {/* Content */}
        <div className="px-6 pb-8 text-center">
          <p className="font-cinzel text-[#C8A96E] text-xs tracking-[0.3em] uppercase mb-2">Undangan Pernikahan</p>
          <div className="w-12 h-px bg-[#C8A96E]/40 mx-auto mb-4" />
          <h3 className="font-cormorant italic text-white text-3xl mb-1">Budi</h3>
          <p className="font-cinzel text-[#C8A96E] text-xs tracking-widest mb-1">&amp;</p>
          <h3 className="font-cormorant italic text-white text-3xl mb-4">Sari</h3>
          <div className="w-12 h-px bg-[#C8A96E]/40 mx-auto mb-4" />
          <p className="font-lato text-[#E8DCC8]/70 text-xs mb-1">Sabtu, 14 Februari 2026</p>
          <p className="font-lato text-[#E8DCC8]/50 text-xs">Balai Kartini, Jakarta</p>
          <div className="mt-5 inline-block border border-[#C8A96E]/50 px-5 py-2">
            <span className="font-cinzel text-[#C8A96E] text-xs tracking-widest">RSVP</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Theme preview cards
const THEMES = [
  {
    name: 'Gold',
    label: 'Emas Klasik',
    desc: 'Mewah, hangat, tak lekang waktu',
    bg: 'linear-gradient(160deg, #2C1A0E 0%, #5C3D23 50%, #C8A96E 100%)',
    accent: '#C8A96E',
  },
  {
    name: 'Silver',
    label: 'Perak Modern',
    desc: 'Elegan, bersih, kontemporer',
    bg: 'linear-gradient(160deg, #1a1a2e 0%, #3a3a5c 50%, #a8a8c8 100%)',
    accent: '#a8a8c8',
  },
  {
    name: 'Dark',
    label: 'Malam Romantis',
    desc: 'Dramatis, intim, berkesan',
    bg: 'linear-gradient(160deg, #0a0a0a 0%, #1a0a1a 50%, #4a2040 100%)',
    accent: '#e8a0c0',
  },
  {
    name: 'Floral',
    label: 'Bunga Taman',
    desc: 'Lembut, feminin, penuh cinta',
    bg: 'linear-gradient(160deg, #2d1b1b 0%, #5a2d3a 50%, #c8a0b0 100%)',
    accent: '#f0c0d0',
  },
]

// Steps
const STEPS = [
  {
    num: '01',
    title: 'Pilih Desain',
    desc: 'Pilih dari 30+ template premium dengan 75 palet warna yang dikurasi khusus.',
  },
  {
    num: '02',
    title: 'Isi Detail',
    desc: 'Masukkan nama, tanggal, lokasi, galeri foto, rekening, dan love story kalian.',
  },
  {
    num: '03',
    title: 'Bagikan',
    desc: 'Dapatkan link personal, bagikan via WhatsApp, dan pantau RSVP secara real-time.',
  },
]

// Stats
const STATS = [
  { value: '30+', label: 'Template Premium' },
  { value: '75', label: 'Palet Warna' },
  { value: '5', label: 'Keluarga Ornamen' },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main style={{ background: '#FAF7F2' }} className="min-h-screen font-lato">

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(44,26,14,0.97)'
            : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(200,169,110,0.15)' : 'none',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-3">
            <span className="font-cormorant italic font-semibold text-2xl" style={{ color: '#C8A96E' }}>
              Pelaminan
            </span>
            <span className="hidden sm:block font-cinzel text-[10px] tracking-[0.3em] uppercase" style={{ color: '#E8DCC8', opacity: 0.6 }}>
              Digital
            </span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="font-cinzel text-xs tracking-widest px-4 py-2 transition-colors duration-200"
              style={{ color: '#E8DCC8' }}
            >
              MASUK
            </Link>
            <Link
              href="/register"
              className="font-cinzel text-xs tracking-widest px-5 py-2 transition-colors duration-200"
              style={{
                background: '#6B3F2A',
                color: '#E8DCC8',
                border: '1px solid #C8A96E',
              }}
            >
              MULAI GRATIS
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 pt-16 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2C1A0E 0%, #3D2410 55%, #4A2E18 100%)' }}
      >
        {/* Batik texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #C8A96E 0, #C8A96E 1px, transparent 0, transparent 50%)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-20 left-6 w-20 h-20 border-t-2 border-l-2 border-[#C8A96E] opacity-25" />
        <div className="absolute top-20 right-6 w-20 h-20 border-t-2 border-r-2 border-[#C8A96E] opacity-25" />
        <div className="absolute bottom-10 left-6 w-20 h-20 border-b-2 border-l-2 border-[#C8A96E] opacity-25" />
        <div className="absolute bottom-10 right-6 w-20 h-20 border-b-2 border-r-2 border-[#C8A96E] opacity-25" />

        {/* Left — copy */}
        <div className="flex-1 max-w-xl text-center lg:text-left z-10 py-16 lg:py-0">
          {/* Eyebrow */}
          <p className="font-cinzel text-xs tracking-[0.4em] uppercase mb-6" style={{ color: '#C8A96E' }}>
            Platform Undangan Digital
          </p>

          {/* Brand mark */}
          <h1 className="font-cormorant italic font-semibold mb-3" style={{ color: '#E8DCC8', fontSize: 'clamp(3rem, 8vw, 5.5rem)', lineHeight: 1.1 }}>
            Pelaminan
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
            <div className="flex-1 max-w-[60px] h-px" style={{ background: '#C8A96E', opacity: 0.4 }} />
            <PelaminanOrnament width={28} height={28} className="opacity-70" />
            <div className="flex-1 max-w-[60px] h-px" style={{ background: '#C8A96E', opacity: 0.4 }} />
          </div>

          {/* Tagline */}
          <p className="font-cormorant italic text-2xl mb-4" style={{ color: '#C8A96E' }}>
            Dari Hati, Untuk Selamanya
          </p>

          <p className="font-lato text-base mb-10 leading-relaxed" style={{ color: '#E8DCC8', opacity: 0.7 }}>
            Buat undangan pernikahan digital yang elegan — cantik di semua perangkat,
            mudah dibagikan, dan dilengkapi RSVP real-time untuk momen terbaik hidupmu.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/register"
              className="font-cinzel text-xs tracking-[0.2em] uppercase px-8 py-4 text-center transition-all duration-300 hover:opacity-90"
              style={{ background: '#6B3F2A', color: '#E8DCC8', border: '1px solid #C8A96E' }}
            >
              Buat Undangan Gratis
            </Link>
            <Link
              href="/login"
              className="font-cinzel text-xs tracking-[0.2em] uppercase px-8 py-4 text-center transition-all duration-300 hover:bg-[#E8DCC8]/10"
              style={{ color: '#C8A96E', border: '1px solid rgba(200,169,110,0.35)' }}
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>

        {/* Right — floating mock card */}
        <div className="flex-1 flex items-center justify-center z-10 pb-12 lg:pb-0">
          <MockInvitationCard />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: '#6B3F2A' }}>
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-around gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-cormorant italic font-semibold text-4xl" style={{ color: '#C8A96E' }}>{s.value}</p>
              <p className="font-cinzel text-xs tracking-widest uppercase mt-1" style={{ color: '#E8DCC8', opacity: 0.75 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-cinzel text-xs tracking-[0.35em] uppercase mb-3" style={{ color: '#6B3F2A' }}>Cara Kerja</p>
          <h2 className="font-playfair text-4xl" style={{ color: '#2C1A0E' }}>Tiga Langkah Sederhana</h2>
          <div className="w-16 h-px mx-auto mt-4" style={{ background: '#C8A96E' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {STEPS.map((step) => (
            <div key={step.num} className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 font-cormorant italic font-semibold text-xl"
                style={{ background: '#FAF7F2', border: '1.5px solid #C8A96E', color: '#6B3F2A' }}
              >
                {step.num}
              </div>
              <h3 className="font-playfair text-xl mb-2" style={{ color: '#2C1A0E' }}>{step.title}</h3>
              <p className="font-lato text-sm leading-relaxed" style={{ color: '#6B3F2A', opacity: 0.8 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THEME SHOWCASE ── */}
      <section className="py-20 px-6" style={{ background: '#2C1A0E' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-cinzel text-xs tracking-[0.35em] uppercase mb-3" style={{ color: '#C8A96E' }}>Koleksi Desain</p>
            <h2 className="font-playfair text-4xl" style={{ color: '#E8DCC8' }}>Template Premium</h2>
            <div className="w-16 h-px mx-auto mt-4" style={{ background: '#C8A96E', opacity: 0.5 }} />
            <p className="font-lato text-sm mt-4" style={{ color: '#E8DCC8', opacity: 0.55 }}>
              Pilih dari koleksi yang dikurasi — setiap tema hadir dengan palet lengkap &amp; ornamen tradisional
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {THEMES.map((theme) => (
              <Link key={theme.name} href={`/preview/${theme.name.toLowerCase()}`}>
                <div className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="aspect-[9/16] flex flex-col items-center justify-center gap-3 relative"
                    style={{ background: theme.bg }}
                  >
                    {/* Mini ornament */}
                    <PelaminanOrnament width={50} height={50} className="opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                    <span className="font-cormorant italic font-semibold text-lg" style={{ color: theme.accent }}>
                      {theme.label}
                    </span>
                    <span className="font-lato text-xs text-center px-4 leading-snug" style={{ color: theme.accent, opacity: 0.7 }}>
                      {theme.desc}
                    </span>
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
                    >
                      <span className="font-cinzel text-xs tracking-widest uppercase" style={{ color: '#C8A96E' }}>
                        Lihat Contoh →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOCK INVITATION SAMPLE ── */}
      <section className="py-24 px-6" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">

          {/* Left — text */}
          <div className="flex-1 max-w-lg">
            <p className="font-cinzel text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#6B3F2A' }}>Contoh Undangan</p>
            <h2 className="font-playfair text-4xl mb-4 leading-snug" style={{ color: '#2C1A0E' }}>
              Tampilan yang Memukau di Semua Perangkat
            </h2>
            <div className="w-16 h-px mb-6" style={{ background: '#C8A96E' }} />
            <p className="font-lato text-sm leading-relaxed mb-6" style={{ color: '#6B3F2A', opacity: 0.8 }}>
              Setiap undangan hadir dengan hero foto penuh layar, timeline perjalanan cinta,
              detail lokasi interaktif, galeri foto, konfirmasi kehadiran (RSVP), ucapan tamu,
              dan rekening hadiah — semua dalam satu link yang elegan.
            </p>
            <ul className="space-y-3">
              {[
                'Hero foto &amp; countdown hari-H',
                'Love story &amp; galeri foto',
                'Lokasi dengan peta Google Maps',
                'RSVP real-time &amp; ucapan tamu',
                'Rekening bank &amp; hadiah digital',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 font-lato text-sm" style={{ color: '#2C1A0E' }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C8A96E' }} />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>

          {/* Right — expanded mock */}
          <div className="flex-1 flex justify-center">
            <div
              className="w-80 rounded-2xl overflow-hidden shadow-2xl border border-[#C8A96E]/20"
              style={{ background: 'linear-gradient(160deg, #2C1A0E 0%, #3D2410 100%)' }}
            >
              {/* Mock phone notch */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-20 h-1.5 rounded-full" style={{ background: 'rgba(200,169,110,0.3)' }} />
              </div>

              {/* Hero section */}
              <div className="px-6 py-6 text-center border-b border-[#C8A96E]/10">
                <PelaminanOrnament width={64} height={64} className="mx-auto mb-3 opacity-70" />
                <p className="font-cinzel text-[#C8A96E] text-[10px] tracking-[0.3em] uppercase mb-2">Undangan Pernikahan</p>
                <h4 className="font-cormorant italic text-white text-2xl">Ahmad &amp; Dewi</h4>
                <p className="font-lato text-[#E8DCC8]/50 text-xs mt-1">Sabtu, 14 Februari 2026</p>
              </div>

              {/* Countdown mock */}
              <div className="px-6 py-4 flex justify-around border-b border-[#C8A96E]/10">
                {[['07', 'Hari'], ['12', 'Jam'], ['45', 'Menit']].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <p className="font-cormorant italic text-2xl font-semibold" style={{ color: '#C8A96E' }}>{n}</p>
                    <p className="font-cinzel text-[8px] tracking-widest uppercase" style={{ color: '#E8DCC8', opacity: 0.5 }}>{l}</p>
                  </div>
                ))}
              </div>

              {/* Details mock */}
              <div className="px-6 py-4 border-b border-[#C8A96E]/10">
                <p className="font-cinzel text-[#C8A96E] text-[9px] tracking-widest uppercase mb-2">Akad Nikah</p>
                <p className="font-lato text-[#E8DCC8]/80 text-xs">08.00 WIB — Masjid Istiqlal</p>
                <p className="font-cinzel text-[#C8A96E] text-[9px] tracking-widest uppercase mt-3 mb-2">Resepsi</p>
                <p className="font-lato text-[#E8DCC8]/80 text-xs">11.00 WIB — Balai Kartini, Jakarta</p>
              </div>

              {/* RSVP button mock */}
              <div className="px-6 py-5 text-center">
                <div
                  className="inline-block px-8 py-2.5 font-cinzel text-[10px] tracking-widest uppercase"
                  style={{ background: '#6B3F2A', color: '#E8DCC8', border: '1px solid #C8A96E' }}
                >
                  Konfirmasi Kehadiran
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section
        className="py-20 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6B3F2A 0%, #3D2410 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #C8A96E 0, #C8A96E 1px, transparent 0, transparent 50%)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10">
          <PelaminanOrnament width={60} height={60} className="mx-auto mb-5 opacity-50" />
          <h2 className="font-playfair text-4xl mb-3" style={{ color: '#E8DCC8' }}>Siap Membuat Undangan?</h2>
          <p className="font-lato text-sm mb-8" style={{ color: '#E8DCC8', opacity: 0.65 }}>
            Gratis untuk memulai — tanpa kartu kredit, tanpa batas waktu trial.
          </p>
          <Link
            href="/register"
            className="inline-block font-cinzel text-xs tracking-[0.25em] uppercase px-10 py-4 transition-all duration-300 hover:opacity-90"
            style={{ background: '#C8A96E', color: '#2C1A0E' }}
          >
            Buat Undangan Sekarang
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#2C1A0E', borderTop: '1px solid rgba(200,169,110,0.15)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-cormorant italic font-semibold text-xl" style={{ color: '#C8A96E' }}>Pelaminan</span>
            <p className="font-lato text-xs mt-1" style={{ color: '#E8DCC8', opacity: 0.4 }}>Dari Hati, Untuk Selamanya</p>
          </div>
          <div className="flex gap-6">
            {[['Masuk', '/login'], ['Daftar', '/register'], ['Desain', '/preview/gold']].map(([label, href]) => (
              <Link key={href} href={href} className="font-cinzel text-xs tracking-widest uppercase transition-opacity hover:opacity-100" style={{ color: '#E8DCC8', opacity: 0.45 }}>
                {label}
              </Link>
            ))}
          </div>
          <p className="font-lato text-xs" style={{ color: '#E8DCC8', opacity: 0.3 }}>© 2025 Pelaminan. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
