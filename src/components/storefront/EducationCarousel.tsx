'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const educationCards = [
  {
    id: 'shoe-cleaner',
    emoji: '👟',
    problem: 'Dirty shoes or sneakers?',
    product: 'Shoe Cleaner',
    href: '/shop/shoe-cleaner',
    bg: '#EDE9FE',
    accent: '#4338CA',
    summary: 'A dedicated solution for cleaning compatible footwear and tackling everyday dirt.',
    steps: [
      { num: 1, title: 'Remove loose dirt', body: 'Use a soft brush to remove loose dirt and dust from the shoe before applying the cleaner.' },
      { num: 2, title: 'Check compatibility', body: 'Check the footwear care label and the cleaner\'s label. Test on a small, hidden area first.' },
      { num: 3, title: 'Apply the cleaner', body: 'Apply the recommended amount using the method specified on the packaging.' },
      { num: 4, title: 'Wipe and dry', body: 'Wipe or rinse as directed. Allow the footwear to dry naturally — away from direct heat.' },
    ],
    warning: 'Test on a hidden area first, especially on leather or suede. Stop use if unexpected discolouration occurs.',
  },
  {
    id: 'multipurpose-cleaner',
    emoji: '🧹',
    problem: 'Everyday household messes on surfaces?',
    product: 'Multipurpose Cleaner',
    href: '/shop/multipurpose-cleaner',
    bg: '#FEF9C3',
    accent: '#D97706',
    summary: 'A versatile option for everyday cleaning on approved household surfaces.',
    steps: [
      { num: 1, title: 'Check the label', body: 'Read the product label and confirm the surface is listed as compatible.' },
      { num: 2, title: 'Apply as directed', body: 'Spray or apply using the method and quantity specified on the packaging.' },
      { num: 3, title: 'Wait if needed', body: 'Observe any stated contact time before wiping.' },
      { num: 4, title: 'Wipe and dry', body: 'Wipe or rinse the surface as instructed. Allow the area to dry before normal use.' },
    ],
    warning: 'Do not use on natural stone, unsealed wood, electronics, or any surface not listed on the label. Never mix cleaners.',
  },
  {
    id: 'kitchen-cleaner',
    emoji: '🍳',
    problem: 'Kitchen grease and cooking residue?',
    product: 'Kitchen Cleaner',
    href: '/shop/kitchen-cleaner',
    bg: '#FFE4E6',
    accent: '#BE123C',
    summary: 'Spray on grease, let the formula work, wipe it away. Built for kitchen messes.',
    steps: [
      { num: 1, title: 'Clear the area', body: 'Keep food, utensils, and exposed food items away from the cleaning area.' },
      { num: 2, title: 'Spray on the surface', body: 'Apply the cleaner as directed on the packaging.' },
      { num: 3, title: 'Allow contact time', body: 'Let the formula sit for the recommended time — it clings and lifts the grease.' },
      { num: 4, title: 'Wipe and rinse', body: 'Wipe and rinse as required. Rinse food-preparation surfaces thoroughly before use.' },
    ],
    warning: 'Check compatibility before use on natural stone, aluminium, or delicate coatings. Never mix cleaners.',
  },
  {
    id: 'laundry-pods',
    emoji: '🫧',
    problem: 'Looking for simpler laundry day?',
    product: 'Laundry Pods',
    href: '/shop/laundry-pods',
    bg: '#DCFCE7',
    accent: '#166534',
    summary: 'Pre-measured detergent pods — no measuring, no mess. Coming soon.',
    steps: [
      { num: 1, title: 'Check the label', body: 'Read the packaging and your garment care labels before washing.' },
      { num: 2, title: 'Place in the drum', body: 'Handle with dry hands. Place as directed on the packaging — not in the dispenser drawer.' },
      { num: 3, title: 'Add clothes & wash', body: 'Add clothes and select an appropriate wash cycle.' },
      { num: 4, title: 'Store safely', body: 'Keep unused pods in their original packaging, securely closed and away from children and pets.' },
    ],
    warning: 'Do not cut or pierce pods. Handle with dry hands. Do not ingest. Keep out of reach of children.',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
