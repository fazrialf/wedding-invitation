import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pelaminan — Undangan Digital',
  description: 'Dari Hati, Untuk Selamanya. Platform undangan digital modern dengan sentuhan tradisi Nusantara.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
