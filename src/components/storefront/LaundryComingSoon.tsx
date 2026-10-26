import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function LaundryComingSoon() {
  return <section className="guru-coming-soon" id="coming-soon"><div className="guru-coming-art" aria-hidden="true"><Sparkles size={54} /><span>THE NEXT<br />CLEAN THING.</span></div><div><span className="guru-eyebrow">COMING SOON</span><h2>Laundry Pods</h2><p>A fresh spin on laundry day is on its way. Our pods are getting ready for their Guru debut.</p><span className="guru-coming-label">Not available to order yet</span><Link href="mailto:support@mrgrimeguru.com">Ask us about the launch ↗</Link></div></section>
}
