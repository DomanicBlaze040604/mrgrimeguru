import type { Metadata } from 'next'
import { HeroSection } from '@/components/storefront/HeroSection'
import { CircularCategories, SurfaceBanner, ProductRange, WhyFoam, BuyingFromUs } from '@/components/storefront/HomeSections'
import { HomeVideos } from '@/components/storefront/HomeVideos'

export const metadata: Metadata = {
  title: 'Mr GrimeGuru — Big on Foam. Tough on Grime.',
  description: 'Meet the grime-fighting trio: kitchen, multipurpose and shoe foam cleaners. Pick your mess. Let the Guru do the rest.',
}

export default function HomePage() {
  return <div className="guru-home"><HeroSection /><CircularCategories /><SurfaceBanner /><ProductRange /><WhyFoam /><HomeVideos /><BuyingFromUs /></div>
}
