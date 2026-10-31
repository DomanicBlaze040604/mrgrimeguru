import type { Metadata, Viewport } from 'next'
import { DM_Sans, Syne, Bebas_Neue, Black_Ops_One } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/Toaster'

// Body copy — clean, readable, modern
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

// UI labels, nav, tags — geometric & punchy
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

// Hero headlines — ultra-bold condensed, like packaging
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
  weight: ['400'],
})

// Offer badge — military stencil, high-impact strike
const blackOpsOne = Black_Ops_One({
  subsets: ['latin'],
  variable: '--font-black-ops',
  display: 'swap',
  weight: ['400'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mrgrimeguru.com'),
  title: {
    default: 'Mr GrimeGuru — Secret Formula Foam Spray Cleaners',
    template: '%s | Mr GrimeGuru',
  },
  description:
    'Mr GrimeGuru secret formula hydrogen foam sprays. Shoe Cleaner, Kitchen Cleaner, Multipurpose Cleaner. Spray. 30 sec. Wipe.',
  keywords: [
    'foam spray cleaner india',
    'shoe cleaner spray',
    'kitchen cleaner spray',
    'multipurpose cleaner',
    'hydrogen foam cleaner',
    'Mr GrimeGuru',
    'secret formula cleaner',
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
    <html lang="en" className={`${dmSans.variable} ${syne.variable} ${bebasNeue.variable} ${blackOpsOne.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
