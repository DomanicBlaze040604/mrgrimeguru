import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants(*),
        product_media(*)
      `)
      .eq('id', id)
      .single()

    if (error || !product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    return Response.json({ product })
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

    const {
      name,
      slug,
      status,
      short_description,
      description,
      price_paise,
      compare_at_price_paise,
      sku,
    } = body

    // 1. Update product base info
    const updateProduct: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (name !== undefined) updateProduct.name = name
    if (slug !== undefined) updateProduct.slug = slug
    if (status !== undefined) updateProduct.status = status
    if (short_description !== undefined) updateProduct.short_description = short_description
    if (description !== undefined) updateProduct.description = description

    const { error: pErr } = await supabase
      .from('products')
      .update(updateProduct)
      .eq('id', id)

    if (pErr) throw pErr

    // 2. Update default variant price & sku if provided
    if (price_paise !== undefined || compare_at_price_paise !== undefined || sku !== undefined) {
      const updateVariant: Record<string, any> = {
        updated_at: new Date().toISOString(),
      }
      if (price_paise !== undefined) updateVariant.price_paise = price_paise
      if (compare_at_price_paise !== undefined) updateVariant.compare_at_price_paise = compare_at_price_paise
      if (sku !== undefined) updateVariant.sku = sku

      await supabase
        .from('product_variants')
        .update(updateVariant)
        .eq('product_id', id)
        .eq('is_default', true)
    }

    return Response.json({ ok: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error

    return Response.json({ ok: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete' }, { status: 500 })
  }
}
