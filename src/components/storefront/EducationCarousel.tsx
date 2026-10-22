'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const educationCards = [
  {
    id: 'laundry-pods',
    emoji: '🫧',
    problem: 'Tough laundry stains that don\'t come out?',
    product: 'Laundry Pods',
    href: '/shop/laundry-pods',
    bg: '#E6F5F8',
    accent: '#347F99',
    summary: 'Pre-measured pods with 3-in-1 action: stain removal, freshness, and fabric care in every wash.',
    steps: [
      { num: 1, title: 'Load the drum', body: 'Place one pod at the bottom of the drum before adding your laundry.' },
      { num: 2, title: 'Add your clothes', body: 'Load clothes on top of the pod. Do not place the pod in the dispenser drawer.' },
      { num: 3, title: 'Select your cycle', body: 'Choose any wash cycle — the pod dissolves completely in both hot and cold water.' },
      { num: 4, title: 'Enjoy the results', body: 'Clean, fresh-smelling laundry every time. Repeat as needed per load size.' },
    ],
    warning: 'Keep pods away from children. Do not break or cut the pod. Wash hands after handling.',
    competitors: 'Works as an alternative to loose powder and liquid detergents like Tide and Ariel.',
  },
  {
    id: 'laundry-beads',
    emoji: '🌸',
    problem: 'Laundry smells fine when wet, but loses freshness by evening?',
    product: 'Scented Laundry Beads',
    href: '/shop/laundry-beads',
    bg: '#F5EDF7',
    accent: '#8B5CF6',
    summary: 'Small scent beads that release fragrance slowly — keeping clothes fresh for up to 12 weeks.',
    steps: [
      { num: 1, title: 'Measure the beads', body: 'Use the cap to measure. 1 capful for small loads, 2 for large loads.' },
      { num: 2, title: 'Add to drum', body: 'Pour directly into the drum before adding laundry.' },
      { num: 3, title: 'Wash as normal', body: 'Add your regular detergent too. Beads work alongside any detergent.' },
      { num: 4, title: 'Long-lasting freshness', body: 'Fragrance is activated each time you wear or fold the clothes.' },
    ],
    variants: ['Lavender Dreams', 'Ocean Breeze', 'Citrus Fresh', 'Velvet Rose'],
  },
  {
    id: 'floor-cleaner',
    emoji: '🏠',
    problem: 'Floors look dull even after mopping?',
    product: 'Floor Cleaner',
    href: '/shop/floor-cleaner',
    bg: '#FFF7ED',
    accent: '#D97706',
    summary: 'Lemon-fresh formula that cleans and leaves a streak-free shine on all common floor surfaces.',
    steps: [
      { num: 1, title: 'Dilute properly', body: 'Mix 20ml of Floor Cleaner in 1 litre of clean water.' },
      { num: 2, title: 'Mop the floor', body: 'Apply diluted solution with a mop. No rinsing required.' },
      { num: 3, title: 'Allow to dry', body: 'Let floors air-dry. Avoid walking on wet surfaces.' },
      { num: 4, title: 'Enjoy fresh floors', body: 'Floors are left clean, streak-free, and lemon fresh.' },
    ],
    warning: 'Test on an inconspicuous area first. Not recommended for untreated wood or polished stone without testing.',
    floorTypes: ['Marble', 'Ceramic Tile', 'Vinyl', 'Laminate'],
  },
  {
    id: 'kitchen-degreaser',
    emoji: '🍳',
    problem: 'Greasy stovetop and range hood that won\'t come clean?',
    product: 'Kitchen Degreaser',
    href: '/shop/kitchen-degreaser',
    bg: '#FEF2F2',
    accent: '#DC2626',
    summary: 'Powerful spray formula that breaks down cooking oil, food residue, and stubborn grease.',
    steps: [
      { num: 1, title: 'Spray the surface', body: 'Hold 15–20 cm from the surface and spray a light, even coat.' },
      { num: 2, title: 'Wait 30 seconds', body: 'Allow contact time for the formula to break down grease.' },
      { num: 3, title: 'Wipe clean', body: 'Use a damp cloth or sponge to wipe away residue.' },
      { num: 4, title: 'Rinse if needed', body: 'For food-contact surfaces, rinse with clean water after wiping.' },
    ],
    warning: 'Do not use on hot surfaces. Not suitable for painted or lacquered surfaces without testing. Keep away from eyes.',
  },
  {
    id: 'shoe-cleaner',
    emoji: '👟',
    problem: 'Dirty shoes that regular washing can\'t fix?',
    product: 'Shoe Cleaner',
    href: '/shop/shoe-cleaner',
    bg: '#ECFDF5',
    accent: '#059669',
    summary: 'A gentle but effective formula that removes dirt and stains from canvas, leather, mesh, and synthetic materials.',
    steps: [
      { num: 1, title: 'Remove loose dirt', body: 'Use a soft brush to remove loose dirt before applying the cleaner.' },
      { num: 2, title: 'Apply the cleaner', body: 'Apply a small amount to a clean cloth or soft brush.' },
      { num: 3, title: 'Scrub gently', body: 'Work in small circular motions on the soiled area.' },
      { num: 4, title: 'Wipe and dry', body: 'Wipe away residue with a damp cloth. Allow to air-dry away from direct heat.' },
    ],
    warning: 'Test on a hidden area first, especially for leather and suede. Do not soak the material.',
    materials: ['Canvas', 'Leather', 'Mesh', 'Synthetic uppers'],
  },
]

export function EducationCarousel() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  const activeCardData = educationCards.find((c) => c.id === activeCard)

  function openCard(id: string) {
    setActiveCard(id)
    setStepIndex(0)
  }

  function closeCard() {
    setActiveCard(null)
    setStepIndex(0)
  }

  return (
    <section
      id="education"
      className="section-gap"
      style={{ backgroundColor: '#24333A' }}
      aria-label="Cleaning education"
    >
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-caption mb-3" style={{ color: '#9FD8E8' }}>
            Cleaning Education
          </p>
          <h2 className="text-headline mb-4" style={{ color: '#FAF8F2' }}>
            Every Mess Has a Match.
          </h2>
          <p className="text-body-lg max-w-xl mx-auto" style={{ color: '#75828A' }}>
            Discover the right product for every cleaning challenge in your home.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {educationCards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => openCard(card.id)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-left rounded-2xl p-5 flex flex-col gap-3 transition-all cursor-pointer"
              style={{ backgroundColor: card.bg }}
              aria-label={`Learn about ${card.product}`}
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {card.emoji}
              </span>
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: card.accent }}
              >
                {card.product}
              </p>
              <p className="text-sm font-semibold text-[#24333A] leading-snug">
                {card.problem}
              </p>
              <p className="text-xs text-[#75828A] line-clamp-2">{card.summary}</p>
              <div
                className="flex items-center gap-1 text-xs font-semibold mt-auto"
                style={{ color: card.accent }}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Learn How
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {activeCard && activeCardData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#24333A]/70 backdrop-blur-sm"
              onClick={closeCard}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-50 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: 'calc(100vh - 2rem)' }}
              role="dialog"
              aria-modal="true"
              aria-label={`How to use ${activeCardData.product}`}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between p-5 border-b border-[#E6F5F8]"
                style={{ backgroundColor: activeCardData.bg }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeCardData.emoji}</span>
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: activeCardData.accent }}
                    >
                      How to use
                    </p>
                    <h3 className="font-bold text-lg text-[#24333A]">{activeCardData.product}</h3>
                  </div>
                </div>
                <button
                  onClick={closeCard}
                  className="p-2 rounded-full hover:bg-white/60 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-[#24333A]" />
                </button>
              </div>

              {/* Steps */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {/* Step indicators */}
                <div className="flex gap-2 mb-6">
                  {activeCardData.steps.map((step, i) => (
                    <button
                      key={step.num}
                      onClick={() => setStepIndex(i)}
                      className="flex-1 h-1.5 rounded-full transition-all"
                      style={{
                        backgroundColor: i <= stepIndex ? activeCardData.accent : '#E6F5F8',
                      }}
                      aria-label={`Step ${step.num}: ${step.title}`}
                    />
                  ))}
                </div>

                {/* Current step */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4"
                      style={{ backgroundColor: activeCardData.accent }}
                    >
                      {activeCardData.steps[stepIndex].num}
                    </div>
                    <h4 className="font-bold text-xl text-[#24333A] mb-2">
                      {activeCardData.steps[stepIndex].title}
                    </h4>
                    <p className="text-[#75828A] leading-relaxed">
                      {activeCardData.steps[stepIndex].body}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Warning */}
                {activeCardData.warning && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <p className="text-xs text-amber-800 leading-relaxed">
                      ⚠️ {activeCardData.warning}
                    </p>
                  </div>
                )}

                {/* Variants */}
                {'variants' in activeCardData && activeCardData.variants && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-[#24333A] uppercase tracking-wider mb-2">
                      Available scents
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeCardData.variants.map((v) => (
                        <span
                          key={v}
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ backgroundColor: activeCardData.bg, color: activeCardData.accent }}
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="p-5 border-t border-[#E6F5F8] flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                  disabled={stepIndex === 0}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Prev
                </Button>
                {stepIndex < activeCardData.steps.length - 1 ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => setStepIndex((i) => i + 1)}
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" className="flex-1" asChild>
                    <Link href={activeCardData.href} onClick={closeCard}>
                      Shop {activeCardData.product} <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
