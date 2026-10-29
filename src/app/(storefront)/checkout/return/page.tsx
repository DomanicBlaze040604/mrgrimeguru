import Link from 'next/link'
import { CONTACT } from '@/lib/contact'

export const metadata = { title: 'Checkout update — Mr GrimeGuru', robots: { index: false, follow: false } }

// Redirect query parameters are not payment proof. Keep the cart intact until a
// verified provider order/webhook integration can reconcile a completed order.
export default function CheckoutReturnPage() {
  return <section className="container-wide py-20 max-w-2xl space-y-6">
    <span className="guru-eyebrow">YOUR CHECKOUT UPDATE</span>
    <h1 className="text-3xl font-bold">Thanks for stopping by, Guru.</h1>
    <p>Check your Shiprocket order confirmation for your order and payment status. If checkout was interrupted, your cart is still saved.</p>
    <p>Need help confirming an order? Message us with the reference from your confirmation.</p>
    <div className="flex flex-wrap gap-4"><a className="guru-button" href={CONTACT.whatsappUrl}>WhatsApp support</a><Link className="guru-button guru-button-light" href="/cart">Return to cart</Link></div>
  </section>
}
