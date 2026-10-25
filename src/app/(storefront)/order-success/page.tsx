'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Truck, ArrowRight, Home, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order_number') || `GG-${Math.floor(100000 + Math.random() * 900000)}`
  const total = searchParams.get('total') ? parseInt(searchParams.get('total')!, 10) : 0

  const deliveryDate = new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-[#fffbf0]">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-[#e5dcc9] p-8 sm:p-10 shadow-lg text-center">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff2be] text-[#b9460c] mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
        </span>

        <h1 className="text-3xl font-bold text-[#171714] mb-2">Thank You For Your Order!</h1>
        <p className="text-[#75828A] text-sm mb-6">
          Your cleaning upgrade is officially in motion. We have dispatched a confirmation email and WhatsApp alert.
        </p>

        {/* Order Info Card */}
        <div className="p-5 rounded-2xl bg-[#fffbf0] border border-[#e5dcc9] mb-8 text-left space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#75828A]">Order Reference</span>
            <span className="font-mono font-bold text-[#171714] text-base">{orderNumber}</span>
          </div>

          {total > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#75828A]">Total Paid</span>
              <span className="font-bold text-[#171714]">{formatPrice(total)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm pt-2 border-t border-[#e5dcc9]">
            <span className="text-[#75828A] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#b9460c]" /> Estimated Delivery
            </span>
            <span className="font-bold text-[#b9460c]">{deliveryDate}</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-4 mb-8 text-left">
          <h3 className="text-xs font-bold text-[#171714] uppercase tracking-wider">
            What Happens Next?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#75828A]">
            <div className="p-3 rounded-xl border border-[#e5dcc9] bg-white">
              <Package className="w-4 h-4 text-[#b9460c] mb-1" />
              <strong className="block text-[#171714] mb-0.5">Order Fulfillment</strong>
              Our team packages your bottles in eco-friendly protective shock boxes within 12 hours.
            </div>
            <div className="p-3 rounded-xl border border-[#e5dcc9] bg-white">
              <Truck className="w-4 h-4 text-[#b9460c] mb-1" />
              <strong className="block text-[#171714] mb-0.5">Live Courier Tracking</strong>
              You will receive an SMS and WhatsApp tracking link as soon as your parcel ships.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="lg" className="flex-1" asChild>
            <Link href="/" className="inline-flex items-center justify-center gap-2">
              <Home className="w-4 h-4" /> Return to Home
            </Link>
          </Button>
          <Button variant="primary" size="lg" className="flex-1" asChild>
            <Link href="/shop" className="inline-flex items-center justify-center gap-2">
              Keep Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
