'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, Tag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotals,
    discountCode,
    discountAmountPaise,
  } = useCartStore()

  const totals = getTotals()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#171714]/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#fff2be]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#b9460c]" />
                <h2 className="font-bold text-lg text-[#171714]">
                  Your Cart {totals.item_count > 0 && `(${totals.item_count})`}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-[#fff2be] transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 text-[#171714]" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#fff2be' }}
                  >
                    <ShoppingBag className="h-9 w-9 text-[#facc15]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#171714] mb-1">Your cart is empty</p>
                    <p className="text-sm text-[#75828A]">
                      Browse our cleaning products and find your fix
                    </p>
                  </div>
                  <Button variant="primary" size="md" onClick={closeCart} asChild>
                    <Link href="/shop">Shop Products</Link>
                  </Button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4" role="list">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 rounded-xl border border-[#fff2be]"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#fff2be]">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.product_name}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-[#facc15]" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-semibold text-sm text-[#171714] hover:text-[#b9460c] transition-colors line-clamp-1"
                            onClick={closeCart}
                          >
                            {item.product_name}
                          </Link>
                          <p className="text-xs text-[#75828A] mt-0.5">{item.variant_name}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-sm text-[#171714]">
                              {formatPrice(item.price_paise)}
                            </span>
                            {/* Quantity control */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                                className="w-7 h-7 rounded-full border border-[#e5dcc9] flex items-center justify-center hover:bg-[#fff2be] transition-colors"
                                aria-label={`Decrease quantity of ${item.product_name}`}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center" aria-live="polite">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full border border-[#e5dcc9] flex items-center justify-center hover:bg-[#fff2be] transition-colors"
                                aria-label={`Increase quantity of ${item.product_name}`}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="self-start p-1.5 rounded-lg text-[#75828A] hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label={`Remove ${item.product_name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer with totals */}
            {items.length > 0 && (
              <div className="border-t border-[#fff2be] p-5 bg-[#fffbf0]">
                {/* Discount code */}
                {discountCode && (
                  <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <Tag className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">
                      Code &quot;{discountCode}&quot; applied — saving {formatPrice(typeof discountAmountPaise === 'function' ? (discountAmountPaise as any)() : (discountAmountPaise || 0))}
                    </span>
                  </div>
                )}

                {/* Order summary */}
                <div className="flex flex-col gap-2 mb-4 text-sm">
                  <div className="flex justify-between text-[#75828A]">
                    <span>Subtotal</span>
                    <span>{formatPrice(totals.subtotal_paise)}</span>
                  </div>
                  {totals.discount_paise > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>−{formatPrice(totals.discount_paise)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#75828A]">
                    <span>Shipping</span>
                    <span>
                      {totals.shipping_paise === 0 ? (
                        <span className="text-emerald-600 font-medium">Free</span>
                      ) : (
                        formatPrice(totals.shipping_paise)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#75828A]">
                    <span>GST (18%)</span>
                    <span>{formatPrice(totals.tax_paise)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-[#171714] border-t border-[#e5dcc9] pt-2 mt-1">
                    <span>Total</span>
                    <span>{formatPrice(totals.total_paise)}</span>
                  </div>
                </div>

                <Button variant="primary" size="lg" className="w-full mb-2" asChild>
                  <Link href="/checkout" onClick={closeCart}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-[#75828A] hover:text-[#b9460c] transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
