import { cookies } from 'next/headers'
import { checkoutConfig, CheckoutError } from '@/lib/fastrr/checkout'
import { providerOrderId } from '@/lib/fastrr/provider'
import { syncFastrrOrder } from '@/lib/fastrr/orders'
import { verifyGuestOrder } from '@/lib/fastrr/session'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store' }
  try {
    if (request.headers.get('origin') !== new URL(request.url).origin) throw new CheckoutError('Invalid request origin.', 403)
    const body = await request.text()
    if (body.length > 512) throw new CheckoutError('Invalid order request.')
    let input: unknown
    try { input = JSON.parse(body) } catch { throw new CheckoutError('Invalid order request.') }
    const id = providerOrderId.safeParse(typeof input === 'object' && input !== null && 'orderId' in input ? input.orderId : null)
    if (!id.success) throw new CheckoutError('Invalid order reference.')
    const config = checkoutConfig(process.env)
    const cookieStore = await cookies()
    if (!verifyGuestOrder(cookieStore.get(`fastrr_${id.data}`)?.value, id.data, config.apiSecret)) throw new CheckoutError('Open this confirmation in the browser where you placed the order, or contact support with your Fastrr reference.', 403)
    return Response.json(await syncFastrrOrder(id.data), { headers })
  } catch (error) {
    return Response.json({ error: error instanceof CheckoutError ? error.message : 'We could not confirm the order yet. Please try again shortly; do not pay again if your payment was debited.' }, { status: error instanceof CheckoutError ? error.status : 503, headers })
  }
}
