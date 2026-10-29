import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ posts: posts || [] })
  } catch (err: any) {
    return Response.json({ posts: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, status, reading_time_minutes } = body

    if (!title || !slug) {
      return Response.json({ error: 'Title and slug are required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get an author profile id
    const { data: profiles } = await supabase.from('profiles').select('id').limit(1)
    const author_id = profiles?.[0]?.id || '25b01502-866d-4415-ad6c-b5f572036909'

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt: excerpt || '',
        content: content || '',
        author_id,
        status: status || 'published',
        published_at: status === 'published' ? new Date().toISOString() : null,
        reading_time_minutes: reading_time_minutes || 3,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return Response.json({ post: data })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Failed to create article' }, { status: 500 })
  }
}
