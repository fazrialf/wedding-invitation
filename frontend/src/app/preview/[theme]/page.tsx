'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { themes } from '@/themes/config'
import PelaminanOrnament from '@/components/studio/PelaminanOrnament'

interface Props {
  params: Promise<{ theme: string }>
}

// Mock data for the preview
const MOCK = {
  groom: 'Ahmad Rizky',
  bride: 'Dewi Sartika',
  groomFull: 'Ahmad Rizky Pratama, S.T.',
  brideFull: 'Dewi Sartika Putri, S.Pd.',
  groomParents: 'Bpk. Hendra Pratama & Ibu Sri Wahyuni',
  brideParents: 'Bpk. Sartono & Ibu Eni Rahayu',
  date: 'Sabtu, 14 Februari 2026',
  akadTime: '08.00 WIB',
  akadVenue: 'Masjid Istiqlal, Jakarta Pusat',
  resepsiTime: '11.00 – 14.00 WIB',
  resepsiVenue: 'Ballroom Shangri-La Hotel, Jakarta',
  loveStory: [
    { year: '2019', title: 'Pertama Bertemu', desc: 'Pertemuan tak terduga di sebuah seminar di Universitas Indonesia yang mengubah segalanya.' },
    { year: '2021', title: 'Jatuh Cinta', desc: 'Dua tahun persahabatan yang perlahan berbunga menjadi cinta yang tulus dan mendalam.' },
    { year: '2023', title: 'Lamaran', desc: 'Di tepi pantai Bali saat matahari terbenam, Ahmad melamar Dewi dengan cincin keluarga.' },
    { year: '2026', title: 'Pernikahan', desc: 'Hari yang paling dinantikan — bersatu dalam ikatan suci untuk selamanya.' },
  ],
}

export default function PreviewPage({ params }: Props) {
  const { theme: themeSlug } = use(params)
  const t = themes[themeSlug]
  if (!t) notFound()

  // Resolve bgDark hex from Tailwind class
  const darkBgMap: Record<string, string> = {
    'bg-stone-900': '#1c1917',
    'bg-stone-950': '#0c0a09',
    'bg-black': '#000000',
    'bg-slate-800': '#1e293b',
    'bg-rose-900': '#4c0519',
    'bg-stone-800': '#292524',
    'bg-[#2C1A0E]': '#2C1A0E',
    'bg-[#1B3A5C]': '#1B3A5C',
    'bg-[#3D3530]': '#3D3530',
    'bg-[#1E293B]': '#1E293B',
    'bg-[#2D3D2A]': '#2D3D2A',
    'bg-[#1C1C1C]': '#1C1C1C',
    'bg-[#3D2825]': '#3D2825',
  }
  const darkBg = darkBgMap[t.bgDark] ?? '#1c1917'

  // Resolve page bg
  const pageBgMap: Record<string, string> = {
    'bg-stone-50': '#fafaf9',
    'bg-slate-50': '#f8fafc',
    'bg-rose-50': '#fff1f2',
    'bg-white': '#ffffff',
    'bg-stone-950': '#0c0a09',
    'bg-[#FFFAF5]': '#FFFAF5',
    'bg-[#FDFAF4]': '#FDFAF4',
    'bg-[#F8FAFC]': '#F8FAFC',
    'bg-[#F7FAF6]': '#F7FAF6',
    'bg-[#FEF8F7]': '#FEF8F7',
    'bg-[#FFF5F8]': '#FFF5F8',
    'bg-[#FEFCF6]': '#FEFCF6',
    'bg-[#FAF5FD]': '#FAF5FD',
  }
  const pageBg = pageBgMap[t.bgPage] ?? '#fafaf9'

  const textDarkHex = t.textDark.includes('[') ? t.textDark.replace(/text-\[(.+)\]/, '$1') : undefined
  const textMutedHex = t.textMuted.includes('[') ? t.textMuted.replace(/text-\[(.+)\]/, '$1') : undefined

  const isDark = t.bgPage.includes('950') || t.bgPage.includes('black') || t.bgPage.includes('0c0a09')

  return (
    <div style={{ background: pageBg, minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* ── TOP BAR ── */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-14 border-b"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderColor: '#e5e7eb' }}
      >
        <Link href="/" className="flex items-center gap-2 font-cormorant italic font-semibold text-xl" style={{ color: '#6B3F2A' }}>
          ← Pelaminan
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs tracking-widest uppercase" style={{ color: '#6B3F2A', opacity: 0.6 }}>
            Preview —
          </span>
          <span className="font-cinzel text-xs tracking-widest uppercase font-semibold" style={{ color: '#6B3F2A' }}>
            {t.name}
          </span>
        </div>
        <Link
          href="/register"
          className="font-cinzel text-xs tracking-widest uppercase px-4 py-2"
          style={{ background: '#6B3F2A', color: '#E8DCC8', border: '1px solid #C8A96E' }}
        >
          Pakai Tema Ini
        </Link>
      </div>

      {/* ── HERO ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-24 px-6 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${darkBg} 0%, ${t.gradientFrom}22 100%)`, minHeight: '100vh' }}
      >
        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
            color: t.primaryHex,
          }}
        />

        <div className="relative z-10">
          <PelaminanOrnament width={72} height={72} className="mx-auto mb-6 opacity-60" />

          <p className={`${t.fontLabel} text-xs mb-4`} style={{ color: t.primaryHex, letterSpacing: t.trackingLabel ?? '0.3em' }}>
            UNDANGAN PERNIKAHAN
          </p>

          <h1 className={`${t.fontDisplay} mb-2`} style={{ color: '#ffffff', fontSize: 'clamp(2.5rem,8vw,5rem)', letterSpacing: t.trackingDisplay }}>
            {MOCK.groom}
          </h1>
          <p className={`${t.fontLabel} text-sm mb-2`} style={{ color: t.primaryHex }}>& </p>
          <h1 className={`${t.fontDisplay} mb-8`} style={{ color: '#ffffff', fontSize: 'clamp(2.5rem,8vw,5rem)', letterSpacing: t.trackingDisplay }}>
            {MOCK.bride}
          </h1>

          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-16 h-px" style={{ background: t.primaryHex, opacity: 0.5 }} />
            <span style={{ color: t.primaryHex }}>{t.ornamentChar}</span>
            <div className="w-16 h-px" style={{ background: t.primaryHex, opacity: 0.5 }} />
          </div>

          <p className={`${t.fontBody} text-base`} style={{ color: '#ffffff', opacity: 0.75 }}>{MOCK.date}</p>
        </div>
      </section>

      {/* ── COUNTDOWN MOCK ── */}
      <section className="py-12 px-6" style={{ background: darkBg }}>
        <div className="max-w-lg mx-auto flex justify-around">
          {[['42', 'Hari'], ['08', 'Jam'], ['30', 'Menit'], ['00', 'Detik']].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className={`${t.fontDisplay} text-4xl font-semibold`} style={{ color: t.primaryHex }}>{n}</p>
              <p className={`${t.fontLabel} text-[10px] mt-1`} style={{ color: '#ffffff', opacity: 0.5, letterSpacing: t.trackingLabel ?? '0.25em' }}>{l.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COUPLE ── */}
      <section className="py-20 px-6" style={{ background: pageBg }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className={`${t.fontLabel} text-xs mb-4`} style={{ color: t.primaryHex, letterSpacing: t.trackingLabel ?? '0.3em' }}>
            MEMPELAI
          </p>
          <h2 className={`${t.fontHeading} text-4xl mb-2`} style={{ color: textDarkHex ?? undefined }}>
            {MOCK.groomFull}
          </h2>
          <p className={`${t.fontBody} text-sm mb-1`} style={{ color: textMutedHex ?? undefined }}>Putra dari</p>
          <p className={`${t.fontBody} text-sm mb-8`} style={{ color: textMutedHex ?? undefined }}>{MOCK.groomParents}</p>

          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-12 h-px" style={{ background: t.primaryHex, opacity: 0.4 }} />
            <PelaminanOrnament width={36} height={36} className="opacity-50" />
            <div className="w-12 h-px" style={{ background: t.primaryHex, opacity: 0.4 }} />
          </div>

          <h2 className={`${t.fontHeading} text-4xl mb-2`} style={{ color: textDarkHex ?? undefined }}>
            {MOCK.brideFull}
          </h2>
          <p className={`${t.fontBody} text-sm mb-1`} style={{ color: textMutedHex ?? undefined }}>Putri dari</p>
          <p className={`${t.fontBody} text-sm`} style={{ color: textMutedHex ?? undefined }}>{MOCK.brideParents}</p>
        </div>
      </section>

      {/* ── AKAD & RESEPSI ── */}
      <section className="py-20 px-6" style={{ background: t.gradientFrom + '66' }}>
        <div className="max-w-4xl mx-auto">
          <p className={`${t.fontLabel} text-xs text-center mb-10`} style={{ color: t.primaryHex, letterSpacing: t.trackingLabel ?? '0.3em' }}>
            DETAIL ACARA
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Akad Nikah', time: MOCK.akadTime, venue: MOCK.akadVenue },
              { title: 'Resepsi', time: MOCK.resepsiTime, venue: MOCK.resepsiVenue },
            ].map((ev) => (
              <div
                key={ev.title}
                className="text-center p-8 border"
                style={{ borderColor: t.primaryHex + '33', background: 'rgba(255,255,255,0.6)' }}
              >
                <span style={{ color: t.primaryHex, fontSize: '1.5rem' }}>{t.ornamentChar}</span>
                <h3 className={`${t.fontHeading} text-2xl mt-3 mb-4`} style={{ color: textDarkHex ?? undefined }}>{ev.title}</h3>
                <p className={`${t.fontBody} text-sm mb-1`} style={{ color: textMutedHex ?? undefined }}>{ev.time}</p>
                <p className={`${t.fontBody} text-sm`} style={{ color: textMutedHex ?? undefined }}>{ev.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOVE STORY ── */}
      <section className="py-20 px-6" style={{ background: pageBg }}>
        <div className="max-w-2xl mx-auto">
          <p className={`${t.fontLabel} text-xs text-center mb-12`} style={{ color: t.primaryHex, letterSpacing: t.trackingLabel ?? '0.3em' }}>
            PERJALANAN CINTA
          </p>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: t.primaryHex, opacity: 0.2 }} />
            <div className="space-y-12">
              {MOCK.loveStory.map((item, i) => (
                <div key={item.year} className={`flex gap-8 items-start ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-1 text-right" style={i % 2 !== 0 ? { textAlign: 'left' } : {}}>
                    <p className={`${t.fontLabel} text-xs mb-1`} style={{ color: t.primaryHex, letterSpacing: '0.2em' }}>{item.year}</p>
                    <h4 className={`${t.fontHeading} text-lg mb-1`} style={{ color: textDarkHex ?? undefined }}>{item.title}</h4>
                    <p className={`${t.fontBody} text-sm leading-relaxed`} style={{ color: textMutedHex ?? undefined }}>{item.desc}</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10" style={{ background: pageBg, borderColor: t.primaryHex }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: t.primaryHex }} />
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RSVP ── */}
      <section className="py-20 px-6 text-center" style={{ background: darkBg }}>
        <PelaminanOrnament width={56} height={56} className="mx-auto mb-6 opacity-50" />
        <p className={`${t.fontLabel} text-xs mb-4`} style={{ color: t.primaryHex, letterSpacing: t.trackingLabel ?? '0.3em' }}>
          KONFIRMASI KEHADIRAN
        </p>
        <h2 className={`${t.fontHeading} text-3xl mb-3`} style={{ color: '#ffffff' }}>Mohon Konfirmasi</h2>
        <p className={`${t.fontBody} text-sm mb-8`} style={{ color: '#ffffff', opacity: 0.6 }}>
          Kehadiran Anda sangat berarti bagi kami. Mohon konfirmasi sebelum 1 Februari 2026.
        </p>
        <div
          className={`inline-block px-10 py-3 ${t.fontLabel} text-xs`}
          style={{ background: t.primaryHex, color: darkBg, letterSpacing: t.trackingLabel ?? '0.25em' }}
        >
          HADIR
        </div>
      </section>

      {/* ── FOOTER / CTA ── */}
      <section className="py-16 px-6 text-center" style={{ background: pageBg }}>
        <div className="max-w-lg mx-auto">
          <p className={`${t.fontLabel} text-xs mb-3`} style={{ color: t.primaryHex, letterSpacing: '0.3em' }}>BUAT UNDANGANMU</p>
          <h2 className={`${t.fontHeading} text-3xl mb-4`} style={{ color: textDarkHex ?? '#1c1917' }}>
            Suka dengan tema ini?
          </h2>
          <p className={`${t.fontBody} text-sm mb-8`} style={{ color: textMutedHex ?? '#6b7280' }}>
            Daftar gratis dan buat undangan digitalmu dalam hitungan menit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className={`${t.fontLabel} text-xs px-8 py-4 text-center`}
              style={{ background: t.primaryHex, color: '#ffffff', letterSpacing: t.trackingLabel ?? '0.25em' }}
            >
              MULAI GRATIS
            </Link>
            <Link
              href="/"
              className={`${t.fontLabel} text-xs px-8 py-4 text-center`}
              style={{ border: `1px solid ${t.primaryHex}`, color: t.primaryHex, letterSpacing: t.trackingLabel ?? '0.25em' }}
            >
              LIHAT TEMA LAIN
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
