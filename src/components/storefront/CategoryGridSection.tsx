'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, Heart, Leaf } from 'lucide-react'

interface CategoryItem {
  id: string
  title: string
  subtitle: string
  href: string
  image: string
  badge: string
  badgeColor?: string
  accentColor: string
  count: string
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'shoe-cleaner',
    title: 'Shoe & Sneaker Care',
    subtitle: 'Deep foaming kit for all shoe fabrics',
    href: '/shop/shoe-cleaner',
    image: '/images/products/shoe-cleaner.jpg',
    badge: 'Restores White',
    badgeColor: 'bg-indigo-700 text-white',
    accentColor: '#4338CA',
    count: 'From ₹449',
  },
  {
    id: 'multipurpose-cleaner',
    title: 'Multipurpose Cleaner',
    subtitle: 'One cleaner for everyday household surfaces',
    href: '/shop/multipurpose-cleaner',
    image: '/images/products/multipurpose-cleaner-1.jpeg',
    badge: 'Versatile',
    badgeColor: 'bg-amber-600 text-white',
    accentColor: '#D97706',
    count: 'From ₹399',
  },
  {
    id: 'kitchen-cleaner',
    title: 'Kitchen Cleaner',
    subtitle: 'Cuts through stovetop grease & kitchen residue',
    href: '/shop/kitchen-cleaner',
    image: '/images/products/kitchen-cleaner-1.jpeg',
    badge: 'Zero Scrub',
    badgeColor: 'bg-rose-700 text-white',
    accentColor: '#BE123C',
    count: 'From ₹349',
  },
  {
    id: 'laundry-care',
    title: 'Laundry Pods',
    subtitle: 'Pre-measured pods for every wash',
    href: '/shop/laundry-pods',
    image: '/images/products/shoe-cleaner-1.jpeg',
    badge: 'Bestseller',
    badgeColor: 'bg-emerald-700 text-white',
    accentColor: '#166534',
    count: 'From ₹899',
  },
]

export function CategoryGridSection() {
  return (
    <section className="py-16 md:py-24 bg-[#FAFAF8] relative overflow-hidden" aria-labelledby="shop-by-category-heading">
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="container-wide relative z-10">
        {/* Section Heading — Koparo Clean Style */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-[#166534] text-xs font-bold uppercase tracking-wider mb-3">
            <Leaf className="w-3.5 h-3.5 text-[#166534]" />
            Plant-Powered Essentials
          </div>
          <h2 id="shop-by-category-heading" className="text-3xl md:text-4xl lg:text-5xl font-black text-[#14532D] tracking-tight mb-4">
            Shop By Category
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Engineered with potent botanical actives and allergen-free fragrances. Safe for babies, playful pets, and gentle on your hands.
          </p>
        </div>

        {/* Squarish Rectangular Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                href={cat.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-gray-200/90 hover:border-[#166534] shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/5] sm:aspect-[1/1] md:aspect-[4/5] p-4 sm:p-6"
                aria-label={`Shop ${cat.title}`}
              >
                {/* Background soft glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F0FDF4]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Top Row: Badge + Price tag */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                  <span className="text-xs font-bold text-gray-500 group-hover:text-[#166534] transition-colors bg-gray-50 group-hover:bg-emerald-50 px-2 py-0.5 rounded-md">
                    {cat.count}
                  </span>
                </div>

                {/* Center: Image in Squarish Box with Zoom Effect */}
                <div className="relative w-full flex-1 my-2 flex items-center justify-center overflow-hidden">
                  <div className="relative w-4/5 h-4/5 transition-transform duration-500 ease-out group-hover:scale-110">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-contain drop-shadow-md"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                </div>

                {/* Bottom Row: Title, Subtitle & Arrow */}
                <div className="relative z-10 pt-2 border-t border-gray-100 group-hover:border-emerald-200/60 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-base sm:text-lg text-[#14532D] group-hover:text-[#166534] transition-colors truncate">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>

                    {/* Circular Action Button */}
                    <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-50 group-hover:bg-[#166534] text-[#166534] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow group-hover:translate-x-0.5">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Feature Badges under Category Section (Koparo style guarantee bar) */}
        <div className="mt-14 pt-8 border-t border-gray-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white shadow-xs border border-gray-100">
            <span className="text-2xl">🌱</span>
            <span className="text-xs md:text-sm font-bold text-gray-800">100% Plant Actives</span>
            <span className="text-[11px] text-gray-500">Zero artificial sulfates</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white shadow-xs border border-gray-100">
            <span className="text-2xl">🐾</span>
            <span className="text-xs md:text-sm font-bold text-gray-800">Pet & Baby Safe</span>
            <span className="text-[11px] text-gray-500">Non-toxic & hypoallergenic</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white shadow-xs border border-gray-100">
            <span className="text-2xl">⚡</span>
            <span className="text-xs md:text-sm font-bold text-gray-800">Tough On Stains</span>
            <span className="text-[11px] text-gray-500">Effective on Indian grime</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white shadow-xs border border-gray-100">
            <span className="text-2xl">📦</span>
            <span className="text-xs md:text-sm font-bold text-gray-800">Free Shipping ₹499+</span>
            <span className="text-[11px] text-gray-500">Express delivery across India</span>
          </div>
        </div>
      </div>
    </section>
  )
}
