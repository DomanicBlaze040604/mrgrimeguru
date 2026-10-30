'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock3, LoaderCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { CONTACT } from '@/lib/contact'
import { formatPrice } from '@/lib/utils'

interface Result { state: 'pending' | 'failed' | 'confirmed'; reference?: string; totalPaise?: number; paymentStatus?: string; paymentType?: string; items?: { variant_id: string; quantity: number }[] }

export function CheckoutResult({ orderId }: { orderId: string }) {
  const [result, setResult] = useState<Result>({ state: 'pending' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const reconciled = useRef(false)
  const check = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    try {
      const response = await fetch('/api/fastrr/status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }), signal })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'We could not verify your order yet.')
      setResult(data)
      setError('')
      if (data.state === 'confirmed' && !reconciled.current) {
        reconciled.current = true
        // Remove only purchased quantities, once; preserve later cart additions.
        const marker = `fastrr-confirmed-${orderId}`
        if (!localStorage.getItem(marker)) {
          localStorage.setItem(marker, '1')
          const cart = useCartStore.getState()
          for (const bought of (data.items ?? []) as NonNullable<Result['items']>) {
            const item = cart.items.find(i => i.variant_id === bought.variant_id)
            if (item) cart.updateQuantity(item.id, Math.max(0, item.quantity - bought.quantity))
          }
          cart.closeCart()
        }
      }
      return data.state as Result['state']
    } catch (caught) {
      if (!signal?.aborted) setError(caught instanceof Error ? caught.message : 'Please check your order again shortly.')
    } finally { if (!signal?.aborted) setLoading(false) }
  }, [orderId])

  useEffect(() => {
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout>
    let attempts = 0
    async function poll() {
      const state = await check(controller.signal)
      if (!controller.signal.aborted && state === 'pending' && ++attempts < 8) timer = setTimeout(poll, 4000)
    }
    void poll()
    return () => { controller.abort(); clearTimeout(timer) }
  }, [check])

  const confirmed = result.state === 'confirmed'
  const paid = result.paymentStatus === 'paid'
  return <section className="container-wide py-12 sm:py-20 max-w-3xl">
    <div className="rounded-3xl border-2 border-[#171714] bg-[#fffbee] p-7 sm:p-12 shadow-[6px_6px_0_#ff7518] space-y-7">
      <span className="guru-eyebrow">YOUR GRIME GURU ORDER</span>
      {confirmed ? <CheckCircle2 className="h-14 w-14 text-green-700" /> : loading ? <LoaderCircle className="h-12 w-12 animate-spin text-orange-600" /> : <Clock3 className="h-12 w-12 text-orange-600" />}
      <h1 className="text-4xl sm:text-5xl font-bold">{confirmed ? 'Grime out. Good times ahead.' : result.state === 'failed' ? 'Checkout wasn’t completed.' : 'Let’s confirm your order.'}</h1>
      <p className="text-lg text-[#655e51]" role="status">{confirmed ? paid ? 'Your payment is confirmed and your order is placed. Keep your reference handy for delivery enquiries.' : 'Your order is confirmed. Pay on delivery when your cleaners arrive.' : result.state === 'failed' ? 'Your cart is saved. You can return to checkout when you’re ready.' : 'We’re checking directly with Fastrr. If money was debited, please don’t pay again while confirmation is pending.'}</p>
      {confirmed && <dl className="space-y-3 border-y border-[#ded5c2] py-6"><div className="break-all"><dt className="font-semibold">Order reference</dt><dd>{result.reference}</dd></div><div><dt className="font-semibold">{paid ? 'Total paid' : 'Pay on delivery'}</dt><dd className="text-2xl font-bold">{formatPrice(result.totalPaise ?? 0)}</dd></div></dl>}
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <div className="flex flex-wrap gap-4">
        <Link className="guru-button" href="/">Back to home</Link>
        {!confirmed && <button className="guru-button guru-button-light" disabled={loading} onClick={() => void check()}>Check order status</button>}
        {!confirmed && <Link className="guru-button guru-button-light" href="/cart">Return to cart</Link>}
        <a className="self-center font-semibold underline" href={CONTACT.whatsappUrl}>Contact Grime Guru</a>
      </div>
    </div>
  </section>
}
