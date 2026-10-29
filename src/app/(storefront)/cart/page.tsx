'use client'

import React, { useEffect, useState } from 'react'
import { FastrrCheckoutButton } from '@/components/storefront/FastrrCheckoutButton'
import Link from 'next/link'
import Image from 'next/image'
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Truck,
  ShieldCheck,
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotalPaise,
  } = useCartStore()

  const [checkoutUnavailable, setCheckoutUnavailable] = useState(false)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('checkout') === 'unavailable') {
      const timer = window.setTimeout(() => setCheckoutUnavailable(true), 0)
      return () => window.clearTimeout(timer)
    }
  }, [])

  const subtotal = subtotalPaise()
  const freeShippingThreshold = 49900
  const isFreeShipping = subtotal >= freeShippingThreshold
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : 4900
  const grandTotal = Math.max(0, subtotal + shippingFee)

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#fffbf0] py-20">
        <div className="max-w-md w-full mx-auto text-center px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#fff2be] flex items-center justify-center text-[#b9460c]">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-[#171714] mb-3">Your Cart is Clean & Empty</h1>
          <p className="text-[#75828A] text-base mb-8">
            Looks like you haven&apos;t added any GrimeGuru essentials yet. Explore our high-performance cleaning collection!
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/shop" className="inline-flex items-center gap-2">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffbf0] py-12">
      <div className="container-wide">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#171714] mb-8">
          Review Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        <ol aria-label="Checkout steps" className="flex flex-wrap gap-6 text-sm mb-6"><li aria-current="step" className="font-bold text-[#b9460c]">1. Review cart</li><li className="text-[#655e51]">2. Secure checkout</li></ol>
        {checkoutUnavailable && <p role="alert" className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4">Checkout is temporarily unavailable. Your cart is saved. Please try again or contact us on WhatsApp.</p>}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress Banner */}
            <div className="p-4 rounded-2xl bg-white border border-[#e5dcc9] shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#171714]">
                <Truck className="w-4 h-4 text-[#b9460c]" />
                {isFreeShipping ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    You unlocked FREE Standard Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#b9460c]">{formatPrice(amountNeededForFreeShipping)}</strong> more to get FREE Shipping
                  </span>
                )}
              </div>
              <div className="w-full bg-[#F2EBE0] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#b9460c] h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-3xl border border-[#e5dcc9] divide-y divide-[#e5dcc9] shadow-sm overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#fffbf0] border border-[#e5dcc9] shrink-0">
                    <Image
                      src={item.image_url || '/images/placeholder.jpg'}
                      alt={item.product_name}
                      sizes="96px"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-bold text-lg text-[#171714] hover:text-[#b9460c] transition-colors"
                    >
                      {item.product_name}
                    </Link>
                    <div className="text-sm font-semibold text-[#b9460c] mt-1">
                      {formatPrice(item.price_paise)}
                    </div>
                  </div>

                  {/* Quantity modifier */}
                  <div className="flex items-center border border-[#e5dcc9] rounded-xl overflow-hidden bg-[#fffbf0]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variant_id, Math.max(1, item.quantity - 1))}
                      className="p-2.5 hover:bg-white text-[#171714] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-[#171714]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                      className="p-2.5 hover:bg-white text-[#171714] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total line item price */}
                  <div className="text-right min-w-[90px]">
                    <div className="font-bold text-base text-[#171714]">
                      {formatPrice(item.price_paise * item.quantity)}
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.variant_id)}
                    className="p-2 text-[#75828A] hover:text-red-500 transition-colors"
                    title="Remove item"
                    aria-label={`Remove ${item.product_name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-[#e5dcc9] p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#171714]">Order Summary</h2>

              <p className="text-sm text-[#655e51]">Review your items here. Add your delivery details and any discount code at checkout.</p>

              {/* Cost breakdown */}
              <div className="border-t border-[#e5dcc9] pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-[#75828A]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#171714]">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-[#75828A]">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-[#171714]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="border-t border-[#e5dcc9] pt-4 flex justify-between items-baseline">
                  <span className="text-base font-bold text-[#171714]">Total Amount</span>
                  <span className="text-2xl font-extrabold text-[#171714]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="text-[11px] text-[#75828A]">Tax included in product prices</p>
              </div>

              <FastrrCheckoutButton />

              {/* Guarantees */}
              <div className="border-t border-[#e5dcc9] pt-4 space-y-2 text-xs text-[#75828A]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#b9460c]" />
                  <span>Secure checkout with Shiprocket</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#b9460c]" />
                  <span>Delivery options confirmed at checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
