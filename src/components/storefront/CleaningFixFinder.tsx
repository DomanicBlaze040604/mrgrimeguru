'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const situations = [
  { id: 'laundry', label: 'Laundry stains', emoji: '👕' },
  { id: 'odour', label: 'Laundry odour', emoji: '🌸' },
  { id: 'floors', label: 'Dirty floors', emoji: '🏠' },
  { id: 'kitchen', label: 'Kitchen grease', emoji: '🍳' },
  { id: 'shoes', label: 'Dirty shoes', emoji: '👟' },
]

const recommendations: Record<string, {
  product: string
  href: string
  emoji: string
  tip: string
  color: string
}> = {
  laundry: {
    product: 'Laundry Pods',
    href: '/shop/laundry-pods',
    emoji: '🫧',
    tip: 'Drop one pod into the drum before loading clothes. Works in any wash cycle.',
    color: '#E6F5F8',
  },
  odour: {
    product: 'Scented Laundry Beads',
    href: '/shop/laundry-beads',
    emoji: '🌸',
    tip: 'Add beads to the drum alongside your detergent for long-lasting freshness — up to 12 weeks.',
    color: '#F5EDF7',
  },
  floors: {
    product: 'Floor Cleaner',
    href: '/shop/floor-cleaner',
    emoji: '🏠',
    tip: 'Dilute 20ml in 1 litre of water and mop as usual. No rinsing needed.',
    color: '#FFF7ED',
  },
  kitchen: {
    product: 'Kitchen Degreaser',
    href: '/shop/kitchen-degreaser',
    emoji: '🍳',
    tip: 'Spray on the greasy surface, wait 30 seconds, then wipe clean.',
    color: '#FEF2F2',
  },
  shoes: {
    product: 'Shoe Cleaner',
    href: '/shop/shoe-cleaner',
    emoji: '👟',
    tip: 'Apply to a soft brush or cloth and scrub gently in circular motions.',
    color: '#ECFDF5',
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
          Find Your Cleaning Fix
        </h2>
        <p className="text-body mb-8" style={{ color: '#75828A' }}>
          Select your cleaning challenge and we&apos;ll point you to the right product.
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
