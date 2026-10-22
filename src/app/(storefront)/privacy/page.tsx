import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — Mr GrimeGuru',
  description: 'How Mr GrimeGuru collects, protects, and respects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#D6E8ED] p-8 sm:p-12 shadow-sm space-y-8 text-[#24333A]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F5F8] text-[#347F99] mb-3">
            <Shield className="w-3.5 h-3.5" /> Data Security & Trust
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#75828A]">Last Updated: October 2026</p>
        </div>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">1. Information We Collect</h2>
          <p>
            When you visit or make a purchase from Mr GrimeGuru (mrgrimeguru.com), we collect certain details required to fulfill your order, including your full name, shipping and billing address, email address, and phone number.
          </p>
          <p>
            We do not store your credit card or debit card numbers on our servers. All online transactions are handled through PCI-DSS Level 1 compliant gateways (Razorpay).
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">2. How We Use Your Information</h2>
          <p>
            We use your data solely to process orders, communicate shipment tracking updates via SMS and WhatsApp, prevent fraud, and — if opted in — notify you of new product releases and exclusive discounts.
          </p>
          <p>
            We never sell, rent, or trade your personal data to third-party data brokers under any circumstances.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">3. Cookies & Analytics</h2>
          <p>
            We use essential cookies to maintain your shopping cart state and session security. Non-essential analytical cookies help us understand which cleaning guides and product pages are most useful to visitors.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">4. Your Rights & Data Deletion</h2>
          <p>
            You have the right to request a copy of your personal data or ask for complete deletion of your customer account at any time by contacting{' '}
            <a href="mailto:privacy@mrgrimeguru.com" className="text-[#347F99] font-bold underline">
              privacy@mrgrimeguru.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
