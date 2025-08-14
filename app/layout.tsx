import type { Metadata } from 'next'
import './globals.css'
import AppProviders from './providers'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'Fixora — Device Repair in Kolkata',
  description: 'Pickup & return device repair service in Kolkata',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <AppProviders>
          <Header />
          {children}
        </AppProviders>
      </body>
    </html>
  )
}