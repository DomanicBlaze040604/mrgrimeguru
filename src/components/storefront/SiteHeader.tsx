'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart'
import { cn } from '@/lib/utils'
import { ThemeBanner } from './ThemeBanner'

const navLinks = [
  {
    label: 'Kitchen',
    href: '/shop/kitchen-cleaner',
    children: null,
  },
  {
    label: 'Multipurpose',
    href: '/shop/multipurpose-cleaner',
    children: null,
  },
  {
    label: 'Shoe Cleaner',
    href: '/shop/shoe-cleaner',
    children: null,
  },
  {
    label: 'Our Story',
    href: '/about',
    children: null,
  },
  {
    label: 'Help',
    href: '/faq',
    children: null,
  },
]

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { items, openCart } = useCartStore()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      {/* ── Dynamic Festive Theme Banner (Diwali, Holi, Christmas, etc.) ── */}
      <ThemeBanner />

      {/* ── Announcement bar — black like the packaging ── */}
      <div className="bg-[#111111] text-white overflow-hidden py-2.5 select-none relative z-50">
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-10 mx-8 text-xs font-semibold">
              <span className="inline-flex items-center gap-2 font-black tracking-wider" style={{ color: '#FACC15' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#F97316' }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#F97316' }}></span>
                </span>
                🔥 SALE IS LIVE · UP TO 50% OFF
              </span>
              <span className="text-white/80">USE CODE: <strong className="text-[#FACC15]">CLEAN50</strong> FOR EXTRA 10% OFF</span>
              <span className="text-white/80">🚚 FREE SHIPPING ON ORDERS ₹499+</span>
              <span className="text-white/80">✦ HYDROGEN FOAM · SECRET FORMULA</span>
              <span className="text-white/80">⭐ 4.9/5 RATED BY 50,000+ HOMES</span>
              <span className="text-white/80">✦ LESS GRIME. MORE GOOD TIMES.</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main header ── */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 border-b-2 border-[#111111]',
          isScrolled ? 'shadow-[0_4px_0px_#111111]' : '',
          'bg-[#FFFBF0]'
        )}
      >
        <div className="container-wide">
          <div className="flex h-[82px] items-center justify-between gap-3">

            {/* Logo — Bebas Neue display font */}
            <Link
              href="/"
              className="guru-header-logo flex flex-col shrink-0 group"
              aria-label="Mr GrimeGuru home"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
            >
              <span
                className="font-black leading-none text-[#111111] tracking-wide group-hover:text-[#F97316] transition-colors"
                style={{
                  fontFamily: 'var(--font-bebas), Impact, sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  letterSpacing: '0.02em',
                }}
              >
                <span className="guru-logo-orange">Mr</span> <span className="guru-logo-white">Grime</span><span className="guru-logo-orange">Guru</span>
              </span>
              <span
                className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#111111] mt-1"
                style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif' }}
              >
                Secret Formula · Foam Spray
              </span>
            </Link>

            {/* Desktop nav — Syne font, flat pill style */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm transition-all duration-150',
                    'hover:bg-[#FACC15] hover:text-[#111111]',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'bg-[#FACC15] text-[#111111]'
                      : 'text-[#111111]'
                  )}
                  style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif', fontWeight: 700 }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <Link
                href="/search"
                className="p-2.5 rounded-full hover:bg-[#FACC15] transition-colors text-[#111111]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Link>

              <Link
                href="/account"
                className="p-2.5 rounded-full hover:bg-[#FACC15] transition-colors text-[#111111]"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full hover:bg-[#FACC15] transition-colors text-[#111111]"
                aria-label={`Cart, ${itemCount} items`}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
                    style={{ backgroundColor: '#F97316' }}
                    aria-live="polite"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </button>

              {/* "Shop all" CTA — black pill, desktop only */}
              <Link
                href="/shop"
                className="guru-shop-all hidden md:inline-flex items-center px-5 py-2.5 rounded-full text-sm text-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all ml-1"
                style={{
                  backgroundColor: '#111111',
                  fontFamily: 'var(--font-syne), system-ui, sans-serif',
                  fontWeight: 800,
                }}
              >
                Shop all
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-[#FACC15] text-[#111111] transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden bg-[#FFFBF0] border-t-2 border-[#111111]"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <nav className="container-wide py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-sm font-black text-[#111111] hover:bg-[#FACC15] transition-colors"
                    style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t-2 border-[#111111]/10 mt-2">
                  <Link
                    href="/shop"
                    className="block w-full text-center px-6 py-3.5 rounded-full font-black text-sm text-white bg-[#111111] border-2 border-[#111111] shadow-[3px_3px_0px_rgba(0,0,0,0.3)]"
                    style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif' }}
                  >
                    Shop All Products
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
