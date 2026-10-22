import type { Metadata } from 'next'
import { Truck, CheckCircle, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy — Mr GrimeGuru',
  description: 'Delivery timelines, courier partners, and free shipping terms for all orders across India.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#D6E8ED] p-8 sm:p-12 shadow-sm space-y-8 text-[#24333A]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F5F8] text-[#347F99] mb-3">
            <Truck className="w-3.5 h-3.5" /> Fast Nationwide Logistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Shipping & Delivery Policy</h1>
          <p className="text-sm text-[#75828A]">Clear, predictable delivery for every modern home.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-[#D6E8ED] py-6">
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#D6E8ED]">
            <Clock className="w-6 h-6 text-[#347F99] mb-2" />
            <div className="font-bold text-sm text-[#24333A]">12-Hour Dispatch</div>
            <div className="text-xs text-[#75828A]">Orders packed and dispatched same or next business day.</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#D6E8ED]">
            <Truck className="w-6 h-6 text-[#347F99] mb-2" />
            <div className="font-bold text-sm text-[#24333A]">2 to 4 Days Metro</div>
            <div className="text-xs text-[#75828A]">Fast delivery to Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad.</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#D6E8ED]">
            <CheckCircle className="w-6 h-6 text-[#347F99] mb-2" />
            <div className="font-bold text-sm text-[#24333A]">Free Over ₹499</div>
            <div className="text-xs text-[#75828A]">Automatic free delivery applied at checkout.</div>
          </div>
        </div>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">Courier Partners & Tracking</h2>
          <p>
            We partner with premier logistics carriers including Blue Dart, Delhivery, Xpressbees, and DTDC. You will receive an automated tracking link on WhatsApp and SMS as soon as your package leaves our facility.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">Leak-Proof Packaging Guarantee</h2>
          <p>
            Liquids and laundry beads are sealed with induction cap barriers and shipped inside impact-absorbing honeycomb corrugated sleeves. In the rare event of transit leakage, we replace the item immediately at zero cost.
          </p>
        </section>
      </div>
    </div>
  )
}
