import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Mr GrimeGuru',
  description: 'Terms of service and purchasing conditions for Mr GrimeGuru customers.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#D6E8ED] p-8 sm:p-12 shadow-sm space-y-8 text-[#24333A]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Terms & Conditions</h1>
          <p className="text-sm text-[#75828A]">Effective Date: October 2026</p>
        </div>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">1. Agreement to Terms</h2>
          <p>
            By accessing or purchasing from mrgrimeguru.com, you agree to comply with and be bound by these Terms and Conditions. Please review them carefully before placing an order.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">2. Product Information & Pricing</h2>
          <p>
            All prices listed on the website are in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST). We reserve the right to revise product specifications, pack sizes, and prices without prior notice.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">3. Orders & Cancellation</h2>
          <p>
            You may cancel an order before it has been handed over to the courier partner by visiting your account orders page or contacting customer support. Once an order is in transit, it cannot be recalled.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">4. Safe Usage & Liability</h2>
          <p>
            Always follow instructions on the product packaging. Keep pods and concentrated liquids stored out of reach of children and pets. Mr GrimeGuru is not liable for damage arising from misuse or failure to follow dilution and fabric instructions.
          </p>
        </section>
      </div>
    </div>
  )
}
