import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal_paise } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Discount code is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: discount, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !discount) {
      return NextResponse.json({ error: 'Invalid or expired discount code' }, { status: 404 })
    }

    const now = new Date()

    // Check validity dates
    if (discount.valid_from && new Date(discount.valid_from) > now) {
      return NextResponse.json({ error: 'This discount code is not yet active' }, { status: 400 })
    }

    if (discount.valid_until && new Date(discount.valid_until) < now) {
      return NextResponse.json({ error: 'This discount code has expired' }, { status: 400 })
    }

    // Check usage limit
    if (discount.max_uses !== null && discount.used_count >= discount.max_uses) {
      return NextResponse.json({ error: 'This discount code has reached its usage limit' }, { status: 400 })
    }

    // Check minimum order amount
    if (discount.min_order_paise && subtotal_paise < discount.min_order_paise) {
      return NextResponse.json({
        error: `Minimum order of ₹${(discount.min_order_paise / 100).toFixed(0)} required for this code`,
      }, { status: 400 })
    }

    // Calculate discount amount
    let discount_amount_paise = 0
    if (discount.type === 'percentage') {
      discount_amount_paise = Math.round((subtotal_paise * Number(discount.value)) / 100)
    } else if (discount.type === 'fixed_amount') {
      discount_amount_paise = Math.round(Number(discount.value) * 100)
    }

    // Cap at subtotal
    discount_amount_paise = Math.min(discount_amount_paise, subtotal_paise)

    return NextResponse.json({
      valid: true,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discount_amount_paise,
      message: `Code applied — saving ₹${(discount_amount_paise / 100).toFixed(0)}`,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
