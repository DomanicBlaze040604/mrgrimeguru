import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
export const runtime = 'nodejs'
async function adminClient() {
  const client = await createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return null
  const { data } = await client.from('profiles').select('role').eq('id', user.id).single()
  return data && ['owner', 'administrator', 'operations', 'customer_support'].includes(data.role) ? client : null
}
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const client = await adminClient()
  if (!client) return Response.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const { data: order, error } = await client.from('orders').select('*,order_items(*),payments(*)').eq('id', id).single()
  if (error || !order) return Response.json({ error: 'Order not found' }, { status: 404 })
  return Response.json({ order }, { headers: { 'Cache-Control': 'no-store' } })
}
const updatesSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded']).optional(),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded', 'partially_refunded']).optional(),
  fulfillment_status: z.enum(['unfulfilled', 'partial', 'fulfilled', 'returned']).optional(),
  tracking_number: z.string().max(200).optional(), notes: z.string().max(5000).optional(),
}).strict()
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Forbidden' }, { status: 403 })
  const client = await adminClient()
  if (!client) return Response.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const input = updatesSchema.safeParse(await request.json())
    if (!input.success) return Response.json({ error: 'Invalid order update' }, { status: 400 })
    const { id } = await params
    const { data, error } = await client.from('orders').update({ ...input.data, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return Response.json({ order: data })
  } catch {
    return Response.json({ error: 'Order update was not saved. Please retry.' }, { status: 500 })
  }
}
