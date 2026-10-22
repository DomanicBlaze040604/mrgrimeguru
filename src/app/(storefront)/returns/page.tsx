import type { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, ShieldCheck, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Returns & Refund Policy — Mr GrimeGuru',
  description: 'Our 100% Clean Guarantee and easy return & replacement terms.',
}

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#D6E8ED] p-8 sm:p-12 shadow-sm space-y-8 text-[#24333A]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F5F8] text-[#347F99] mb-3">
            <RotateCcw className="w-3.5 h-3.5" /> 100% Clean Guarantee
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Returns & Refunds</h1>
          <p className="text-sm text-[#75828A]">We want you to love how clean your home feels.</p>
        </div>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">7-Day Satisfaction Guarantee</h2>
          <p>
            If you are not satisfied with the cleaning power of any Mr GrimeGuru product, or if your package arrives damaged, leaked, or incorrect, you are covered by our 7-Day Clean Guarantee.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">Damaged or Leaked Bottles</h2>
          <p>
            Simply email us a photo or video of the parcel and damaged bottle at{' '}
            <a href="mailto:support@mrgrimeguru.com" className="text-[#347F99] font-bold underline">
              support@mrgrimeguru.com
            </a>{' '}
            or message our WhatsApp care team. We will dispatch a fresh replacement bottle within 24 hours without requiring you to return the leaked product.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">Refund Process & Timelines</h2>
          <p>
            Refunds are credited back to the original payment source (UPI, Credit/Debit Card, Netbanking) within 5 to 7 business days of approval. For Cash on Delivery orders, refunds are issued via direct UPI transfer or bank NEFT upon receiving your account details.
          </p>
        </section>

        <div className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#D6E8ED] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-[#24333A]">Need to initiate a return or replacement?</div>
            <div className="text-xs text-[#75828A]">Our team responds in under 4 hours.</div>
          </div>
          <Button variant="primary" asChild>
            <Link href="/contact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Contact Support Team
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
