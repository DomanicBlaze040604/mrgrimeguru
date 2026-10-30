import { providerOrderId } from '@/lib/fastrr/provider'
import { syncFastrrOrder } from '@/lib/fastrr/orders'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  try {
    const text = await request.text()
    if (text.length > 64000) return Response.json({ error: 'Request too large' }, { status: 413 })
    const data = JSON.parse(text)
    const id = providerOrderId.safeParse(data?.order_id)
    if (!id.success) return Response.json({ error: 'Invalid order reference' }, { status: 400 })
    // Only use the webhook ID. Verify all customer, price and status fields
    // through the authenticated provider API before writing anything.
    await syncFastrrOrder(id.data)
    return Response.json({ received: true })
  } catch {
    return Response.json({ error: 'Order update could not be verified; retry delivery.' }, { status: 503 })
  }
}
