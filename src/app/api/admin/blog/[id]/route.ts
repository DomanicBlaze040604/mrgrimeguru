import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !post) {
      return Response.json({ error: 'Post not found' }, { status: 404 })
    }

    return Response.json({ post })
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

    const { title, slug, excerpt, content, status, reading_time_minutes } = body

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (title !== undefined) updates.title = title
    if (slug !== undefined) updates.slug = slug
    if (excerpt !== undefined) updates.excerpt = excerpt
    if (content !== undefined) updates.content = content
    if (status !== undefined) {
      updates.status = status
      if (status === 'published') updates.published_at = new Date().toISOString()
    }
    if (reading_time_minutes !== undefined) updates.reading_time_minutes = reading_time_minutes

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return Response.json({ post: data })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) throw error

    return Response.json({ ok: true })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to delete' }, { status: 500 })
  }
}
