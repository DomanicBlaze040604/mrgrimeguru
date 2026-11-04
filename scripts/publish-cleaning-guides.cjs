// Run once after reviewing src/data/cleaning-guides.json. Never prints credentials.
require('@next/env').loadEnvConfig(process.cwd())
const fs = require('node:fs')
const { createClient } = require('@supabase/supabase-js')
const guides = require('../src/data/cleaning-guides.json')
async function main() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('Server-side Supabase credential is required')
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, { auth: { persistSession: false } })
  const { data: existing, error } = await db.from('blog_posts').select('*')
  if (error) throw error
  const otherPublished = existing.filter(post => post.status === 'published' && !guides.some(guide => guide.slug === post.slug))
  if (otherPublished.length) throw new Error('Additional published posts found; review before publishing')
  fs.mkdirSync('.vercel/seo-backup', { recursive: true })
  const backup = '.vercel/seo-backup/blog-posts.json'
  if (!fs.existsSync(backup)) fs.writeFileSync(backup, JSON.stringify(existing, null, 2))
  const author = existing[0]?.author_id
  if (!author) throw new Error('Existing editorial author is required')
  for (const { product, ...guide } of guides) {
    const original = existing.find(post => post.slug === guide.slug)
    const payload = { ...guide, author_id: original?.author_id || author, ...(original ? { id: original.id, published_at: original.published_at } : {}) }
    const { error: writeError } = await db.from('blog_posts').upsert(payload, { onConflict: 'slug' })
    if (writeError) throw writeError
  }
  const { data: published, error: readError } = await db.from('blog_posts').select('slug,title,content,featured_image_url').eq('status', 'published')
  if (readError) throw readError
  if (published.length !== 6 || published.some(post => !post.content || !post.featured_image_url)) throw new Error('Published guide verification failed')
  console.log('VERDICT: PASS — six complete published guides; original records backed up locally.')
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
