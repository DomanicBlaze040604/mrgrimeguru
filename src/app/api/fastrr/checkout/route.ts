import { loadCatalog } from '@/lib/fastrr/handler'
import { buildCheckoutPayload, checkoutConfig, CheckoutError, parseCheckoutItems, requestCheckoutToken } from '@/lib/fastrr/checkout'

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
    const payload = buildCheckoutPayload(items, await loadCatalog(), config.origin)
    const token = await requestCheckoutToken(payload, config)
    return Response.json({ token, scriptUrl: `${config.uiBase}/assets/js/channels/shopify.js`, styleUrl: `${config.uiBase}/assets/styles/shopify.css` }, { headers })
  } catch (error) {
    const status = error instanceof CheckoutError ? error.status : 503
    const message = error instanceof CheckoutError ? error.message : 'Checkout is temporarily unavailable. Your cart is saved; please try again shortly.'
    // Do not log provider responses, tokens, credentials or customer cart contents.
    if (!(error instanceof CheckoutError)) console.error('[Fastrr checkout] Unable to create checkout session')
    return Response.json({ error: message }, { status, headers })
  }
}
