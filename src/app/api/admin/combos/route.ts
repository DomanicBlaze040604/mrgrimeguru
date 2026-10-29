import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('product_combos')
      .select('*')
      .order('sort_order')

    if (error || !data) return Response.json({ combos: [] })
    return Response.json({ combos: data })
  } catch {
    return Response.json({ combos: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, price_paise, compare_price_paise, products, is_active, sort_order } = body

    if (!name || !slug || !price_paise || !Array.isArray(products)) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('product_combos')
      .insert({
        name, slug, description: description ?? '',
        price_paise, compare_price_paise: compare_price_paise ?? null,
        products, is_active: is_active ?? true,
        sort_order: sort_order ?? 0,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ combo: data })
  } catch {
    return Response.json({ error: 'Failed to create combo' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return Response.json({ error: 'Missing combo id' }, { status: 400 })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('product_combos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ combo: data })
  } catch {
    return Response.json({ error: 'Failed to update combo' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) return Response.json({ error: 'Missing combo id' }, { status: 400 })

    const supabase = await createClient()
    await supabase.from('product_combos').delete().eq('id', id)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to delete combo' }, { status: 500 })
  }
}

