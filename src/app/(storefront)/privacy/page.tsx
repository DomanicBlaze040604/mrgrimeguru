import type { Metadata } from 'next'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — Mr GrimeGuru',
  description: 'How Mr GrimeGuru collects, uses, stores, and shares your personal information.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-[#171714]">{title}</h2>
      <div className="text-sm sm:text-base text-[#655e51] leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fffbf0] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#e5dcc9] p-8 sm:p-12 shadow-sm space-y-10 text-[#171714]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff2be] text-[#b9460c] mb-3">
            <Shield className="w-3.5 h-3.5" /> Privacy Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-xs text-[#75828A]">Last updated: [DATE]</p>
          <p className="text-sm text-[#655e51] mt-3">
            Mr GrimeGuru respects your privacy. This Privacy Policy explains how we collect, use, store, and share personal information when you visit our website, browse products, place orders, or contact our team.
          </p>
        </div>

        <Section title="1. Business Information">
          <p>Legal business name: [REGISTERED LEGAL BUSINESS NAME]</p>
          <p>Website: https://mrgrimeguru.vercel.app/</p>
          <p>Business address: [REGISTERED BUSINESS ADDRESS]</p>
          <p>Customer support email: [SUPPORT EMAIL]</p>
          <p>Privacy contact: [PRIVACY CONTACT EMAIL]</p>
        </Section>

        <Section title="2. Information We Collect">
          <p>Depending on how you use our website, we may collect:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Personal information:</strong> Name, email address, phone number, billing address, and shipping address.</li>
            <li><strong>Order information:</strong> Products purchased, order numbers, transaction references, delivery information, and customer service communications.</li>
            <li><strong>Payment information:</strong> Payment status and transaction references. We do not intentionally collect or store full card credentials, security codes, UPI PINs, or banking passwords.</li>
            <li><strong>Technical information:</strong> IP address, browser type, operating system, and device information.</li>
            <li><strong>Usage information:</strong> Pages visited, products viewed, and cart activity.</li>
            <li><strong>Communications:</strong> Information you provide when contacting us.</li>
          </ul>
        </Section>

        <Section title="3. How We Collect Information">
          <p>Information may be collected directly from you, automatically through website technologies, or from payment providers, shipping partners, and other lawful sources where necessary to fulfil orders and operate our business.</p>
        </Section>

        <Section title="4. How We Use Information">
          <p>We may use information to process and fulfil orders; arrange payments, shipping, returns, and refunds; send transactional notifications; respond to customer enquiries; improve website performance; detect fraud; maintain legally required records; send marketing communications where permitted; and comply with applicable laws.</p>
        </Section>

        <Section title="5. Cookies and Tracking Technologies">
          <p>Our website may use essential cookies and, where enabled, analytics or advertising technologies. You can manage cookies through your browser settings and any consent controls offered on the website.</p>
        </Section>

        <Section title="6. Sharing Information">
          <p>Information may be shared with relevant service providers including website hosting, payment processors, shipping partners, analytics services, professional advisers, and government authorities where legally required. We limit sharing to what is reasonably necessary for the relevant purpose.</p>
          <p>We do not sell personal information as a standalone commercial product.</p>
        </Section>

        <Section title="7. Third-Party Services">
          <p>Third-party websites and services operate under their own privacy policies. We are not responsible for the privacy practices of services we do not control.</p>
        </Section>

        <Section title="8. Data Retention">
          <p>We retain information for as long as reasonably necessary for order fulfilment, customer support, business administration, dispute resolution, and legal compliance.</p>
        </Section>

        <Section title="9. Security">
          <p>We use reasonable technical and organisational safeguards to help protect personal information. However, no online system can be guaranteed to be completely secure.</p>
        </Section>

        <Section title="10. Your Rights">
          <p>Subject to applicable law, you may have rights to request access to your personal information, correction, erasure where legally permissible, withdrawal of consent, and grievance redressal.</p>
          <p>Contact [PRIVACY CONTACT EMAIL] to submit a request.</p>
        </Section>

        <Section title="11. Marketing Communications">
          <p>Where permitted by law, we may send promotional communications if you have opted in or another lawful basis applies. You may unsubscribe through the available link or contact [SUPPORT EMAIL].</p>
        </Section>

        <Section title="12. Children's Privacy">
          <p>Our purchasing services are intended for adults who can lawfully enter into purchase transactions. We do not knowingly collect children's personal information in circumstances where such collection is prohibited.</p>
        </Section>

        <Section title="13. Policy Changes">
          <p>We may update this Policy to reflect changes in our practices, technology, or legal obligations. The latest version will be published on this page with an updated date.</p>
        </Section>

        <Section title="14. Contact and Grievances">
          <p>Legal business name: [REGISTERED LEGAL BUSINESS NAME]</p>
          <p>Email: [PRIVACY OR GRIEVANCE EMAIL]</p>
          <p>Address: [REGISTERED BUSINESS ADDRESS]</p>
          <p>Governing law: applicable laws of India.</p>
        </Section>
      </div>
    </div>
  )
}
