import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import PostHogProvider from '@/components/PostHogProvider'

export const metadata: Metadata = {
  title: 'Pelaminan — Undangan Digital',
  description: 'Dari Hati, Untuk Selamanya. Platform undangan digital modern dengan sentuhan tradisi Nusantara.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {/* Suspense required because PostHogProvider calls useSearchParams() */}
        <Suspense fallback={null}>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}
