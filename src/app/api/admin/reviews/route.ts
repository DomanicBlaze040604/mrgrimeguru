import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        guest_name,
        guest_email,
        rating,
        title,
        body,
        status,
        is_verified_purchase,
        created_at,
        product:products(name)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ reviews: reviews || [] })
  } catch (err: any) {
    return Response.json({ reviews: [] })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return Response.json({ error: 'id and status required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('reviews')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return Response.json({ ok: true, review: data })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) return Response.json({ error: 'id required' }, { status: 400 })

    const supabase = await createClient()
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) throw error

    return Response.json({ ok: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete review' }, { status: 500 })
  }
}
