'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const ICON_CATEGORIES = [
  { id: 'laundry-pods',      label: 'Laundry',  sublabel: 'Pods & Liquid',    href: '/shop?family=laundry_pods',      image: '/images/products/laundry-pods.jpg',     bg: '#DCFCE7' },
  { id: 'laundry-beads',     label: 'Fabric',   sublabel: 'Fragrance Beads',  href: '/shop?family=laundry_beads',     image: '/images/products/laundry-beads.jpg',    bg: '#FEF9C3' },
  { id: 'floor-cleaner',     label: 'Floor &',  sublabel: 'Surface Care',     href: '/shop?family=floor_cleaner',     image: '/images/products/floor-cleaner.jpg',    bg: '#CCFBF1' },
  { id: 'kitchen-degreaser', label: 'Kitchen',  sublabel: 'Degreaser',        href: '/shop?family=kitchen_degreaser', image: '/images/products/kitchen-degreaser.jpg',bg: '#FFE4E6' },
  { id: 'shoe-cleaner',      label: 'Shoe &',   sublabel: 'Sneaker Care',     href: '/shop?family=shoe_cleaner',      image: '/images/products/shoe-cleaner.jpg',     bg: '#EDE9FE' },
  { id: 'all-products',      label: 'All',      sublabel: 'Products',         href: '/shop',                          image: '/images/brand/product-range.jpg',       bg: '#FEF3C7' },
]

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #F0FDF4 0%, #FAFDF7 50%, #FFFFFF 100%)',
      }}
      aria-label="Brand hero"
    >
      {/* Decorative background blobs */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#DCFCE7' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#FEF3C7' }}
        aria-hidden="true"
      />

      {/* ── Category Icon Strip — sits at the very top, above hero content ── */}
      <div className="relative z-10 border-b border-emerald-100/80 bg-white/70 backdrop-blur-sm">
        <div className="container-wide py-5 md:py-6">
          <div className="flex items-start justify-start md:justify-center gap-5 sm:gap-8 md:gap-10 overflow-x-auto scrollbar-hide px-1">
            {ICON_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="flex-shrink-0"
              >
                <Link
                  href={cat.href}
                  className="group flex flex-col items-center gap-2 text-center w-16 sm:w-20 md:w-24"
                  aria-label={`Shop ${cat.label} ${cat.sublabel}`}
                >
                  <div
                    className="relative w-[62px] h-[62px] sm:w-[76px] sm:h-[76px] md:w-[88px] md:h-[88px] rounded-full overflow-hidden shadow-md ring-2 ring-transparent group-hover:ring-[#166534] group-hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: cat.bg }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 62px, (max-width: 1024px) 76px, 88px"
                    />
                  </div>
                  <p className="text-[11px] sm:text-xs font-bold text-[#14532D] group-hover:text-[#166534] leading-tight transition-colors">
                    {cat.label}<br /><span className="font-semibold">{cat.sublabel}</span>
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 py-16 lg:py-20">
          {/* Text content */}
          <div className="flex-1 max-w-xl">
            {/* Eyebrow */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 mb-5"
            >
              <span
                className="badge text-xs font-bold tracking-wide uppercase px-3.5 py-1.5 rounded-full"
                style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC' }}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#166534]" />
                🌿 100% Plant Powered · 0% Harsh Chemicals
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-display mb-5"
              style={{ color: '#14532D' }}
            >
              Naturally Clean.{' '}
              <span className="text-[#166534]">Truly Powerful.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="text-body-lg mb-8 text-gray-600 leading-relaxed"
            >
              Toxin-free, plant-powered cleaning solutions crafted for modern Indian homes. From in-wash laundry pods to kitchen degreasers — safe for playful pets, gentle on hands, ruthless on grime.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="flex flex-wrap gap-3"
            >
              <Button variant="primary" size="lg" className="bg-[#166534] hover:bg-[#14532D] shadow-md shadow-emerald-900/10" rightIcon={<ArrowRight className="h-4 w-4" />} asChild>
                <Link href="/shop">Shop Best Cleaners</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-[#166534] text-[#166534] hover:bg-[#F0FDF4]" asChild>
                <Link href="#cleaning-fix">Find Your Cleaning Fix</Link>
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="flex flex-wrap items-center gap-6 mt-8"
            >
              {[
                { stat: '100% Plant Actives', label: 'Biodegradable' },
                { stat: '★ 4.9 Rating', label: '50,000+ happy homes' },
                { stat: 'Free shipping', label: 'On orders above ₹499' },
              ].map(({ stat, label }) => (
                <div key={stat} className="flex flex-col">
                  <span className="font-extrabold text-base text-[#14532D]">
                    {stat}
                  </span>
                  <span className="text-xs text-gray-500">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 relative max-w-lg w-full"
          >
            {/* Decorative card behind */}
            <div
              className="absolute inset-4 rounded-3xl"
              style={{ backgroundColor: '#DCFCE7', opacity: 0.7 }}
              aria-hidden="true"
            />

            {/* Main product image */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] border border-emerald-100">
              <Image
                src="/images/brand/hero-banner.jpg"
                alt="Modern Indian home with Mr GrimeGuru cleaning products"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Floating product badge */}
              <div
                className="absolute bottom-6 left-6 glass rounded-2xl px-4 py-3 shadow-lg border border-white/80"
                aria-hidden="true"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100"
                  >
                    <span className="text-lg">🌿</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#14532D]">Plant Powered Formulas</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating product icons */}
            {[
              { emoji: '🫧', label: 'Laundry Pods', top: '8%', right: '-4%' },
              { emoji: '🌸', label: 'Scented Beads', bottom: '20%', right: '-6%' },
              { emoji: '🏠', label: 'Floor Clean', top: '30%', left: '-6%' },
            ].map(({ emoji, label, ...pos }) => (
              <motion.div
                key={label}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                className="absolute w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center bg-white"
                style={pos as React.CSSProperties}
                aria-hidden="true"
              >
                <span className="text-xl" role="img" aria-label={label}>
                  {emoji}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
