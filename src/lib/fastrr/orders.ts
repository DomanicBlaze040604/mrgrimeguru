import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { buildCatalog, catalogId, type CatalogRows } from './catalog'
import { CheckoutError, type parseCheckoutItems } from './checkout'
import { fetchProviderOrder, type ProviderOrder } from './provider'

// Private storage keeps the server-validated prices at checkout time, without
// creating fake customers or incomplete orders in the merchant's order list.
export const CHECKOUT_BUCKET = 'fastrr-checkouts'
const snapshotSchema = z.object({
  createdAt: z.string(),
  items: z.array(z.object({
    product_id: z.string(), variant_id: z.string(), external_id: z.string(),
    product_name: z.string(), variant_name: z.string(), sku: z.string(),
    unit_price_paise: z.number().int().nonnegative(), quantity: z.number().int().positive(), image_url: z.string(),
  })).min(1),
})
export type CheckoutSnapshot = z.infer<typeof snapshotSchema>

export function orderDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new CheckoutError('Order storage is temporarily unavailable.', 503)
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function checkoutSnapshot(items: ReturnType<typeof parseCheckoutItems>, rows: CatalogRows, origin: string): CheckoutSnapshot {
  const catalog = buildCatalog(rows, origin)
  return { createdAt: new Date().toISOString(), items: items.map(item => {
    const variant = rows.variants.find(v => v.id === item.variant_id)
    const product = catalog.products.find(p => p.value.variants.some(v => v.id === catalogId('variant', item.variant_id)))?.value
    const external = product?.variants.find(v => v.id === catalogId('variant', item.variant_id))
    if (!variant || !product || !external) throw new CheckoutError('A cart item is no longer available.', 409)
    return { product_id: variant.product_id, variant_id: variant.id, external_id: String(external.id), product_name: product.title, variant_name: external.title, sku: variant.sku, unit_price_paise: Math.round(Number(external.price) * 100), quantity: item.quantity, image_url: external.image.src }
  }) }
}

export async function saveCheckoutSnapshot(id: string, snapshot: CheckoutSnapshot) {
  const { error } = await orderDatabase().storage.from(CHECKOUT_BUCKET).upload(`${id}.json`, JSON.stringify(snapshot), { contentType: 'application/json', upsert: false })
  if (error) throw new CheckoutError('Unable to save checkout. Your cart is unchanged; please retry.', 503)
}

async function loadSnapshot(id: string) {
  const { data, error } = await orderDatabase().storage.from(CHECKOUT_BUCKET).download(`${id}.json`)
  if (error || !data) throw new CheckoutError('The checkout record could not be found. Please contact support with your Fastrr reference.', 409)
  return snapshotSchema.parse(JSON.parse(await data.text()))
}

export function stableOrderId(value: string) {
  const hex = createHash('sha256').update(`mrgrimeguru:fastrr:${value}`).digest('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}
const paise = (value: number) => {
  const result = Math.round(value * 100)
  if (!Number.isSafeInteger(result) || result < 0) throw new CheckoutError('Invalid order amount.', 502)
  return result
}

export function confirmedOrderRecords(order: ProviderOrder, snapshot: CheckoutSnapshot) {
  if (order.status !== 'SUCCESS' || order.payment_status === 'Failed' || (order.payment_type !== 'CASH_ON_DELIVERY' && order.payment_status !== 'Success')) return null
  if (!order.shipping_address || !order.payment_type || order.subtotal_price == null || order.total_amount_payable == null) throw new CheckoutError('Order details are still being confirmed.', 502)
  const actual = new Map<string, number>()
  for (const item of order.cart_data.items) actual.set(item.variant_id, (actual.get(item.variant_id) ?? 0) + item.quantity)
  if (actual.size !== snapshot.items.length || snapshot.items.some(i => actual.get(i.external_id) !== i.quantity)) throw new CheckoutError('Order items do not match the checkout record.', 502)
  const subtotal = snapshot.items.reduce((sum, i) => sum + i.unit_price_paise * i.quantity, 0)
  if (paise(order.subtotal_price) !== subtotal) throw new CheckoutError('Order prices need reconciliation. Please contact support.', 502)
  const id = stableOrderId(order.order_id)
  const email = order.email || order.shipping_address.email || ''
  const paymentStatus = order.payment_status === 'Success' ? 'paid' : 'pending'
  const shipping = paise((order.shipping_charges ?? 0) + (order.cod_charges ?? 0))
  const discount = paise(order.total_discount ?? 0)
  const total = paise(order.total_amount_payable)
  if (Math.abs(subtotal + shipping - discount - total) > 1) throw new CheckoutError('Order total needs reconciliation. Please contact support.', 502)
  return {
    order: { id, order_number: `MG-${order.order_id.toUpperCase()}`, guest_email: email, status: 'confirmed', payment_status: paymentStatus, subtotal_paise: subtotal, discount_paise: discount, shipping_paise: shipping, tax_paise: 0, total_paise: total,
      shipping_address: { ...order.shipping_address, phone: order.shipping_address.phone || order.phone || '', postal_code: order.shipping_address.pincode },
      discount_code: order.coupon_codes?.join(', ') || null,
      created_at: order.order_created_date && Number.isFinite(Date.parse(order.order_created_date)) ? new Date(order.order_created_date).toISOString() : snapshot.createdAt,
    },
    items: snapshot.items.map(item => ({ product_id: item.product_id, variant_id: item.variant_id, product_name: item.product_name, variant_name: item.variant_name, sku: item.sku, unit_price_paise: item.unit_price_paise, quantity: item.quantity, image_url: item.image_url, id: stableOrderId(`${order.order_id}:${item.variant_id}`), order_id: id, total_price_paise: item.unit_price_paise * item.quantity })),
    payment: { id: stableOrderId(`${order.order_id}:payment`), order_id: id, provider: 'fastrr', provider_order_id: order.order_id, provider_payment_id: order.payments?.find(p => p.payment_status === 'Success')?.txn_id ?? null, amount_paise: total, currency: 'INR', status: paymentStatus,
      metadata: { payment_type: order.payment_type, fastrr_order_id: order.fastrr_order_id, billing_address: order.billing_address, transactions: order.payments ?? [] },
    },
  }
}

export async function syncFastrrOrder(id: string) {
  const snapshot = await loadSnapshot(id)
  const verified = await fetchProviderOrder(id)
  const records = confirmedOrderRecords(verified, snapshot)
  if (!records) return { state: verified.status === 'FAILED' ? 'failed' as const : 'pending' as const }
  const db = orderDatabase()
  // Deterministic primary keys make retries/concurrent webhook delivery safe.
  // Keep new orders pending until every line and payment has been saved.
  const insert = await db.from('orders').upsert({ ...records.order, status: 'pending', payment_status: 'pending' }, { onConflict: 'id', ignoreDuplicates: true })
  if (insert.error) throw new Error('Order storage failed')
  const lines = await db.from('order_items').upsert(records.items, { onConflict: 'id', ignoreDuplicates: true })
  if (lines.error) throw new Error('Order items storage failed')
  const payment = await db.from('payments').upsert(records.payment, { onConflict: 'id', ignoreDuplicates: true })
  if (payment.error) throw new Error('Payment storage failed')
  if (records.payment.status === 'paid') {
    const update = await db.from('payments').update({ status: 'paid', provider_payment_id: records.payment.provider_payment_id, metadata: records.payment.metadata }).eq('id', records.payment.id).eq('status', 'pending')
    if (update.error) throw new Error('Payment update failed')
  }
  const final = await db.from('orders').update({ status: 'confirmed', payment_status: records.order.payment_status }).eq('id', records.order.id).eq('status', 'pending').eq('payment_status', 'pending')
  if (final.error) throw new Error('Order confirmation storage failed')
  // Never downgrade a fulfilled/refunded order during a late provider retry.
  if (records.order.payment_status === 'paid') {
    const paid = await db.from('orders').update({ payment_status: 'paid' }).eq('id', records.order.id).eq('payment_status', 'pending')
    if (paid.error) throw new Error('Order payment update failed')
  }
  return { state: 'confirmed' as const, reference: records.order.order_number, totalPaise: records.order.total_paise, paymentStatus: records.order.payment_status, paymentType: verified.payment_type, items: snapshot.items.map(({ variant_id, quantity }) => ({ variant_id, quantity })) }
}
