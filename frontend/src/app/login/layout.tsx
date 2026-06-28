import type { Metadata } from 'next'
import '../globals.css'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata: Metadata = { title: 'Login — Wedding Invitation' }

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
