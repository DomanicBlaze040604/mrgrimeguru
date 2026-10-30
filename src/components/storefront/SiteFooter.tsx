import Link from 'next/link'
import { CONTACT } from '@/lib/contact'
import { ArrowUpRight, Sparkles } from 'lucide-react'

const columns = [
  {
    title: 'FIND YOUR GURU',
    links: [
      ['Kitchen Cleaner', '/shop/kitchen-cleaner'],
      ['Multipurpose Cleaner', '/shop/multipurpose-cleaner'],
      ['Shoe Cleaner', '/shop/shoe-cleaner'],
      ['Shop everything', '/shop'],
    ],
  },
  {
    title: 'THE GURU WORLD',
    links: [
      ['Our story', '/about'],
      ['Why our foam', '/#why-foam'],
      ['Watch it work', '/#see-it-work'],
      ['Cleaning guides', '/guides'],
      ['Instagram', CONTACT.instagramUrl],
    ],
  },
  {
    title: 'HERE TO HELP',
    links: [
      ['Email support', `mailto:${CONTACT.email}`],
      ['WhatsApp support', CONTACT.whatsappUrl],
      [CONTACT.phone, CONTACT.telephoneUrl],
      ['Help centre', '/faq'],
      ['Your orders', '/account/orders'],
      ['Shipping', '/shipping'],
      ['Returns & refunds', '/returns'],
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="guru-footer">
      <div className="guru-container">
        <div className="guru-footer-top">
          <div>
            <span className="guru-eyebrow">LESS GRIME. MORE GOOD TIMES.</span>
            <h2>Mess happens.<br /><span>Guru handles.</span></h2>
          </div>
          <Link href="/shop" className="guru-button">
            Find your clean <ArrowUpRight size={21} />
          </Link>
        </div>

        <div className="guru-footer-grid">
          <div className="guru-footer-brand">
            <Link href="/" className="guru-brand-box" aria-label="Mr GrimeGuru home">
              <span className="guru-logo-orange">MR</span>
              <span className="guru-logo-white">GRIME</span>
              <span className="guru-logo-orange">GURU ✦</span>
            </Link>
            <p>
              Big on foam. Tough on grime.<br />
              Your everyday clean-up, with a little more attitude.
            </p>
            <a className="guru-footer-email" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
            <a
              className="guru-footer-instagram"
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Mr GrimeGuru on Instagram"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>Instagram {CONTACT.instagramHandle}</span>
            </a>
            <address className="guru-footer-address">{CONTACT.address}</address>
            <span className="guru-footer-signoff">
              <Sparkles size={17} /> Secret formula. Guru spirit.
            </span>
          </div>

          {columns.map(column => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map(([label, href]) => {
                  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
                  return (
                    <li key={label}>
                      {isExternal ? (
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {label}
                        </a>
                      ) : (
                        <Link href={href}>{label}</Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="guru-footer-bottom">
          <p>© {new Date().getFullYear()} Mr GrimeGuru</p>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
          <span>Made for everyday messes. ✦</span>
        </div>

        <div className="guru-footer-word" aria-hidden="true">
          MR GRIMEGURU
        </div>
      </div>
    </footer>
  )
}
