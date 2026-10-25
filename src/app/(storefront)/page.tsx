import type { Metadata } from 'next'
import { HeroSection } from '@/components/storefront/HeroSection'
import { CategoryGridSection } from '@/components/storefront/CategoryGridSection'
import { ProductCarousel } from '@/components/storefront/ProductCarousel'
import { ProductVideoSection } from '@/components/storefront/ProductVideoSection'
import { EducationCarousel } from '@/components/storefront/EducationCarousel'
import { CleaningFixFinder } from '@/components/storefront/CleaningFixFinder'
import { BrandVideoSection } from '@/components/storefront/BrandVideoSection'
import { BlogPreviewSection } from '@/components/storefront/BlogPreviewSection'
import { ReviewsSection } from '@/components/storefront/ReviewsSection'
import { MascotGuide } from '@/components/mascot/MascotGuide'

export const metadata: Metadata = {
  title: 'Mr GrimeGuru — Everyday Cleaning Essentials',
  description:
    'Find Your Clean. Practical cleaning essentials for shoes, household surfaces, kitchens, and laundry. Mr GrimeGuru.',
}

const PLACEHOLDER_PRODUCTS = [
  {
    id: '1',
    name: 'Laundry Pods',
    slug: 'laundry-pods',
    family: 'laundry_pods' as const,
    short_description: 'Pre-measured detergent pods designed to simplify your wash routine.',
    price_paise: 89900,
    compare_price_paise: 109900,
    image_url: '/images/products/laundry-pods.jpg',
    variant_id: 'v1',
    variant_name: '30 Pods',
    sku: 'MGG-LP-30',
    in_stock: true,
  },
  {
    id: '2',
    name: 'Shoe Cleaner',
    slug: 'shoe-cleaner',
    family: 'shoe_cleaner' as const,
    short_description: 'A dedicated solution for cleaning compatible footwear and tackling everyday dirt.',
    price_paise: 44900,
    compare_price_paise: 54900,
    image_url: '/images/products/shoe-cleaner.jpg',
    variant_id: 'v2',
    variant_name: '200ml Kit',
    sku: 'MGG-SC-200',
    in_stock: true,
  },
  {
    id: '3',
    name: 'Multipurpose Cleaner',
    slug: 'multipurpose-cleaner',
    family: 'multipurpose_cleaner' as const,
    short_description: 'A versatile option for everyday cleaning on approved household surfaces.',
    price_paise: 39900,
    compare_price_paise: 49900,
    image_url: '/images/products/floor-cleaner.jpg',
    variant_id: 'v3',
    variant_name: '500ml Spray',
    sku: 'MGG-MP-500',
    in_stock: true,
  },
  {
    id: '4',
    name: 'Kitchen Cleaner',
    slug: 'kitchen-cleaner',
    family: 'kitchen_cleaner' as const,
    short_description: 'A targeted solution for everyday kitchen messes and grease on compatible surfaces.',
    price_paise: 34900,
    compare_price_paise: null,
    image_url: '/images/products/kitchen-degreaser.jpg',
    variant_id: 'v4',
    variant_name: '500ml Spray',
    sku: 'MGG-KC-500',
    in_stock: true,
  },
]

export default function HomePage() {
  return (
    <>
      {/* SECTION 1: Hero (with category icon strip) + Shop By Category + Product Carousel */}
      <HeroSection />
      <CategoryGridSection />
      <ProductCarousel products={PLACEHOLDER_PRODUCTS} />

      {/* SECTION 2: Product Videos + Cleaning Education */}
      <ProductVideoSection
        title="See It Work."
        subtitle="Spray. Wait. Wipe. Our own secret formula does the rest."
        accentColor="#166534"
        videos={[
          { src: '/images/products/shoe-cleaner-1.mp4', label: 'Shoe Cleaner', caption: 'Everyday dirt lifted in seconds' },
          { src: '/images/products/shoe-cleaner-2.mp4', label: 'Shoe Cleaner', caption: 'Works on canvas, mesh & synthetic' },
          { src: '/images/products/shoe-cleaner-3.mp4', label: 'Shoe Cleaner', caption: 'Before & after — real results' },
          { src: '/images/products/kitchen-cleaner-1.mp4', label: 'Kitchen Cleaner', caption: 'Spray on grease. Wipe clean.' },
          { src: '/images/products/kitchen-cleaner-2.mp4', label: 'Kitchen Cleaner', caption: 'Stovetop residue — gone' },
          { src: '/images/products/kitchen-cleaner-3.mp4', label: 'Kitchen Cleaner', caption: 'Our formula clings, then lifts' },
          { src: '/images/products/multipurpose-1.mp4', label: 'Multipurpose Cleaner', caption: 'One spray for everyday surfaces' },
          { src: '/images/products/multipurpose-2.mp4', label: 'Multipurpose Cleaner', caption: 'Versatile clean across your home' },
        ]}
      />
      <EducationCarousel />
      <CleaningFixFinder />

      {/* SECTION 3: Brand Content + Video + Blog + Reviews */}
      <BrandVideoSection />
      <BlogPreviewSection />
      <ReviewsSection />

      {/* Floating 3D Mascot */}
      <MascotGuide />
    </>
  )
}
