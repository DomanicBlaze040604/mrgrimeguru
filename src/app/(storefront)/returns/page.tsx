import type { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Return, Refund & Cancellation Policy — Mr GrimeGuru',
  description: 'How return, refund, and cancellation requests are handled for orders placed through Mr GrimeGuru.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-[#24333A]">{title}</h2>
      <div className="text-sm sm:text-base text-[#52636a] leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#D6E8ED] p-8 sm:p-12 shadow-sm space-y-10 text-[#24333A]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F5F8] text-[#347F99] mb-3">
            <RotateCcw className="w-3.5 h-3.5" /> Returns & Refunds
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Return, Refund and Cancellation Policy</h1>
          <p className="text-xs text-[#75828A]">Last updated: [DATE]</p>
          <p className="text-sm text-[#52636a] mt-3">
            This Policy explains how return, refund, and cancellation requests are handled for orders placed through Mr GrimeGuru.
          </p>
        </div>

        <Section title="1. Return Eligibility">
          <p>Return requests may be considered within [NUMBER OF DAYS] days of delivery, subject to the conditions below and applicable law.</p>
          <p>Customers should provide proof of purchase or a valid order number and contact support before returning an item.</p>
          <p>Opened or used cleaning products may be subject to restrictions for hygiene, safety, and quality reasons, except where a return, replacement, refund, or other remedy is required by applicable law.</p>
        </Section>

        <Section title="2. Damaged, Defective, or Incorrect Products">
          <p>If an item arrives damaged, defective, leaking, incomplete, or different from the product ordered, contact [SUPPORT EMAIL] promptly.</p>
          <p>Provide your order number, a description of the issue, and photographs where available.</p>
          <p>We will review the request and determine the appropriate remedy, which may include replacement, refund, or another remedy required by applicable law.</p>
        </Section>

        <Section title="3. Change-of-Mind Returns">
          <p>Change-of-mind returns are subject to the applicable return window, product condition, and conditions displayed on the website. Any applicable return-shipping charges and packaging requirements will be communicated before the return is arranged.</p>
        </Section>

        <Section title="4. How to Request a Return">
          <ol className="list-decimal list-inside space-y-1">
            <li>Email [SUPPORT EMAIL] with your order number.</li>
            <li>Explain the reason for your request.</li>
            <li>Provide photographs if the issue involves damage or an incorrect item.</li>
            <li>Wait for return instructions from our support team.</li>
            <li>Retain return-shipping receipts and tracking information where applicable.</li>
          </ol>
          <p>Do not send products to an address that has not been confirmed by our support team.</p>
        </Section>

        <Section title="5. Refund Processing">
          <p>Approved refunds will generally be issued to the original payment method where supported. Other methods may be used where appropriate and legally permitted.</p>
          <p>The time required for funds to appear in your account depends on the payment provider and financial institution.</p>
        </Section>

        <Section title="6. Shipping Charges">
          <p>Original shipping charges and return-shipping charges will be handled according to the circumstances, the terms disclosed at checkout, and applicable law. Where a remedy is required for a defective or incorrect product, we will comply with applicable legal requirements.</p>
        </Section>

        <Section title="7. Order Cancellations">
          <p>Contact [SUPPORT EMAIL] as soon as possible if you wish to cancel an order. Cancellation may be possible before dispatch, subject to operational feasibility. Once dispatched, the order may need to be handled under the return procedure.</p>
        </Section>

        <Section title="8. Exchanges and Replacements">
          <p>Exchanges and replacements may be offered depending on product availability and the circumstances of the request. If a replacement is unavailable, we will communicate the available options and any refund required by applicable law.</p>
        </Section>

        <Section title="9. Undelivered Orders">
          <p>If tracking indicates that an order is lost, returned to sender, or undelivered, contact our support team. We will review the shipment and explain the next steps.</p>
        </Section>

        <Section title="10. Contact">
          <p>Email: [SUPPORT EMAIL]</p>
          <p>Business address: [REGISTERED BUSINESS ADDRESS]</p>
        </Section>

        <div className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#D6E8ED] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-[#24333A]">Need to raise a return or refund request?</div>
            <div className="text-xs text-[#75828A]">Contact our support team with your order number.</div>
          </div>
          <Button variant="primary" asChild>
            <Link href="/contact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
