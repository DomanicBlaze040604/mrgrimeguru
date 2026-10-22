'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
      { label: 'Laundry Pods', href: '/shop/laundry-pods', description: 'Powerful 3-in-1 pods' },
      { label: 'Laundry Beads', href: '/shop/laundry-beads', description: '4 signature scents' },
      { label: 'Floor Cleaner', href: '/shop/floor-cleaner', description: 'All-floor formula' },
      { label: 'Kitchen Degreaser', href: '/shop/kitchen-degreaser', description: 'Cuts through grease' },
      { label: 'Shoe Cleaner', href: '/shop/shoe-cleaner', description: 'For all materials' },
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
      {/* Announcement Bar */}
      <div
        style={{ backgroundColor: '#347F99' }}
        className="text-white text-center py-2 px-4 text-xs font-medium"
      >
        🚚 Free shipping on orders above ₹499 · New: Laundry Beads in 4 amazing scents!
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-[#FAF8F2]'
        )}
      >
        <div className="container-wide">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Mr GrimeGuru home">
              <div
                className="relative w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#9FD8E8' }}
              >
                <span className="text-[#24333A] font-bold text-sm">G</span>
              </div>
              <span
                className="font-bold text-lg hidden sm:block"
                style={{ color: '#24333A', fontFamily: 'var(--font-playfair)' }}
              >
                Mr <span style={{ color: '#347F99' }}>GrimeGuru</span>
              </span>
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
                      'flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all',
                      'hover:bg-[#E6F5F8] hover:text-[#347F99]',
                      pathname === link.href || pathname.startsWith(link.href + '/')
                        ? 'text-[#347F99] bg-[#E6F5F8]'
                        : 'text-[#24333A]'
                    )}
                    aria-haspopup={link.children ? 'true' : undefined}
                    aria-expanded={link.children ? activeDropdown === link.label : undefined}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform',
                          activeDropdown === link.label ? 'rotate-180' : ''
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
                        className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-[#E6F5F8] overflow-hidden"
                        role="menu"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex flex-col gap-0.5 px-4 py-3 hover:bg-[#E6F5F8] transition-colors"
                            role="menuitem"
                          >
                            <span className="text-sm font-semibold text-[#24333A]">
                              {child.label}
                            </span>
                            <span className="text-xs text-[#75828A]">{child.description}</span>
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
                className="p-2 rounded-full hover:bg-[#E6F5F8] transition-colors text-[#24333A]"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 rounded-full hover:bg-[#E6F5F8] transition-colors text-[#24333A]"
                aria-label="My account"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-full hover:bg-[#E6F5F8] transition-colors text-[#24333A]"
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
                      'bg-[#24333A] text-white'
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
                className="lg:hidden p-2 rounded-full hover:bg-[#E6F5F8] transition-colors text-[#24333A]"
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
              className="lg:hidden overflow-hidden bg-white border-t border-[#E6F5F8]"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <nav className="container-wide py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      className="block px-4 py-3 rounded-xl text-sm font-semibold text-[#24333A] hover:bg-[#E6F5F8] transition-colors"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 flex flex-col gap-1 mt-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 rounded-lg text-sm text-[#75828A] hover:text-[#24333A] hover:bg-[#E6F5F8] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-[#E6F5F8] mt-2">
                  <Button variant="primary" size="md" className="w-full" asChild>
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
