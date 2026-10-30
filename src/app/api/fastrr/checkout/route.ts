import { loadCatalog } from '@/lib/fastrr/handler'
import { buildCheckoutPayload, checkoutConfig, CheckoutError, parseCheckoutItems, requestCheckoutToken } from '@/lib/fastrr/checkout'
import { cookies } from 'next/headers'
import { checkoutSnapshot, saveCheckoutSnapshot } from '@/lib/fastrr/orders'
import { signGuestOrder } from '@/lib/fastrr/session'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  try {
    if (request.headers.get('origin') !== new URL(request.url).origin) throw new CheckoutError('Please start checkout from your cart on this website.', 403)
    if (!request.headers.get('content-type')?.includes('application/json')) throw new CheckoutError('Expected a JSON cart.', 415)
    const config = checkoutConfig(process.env)
    const text = await request.text()
    if (text.length > 16000) throw new CheckoutError('Cart request is too large.', 413)
    let body: unknown
    try { body = JSON.parse(text) } catch { throw new CheckoutError('Invalid cart request.') }
    const items = parseCheckoutItems(body)
    const rows = await loadCatalog()
    const payload = buildCheckoutPayload(items, rows, config.origin)
    const { token, orderId } = await requestCheckoutToken(payload, config)
    await saveCheckoutSnapshot(orderId, checkoutSnapshot(items, rows, config.origin))
    const cookieStore = await cookies()
    cookieStore.set(`fastrr_${orderId}`, signGuestOrder(orderId, config.apiSecret), { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 7 * 86400 })
    return Response.json({ token, orderId, scriptUrl: `${config.uiBase}/assets/js/channels/shopify.js`, styleUrl: `${config.uiBase}/assets/styles/shopify.css` }, { headers })
  } catch (error) {
    const status = error instanceof CheckoutError ? error.status : 503
    const message = error instanceof CheckoutError ? error.message : 'Checkout is temporarily unavailable. Your cart is saved; please try again shortly.'
    // Do not log provider responses, tokens, credentials or customer cart contents.
    if (!(error instanceof CheckoutError)) console.error('[Fastrr checkout] Unable to create checkout session')
    return Response.json({ error: message }, { status, headers })
  }
}
