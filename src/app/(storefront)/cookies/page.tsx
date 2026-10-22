import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy — Mr GrimeGuru',
  description: 'How Mr GrimeGuru uses cookies to deliver a fast, personalized experience.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#D6E8ED] p-8 sm:p-12 shadow-sm space-y-8 text-[#24333A]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Cookie Policy</h1>
          <p className="text-sm text-[#75828A]">How we optimize your web browsing experience.</p>
        </div>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your browser when you visit websites. They allow our website to remember your items in the shopping cart as you browse different pages, preserve your authentication state, and keep your preferences intact.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#52636a] leading-relaxed">
          <h2 className="text-xl font-bold text-[#24333A]">Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[#24333A]">Essential Store Cookies:</strong> Required to keep products in your cart and process secure checkout transactions.
            </li>
            <li>
              <strong className="text-[#24333A]">Authentication Cookies:</strong> Secure encrypted tokens via Supabase Auth that verify your login state.
            </li>
            <li>
              <strong className="text-[#24333A]">Performance & Analytics:</strong> Aggregate statistics that help us identify slow pages or broken links.
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
