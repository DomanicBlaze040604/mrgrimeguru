import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { order_id, amount_paise } = await request.json()

    if (!order_id || !amount_paise) {
      return NextResponse.json(
        { error: 'order_id and amount_paise are required' },
        { status: 400 }
      )
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // If Razorpay keys are configured, create real Razorpay order
    if (keyId && keySecret) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
      const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount_paise,
          currency: 'INR',
          receipt: order_id,
          payment_capture: 1,
        }),
      })

      if (!razorpayRes.ok) {
        const errText = await razorpayRes.text()
        console.error('Razorpay API error:', errText)
        throw new Error('Failed to create Razorpay order')
      }

      const rzpOrder = await razorpayRes.json()
      return NextResponse.json({
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        key: keyId,
      })
    }

    // Demo/Development fallback order ID
    const demoOrderId = `rzp_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`
    return NextResponse.json({
      id: demoOrderId,
      amount: amount_paise,
      currency: 'INR',
      key: keyId || 'rzp_test_placeholder',
      is_mock: true,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
