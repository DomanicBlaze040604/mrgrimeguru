import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('inventory')
      .select('id, quantity, reserved_quantity, low_stock_threshold, variant:product_variants(id, name, sku, product:products(name))')
      .order('quantity', { ascending: true })

    if (error) throw error
    return Response.json({ items: data || [] })
  } catch (err: any) {
    return Response.json({ items: [] })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, quantity, low_stock_threshold } = body

    if (!id || quantity === undefined) {
      return Response.json({ error: 'id and quantity required' }, { status: 400 })
    }

    const supabase = await createClient()
    const updates: Record<string, any> = {
      quantity: Number(quantity),
      updated_at: new Date().toISOString(),
    }
    if (low_stock_threshold !== undefined) {
      updates.low_stock_threshold = Number(low_stock_threshold)
    }

    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return Response.json({ ok: true, item: data })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update stock' }, { status: 500 })
  }
}

