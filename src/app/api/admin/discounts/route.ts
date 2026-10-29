import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: discounts, error } = await supabase
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ discounts: discounts || [] })
  } catch (err: any) {
    return Response.json({ discounts: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, type, value, min_order_paise, max_uses, is_active } = body

    if (!code || !type || value === undefined) {
      return Response.json({ error: 'Code, type, and value are required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('discounts')
      .insert({
        code: code.toUpperCase().trim(),
        type,
        value: Number(value),
        min_order_paise: min_order_paise ? Number(min_order_paise) : 0,
        max_uses: max_uses ? Number(max_uses) : 1000,
        used_count: 0,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return Response.json({ discount: data })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to create discount' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, is_active, value, min_order_paise } = body

    if (!id) return Response.json({ error: 'id required' }, { status: 400 })

    const supabase = await createClient()
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (is_active !== undefined) updates.is_active = is_active
    if (value !== undefined) updates.value = Number(value)
    if (min_order_paise !== undefined) updates.min_order_paise = Number(min_order_paise)

    const { data, error } = await supabase
      .from('discounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return Response.json({ discount: data })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update discount' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) return Response.json({ error: 'id required' }, { status: 400 })

    const supabase = await createClient()
    const { error } = await supabase.from('discounts').delete().eq('id', id)
    if (error) throw error

    return Response.json({ ok: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete' }, { status: 500 })
  }
}
