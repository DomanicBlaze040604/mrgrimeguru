'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const situations = [
  { id: 'shoes',     label: 'Dirty shoes or sneakers',    emoji: '👟' },
  { id: 'surfaces',  label: 'Household surface mess',     emoji: '🧹' },
  { id: 'kitchen',   label: 'Kitchen grease & residue',   emoji: '🍳' },
  { id: 'laundry',   label: 'Washing clothes',            emoji: '🫧' },
]

const recommendations: Record<string, {
  product: string
  href: string
  emoji: string
  tip: string
  color: string
}> = {
  shoes: {
    product: 'Shoe Cleaner',
    href: '/shop/shoe-cleaner',
    emoji: '👟',
    tip: 'Apply to a soft brush or cloth. Check label for compatible materials before use.',
    color: '#EDE9FE',
  },
  surfaces: {
    product: 'Multipurpose Cleaner',
    href: '/shop/multipurpose-cleaner',
    emoji: '🧹',
    tip: 'Suitable for approved household surfaces. Always check label for compatibility.',
    color: '#FEF9C3',
  },
  kitchen: {
    product: 'Kitchen Cleaner',
    href: '/shop/kitchen-cleaner',
    emoji: '🍳',
    tip: 'Apply as directed on label. Rinse food-contact surfaces thoroughly before use.',
    color: '#FFE4E6',
  },
  laundry: {
    product: 'Laundry Pods',
    href: '/shop/laundry-pods',
    emoji: '🫧',
    tip: 'Place pod directly in the drum before adding clothes. Follow label for load size.',
    color: '#DCFCE7',
  },
}

export function CleaningFixFinder() {
  const [selected, setSelected] = useState<string | null>(null)
  const rec = selected ? recommendations[selected] : null

  return (
    <section
      id="cleaning-fix"
      className="section-gap"
      style={{ backgroundColor: '#E6F5F8' }}
      aria-label="Find your cleaning fix"
    >
      <div className="container-narrow text-center">
        <p className="text-caption mb-3" style={{ color: '#347F99' }}>
          Quick Finder
        </p>
        <h2 className="text-subheadline mb-4" style={{ color: '#24333A' }}>
          Tell Us What Needs Cleaning.
        </h2>
        <p className="text-body mb-8" style={{ color: '#75828A' }}>
          Choose your cleaning challenge and discover the right product for the task.
        </p>

        {/* Situation buttons */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-8"
          role="group"
          aria-label="Cleaning situations"
        >
          {situations.map(({ id, label, emoji }) => (
            <button
              key={id}
              onClick={() => setSelected(id === selected ? null : id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border-2 transition-all ${
                selected === id
                  ? 'border-[#347F99] bg-[#347F99] text-white shadow-md scale-105'
                  : 'border-[#9FD8E8] bg-white text-[#24333A] hover:border-[#347F99] hover:shadow-sm'
              }`}
              aria-pressed={selected === id}
            >
              <span role="img" aria-hidden="true">{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Recommendation */}
        <AnimatePresence mode="wait">
          {rec ? (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl p-8 text-left max-w-md mx-auto shadow-lg"
              style={{ backgroundColor: rec.color }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl shrink-0" role="img" aria-hidden="true">
                  {rec.emoji}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      We recommend
                    </p>
                  </div>
                  <h3 className="font-bold text-xl text-[#24333A] mb-2">{rec.product}</h3>
                  <p className="text-sm text-[#75828A] leading-relaxed mb-4">{rec.tip}</p>
                  <Button variant="primary" size="sm" asChild>
                    <Link href={rec.href}>
                      Shop {rec.product} <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-[#75828A]"
            >
              Select a situation above to see our recommendation.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
