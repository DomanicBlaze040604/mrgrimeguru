'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, MessageSquare, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const PLACEHOLDER_REVIEWS = [
  {
    id: '1',
    author: 'Priya S.',
    location: 'Mumbai',
    rating: 5,
    title: 'Finally, laundry pods that work in India!',
    body: 'I was sceptical at first, but these pods dissolve completely even in cold water. My clothes come out smelling great and the stains are gone. Will definitely repurchase!',
    product: 'Laundry Pods',
    is_verified: true,
    helpful_count: 24,
    date: '2026-10-12',
    avatar: 'P',
  },
  {
    id: '2',
    author: 'Rajan M.',
    location: 'Bengaluru',
    rating: 5,
    title: 'Lavender Dreams is my new obsession',
    body: 'The scent lasts for days, not just while the clothes are wet. My wife noticed immediately and now we\'ve ordered all four variants. Ocean Breeze is also lovely.',
    product: 'Scented Laundry Beads',
    is_verified: true,
    helpful_count: 18,
    date: '2026-10-08',
    avatar: 'R',
  },
  {
    id: '3',
    author: 'Ananya K.',
    location: 'Delhi',
    rating: 4,
    title: 'Good floor cleaner, nice fragrance',
    body: 'The floor cleaner leaves my marble floors spotless and smelling fresh. I dilute a bit more than suggested and it still works. Delivery was quick too.',
    product: 'Floor Cleaner',
    is_verified: true,
    helpful_count: 11,
    date: '2026-09-29',
    avatar: 'A',
  },
]

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of ${max} stars`} role="img">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4"
          fill={i < rating ? '#F59E0B' : 'none'}
          color={i < rating ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
    </div>
  )
}

export function ReviewsSection() {
  const [showForm, setShowForm] = useState(false)

  const avgRating =
    PLACEHOLDER_REVIEWS.reduce((s, r) => s + r.rating, 0) / PLACEHOLDER_REVIEWS.length

  return (
    <section
      className="section-gap"
      style={{ backgroundColor: '#FAF8F2' }}
      aria-label="Customer reviews"
    >
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-caption mb-2" style={{ color: '#347F99' }}>
              Real Customers
            </p>
            <h2 className="text-headline" style={{ color: '#24333A' }}>
              What People Are Saying
            </h2>
            {/* Average rating */}
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl font-bold text-[#24333A]">{avgRating.toFixed(1)}</span>
              <div>
                <StarRating rating={Math.round(avgRating)} />
                <p className="text-xs text-[#75828A] mt-0.5">
                  Based on {PLACEHOLDER_REVIEWS.length} reviews
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<MessageSquare className="h-4 w-4" />}
            onClick={() => setShowForm(true)}
          >
            Leave a Review
          </Button>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {PLACEHOLDER_REVIEWS.map((review) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#E6F5F8] flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: '#347F99' }}
                    aria-hidden="true"
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#24333A]">{review.author}</p>
                    <p className="text-xs text-[#75828A]">{review.location}</p>
                  </div>
                </div>
                {review.is_verified && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                    ✓ Verified
                  </span>
                )}
              </div>

              <StarRating rating={review.rating} />

              <div>
                <p className="font-semibold text-sm text-[#24333A] mb-1">{review.title}</p>
                <p className="text-sm text-[#75828A] leading-relaxed">{review.body}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E6F5F8] mt-auto">
                <span className="text-xs text-[#75828A]">
                  for{' '}
                  <span className="font-medium text-[#347F99]">{review.product}</span>
                </span>
                <button className="flex items-center gap-1 text-xs text-[#75828A] hover:text-[#24333A] transition-colors">
                  <ThumbsUp className="h-3 w-3" />
                  {review.helpful_count}
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Review form placeholder */}
        {showForm && (
          <div className="bg-white rounded-3xl p-8 border border-[#E6F5F8] shadow-sm max-w-lg mx-auto">
            <h3 className="font-bold text-xl text-[#24333A] mb-5">Leave a Review</h3>
            <p className="text-sm text-[#75828A] mb-6">
              Your review will be visible after moderation. Only verified purchases receive the ✓ badge.
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#24333A] mb-1" htmlFor="r-name">
                  Your name
                </label>
                <input
                  id="r-name"
                  type="text"
                  placeholder="e.g. Priya S."
                  className="w-full rounded-xl border border-[#D6E8ED] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#24333A] mb-1" htmlFor="r-product">
                  Product
                </label>
                <select
                  id="r-product"
                  className="w-full rounded-xl border border-[#D6E8ED] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8]"
                >
                  <option>Laundry Pods</option>
                  <option>Scented Laundry Beads</option>
                  <option>Floor Cleaner</option>
                  <option>Kitchen Degreaser</option>
                  <option>Shoe Cleaner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#24333A] mb-1" htmlFor="r-review">
                  Your review
                </label>
                <textarea
                  id="r-review"
                  rows={4}
                  placeholder="Tell us about your experience..."
                  className="w-full rounded-xl border border-[#D6E8ED] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8] resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="primary" size="md" className="flex-1">
                  Submit Review
                </Button>
                <Button variant="ghost" size="md" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
