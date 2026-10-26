import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mrgrimeguru.com'

  const staticRoutes = [
    '',
    '/shop',
    '/shop/laundry-pods',
    '/shop/laundry-beads',
    '/shop/floor-cleaner',
    '/shop/kitchen-degreaser',
    '/shop/shoe-cleaner',
    '/products/laundry-pods',
    '/products/laundry-beads',
    '/products/floor-cleaner',
    '/products/kitchen-degreaser',
    '/products/shoe-cleaner',
    '/blog',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
    '/shipping',
    '/returns',
    '/cookies',
  ]

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith('/shop') || route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/shop') ? 0.9 : 0.7,
  }))
}
