import { z } from 'zod'
import { checkoutConfig, CheckoutError, signCheckoutBody } from './checkout'

export const providerOrderId = z.string().regex(/^[a-f0-9]{24}$/)
const address = z.object({
  first_name: z.string().nullish(), last_name: z.string().nullish(),
  phone: z.string().nullish(), email: z.string().nullish(), alternate_phone: z.string().nullish(),
  line1: z.string(), line2: z.string().nullish(), landmark: z.string().nullish(),
  city: z.string(), state: z.string(), pincode: z.string(), country: z.string(),
})
const money = z.number().finite().nonnegative()
export const providerOrderSchema = z.object({
  order_id: providerOrderId,
  status: z.enum(['CREATED', 'INITIATED', 'FAILED', 'SUCCESS']),
  cart_data: z.object({ items: z.array(z.object({ variant_id: z.string(), quantity: z.number().int().positive() })).min(1) }),
  email: z.string().nullish(), phone: z.string().nullish(),
  shipping_address: address.nullish(), billing_address: address.nullish(),
  payment_type: z.enum(['CASH_ON_DELIVERY', 'PREPAID']).nullish(),
  payment_status: z.enum(['Pending', 'Success', 'Failed']).nullish(),
  subtotal_price: money.nullish(), total_amount_payable: money.nullish(),
  total_discount: money.nullish(), shipping_charges: money.nullish(), cod_charges: money.nullish(),
  coupon_codes: z.array(z.string()).nullish(), fastrr_order_id: z.union([z.string(), z.number()]).nullish(),
  order_created_date: z.string().nullish(),
  payments: z.array(z.object({ txn_id: z.string().nullish(), payment_status: z.string().nullish(), gateway: z.string().nullish(), payment_method: z.string().nullish(), pg_transaction_id: z.string().nullish(), amount: money.nullish() })).nullish(),
})
export type ProviderOrder = z.infer<typeof providerOrderSchema>

export async function providerRequest(path: string, input: Record<string, unknown>, fetcher: typeof fetch = fetch): Promise<unknown> {
  const config = checkoutConfig(process.env)
  const body = JSON.stringify({ ...input, timestamp: new Date().toISOString() })
  const response = await fetcher(`${config.apiBase}/api/v1/${path}`, {
    method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': config.apiKey, 'X-Api-HMAC-SHA256': signCheckoutBody(body, config.apiSecret) }, body,
  })
  if (!response.ok) throw new CheckoutError('Fastrr could not verify this order yet. Please check again shortly.', 502)
  const data = z.object({ ok: z.literal(true), result: z.unknown() }).safeParse(await response.json())
  if (!data.success) throw new CheckoutError('Fastrr returned an incomplete order update. Please try again.', 502)
  return data.data.result
}

export async function fetchProviderOrder(id: string) {
  providerOrderId.parse(id)
  const order = providerOrderSchema.parse(await providerRequest('custom-platform-order/details', { order_id: id }))
  if (order.order_id !== id) throw new CheckoutError('Order verification failed.', 502)
  return order
}

export async function fetchProviderOrderList(page = 0) {
  const now = new Date()
  return z.object({ total: z.number().int().nonnegative(), data: z.array(z.object({ id: providerOrderId, status: z.string() })) }).parse(
    await providerRequest('custom-platform-order/details/list', {
      startDate: new Date(now.getTime() - 90 * 86400000).toISOString(), endDate: now.toISOString(), status: 'SUCCESS', limit: 10, page,
    }),
  )
}
