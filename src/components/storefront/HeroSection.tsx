'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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
        background: 'linear-gradient(160deg, #E6F5F8 0%, #FAF8F2 55%, #F2EBE0 100%)',
        minHeight: 'min(90vh, 700px)',
      }}
      aria-label="Brand hero"
    >
      {/* Decorative background blobs */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#9FD8E8' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#E8D8C1' }}
        aria-hidden="true"
      />

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
                className="badge badge-primary text-xs"
                style={{ backgroundColor: '#E6F5F8', color: '#347F99', border: '1px solid #9FD8E8' }}
              >
                <Sparkles className="h-3 w-3" />
                New Laundry Beads — 4 Scents
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-display mb-5"
              style={{ color: '#24333A' }}
            >
              Grime Happens.{' '}
              <span style={{ color: '#347F99' }}>We Handle It.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="text-body-lg mb-8"
              style={{ color: '#75828A' }}
            >
              Premium cleaning solutions for modern Indian homes. From laundry to kitchen, floor to shoe — Mr GrimeGuru has your back.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="flex flex-wrap gap-3"
            >
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} asChild>
                <Link href="/shop">Shop All Products</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
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
                { stat: '5 Products', label: 'in our range' },
                { stat: '★ 4.8', label: 'avg. rating' },
                { stat: 'Free shipping', label: 'above ₹499' },
              ].map(({ stat, label }) => (
                <div key={stat} className="flex flex-col">
                  <span className="font-bold text-base" style={{ color: '#24333A' }}>
                    {stat}
                  </span>
                  <span className="text-xs" style={{ color: '#75828A' }}>
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
              style={{ backgroundColor: '#9FD8E8', opacity: 0.3 }}
              aria-hidden="true"
            />

            {/* Main product image */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
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
                className="absolute bottom-6 left-6 glass rounded-2xl px-4 py-3 shadow-lg"
                aria-hidden="true"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#9FD8E8' }}
                  >
                    <span className="text-lg">🧹</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#24333A]">5 Product Families</p>
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
