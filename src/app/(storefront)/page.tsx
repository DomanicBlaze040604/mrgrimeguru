import { JsonLd } from '@/components/storefront/JsonLd'
import { absoluteUrl, SITE_URL } from '@/lib/seo'
import { pageMetadata } from '@/lib/seo'
import { HeroSection } from '@/components/storefront/HeroSection'
import { CircularCategories, SurfaceBanner, ProductRange, WhyFoam, BuyingFromUs } from '@/components/storefront/HomeSections'
import { HomeVideos } from '@/components/storefront/HomeVideos'

export const metadata = pageMetadata('Foam Cleaners for Kitchen, Home & Shoes', 'Shop Mr GrimeGuru 500 ml kitchen, multipurpose and shoe foam cleaners. Explore current offers, cleaning guides and household combos.', '/')

export default function HomePage() {
  return <div className="guru-home"><JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Mr GrimeGuru', url: absoluteUrl('/'), publisher: { '@id': `${SITE_URL}/#organization` } }} /><HeroSection /><CircularCategories /><SurfaceBanner /><ProductRange /><WhyFoam /><HomeVideos /><BuyingFromUs /></div>
}
