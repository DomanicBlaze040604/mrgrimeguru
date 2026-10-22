'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4l11.733 16h4.267l-11.733-16z" />
      <path d="M4 20l6.768-6.768m3.555-3.555L20 4" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  )
}

const productLinks = [
  { label: 'Laundry Pods', href: '/shop/laundry-pods' },
  { label: 'Laundry Beads', href: '/shop/laundry-beads' },
  { label: 'Floor Cleaner', href: '/shop/floor-cleaner' },
  { label: 'Kitchen Degreaser', href: '/shop/kitchen-degreaser' },
  { label: 'Shoe Cleaner', href: '/shop/shoe-cleaner' },
  { label: 'Shop All', href: '/shop' },
]

const helpLinks = [
  { label: 'Cleaning Guides', href: '/guides' },
  { label: 'FAQs', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Track Your Order', href: '/account/orders' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Shipping Policy', href: '/shipping' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/mrgrimeguru', icon: InstagramIcon },
  { label: 'YouTube', href: 'https://youtube.com/@mrgrimeguru', icon: YoutubeIcon },
  { label: 'Twitter / X', href: 'https://twitter.com/mrgrimeguru', icon: TwitterIcon },
  { label: 'Facebook', href: 'https://facebook.com/mrgrimeguru', icon: FacebookIcon },
]

export function SiteFooter() {
  return (
    <footer
      className="mt-auto"
      style={{ backgroundColor: '#FAF8F2' }}
      role="contentinfo"
    >
      {/* Main footer content */}
      <div className="border-t border-[#D6E8ED]">
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Mr GrimeGuru home">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#9FD8E8' }}
                >
                  <span className="text-[#24333A] font-bold text-base">G</span>
                </div>
                <span
                  className="font-bold text-xl"
                  style={{ color: '#24333A', fontFamily: 'var(--font-playfair)' }}
                >
                  Mr <span style={{ color: '#347F99' }}>GrimeGuru</span>
                </span>
              </Link>
              <p className="text-sm text-[#75828A] leading-relaxed mb-6 max-w-xs">
                Premium household cleaning solutions for modern Indian homes. Smart, effective, and designed for everyday life.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3" role="list" aria-label="Social media links">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${label}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: '#E6F5F8', color: '#347F99' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#9FD8E8'
                      e.currentTarget.style.color = '#24333A'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#E6F5F8'
                      e.currentTarget.style.color = '#347F99'
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold text-sm text-[#24333A] uppercase tracking-wider mb-4">
                Products
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {productLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[#75828A] hover:text-[#347F99] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="font-semibold text-sm text-[#24333A] uppercase tracking-wider mb-4">
                Help & Info
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {helpLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[#75828A] hover:text-[#347F99] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-sm text-[#24333A] uppercase tracking-wider mb-4">
                Stay in the Loop
              </h3>
              <p className="text-sm text-[#75828A] mb-4 leading-relaxed">
                Cleaning tips, new product launches, and exclusive offers — straight to your inbox.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-2"
                aria-label="Newsletter subscription"
              >
                <div className="flex gap-2">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="flex-1 rounded-full px-4 py-2.5 text-sm border border-[#D6E8ED] bg-white text-[#24333A] placeholder:text-[#75828A] focus:outline-none focus:ring-2 focus:ring-[#9FD8E8] transition-shadow"
                  />
                  <button
                    type="submit"
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: '#24333A', color: 'white' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#347F99'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#24333A'
                    }}
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-[#75828A]">
                  No spam, ever. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#D6E8ED]">
        <div className="container-wide py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#75828A]">
              © 2026 Mr GrimeGuru. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {legalLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs text-[#75828A] hover:text-[#347F99] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
            {/* Payment methods */}
            <div className="flex items-center gap-2" aria-label="Accepted payment methods">
              {['UPI', 'Cards', 'NetBanking'].map((method) => (
                <span
                  key={method}
                  className="text-xs px-2 py-1 rounded-md font-medium"
                  style={{ backgroundColor: '#E6F5F8', color: '#347F99' }}
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
