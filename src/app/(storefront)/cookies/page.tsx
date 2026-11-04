import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('Cookie Policy', 'Learn about essential cookies, Google Analytics and Meta Pixel on the Mr GrimeGuru website.', '/cookies')

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#fffbf0] py-16">
      <div className="container-wide max-w-4xl bg-white rounded-3xl border border-[#e5dcc9] p-8 sm:p-12 shadow-sm space-y-8 text-[#171714]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Cookie Policy</h1>
          <p className="text-sm text-[#75828A]">How we optimize your web browsing experience.</p>
        </div>

        <section className="space-y-4 text-sm sm:text-base text-[#655e51] leading-relaxed">
          <h2 className="text-xl font-bold text-[#171714]">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your browser when you visit websites. They allow our website to remember your items in the shopping cart as you browse different pages, preserve your authentication state, and keep your preferences intact.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base text-[#655e51] leading-relaxed">
          <h2 className="text-xl font-bold text-[#171714]">Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[#171714]">Essential Store Cookies:</strong> Required to keep products in your cart and process secure checkout transactions.
            </li>
            <li>
              <strong className="text-[#171714]">Authentication Cookies:</strong> Secure encrypted tokens via Supabase Auth that verify your login state.
            </li>
            <li>
              <strong className="text-[#171714]">Performance & Analytics:</strong> Google Analytics (GA4) measures website visits, page views and browsing activity to help us understand site use.
            </li>
          <li><strong>Advertising measurement:</strong> Meta Pixel records page visits to help measure advertising performance. Google and Meta may use cookies and device information under their own privacy policies.</li></ul>
          <p>You can block or delete cookies using your browser settings. Browser privacy tools may prevent analytics or advertising tags from loading. Essential cart and sign-in features can be affected if all storage is blocked.</p>
        </section>
      </div>
    </div>
  )
}
