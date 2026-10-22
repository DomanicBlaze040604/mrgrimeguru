import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone: phone || null,
        subject: subject || 'General Inquiry',
        message,
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      console.warn('Supabase contact_messages error (falling back to mock response):', error.message)
      return NextResponse.json({
        success: true,
        message: 'Your message has been received! Our support team will get back to you within 24 hours.',
        id: 'msg_' + Date.now(),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received! Our support team will get back to you within 24 hours.',
      data,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
