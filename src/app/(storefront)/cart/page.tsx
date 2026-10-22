'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotalPaise,
    discountCode,
    discountAmountPaise,
    applyDiscount,
    removeDiscount,
  } = useCartStore()

  const [promoInput, setPromoInput] = useState('')
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)

  const subtotal = typeof subtotalPaise === 'function' ? subtotalPaise() : (subtotalPaise || 0)
  const discount = typeof discountAmountPaise === 'function' ? (discountAmountPaise as any)() : (discountAmountPaise || 0)
  const freeShippingThreshold = 49900
  const isFreeShipping = subtotal >= freeShippingThreshold
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : 4900
  const grandTotal = Math.max(0, subtotal - discount + shippingFee)

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return

    setIsValidatingPromo(true)
    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoInput.trim().toUpperCase(),
          subtotal_paise: subtotal,
        }),
      })

      const data = await res.json()
      if (res.ok && data.valid) {
        applyDiscount(data.discount.code, data.discount.calculated_discount_paise)
        toast({
          title: 'Coupon Applied!',
          description: `You saved ${formatPrice(data.discount.calculated_discount_paise)} with code ${data.discount.code}`,
        })
        setPromoInput('')
      } else {
        toast({
          title: 'Invalid Coupon',
          description: data.error || 'This code is invalid or has expired',
          variant: 'error',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to validate discount code',
        variant: 'error',
      })
    } finally {
      setIsValidatingPromo(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F2] py-20">
        <div className="max-w-md w-full mx-auto text-center px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#E6F5F8] flex items-center justify-center text-[#347F99]">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-[#24333A] mb-3">Your Cart is Clean & Empty</h1>
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
    <div className="min-h-screen bg-[#FAF8F2] py-12">
      <div className="container-wide">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#24333A] mb-8">
          Your Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Progress Banner */}
            <div className="p-4 rounded-2xl bg-white border border-[#D6E8ED] shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#24333A]">
                <Truck className="w-4 h-4 text-[#347F99]" />
                {isFreeShipping ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    You unlocked FREE Standard Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#347F99]">{formatPrice(amountNeededForFreeShipping)}</strong> more to get FREE Shipping
                  </span>
                )}
              </div>
              <div className="w-full bg-[#F2EBE0] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#347F99] h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-3xl border border-[#D6E8ED] divide-y divide-[#D6E8ED] shadow-sm overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#FAF8F2] border border-[#D6E8ED] shrink-0">
                    <Image
src={item.image_url || '/images/placeholder.jpg'}
alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-bold text-lg text-[#24333A] hover:text-[#347F99] transition-colors"
                    >
                      {item.product_name}
                    </Link>
                    <div className="text-sm font-semibold text-[#347F99] mt-1">
                      {formatPrice(item.price_paise)}
                    </div>
                  </div>

                  {/* Quantity modifier */}
                  <div className="flex items-center border border-[#D6E8ED] rounded-xl overflow-hidden bg-[#FAF8F2]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variant_id, Math.max(1, item.quantity - 1))}
                      className="p-2.5 hover:bg-white text-[#24333A] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-[#24333A]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                      className="p-2.5 hover:bg-white text-[#24333A] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total line item price */}
                  <div className="text-right min-w-[90px]">
                    <div className="font-bold text-base text-[#24333A]">
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

            {/* Quick add recommendation */}
            <div className="p-4 rounded-2xl bg-[#E6F5F8]/50 border border-[#9FD8E8]/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#347F99]" />
                <div>
                  <div className="text-sm font-bold text-[#24333A]">Need a Microfiber Cloth?</div>
                  <div className="text-xs text-[#75828A]">Ultra-plush lint-free drying cloth for just ₹99</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  useCartStore.getState().addItem({
                    product_id: 'addon_microfiber',
                    variant_id: 'addon_microfiber',
                    product_name: 'Mr GrimeGuru Microfiber Cloth (2-Pack)',
                    variant_name: 'Standard',
                    slug: 'microfiber-cloth',
                    price_paise: 9900,
                    image_url: '/images/products/shoe-cleaner.jpg',
                    quantity: 1,
                  })
                  toast({ title: 'Added Cloth Pack to cart!' })
                }}
              >
                + Add for ₹99
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-[#D6E8ED] p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[#24333A]">Order Summary</h2>

              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="block text-xs font-bold text-[#24333A] uppercase tracking-wider">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. CLEAN10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-[#D6E8ED] rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#9FD8E8]"
                  />
                  <button
                    type="submit"
                    disabled={isValidatingPromo}
                    className="px-4 py-2 bg-[#24333A] text-white rounded-xl text-xs font-bold hover:bg-[#347F99] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {discountCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg mt-2">
                    <span className="flex items-center gap-1 font-semibold">
                      <Tag className="w-3.5 h-3.5" /> {discountCode} Applied (-{formatPrice(discount)})
                    </span>
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Cost breakdown */}
              <div className="border-t border-[#D6E8ED] pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-[#75828A]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#24333A]">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#75828A]">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-[#24333A]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="border-t border-[#D6E8ED] pt-4 flex justify-between items-baseline">
                  <span className="text-base font-bold text-[#24333A]">Total Amount</span>
                  <span className="text-2xl font-extrabold text-[#24333A]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="text-[11px] text-[#75828A]">Tax included in product prices</p>
              </div>

              {/* Proceed to checkout button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full text-base shadow-md hover:shadow-lg"
                asChild
              >
                <Link href="/checkout" className="flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              {/* Guarantees */}
              <div className="border-t border-[#D6E8ED] pt-4 space-y-2 text-xs text-[#75828A]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#347F99]" />
                  <span>256-bit encrypted secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#347F99]" />
                  <span>Delivered via Bluedart, Delhivery & DTDC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
