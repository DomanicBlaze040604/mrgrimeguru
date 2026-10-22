import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the authenticated user (optional — guest checkout supported)
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const {
      items,
      shipping_address,
      discount_code,
      discount_paise = 0,
      shipping_paise,
      tax_paise,
    } = body

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!shipping_address?.full_name || !shipping_address?.pincode) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 })
    }

    // Calculate subtotal from DB prices (never trust client-side prices)
    let subtotal_paise = 0
    const validatedItems: { product_id: string; variant_id: string; quantity: number; unit_price_paise: number; total_price_paise: number; product_name: string; variant_name: string; sku: string; image_url: string | null }[] = []

    for (const item of items) {
      const { data: variant, error } = await supabase
        .from('product_variants')
        .select(`
          id, name, sku, price_paise, is_active,
          products!inner(id, name, slug, status)
        `)
        .eq('id', item.variant_id)
        .eq('is_active', true)
        .single()

      if (error || !variant) {
        return NextResponse.json({ error: `Product variant not found: ${item.variant_id}` }, { status: 400 })
      }

      // Check inventory
      const { data: inventory } = await supabase
        .from('inventory')
        .select('quantity, reserved_quantity, track_inventory')
        .eq('variant_id', item.variant_id)
        .single()

      if (inventory?.track_inventory && (inventory.quantity - inventory.reserved_quantity) < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${variant.name}` }, { status: 400 })
      }

      const total = variant.price_paise * item.quantity
      subtotal_paise += total

      const product = Array.isArray(variant.products) ? variant.products[0] : variant.products

      validatedItems.push({
        product_id: product.id,
        variant_id: variant.id,
        quantity: item.quantity,
        unit_price_paise: variant.price_paise,
        total_price_paise: total,
        product_name: product.name,
        variant_name: variant.name,
        sku: variant.sku,
        image_url: item.image_url || null,
      })
    }

    // Recalculate shipping and tax server-side
    const calculated_shipping = subtotal_paise >= 49900 ? 0 : 4900
    const calculated_tax = Math.round(subtotal_paise * 0.18)
    const total_paise = subtotal_paise - discount_paise + calculated_shipping + calculated_tax

    const order_number = generateOrderNumber()

    // Create order (use service role to bypass RLS for insert)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number,
        user_id: user?.id || null,
        guest_email: user?.email || shipping_address.email || null,
        status: 'pending',
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled',
        subtotal_paise,
        discount_paise,
        shipping_paise: calculated_shipping,
        tax_paise: calculated_tax,
        total_paise,
        shipping_address,
        discount_code: discount_code || null,
      })
      .select('id, order_number')
      .single()

    if (orderError || !order) {
      console.error('Order creation failed:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    await supabase.from('order_items').insert(
      validatedItems.map((item) => ({ order_id: order.id, ...item }))
    )

    // Reserve inventory
    for (const item of validatedItems) {
      await supabase.rpc('reserve_inventory', {
        p_variant_id: item.variant_id,
        p_quantity: item.quantity,
        p_order_id: order.id,
      }).maybeSingle()
    }

    return NextResponse.json({
      order_id: order.id,
      order_number: order.order_number,
      total_paise,
    })
  } catch (err) {
    console.error('Order API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
