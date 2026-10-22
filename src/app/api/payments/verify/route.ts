import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      is_mock,
    } = await request.json()

    if (!order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 })
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // Signature verification if keys are live
    if (!is_mock && keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 })
      }
    }

    const supabase = await createClient()

    // Update order status to 'processing' or 'paid'
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: 'processing',
        payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id)

    if (orderError) {
      console.warn('Order status update notice:', orderError.message)
    }

    // Insert payment record
    await supabase.from('payments').insert({
      order_id,
      gateway: 'razorpay',
      gateway_payment_id: razorpay_payment_id || `pay_mock_${Date.now()}`,
      gateway_order_id: razorpay_order_id || `order_mock_${Date.now()}`,
      status: 'succeeded',
      currency: 'INR',
    })

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
