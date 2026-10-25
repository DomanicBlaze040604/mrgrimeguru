'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/* ── Brand colours from packaging ────────────────────────
   Black  #111111   (primary text / can body)
   Orange #F97316   (cap / accent)
   Yellow #FACC15   (logo badge)
   Cream  #FFFBF0   (background)
──────────────────────────────────────────────────────── */

const ICON_CATEGORIES = [
  { id: 'shoe-cleaner',    label: 'Shoe Cleaner',         href: '/shop/shoe-cleaner',         image: '/images/products/shoe-cleaner-1.jpeg',        bg: '#FFF3E0' },
  { id: 'multipurpose',    label: 'Multipurpose Cleaner', href: '/shop/multipurpose-cleaner',  image: '/images/products/multipurpose-cleaner-1.jpeg', bg: '#FFFDE7' },
  { id: 'kitchen-cleaner', label: 'Kitchen Cleaner',      href: '/shop/kitchen-cleaner',       image: '/images/products/kitchen-cleaner-1.jpeg',      bg: '#FFF3E0' },
  { id: 'laundry-pods',    label: 'Laundry Pods',         href: '/shop/laundry-pods',          image: '/images/products/laundry-pods.jpg',            bg: '#F3F4F6' },
  { id: 'all-products',    label: 'All Products',         href: '/shop',                       image: '/images/products/all-products-frame.jpeg',     bg: '#FFF8E1' },
]

const TRUST_STATS = [
  { value: '3 Products', sub: 'Spray cleaners' },
  { value: 'Secret Formula', sub: 'Made by us' },
  { value: 'Free Shipping', sub: 'On orders ₹499+' },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: d, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#FFFBF0' }}
      aria-label="Brand hero"
    >
      {/* ── Category strip ── */}
      <div className="border-b border-orange-100 bg-white">
        <div className="container-wide py-4 md:py-5">
          <div className="flex items-start justify-start md:justify-center gap-4 sm:gap-7 md:gap-10 overflow-x-auto scrollbar-hide px-1">
            {ICON_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex-shrink-0"
              >
                <Link
                  href={cat.href}
                  className="group flex flex-col items-center gap-2 text-center w-[68px] sm:w-20 md:w-[90px]"
                  aria-label={cat.label}
                >
                  <div
                    className="relative w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] md:w-[82px] md:h-[82px] rounded-full overflow-hidden shadow ring-2 ring-transparent group-hover:ring-[#F97316] group-hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <Image src={cat.image} alt={cat.label} fill className="object-cover" sizes="82px" />
                  </div>
                  <p
                    className="text-[10px] sm:text-[11px] font-bold text-[#111111] group-hover:text-[#F97316] leading-tight transition-colors"
                    style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif' }}
                  >
                    {cat.label}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero body ── */}
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-14 lg:py-16">

          {/* Left: copy */}
          <div className="flex-1 max-w-[540px]">

            {/* Eyebrow pill — Syne */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-5">
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-[#111111] bg-[#FACC15] text-[#111111] text-xs shadow-[2px_2px_0px_#111111]"
                style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif', fontWeight: 800 }}
              >
                <span>✦</span> Secret Formula · Hydrogen Foam Spray
              </span>
            </motion.div>

            {/* Headline — Bebas Neue, massive condensed like the can label */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.08}
              className="leading-[0.95] tracking-wide mb-5"
              style={{
                fontFamily: 'var(--font-bebas), Impact, sans-serif',
                fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                color: '#111111',
              }}
            >
              Let the foam{' '}
              <span className="relative inline-block">
                do the
                <span
                  className="absolute left-0 w-full h-4 -z-10 rounded-sm"
                  style={{ backgroundColor: '#FACC15', bottom: '6px' }}
                  aria-hidden="true"
                />
              </span>{' '}
              hard work.
            </motion.h1>

            {/* Sub — DM Sans */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.16}
              className="text-base sm:text-lg text-[#444444] leading-relaxed mb-8 max-w-md"
              style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}
            >
              Foam that clings to grease, shoe dirt, and everyday grime — so you scrub less and wipe more. Our own secret formula, made for the way Indian homes actually get dirty.
            </motion.p>

            {/* CTAs — Syne */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.22}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm text-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                style={{ backgroundColor: '#F97316', fontFamily: 'var(--font-syne), system-ui, sans-serif', fontWeight: 800 }}
              >
                Explore the range <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#cleaning-fix"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm text-[#111111] bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif', fontWeight: 800 }}
              >
                See it work
              </Link>
            </motion.div>

            {/* Trust stats — Syne for values */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.28}
              className="flex flex-wrap gap-6 pt-5 border-t-2 border-[#111111]/10"
            >
              {TRUST_STATS.map(({ value, sub }) => (
                <div key={value}>
                  <p className="font-black text-base text-[#111111]" style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif' }}>{value}</p>
                  <p className="text-xs text-[#666666]" style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>{sub}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 relative w-full max-w-[520px]"
          >
            {/* "spray · 30 sec · wipe" badge */}
            <div
              className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full border-2 border-[#111111] bg-white font-black text-xs text-[#111111] shadow-[2px_2px_0px_#111111]"
              aria-hidden="true"
            >
              spray · 30 sec · wipe
            </div>

            {/* 1+1 badge */}
            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3 -right-3 z-20 w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center border-2 border-[#111111] shadow-[3px_3px_0px_#111111] text-center"
              style={{ backgroundColor: '#FACC15' }}
              aria-hidden="true"
            >
              <span className="font-black text-lg leading-none text-[#111111]">1+1</span>
              <span className="text-[9px] font-bold text-[#111111] leading-tight">on every<br />cleaner</span>
            </motion.div>

            {/* Main image card */}
            <div
              className="relative rounded-3xl overflow-hidden border-2 border-[#111111] shadow-[6px_6px_0px_#111111] aspect-square sm:aspect-[4/3]"
              style={{ backgroundColor: '#FFF3E0' }}
            >
              <Image
                src="/images/products/all-products-frame.jpeg"
                alt="Mr GrimeGuru Shoe Cleaner, Kitchen Cleaner and Multipurpose Cleaner spray products"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Secret formula floating tag */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              className="absolute -bottom-4 left-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-[#111111] bg-white shadow-[3px_3px_0px_#111111]"
              aria-hidden="true"
            >
              <span className="text-lg">🔒</span>
              <div>
                <p className="text-xs font-black text-[#111111] leading-none" style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif' }}>Secret Formula</p>
                <p className="text-[10px] text-[#666666]" style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>Made by us · Not white-label</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
