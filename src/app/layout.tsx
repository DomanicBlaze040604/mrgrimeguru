import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mrgrimeguru.com'),
  title: {
    default: 'Mr GrimeGuru — Premium Household Cleaning Products',
    template: '%s | Mr GrimeGuru',
  },
  description:
    'Mr GrimeGuru brings premium cleaning solutions to modern Indian homes. Laundry pods, scented beads, floor cleaner, kitchen degreaser, and shoe cleaner.',
  keywords: [
    'household cleaning',
    'laundry pods india',
    'laundry beads',
    'floor cleaner',
    'kitchen degreaser',
    'shoe cleaner',
    'premium cleaning products india',
    'Mr GrimeGuru',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Mr GrimeGuru',
    title: 'Mr GrimeGuru — Premium Household Cleaning Products',
    description:
      'Smart, effective cleaning for modern Indian homes. Grime Happens. We Handle It.',
    images: [
      {
        url: '/images/brand/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mr GrimeGuru — Premium Household Cleaning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr GrimeGuru — Premium Household Cleaning',
    description: 'Grime Happens. We Handle It.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#9FD8E8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
