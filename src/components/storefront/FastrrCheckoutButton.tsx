'use client'

import { useRef, useState } from 'react'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/lib/store/cart'
import { CONTACT } from '@/lib/contact'

declare global {
  interface Window {
    HeadlessCheckout?: { addToCart: (event: Event, token: string, options: { fallbackUrl: string; isInitiatedFromApp: boolean }) => void | Promise<void> }
  }
}

let widgetPromise: Promise<void> | undefined
function loadWidget(scriptUrl: string, styleUrl: string) {
  if (window.HeadlessCheckout) return Promise.resolve()
  if (widgetPromise) return widgetPromise
  const allowed = ['https://checkout-ui.shiprocket.com', 'https://customcheckoutfastrr.netlify.app']
  if (!allowed.some(base => scriptUrl === `${base}/assets/js/channels/shopify.js` && styleUrl === `${base}/assets/styles/shopify.css`)) return Promise.reject(new Error('Invalid checkout configuration.'))
  widgetPromise = new Promise<void>((resolve, reject) => {
    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = styleUrl
    const script = document.createElement('script')
    script.src = scriptUrl
    script.async = true
    const fail = () => {
      window.clearTimeout(timer)
      script.remove()
      style.remove()
      widgetPromise = undefined
      reject(new Error('Checkout could not load. Please check your connection and try again.'))
    }
    const timer = window.setTimeout(fail, 15000)
    script.onerror = fail
    script.onload = () => {
      if (!window.HeadlessCheckout) { fail(); return }
      window.clearTimeout(timer)
      resolve()
    }
    document.head.append(style, script)
  })
  return widgetPromise
}

export function FastrrCheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const busy = useRef(false)
  async function checkout(event: React.MouseEvent<HTMLButtonElement>) {
    if (busy.current) return
    busy.current = true
    setLoading(true)
    setError('')
    const nativeEvent = event.nativeEvent
    try {
      const items = useCartStore.getState().items.map(({ variant_id, quantity }) => ({ variant_id, quantity }))
      const response = await fetch('/api/fastrr/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }), signal: AbortSignal.timeout(25000) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Checkout is temporarily unavailable.')
      if (typeof data.token !== 'string' || !data.token) throw new Error('Unable to start checkout.')
      await loadWidget(data.scriptUrl, data.styleUrl)
      await window.HeadlessCheckout!.addToCart(nativeEvent, data.token, { fallbackUrl: `${window.location.origin}/cart?checkout=unavailable`, isInitiatedFromApp: true })
    } catch (error) {
      setError(error instanceof Error && error.name !== 'TimeoutError' ? error.message : 'Checkout took too long to respond. Please try again.')
    } finally {
      busy.current = false
      setLoading(false)
    }
  }
  return <div className="space-y-3">
    <Button variant="primary" size="lg" className="w-full" disabled={loading} onClick={checkout}>{loading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}{loading ? 'Opening checkout…' : 'Proceed to Checkout'}</Button>
    <p className="text-xs text-[#655e51]">Enter your delivery details, apply offers and pay securely with Shiprocket Checkout.</p>
    {error && <div role="alert" className="text-sm text-red-800 bg-red-50 rounded-xl p-3">{error} <a className="underline font-semibold" href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp support</a></div>}
  </div>
}
