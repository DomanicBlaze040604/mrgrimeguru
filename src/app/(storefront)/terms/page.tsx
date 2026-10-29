import { CONTACT } from '@/lib/contact'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Mr GrimeGuru',
  description: 'Terms governing access to and use of the Mr GrimeGuru website and related services.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-[#171714]">{title}</h2>
      <div className="text-sm sm:text-base text-[#655e51] leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fffbf0] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#e5dcc9] p-8 sm:p-12 shadow-sm space-y-10 text-[#171714]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-xs text-[#75828A]">Last updated: [DATE]</p>
          <p className="text-sm text-[#655e51] mt-3">
            These Terms govern access to and use of the Mr GrimeGuru website and related services. By accessing the website or placing an order, you agree to these Terms and the applicable policies published on our website, subject to applicable law.
          </p>
        </div>

        <Section title="1. Business Information">
          <p>Legal business name: [REGISTERED LEGAL BUSINESS NAME]</p>
          <p>Website: https://www.mrgrimeguru.com/</p>
          <p>Business address: {CONTACT.address}</p>
          <p>Contact email: support@mrgrimeguru.com</p>
        </Section>

        <Section title="2. Eligibility">
          <p>Customers must have the legal capacity required under applicable law to place an order and enter into a binding agreement.</p>
        </Section>

        <Section title="3. Website Information">
          <p>We aim to keep product descriptions, photographs, prices, availability, and other information accurate and current. Product appearance may vary slightly because of photography or packaging updates. Product packaging and labels provide the applicable usage and safety instructions.</p>
        </Section>

        <Section title="4. Products and Availability">
          <p>Our current product range comprises Shoe Cleaner, Multipurpose Cleaner, Kitchen Cleaner, and Laundry Pods.</p>
          <p>Products are offered subject to availability. If an ordered item becomes unavailable, we will notify the customer and provide an appropriate resolution, including a refund where required.</p>
        </Section>

        <Section title="5. Pricing and Payments">
          <p>Prices are displayed in Indian Rupees unless otherwise specified. Applicable taxes, shipping charges, discounts, and other amounts will be displayed at checkout. Payment processing may be handled by third-party providers and is subject to their applicable terms.</p>
        </Section>

        <Section title="6. Orders and Acceptance">
          <p>Placing an order constitutes a purchase request. Order confirmations acknowledge receipt but do not necessarily indicate dispatch. If an order cannot be fulfilled, we will communicate the situation and arrange an appropriate resolution.</p>
        </Section>

        <Section title="7. Customer Responsibilities">
          <p>Customers agree to provide accurate information, use the website lawfully, avoid fraudulent orders, and refrain from interfering with website security or functionality.</p>
        </Section>

        <Section title="8. Product Safety">
          <p>Cleaning products must be used only for their intended purposes and according to the applicable packaging instructions. We are not responsible for damage arising from misuse, incompatible surfaces, failure to follow instructions, or unauthorised mixing of products, except to the extent liability cannot lawfully be excluded.</p>
          <p>Nothing in these Terms excludes statutory consumer rights or other liability that cannot lawfully be restricted.</p>
        </Section>

        <Section title="9. Shipping, Returns, and Refunds">
          <p>Orders are subject to our Shipping Policy and Return, Refund and Cancellation Policy. Where applicable law provides additional rights, those rights prevail over any inconsistent policy provision.</p>
        </Section>

        <Section title="10. Intellectual Property">
          <p>The Mr GrimeGuru name, branding, original website text, graphics, photographs, and other materials may be protected by intellectual property laws. Website content may be used for lawful personal shopping purposes only.</p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>To the extent permitted by applicable law, we are not liable for indirect or consequential losses where such exclusion is legally permissible. Nothing in these Terms limits liability for fraud, wilful misconduct, statutory consumer rights, or other liability that cannot lawfully be excluded.</p>
        </Section>

        <Section title="12. Privacy">
          <p>Personal information is handled in accordance with our Privacy Policy and applicable data protection law.</p>
        </Section>

        <Section title="13. Changes to These Terms">
          <p>Updated Terms will be published on this page with a revised date. Changes will apply as permitted by law and will not retrospectively remove rights that have already accrued.</p>
        </Section>

        <Section title="14. Governing Law and Disputes">
          <p>These Terms are governed by the applicable laws of India. Disputes will be handled by competent courts or other appropriate forums under applicable law.</p>
        </Section>

        <Section title="15. Contact Information">
          <p>Legal business name: [REGISTERED LEGAL BUSINESS NAME]</p>
          <p>Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
          <p>Phone: <a href={CONTACT.telephoneUrl}>{CONTACT.phone}</a> · <a href={CONTACT.whatsappUrl}>WhatsApp support</a></p>
          <p>Business address: {CONTACT.address}</p>
        </Section>
      </div>
    </div>
  )
}
