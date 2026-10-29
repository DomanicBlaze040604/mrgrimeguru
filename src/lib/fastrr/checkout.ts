import { createHmac } from 'node:crypto'
import { buildCatalog, catalogId, type CatalogRows } from './catalog'

export class CheckoutError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}

export function checkoutConfig(env: Record<string, string | undefined>) {
  const environment = env.FASTRR_ENVIRONMENT
  if (!env.FASTRR_API_KEY || !env.FASTRR_API_SECRET || !['staging', 'production'].includes(environment ?? '')) {
    throw new CheckoutError('Checkout is not available yet. Please contact our support team for help.', 503)
  }
  const origin = new URL(env.FASTRR_PUBLIC_SITE_URL || 'https://www.mrgrimeguru.com')
  if (origin.protocol !== 'https:' || origin.username || origin.password) throw new Error('Invalid Fastrr public site URL')
  const production = environment === 'production'
  return {
    apiKey: env.FASTRR_API_KEY,
    apiSecret: env.FASTRR_API_SECRET,
    apiBase: production ? 'https://checkout-api.shiprocket.com' : 'https://fastrr-api-dev.pickrr.com',
    uiBase: production ? 'https://checkout-ui.shiprocket.com' : 'https://customcheckoutfastrr.netlify.app',
    origin: origin.origin,
  }
}

export function parseCheckoutItems(body: unknown) {
  if (!body || typeof body !== 'object' || !('items' in body) || !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 20) {
    throw new CheckoutError('Please review your cart and try again.')
  }
  const quantities = new Map<string, number>()
  for (const item of body.items) {
    if (!item || typeof item !== 'object' || typeof item.variant_id !== 'string' || !item.variant_id || item.variant_id.length > 100 || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      throw new CheckoutError('Each cart item needs a valid variant and quantity between 1 and 99.')
    }
    const quantity = (quantities.get(item.variant_id) ?? 0) + item.quantity
    if (quantity > 99) throw new CheckoutError('A maximum of 99 units per product can be ordered at once.')
    quantities.set(item.variant_id, quantity)
  }
  return [...quantities].map(([variant_id, quantity]) => ({ variant_id, quantity }))
}

export function buildCheckoutPayload(items: ReturnType<typeof parseCheckoutItems>, rows: CatalogRows, origin: string, now = new Date()) {
  const catalog = buildCatalog(rows, origin)
  return {
    cart_data: {
      items: items.map(item => {
        const id = catalogId('variant', item.variant_id)
        const product = catalog.products.find(p => p.value.variants.some(v => v.id === id))?.value
        const variant = product?.variants.find(v => v.id === id)
        if (!product || !variant) throw new CheckoutError('An item is no longer available. Remove it from your cart and add it again from the shop.', 409)
        if (variant.quantity < item.quantity) throw new CheckoutError(`Not enough stock for ${product.title}. Please reduce the quantity or remove the item.`, 409)
        return {
          variant_id: String(variant.id), quantity: item.quantity,
          // Provider custom-catalog contract; all values come from the server catalog.
          catalog_data: { price: Number(variant.price), name: `${product.title} — ${variant.title}`, image_url: variant.image.src },
        }
      }),
      mobile_app: false,
    },
    redirect_url: new URL('/checkout/return', origin).href,
    timestamp: now.toISOString(),
  }
}

export function signCheckoutBody(body: string, secret: string) {
  return createHmac('sha256', secret).update(body).digest('base64')
}

export async function requestCheckoutToken(payload: ReturnType<typeof buildCheckoutPayload>, config: ReturnType<typeof checkoutConfig>, fetcher: typeof fetch = fetch) {
  const body = JSON.stringify(payload)
  const response = await fetcher(`${config.apiBase}/api/v1/access-token/checkout`, {
    method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': config.apiKey, 'X-Api-HMAC-SHA256': signCheckoutBody(body, config.apiSecret) }, body,
  })
  if (!response.ok) throw new CheckoutError('Checkout is temporarily unavailable. Your cart is saved; please try again shortly.', 502)
  const data = await response.json()
  if (data?.ok !== true || typeof data?.result?.token !== 'string' || !data.result.token || data.result.token.length > 4096) {
    throw new CheckoutError('Unable to start checkout. Please try again shortly.', 502)
  }
  return data.result.token as string
}
