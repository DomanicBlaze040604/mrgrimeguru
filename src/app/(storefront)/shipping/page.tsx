import { CONTACT } from '@/lib/contact'
import type { Metadata } from 'next'
import { Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Policy — Mr GrimeGuru',
  description: 'Delivery information, shipping charges, tracking, and order fulfilment details for Mr GrimeGuru.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-[#171714]">{title}</h2>
      <div className="text-sm sm:text-base text-[#655e51] leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fffbf0] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#e5dcc9] p-8 sm:p-12 shadow-sm space-y-10 text-[#171714]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff2be] text-[#b9460c] mb-3">
            <Truck className="w-3.5 h-3.5" /> Shipping Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Shipping Policy</h1>
          <p className="text-xs text-[#75828A]">Last updated: [DATE]</p>
          <p className="text-sm text-[#655e51] mt-3">
            Mr GrimeGuru aims to provide a straightforward and transparent delivery experience.
          </p>
        </div>

        <Section title="1. Order Processing">
          <p>Orders are processed after successful placement and any required payment or verification. Processing times may vary according to availability, order volume, and operational circumstances.</p>
        </Section>

        <Section title="2. Delivery Locations">
          <p>We deliver to locations supported by our shipping partners. Delivery availability is determined by the PIN code entered at checkout.</p>
        </Section>

        <Section title="3. Shipping Charges">
          <p>Applicable shipping charges will be displayed at checkout before the order is completed.</p>
          <p>Free shipping applies only to orders meeting the conditions and minimum order value displayed on our website at the time of purchase.</p>
        </Section>

        <Section title="4. Delivery Estimates">
          <p>Estimated delivery timelines may be displayed during checkout or in shipping confirmations. Actual delivery times may vary because of destination, courier capacity, holidays, weather, and other circumstances.</p>
        </Section>

        <Section title="5. Tracking">
          <p>Where available, tracking information will be shared after dispatch. Tracking may take time to become active after the shipment is handed to the courier.</p>
        </Section>

        <Section title="6. Incorrect Addresses">
          <p>Customers are responsible for providing accurate delivery details. Contact us promptly if you notice an error. Address changes may not be possible after dispatch.</p>
        </Section>

        <Section title="7. Delayed or Undelivered Orders">
          <p>If tracking indicates a delay, contact support@mrgrimeguru.com with your order number. We will review available tracking information and coordinate with the delivery partner where appropriate.</p>
        </Section>

        <Section title="8. Damaged or Incorrect Products">
          <p>Notify us promptly if an order arrives damaged, incomplete, or incorrect. Provide your order number and photographs of the packaging and product where available. We will review the request and explain the appropriate resolution.</p>
        </Section>

        <Section title="9. Failed Delivery Attempts">
          <p>Courier redelivery or return procedures may apply when a recipient is unavailable or delivery details are incorrect. Any reshipping, cancellation, or refund will be handled under the applicable policy and law.</p>
        </Section>

        <Section title="10. Cash on Delivery">
          <p>Cash on Delivery is available only where displayed at checkout and may depend on the delivery location, order value, and courier service.</p>
        </Section>

        <Section title="11. Contact">
          <p>Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
          <p>Phone: <a href={CONTACT.telephoneUrl}>{CONTACT.phone}</a> · <a href={CONTACT.whatsappUrl}>WhatsApp support</a></p>
          <p>Business address: {CONTACT.address}</p>
        </Section>
      </div>
    </div>
  )
}
