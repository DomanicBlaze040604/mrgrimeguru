'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Mr GrimeGuru! 👋',
    body: 'Your one-stop destination for premium household cleaning in India. Let me show you around.',
    emoji: '🧹',
    action: null,
  },
  {
    id: 'products',
    title: 'Explore our 5 product families',
    body: 'From laundry pods to shoe cleaners — we\'ve got every corner of your home covered.',
    emoji: '🛒',
    action: { label: 'Shop All', href: '/shop' },
  },
  {
    id: 'laundry',
    title: 'Laundry made easy',
    body: 'Our pods and scented beads bring powerful cleaning and long-lasting freshness to every load.',
    emoji: '🫧',
    action: { label: 'See Laundry Range', href: '/shop/laundry-pods' },
  },
  {
    id: 'home',
    title: 'A cleaner home awaits',
    body: 'Floor Cleaner and Kitchen Degreaser tackle the toughest everyday messes with ease.',
    emoji: '🏠',
    action: { label: 'Explore Home Care', href: '/shop/floor-cleaner' },
  },
  {
    id: 'guides',
    title: 'Not sure which product to use?',
    body: 'Read our cleaning guides or use the "Find Your Cleaning Fix" tool for personalised recommendations.',
    emoji: '📖',
    action: { label: 'View Guides', href: '/guides' },
  },
  {
    id: 'ai',
    title: 'Ask me anything!',
    body: 'Our AI assistant can answer product questions, guide your purchase, and give cleaning tips.',
    emoji: '🤖',
    action: null,
  },
]

const TOUR_SEEN_KEY = 'grimeguru_tour_seen_v1'

export function MascotGuide() {
  const [isVisible, setIsVisible] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    // Show mascot after 2s if tour not seen
    const timer = setTimeout(() => {
      const seen = typeof window !== 'undefined' && localStorage.getItem(TOUR_SEEN_KEY)
      if (!seen) setIsVisible(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  function openTour() {
    setIsTourOpen(true)
    setStepIndex(0)
    setIsVisible(false)
  }

  function closeTour() {
    setIsTourOpen(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOUR_SEEN_KEY, '1')
    }
  }

  function nextStep() {
    if (stepIndex < TOUR_STEPS.length - 1) setStepIndex((i) => i + 1)
    else closeTour()
  }

  function prevStep() {
    setStepIndex((i) => Math.max(0, i - 1))
  }

  const currentStep = TOUR_STEPS[stepIndex]
  const isLast = stepIndex === TOUR_STEPS.length - 1

  return (
    <>
      {/* Mascot bubble */}
      <AnimatePresence>
        {isVisible && !isTourOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="fixed bottom-24 left-6 z-30 max-w-[200px]"
          >
            {/* Speech bubble */}
            <div className="bg-white rounded-2xl rounded-bl-none shadow-xl border border-[#E6F5F8] p-4 mb-2">
              <p className="text-xs font-medium text-[#24333A] mb-2">
                👋 New here? Let me give you a quick tour!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={openTour}
                  className="text-xs font-bold text-[#347F99] hover:text-[#24333A] transition-colors"
                >
                  Start Tour
                </button>
                <span className="text-[#D6E8ED]">·</span>
                <button
                  onClick={() => {
                    setIsVisible(false)
                    if (typeof window !== 'undefined') localStorage.setItem(TOUR_SEEN_KEY, '1')
                  }}
                  className="text-xs text-[#75828A] hover:text-[#24333A] transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>

            {/* Mascot character */}
            <motion.button
              onClick={openTour}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl cursor-pointer"
              style={{ backgroundColor: '#9FD8E8' }}
              aria-label="Open brand tour"
            >
              🧹
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour modal */}
      <AnimatePresence>
        {isTourOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#24333A]/50 backdrop-blur-sm"
              onClick={closeTour}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-24 left-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Brand tour"
            >
              {/* Header */}
              <div
                className="px-5 pt-5 pb-4"
                style={{ background: 'linear-gradient(135deg, #E6F5F8 0%, #FAF8F2 100%)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                      style={{ backgroundColor: '#9FD8E8' }}
                    >
                      🧹
                    </div>
                    <p className="text-xs font-bold text-[#347F99] uppercase tracking-wide">
                      GrimeGuru Tour
                    </p>
                  </div>
                  <button
                    onClick={closeTour}
                    className="p-1 rounded-full hover:bg-white/60 transition-colors"
                    aria-label="Close tour"
                  >
                    <X className="h-4 w-4 text-[#24333A]" />
                  </button>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5">
                  {TOUR_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        flex: i === stepIndex ? 2 : 1,
                        backgroundColor: i <= stepIndex ? '#347F99' : '#D6E8ED',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-4xl mb-3">{currentStep.emoji}</div>
                    <h3 className="font-bold text-lg text-[#24333A] mb-2 leading-snug">
                      {currentStep.title}
                    </h3>
                    <p className="text-sm text-[#75828A] leading-relaxed mb-5">
                      {currentStep.body}
                    </p>
                    {currentStep.action && (
                      <Link
                        href={currentStep.action.href}
                        onClick={closeTour}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#347F99] hover:text-[#24333A] transition-colors mb-5"
                      >
                        {currentStep.action.label}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStep}
                    disabled={stepIndex === 0}
                    leftIcon={<ChevronLeft className="h-4 w-4" />}
                  >
                    Back
                  </Button>
                  <span className="text-xs text-[#75828A]">
                    {stepIndex + 1} / {TOUR_STEPS.length}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={nextStep}
                    rightIcon={!isLast ? <ChevronRight className="h-4 w-4" /> : undefined}
                  >
                    {isLast ? 'Start Shopping' : 'Next'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
