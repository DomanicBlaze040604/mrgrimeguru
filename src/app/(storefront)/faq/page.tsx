'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, HelpCircle, MessageCircle, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface FAQItem {
  q: string
  a: string
  category: string
}

const FAQS: FAQItem[] = [
  {
    category: 'Products & Ingredients',
    q: 'Do Mr GrimeGuru Laundry Pods work in cold water washes?',
    a: 'Yes, 100%. Our triple-chamber PVA membrane is engineered to dissolve completely within 30 seconds even in 15°C cold tap water, leaving behind zero gummy film or white powder residue on dark garments.',
  },
  {
    category: 'Products & Ingredients',
    q: 'Are your floor cleaners safe for crawling babies and pets?',
    a: 'Absolutely. We formulate our Botanical Floor Cleaner without harsh chlorine, parabens, or toxic phthalates. It uses natural neem and citrus extracts with a neutral pH, ensuring your pets paws and baby skin remain completely irritation-free.',
  },
  {
    category: 'Products & Ingredients',
    q: 'Can the Kitchen Degreaser be used on marble countertops and brass burners?',
    a: 'The Kitchen Degreaser is safe for stainless steel, vitreous enamel, ceramic tiles, and engineered quartz. For natural porous stones (like unsealed Italian marble) and raw brass, we recommend testing a small inconspicuous patch first or rinsing immediately after 30 seconds.',
  },
  {
    category: 'Shipping & Delivery',
    q: 'How long does delivery take across India?',
    a: 'Orders are dispatched within 12 hours from our fulfillment hubs in Mumbai, Delhi, and Bengaluru. Metro deliveries arrive in 1 to 3 business days, while non-metro and tier 2/3 cities typically arrive in 3 to 5 business days.',
  },
  {
    category: 'Shipping & Delivery',
    q: 'Is there a free shipping threshold?',
    a: 'Yes! All orders above ₹499 qualify for Free Standard Delivery across India. For orders below ₹499, a nominal flat shipping fee of ₹49 is applied.',
  },
  {
    category: 'Shipping & Delivery',
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'Yes, Cash on Delivery is available for all pin codes serviced by our courier partners with a small ₹39 handling charge.',
  },
  {
    category: 'Usage & Safety',
    q: 'How many Laundry Pods should I use per wash cycle?',
    a: 'For regular daily loads up to 6kg, 1 pod is sufficient. For heavy or soiled loads (like monsoon mud, curry stains, or bed linens) over 7kg, use 2 pods placed directly at the bottom or back of the washing drum before adding clothes.',
  },
  {
    category: 'Usage & Safety',
    q: 'Where should I add the Laundry Scent Beads in my washing machine?',
    a: 'Toss a capful of beads directly into the drum with your clothes! Do NOT put beads in the detergent or liquid fabric softener dispenser drawer, as they require direct water flow in the drum to dissolve and fuse their fragrance capsules.',
  },
  {
    category: 'Returns & Refunds',
    q: 'What is your Clean Guarantee return policy?',
    a: 'If you are unsatisfied with your cleaning performance or if your bottles arrive damaged or leaking, contact us within 7 days of delivery. We will issue a free replacement or full refund with no hassle.',
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const categories = ['All', 'Products & Ingredients', 'Shipping & Delivery', 'Usage & Safety', 'Returns & Refunds']

  const filteredFaqs = activeCategory === 'All'
    ? FAQS
    : FAQS.filter((f) => f.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-16">
      <div className="container-wide max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F5F8] text-[#347F99] mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#24333A] tracking-tight mb-4">
            Everything You Need to Know
          </h1>
          <p className="text-[#75828A] text-base sm:text-lg max-w-xl mx-auto">
            Got questions about our formulations, usage methods, or shipping? We have got you covered.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setOpenIndex(null)
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#24333A] text-white shadow-sm'
                  : 'bg-white text-[#75828A] border border-[#D6E8ED] hover:text-[#24333A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 mb-16">
          {filteredFaqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#D6E8ED] overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-[#24333A] hover:bg-[#FAF8F2]/50 gap-4"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#347F99] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#75828A] leading-relaxed border-t border-[#D6E8ED]/40 bg-[#FAF8F2]/30">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Help Banner */}
        <div className="p-8 rounded-3xl bg-[#E6F5F8] border border-[#9FD8E8] text-center space-y-4">
          <Sparkles className="w-8 h-8 text-[#347F99] mx-auto" />
          <h3 className="text-2xl font-bold text-[#24333A]">Still Need Assistance?</h3>
          <p className="text-sm text-[#75828A] max-w-md mx-auto">
            Our AI cleaning assistant is ready 24/7 in the bottom-right corner, or you can speak with our human customer care team.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button variant="primary" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> Contact Us
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const chatBtn = document.querySelector('button[aria-label="Ask Mr GrimeGuru"]') as HTMLButtonElement
                if (chatBtn) chatBtn.click()
              }}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Ask GrimeGuru AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
