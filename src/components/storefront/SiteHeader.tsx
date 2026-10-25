'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, Search, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const navLinks = [
  {
    label: 'Products',
    href: '/shop',
    children: [
      { label: 'All Products', href: '/shop', description: 'Browse the full range' },
      { label: 'Shoe Cleaner', href: '/shop/shoe-cleaner', description: 'For all footwear materials' },
      { label: 'Multipurpose Cleaner', href: '/shop/multipurpose-cleaner', description: 'Everyday household surfaces' },
      { label: 'Kitchen Cleaner', href: '/shop/kitchen-cleaner', description: 'Cuts through grease' },
      { label: 'Laundry Pods', href: '/shop/laundry-pods', description: 'Pre-measured detergent pods' },
    ],
  },
  { label: 'Cleaning Guides', href: '/guides' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
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
      {/* Dynamic Moving Sale Marquee Banner */}
      <div
        className="bg-[#14532D] text-white overflow-hidden py-2.5 text-xs font-semibold tracking-wide border-b border-[#166534]/50 select-none relative z-50"
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-8 mx-6">
              <span className="inline-flex items-center gap-2 font-black text-amber-300 tracking-wider">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
                </span>
                🔥 SALE IS LIVE · UP TO 50% OFF
              </span>
              <span className="text-emerald-100/90 font-medium">
                USE CODE: <strong className="text-white underline decoration-amber-400 underline-offset-2">CLEAN50</strong> FOR EXTRA 10% OFF
              </span>
              <span className="text-emerald-100/90 font-medium">
                Cleaning made simple. Find the right solution for every mess.
              </span>
              <span className="text-emerald-100/90 font-medium">
                🌿 100% PLANT POWERED & PET SAFE
              </span>
              <span className="text-emerald-100/90 font-medium">
                ⭐ 4.9/5 RATED BY 50,000+ HOMES
              </span>
              <span className="text-emerald-100/90 font-medium">
                🎁 FREE LAUNDRY BEADS SAMPLE ON ₹799+
              </span>
            </div>
          ))}
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200'
            : 'bg-white border-b border-gray-100'
        )}
      >
        <div className="container-wide">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Logo — text only, no image */}
            <Link href="/" className="flex items-center shrink-0 py-1 group" aria-label="Mr GrimeGuru home">
              <div className="flex flex-col">
                <span
                  className="font-extrabold text-2xl md:text-3xl tracking-tight text-black leading-none"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Mr GrimeGuru
                </span>
                <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-[#059669] uppercase mt-1">
                  Plant Powered Natural Clean
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all',
                      'hover:bg-[#F0FDF4] hover:text-[#166534]',
                      pathname === link.href || pathname.startsWith(link.href + '/')
                        ? 'text-[#166534] bg-[#F0FDF4]'
                        : 'text-gray-700'
                    )}
                    aria-haspopup={link.children ? 'true' : undefined}
                    aria-expanded={link.children ? activeDropdown === link.label : undefined}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-200 text-gray-400 group-hover:text-[#166534]',
                          activeDropdown === link.label ? 'rotate-180 text-[#166534]' : ''
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden z-50 p-1"
                        role="menu"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-[#F0FDF4] transition-colors"
                            role="menuitem"
                          >
                            <span className="text-sm font-bold text-gray-800 hover:text-[#166534]">
                              {child.label}
                            </span>
                            <span className="text-xs text-gray-500">{child.description}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Link
                href="/search"
                className="p-2.5 rounded-full hover:bg-[#F0FDF4] hover:text-[#166534] transition-colors text-gray-700"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="p-2.5 rounded-full hover:bg-[#F0FDF4] hover:text-[#166534] transition-colors text-gray-700"
                aria-label="My account"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full hover:bg-[#F0FDF4] hover:text-[#166534] transition-colors text-gray-700"
                aria-label={`Shopping cart, ${itemCount} items`}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'absolute -top-1 -right-1',
                      'flex h-5 w-5 items-center justify-center',
                      'rounded-full text-xs font-bold',
                      'bg-[#166534] text-white shadow-sm'
                    )}
                    aria-live="polite"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-[#F0FDF4] text-gray-700 transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <nav className="container-wide py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-800 hover:bg-[#F0FDF4] hover:text-[#166534] transition-colors"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 flex flex-col gap-1 mt-1 pl-2 border-l border-emerald-100">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-[#166534] hover:bg-[#F0FDF4] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-100 mt-2">
                  <Button variant="primary" size="md" className="w-full bg-[#166534] hover:bg-[#14532D]" asChild>
                    <Link href="/shop">Shop All Products</Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
