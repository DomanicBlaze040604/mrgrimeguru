import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .upsert(
        { email: email.toLowerCase().trim(), is_active: true },
        { onConflict: 'email' }
      )

    if (error) {
      console.warn('Newsletter subscribe error:', error.message)
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your inbox for 10% off your first order.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
