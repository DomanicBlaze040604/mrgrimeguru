import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'
import { getGuides, guideImage } from '@/lib/blog'
export const revalidate = 300
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['/', '/shop', '/shop/kitchen-cleaner', '/shop/multipurpose-cleaner', '/shop/shoe-cleaner', '/about', '/blog', '/faq', '/contact', '/privacy', '/terms', '/shipping', '/returns', '/cookies']
  const posts = await getGuides()
  return [...routes.map(path => ({ url: absoluteUrl(path), ...(path.startsWith('/shop/') ? { images: [absoluteUrl(`/images/products/${path.split('/').pop()}-bogo-transparent.png`)] } : {}) })), ...posts.map(post => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updated_at || post.published_at, images: [absoluteUrl(guideImage(post))] }))]
}
