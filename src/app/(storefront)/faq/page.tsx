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
  // Products
  {
    category: 'Products',
    q: 'What products does Mr GrimeGuru sell?',
    a: 'We currently offer four product categories: Shoe Cleaner, Multipurpose Cleaner, Kitchen Cleaner, and Laundry Pods.',
  },
  {
    category: 'Products',
    q: 'How do I choose the right product?',
    a: 'Choose according to the cleaning task. Use Shoe Cleaner for compatible footwear, Multipurpose Cleaner for approved household surfaces, Kitchen Cleaner for compatible kitchen surfaces, and Laundry Pods for washing clothes as directed.',
  },
  {
    category: 'Products',
    q: 'How do I use your products?',
    a: 'Follow the specific instructions printed on the product packaging. Quantities, application methods, contact times, and rinsing requirements may vary between products.',
  },
  {
    category: 'Products',
    q: 'Can I use Multipurpose Cleaner on every surface?',
    a: 'Not necessarily. Always check the label for approved surfaces and material compatibility. Test a small, inconspicuous area first where recommended.',
  },
  {
    category: 'Products',
    q: 'Are the products safe around children and pets?',
    a: 'Always follow the precautions printed on the packaging. Store cleaning products securely and keep them out of reach of children and pets.',
  },
  // Orders & Payments
  {
    category: 'Orders & Payments',
    q: 'How do I place an order?',
    a: 'Choose a product, select the available variant if applicable, add it to your cart, and complete checkout.',
  },
  {
    category: 'Orders & Payments',
    q: 'Which payment methods do you accept?',
    a: 'The payment methods available for your order are displayed at checkout. Availability depends on the payment options enabled on our website.',
  },
  {
    category: 'Orders & Payments',
    q: 'Can I cancel or change my order?',
    a: 'Contact customer support as soon as possible. Changes and cancellations depend on the order\'s fulfilment status and the applicable policy.',
  },
  // Shipping
  {
    category: 'Shipping',
    q: 'Where do you deliver?',
    a: 'Delivery is available to locations supported by our shipping partners. Enter your PIN code at checkout to check serviceability.',
  },
  {
    category: 'Shipping',
    q: 'How can I track my order?',
    a: 'Use the tracking link or shipment updates provided after dispatch. If you need assistance, contact customer support with your order number.',
  },
  {
    category: 'Shipping',
    q: 'What if my order arrives damaged?',
    a: 'Contact customer support with your order number and photographs of the affected product and packaging. Your request will be reviewed under the applicable return and refund policy.',
  },
  // Returns & Refunds
  {
    category: 'Returns & Refunds',
    q: 'Can I return a product?',
    a: 'Returns are handled according to our published Return, Refund and Cancellation Policy and applicable law.',
  },
  {
    category: 'Returns & Refunds',
    q: 'What if I receive the wrong product?',
    a: 'Contact support with your order number and photographs where available. We will review the issue and explain the available resolution.',
  },
  // Safety
  {
    category: 'Safety',
    q: 'Can I mix two cleaners together?',
    a: 'Do not mix cleaning products unless the manufacturer explicitly instructs you to do so.',
  },
  {
    category: 'Safety',
    q: 'What should I do if a product gets into my eyes?',
    a: 'Follow the product\'s first-aid instructions printed on the packaging and seek medical advice when appropriate.',
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const categories = ['All', 'Products', 'Orders & Payments', 'Shipping', 'Returns & Refunds', 'Safety']

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
            Frequently Asked Questions
          </h1>
          <p className="text-[#75828A] text-base sm:text-lg max-w-xl mx-auto">
            Questions about our products, orders, shipping, or safety? Find your answers here.
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
