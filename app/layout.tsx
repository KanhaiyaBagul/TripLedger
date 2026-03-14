import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'TripLedger — Premium Group Expense Tracking',
  description:
    'Track shared travel expenses and automatically compute optimized settlements with minimal transactions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#1A1A1A',
              border: '1px solid #E8E6DE',
              borderRadius: '14px',
              boxShadow: '0 4px 12px rgba(90, 70, 30, 0.1)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: { primary: '#6B8F71', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#C4633A', secondary: '#FFFFFF' },
            },
          }}
        />
      </body>
    </html>
  )
}
