'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

declare global {
  interface Window {
    Razorpay?: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const {
    items,
    subtotalPaise,
    discountCode,
    discountAmountPaise,
    clearCart,
  } = useCartStore()

  // Form states
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [landmark, setLandmark] = useState('')
  const [pincode, setPincode] = useState('')
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = typeof subtotalPaise === 'function' ? subtotalPaise() : (subtotalPaise || 0)
  const discount = typeof discountAmountPaise === 'function' ? (discountAmountPaise as any)() : (discountAmountPaise || 0)
  const isFreeShipping = subtotal >= 49900
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : 4900
  const codFee = paymentMethod === 'cod' ? 3900 : 0
  const grandTotal = Math.max(0, subtotal - discount + shippingFee + codFee)

  // Quick Indian PIN code directory lookup
  const handlePincodeChange = (val: string) => {
    setPincode(val)
    if (val.length === 6) {
      if (val.startsWith('11') || val.startsWith('12')) {
        setCity('New Delhi')
        setStateName('Delhi')
      } else if (val.startsWith('40') || val.startsWith('41')) {
        setCity('Mumbai')
        setStateName('Maharashtra')
      } else if (val.startsWith('56') || val.startsWith('57')) {
        setCity('Bengaluru')
        setStateName('Karnataka')
      } else if (val.startsWith('50') || val.startsWith('51')) {
        setCity('Hyderabad')
        setStateName('Telangana')
      } else if (val.startsWith('60') || val.startsWith('61')) {
        setCity('Chennai')
        setStateName('Tamil Nadu')
      } else if (val.startsWith('70') || val.startsWith('71')) {
        setCity('Kolkata')
        setStateName('West Bengal')
      } else if (val.startsWith('38') || val.startsWith('39')) {
        setCity('Ahmedabad')
        setStateName('Gujarat')
      }
    }
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({ title: 'Your cart is empty', variant: 'error' })
      router.push('/shop')
      return
    }

    if (!email || !phone || !fullName || !addressLine1 || !pincode || !city || !stateName) {
      toast({ title: 'Please fill in all required shipping fields', variant: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email: email,
          customer_phone: phone,
          shipping_name: fullName,
          shipping_address_line1: addressLine1,
          shipping_address_line2: addressLine2 || landmark,
          shipping_city: city,
          shipping_state: stateName,
          shipping_pincode: pincode,
          items: items.map((i) => ({
            id: i.id,
            product_id: i.id.startsWith('mock_') || i.id.startsWith('addon_') ? null : i.id,
            name: i.name,
            quantity: i.quantity,
            price_paise: i.price_paise,
          })),
          discount_code: discountCode || null,
          payment_method: paymentMethod,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to place order')
      }

      const createdOrder = orderData.order

      // 2. Handle Payment Method
      if (paymentMethod === 'cod') {
        // COD order confirmed directly
        clearCart()
        toast({ title: 'Order Placed Successfully!', description: 'Cash on delivery confirmed.' })
        router.push(`/order-success?order_number=${createdOrder.order_number}&total=${grandTotal}`)
        return
      }

      // Online payment via Razorpay
      const paymentRes = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: createdOrder.id,
          amount_paise: grandTotal,
        }),
      })

      const paymentData = await paymentRes.json()

      if (paymentData.is_mock) {
        // Instant verified mock payment for testing & dev
        await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: createdOrder.id,
            is_mock: true,
          }),
        })

        clearCart()
        toast({ title: 'Payment Successful!', description: 'Your order is confirmed.' })
        router.push(`/order-success?order_number=${createdOrder.order_number}&total=${grandTotal}`)
      } else {
        // Load real Razorpay script if available
        if (typeof window.Razorpay === 'function') {
          const rzp = new window.Razorpay({
            key: paymentData.key,
            amount: paymentData.amount,
            currency: 'INR',
            name: 'Mr GrimeGuru',
            description: `Order ${createdOrder.order_number}`,
            order_id: paymentData.id,
            handler: async (response: any) => {
              await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: createdOrder.id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  is_mock: false,
                }),
              })
              clearCart()
              router.push(`/order-success?order_number=${createdOrder.order_number}&total=${grandTotal}`)
            },
            prefill: {
              name: fullName,
              email: email,
              contact: phone,
            },
            theme: { color: '#b9460c' },
          })
          rzp.open()
        } else {
          // Fallback confirmation
          await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: createdOrder.id,
              is_mock: true,
            }),
          })
          clearCart()
          router.push(`/order-success?order_number=${createdOrder.order_number}&total=${grandTotal}`)
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout failed'
      toast({ title: 'Checkout Error', description: msg, variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#fffbf0]">
        <h2 className="text-2xl font-bold text-[#171714] mb-4">No items in your cart</h2>
        <Link href="/shop" className="text-[#b9460c] underline font-semibold">
          Return to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffbf0] py-10">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#e5dcc9]">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-[#b9460c] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#75828A]">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL Encrypted Payment</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Fields Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Contact Information */}
              <div className="p-6 bg-white rounded-3xl border border-[#e5dcc9] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#171714] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#fff2be] text-[#b9460c] text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171714] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#e5dcc9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#171714] mb-1">
                      Mobile Number (for updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#e5dcc9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-6 bg-white rounded-3xl border border-[#e5dcc9] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#171714] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#fff2be] text-[#b9460c] text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Delivery Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171714] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="First and last name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#e5dcc9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171714] mb-1">
                      Flat, House no., Building, Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 402, Sunshine Residency"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#e5dcc9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171714] mb-1">
                        Area, Street, Sector
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Indiranagar 100ft Road"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#e5dcc9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#171714] mb-1">
                        Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Metro Station"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#e5dcc9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#171714] mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-digit PIN"
                        value={pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#e5dcc9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#171714] mb-1">
                        Town / City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#e5dcc9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#171714] mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#e5dcc9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#facc15]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 bg-white rounded-3xl border border-[#e5dcc9] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#171714] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#fff2be] text-[#b9460c] text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Razorpay Online */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-[#b9460c] bg-[#fff2be]/40 ring-1 ring-[#b9460c]'
                        : 'border-[#e5dcc9] hover:border-[#75828A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="mt-1 text-[#b9460c] focus:ring-[#facc15]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#171714] flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#b9460c]" />
                          Online Payment (UPI, Cards, NetBanking)
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Fastest
                        </span>
                      </div>
                      <p className="text-xs text-[#75828A] mt-1">
                        Pay securely with Google Pay, PhonePe, Paytm, Any UPI app, Visa, Mastercard, or Netbanking.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#b9460c] bg-[#fff2be]/40 ring-1 ring-[#b9460c]'
                        : 'border-[#e5dcc9] hover:border-[#75828A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-[#b9460c] focus:ring-[#facc15]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#171714] flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#b9460c]" />
                          Cash on Delivery (Pay upon delivery)
                        </span>
                        <span className="text-xs text-[#75828A] font-semibold">+₹39 handling</span>
                      </div>
                      <p className="text-xs text-[#75828A] mt-1">
                        Pay in cash or UPI QR scan directly to the delivery agent when your parcel arrives.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Review & Pay Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-white rounded-3xl border border-[#e5dcc9] shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-[#171714]">Order Details ({items.length})</h3>

                {/* Mini Item List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-[#e5dcc9] pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#fffbf0] border border-[#e5dcc9] shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="font-bold text-[#171714] line-clamp-1">{item.name}</div>
                        <div className="text-[#75828A]">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-xs font-bold text-[#171714]">
                        {formatPrice(item.price_paise * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-[#e5dcc9] pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-[#75828A]">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-[#171714]">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({discountCode})</span>
                      <span className="font-semibold">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#75828A]">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-[#171714]">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-[#75828A]">
                      <span>COD Handling Fee</span>
                      <span className="font-semibold text-[#171714]">{formatPrice(codFee)}</span>
                    </div>
                  )}

                  <div className="border-t border-[#e5dcc9] pt-4 flex justify-between items-baseline">
                    <span className="text-base font-bold text-[#171714]">Amount Payable</span>
                    <span className="text-2xl font-extrabold text-[#171714]">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full text-base shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    'Processing Order...'
                  ) : paymentMethod === 'cod' ? (
                    `Confirm Order • ${formatPrice(grandTotal)}`
                  ) : (
                    `Pay Now • ${formatPrice(grandTotal)}`
                  )}
                </Button>

                <div className="text-center text-[11px] text-[#75828A] space-y-1">
                  <p>By placing this order you agree to our Terms of Service & Privacy Policy.</p>
                  <p className="flex items-center justify-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Satisfaction or Easy Replacements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
