'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

// Static product info slides (in real app, fetched from admin-configured data)
const productSlides: Record<string, { title: string; body: string; icon: string }[]> = {
  default: [
    { icon: '✨', title: 'Added to cart!', body: 'Great choice. Your product is ready.' },
    { icon: '🛒', title: 'Ready to checkout?', body: 'Secure payment via UPI, cards, or net banking.' },
  ],
  laundry_pods: [
    { icon: '🫧', title: 'How to use Laundry Pods', body: 'Place 1 pod directly into the drum before adding clothes.' },
    { icon: '♻️', title: 'Eco-friendly formula', body: 'Water-soluble film dissolves completely in both hot and cold water.' },
    { icon: '👕', title: 'Works on all fabrics', body: 'Safe for colors, whites, and delicates in machine wash.' },
  ],
  laundry_beads: [
    { icon: '🌸', title: 'How to use Laundry Beads', body: 'Add beads to the drum before placing clothes. Works with any detergent.' },
    { icon: '⏱️', title: 'Long-lasting freshness', body: 'Fragrance lasts up to 12 weeks in the garment.' },
    { icon: '🧺', title: 'Works in all machines', body: 'Compatible with top-load and front-load washing machines.' },
  ],
  floor_cleaner: [
    { icon: '🏠', title: 'How to use Floor Cleaner', body: 'Dilute 20ml in 1 litre of water and mop as usual.' },
    { icon: '✅', title: 'Safe on most surfaces', body: 'Suitable for marble, tile, vinyl, and sealed hardwood.' },
    { icon: '🍋', title: 'Lemon fresh formula', body: 'Leaves a long-lasting, pleasant fragrance after mopping.' },
  ],
  kitchen_degreaser: [
    { icon: '🍳', title: 'How to use', body: 'Spray directly on greasy surface, wait 30 seconds, then wipe clean.' },
    { icon: '💪', title: 'Cuts through grease', body: 'Effective on cooking oil, food residue, and kitchen grime.' },
    { icon: '⚠️', title: 'Read label before use', body: 'Test on an inconspicuous area first. Not for use on hot surfaces.' },
  ],
  shoe_cleaner: [
    { icon: '👟', title: 'How to use Shoe Cleaner', body: 'Apply to brush or cloth, scrub gently, then wipe clean with damp cloth.' },
    { icon: '🎨', title: 'Multi-material formula', body: 'Suitable for canvas, leather, mesh, and synthetic uppers.' },
    { icon: '✨', title: 'Restores shine', body: 'Removes dirt and stains while preserving material texture.' },
  ],
}

function getSlides(family?: string) {
  if (!family) return productSlides.default
  return productSlides[family] || productSlides.default
}

export function CartInfoPanel() {
  const { isInfoPanelOpen, closeInfoPanel, lastAddedItem, openCart } = useCartStore()
  const [slideIndex, setSlideIndex] = useState(0)

  const slides = getSlides(lastAddedItem?.product_id)

  useEffect(() => {
    if (isInfoPanelOpen) setSlideIndex(0)
  }, [isInfoPanelOpen, lastAddedItem])

  const prev = () => setSlideIndex((i) => Math.max(0, i - 1))
  const next = () => setSlideIndex((i) => Math.min(slides.length - 1, i + 1))

  return (
    <AnimatePresence>
      {isInfoPanelOpen && lastAddedItem && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-50 w-72 bg-white rounded-2xl shadow-xl border border-[#E6F5F8] overflow-hidden"
          role="dialog"
          aria-modal="false"
          aria-label="Product information"
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b border-[#E6F5F8]"
            style={{ backgroundColor: '#E6F5F8' }}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0">
              {lastAddedItem.image_url ? (
                <Image
                  src={lastAddedItem.image_url}
                  alt={lastAddedItem.product_name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#9FD8E8]">
                  <ShoppingCart className="h-4 w-4 text-[#24333A]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#24333A] line-clamp-1">
                {lastAddedItem.product_name}
              </p>
              <p className="text-xs text-[#75828A]">{lastAddedItem.variant_name}</p>
            </div>
            <button
              onClick={closeInfoPanel}
              className="p-1 rounded-full hover:bg-white/80 transition-colors shrink-0"
              aria-label="Close product info"
            >
              <X className="h-4 w-4 text-[#24333A]" />
            </button>
          </div>

          {/* Slide content */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="min-h-[80px]"
              >
                <div className="text-2xl mb-2">{slides[slideIndex].icon}</div>
                <p className="font-semibold text-sm text-[#24333A] mb-1">
                  {slides[slideIndex].title}
                </p>
                <p className="text-xs text-[#75828A] leading-relaxed">
                  {slides[slideIndex].body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {slides.length > 1 && (
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={prev}
                  disabled={slideIndex === 0}
                  className="p-1 rounded-full hover:bg-[#E6F5F8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous tip"
                >
                  <ChevronLeft className="h-4 w-4 text-[#24333A]" />
                </button>
                <div className="flex gap-1.5" aria-label={`Tip ${slideIndex + 1} of ${slides.length}`}>
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{
                        backgroundColor: i === slideIndex ? '#347F99' : '#D6E8ED',
                        width: i === slideIndex ? '16px' : '6px',
                      }}
                      aria-label={`Go to tip ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  disabled={slideIndex === slides.length - 1}
                  className="p-1 rounded-full hover:bg-[#E6F5F8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next tip"
                >
                  <ChevronRight className="h-4 w-4 text-[#24333A]" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 pb-4 flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => {
                closeInfoPanel()
                openCart()
              }}
            >
              View Cart
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-xs"
              onClick={closeInfoPanel}
            >
              Continue
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
