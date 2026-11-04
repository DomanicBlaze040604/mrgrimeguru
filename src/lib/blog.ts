import { cache } from 'react'
import seed from '@/data/cleaning-guides.json'

export interface CleaningGuide {
  slug: string; title: string; excerpt: string; content: string;
  featured_image_url: string | null; published_at: string; updated_at: string;
  reading_time_minutes: number; meta_title: string | null; meta_description: string | null;
}

// Public content only. The same source drives the list, article, metadata and sitemap.
export const getGuides = cache(async (): Promise<CleaningGuide[]> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return seed
  try {
    const response = await fetch(`${url}/rest/v1/blog_posts?status=eq.published&select=slug,title,excerpt,content,featured_image_url,published_at,updated_at,reading_time_minutes,meta_title,meta_description&order=published_at.desc,slug.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 300 },
    })
    if (!response.ok) return seed
    const posts: CleaningGuide[] = await response.json()
    return posts
  } catch { return seed }
})

export async function getGuide(slug: string) { return (await getGuides()).find(post => post.slug === slug) }
export function guideImage(post: CleaningGuide) { return post.featured_image_url || '/social-image' }
export function guideProduct(slug: string) { return seed.find(post => post.slug === slug)?.product }
