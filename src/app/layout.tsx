import type { Metadata, Viewport } from 'next'
import { DM_Sans, Bebas_Neue, Black_Ops_One } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/Toaster'

// Body copy — clean, readable, modern
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
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
  metadataBase: new URL('https://www.mrgrimeguru.com'),
  title: {
    default: 'Mr GrimeGuru — Secret Formula Foam Spray Cleaners',
    template: '%s | Mr GrimeGuru',
  },
  description:
    'Mr GrimeGuru secret formula hydrogen foam sprays. Shoe Cleaner, Kitchen Cleaner, Multipurpose Cleaner. For compatible kitchen surfaces, household surfaces and footwear.',
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
        url: '/social-image',
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
  themeColor: '#fffbf0',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${bebasNeue.variable} ${blackOpsOne.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
