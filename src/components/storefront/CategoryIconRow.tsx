'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface CategoryIconItem {
  id: string
  label: string
  sublabel?: string
  href: string
  image: string
  bgColor: string
}

const ICON_CATEGORIES: CategoryIconItem[] = [
  {
    id: 'laundry-pods',
    label: 'Laundry',
    sublabel: 'Pods & Liquid',
    href: '/shop?family=laundry_pods',
    image: '/images/products/laundry-pods.jpg',
    bgColor: '#DCFCE7',
  },
  {
    id: 'laundry-beads',
    label: 'Fabric',
    sublabel: 'Fragrance Beads',
    href: '/shop?family=laundry_beads',
    image: '/images/products/laundry-beads.jpg',
    bgColor: '#FEF9C3',
  },
  {
    id: 'floor-cleaner',
    label: 'Floor &',
    sublabel: 'Surface Care',
    href: '/shop?family=floor_cleaner',
    image: '/images/products/multipurpose-cleaner-cutout.png',
    bgColor: '#CCFBF1',
  },
  {
    id: 'kitchen-degreaser',
    label: 'Kitchen',
    sublabel: 'Degreaser',
    href: '/shop?family=kitchen_degreaser',
    image: '/images/products/kitchen-cleaner-cutout.png',
    bgColor: '#FFE4E6',
  },
  {
    id: 'shoe-cleaner',
    label: 'Shoe &',
    sublabel: 'Sneaker Care',
    href: '/shop?family=shoe_cleaner',
    image: '/images/products/shoe-cleaner-cutout.png',
    bgColor: '#EDE9FE',
  },
  {
    id: 'all-products',
    label: 'All',
    sublabel: 'Products',
    href: '/shop',
    image: '/images/brand/product-range.jpg',
    bgColor: '#FEF3C7',
  },
]

export function CategoryIconRow() {
  return (
    <section
      className="py-8 md:py-12 bg-white border-b border-gray-100"
      aria-label="Shop by category"
    >
      <div className="container-wide">
        {/* Scrollable row on mobile, centered flex on desktop */}
        <div className="flex items-start justify-start md:justify-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide px-2 md:px-0 pb-2">
          {ICON_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
              className="flex-shrink-0"
            >
              <Link
                href={cat.href}
                className="group flex flex-col items-center gap-2 text-center w-20 sm:w-24 md:w-28"
                aria-label={`Shop ${cat.label} ${cat.sublabel ?? ''}`}
              >
                {/* Circle */}
                <div
                  className="relative w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 ring-2 ring-transparent group-hover:ring-[#166534]"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  <Image
                    src={cat.image}
                    alt={`${cat.label} ${cat.sublabel ?? ''}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 72px, (max-width: 1024px) 88px, 100px"
                  />
                </div>

                {/* Label */}
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#14532D] group-hover:text-[#166534] leading-tight transition-colors">
                    {cat.label}
                    {cat.sublabel && (
                      <>
                        <br />
                        <span className="font-semibold">{cat.sublabel}</span>
                      </>
                    )}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
