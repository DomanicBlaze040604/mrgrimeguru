import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !order) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }

    return Response.json({ order })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()

    const { status, payment_status, fulfillment_status, tracking_number, notes } = body

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (status !== undefined) updates.status = status
    if (payment_status !== undefined) updates.payment_status = payment_status
    if (fulfillment_status !== undefined) updates.fulfillment_status = fulfillment_status
    if (tracking_number !== undefined) updates.tracking_number = tracking_number
    if (notes !== undefined) updates.notes = notes

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return Response.json({ order: data })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update order' }, { status: 500 })
  }
}

