import type { Metadata } from 'next'
import { HeroSection } from '@/components/storefront/HeroSection'
import { ProductCarousel } from '@/components/storefront/ProductCarousel'
import { EducationCarousel } from '@/components/storefront/EducationCarousel'
import { CleaningFixFinder } from '@/components/storefront/CleaningFixFinder'
import { BrandVideoSection } from '@/components/storefront/BrandVideoSection'
import { BlogPreviewSection } from '@/components/storefront/BlogPreviewSection'
import { ReviewsSection } from '@/components/storefront/ReviewsSection'
import { MascotGuide } from '@/components/mascot/MascotGuide'

export const metadata: Metadata = {
  title: 'Mr GrimeGuru — Premium Household Cleaning Products',
  description:
    'Smart, effective cleaning for modern Indian homes. Laundry pods, scented beads, floor cleaner, kitchen degreaser, and shoe care. Grime Happens. We Handle It.',
}

// Static placeholder products (replace with Supabase data fetch when configured)
const PLACEHOLDER_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Laundry Pods',
    slug: 'laundry-pods',
    family: 'laundry_pods' as const,
    short_description: '3-in-1 cleaning power. Works in all temperatures.',
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
    name: 'Scented Laundry Beads',
    slug: 'laundry-beads',
    family: 'laundry_beads' as const,
    short_description: 'Long-lasting fragrance for every wash. 4 signature scents.',
    price_paise: 49900,
    compare_price_paise: null,
    image_url: '/images/products/laundry-beads.jpg',
    variant_id: 'v2',
    variant_name: 'Lavender Dreams — 500g',
    sku: 'MGG-LB-LD',
    in_stock: true,
  },
  {
    id: '3',
    name: 'Floor Cleaner',
    slug: 'floor-cleaner',
    family: 'floor_cleaner' as const,
    short_description: 'Powerful lemon-fresh formula for all floor types.',
    price_paise: 29900,
    compare_price_paise: 39900,
    image_url: '/images/products/floor-cleaner.jpg',
    variant_id: 'v3',
    variant_name: '1 Litre',
    sku: 'MGG-FC-1L',
    in_stock: true,
  },
  {
    id: '4',
    name: 'Kitchen Degreaser',
    slug: 'kitchen-degreaser',
    family: 'kitchen_degreaser' as const,
    short_description: 'Cuts through grease and kitchen grime instantly.',
    price_paise: 34900,
    compare_price_paise: null,
    image_url: '/images/brand/product-range.jpg',
    variant_id: 'v4',
    variant_name: '500ml Spray',
    sku: 'MGG-KD-500',
    in_stock: true,
  },
  {
    id: '5',
    name: 'Shoe Cleaner',
    slug: 'shoe-cleaner',
    family: 'shoe_cleaner' as const,
    short_description: 'Restores all materials. Canvas, leather, mesh & more.',
    price_paise: 44900,
    compare_price_paise: 54900,
    image_url: '/images/brand/product-range.jpg',
    variant_id: 'v5',
    variant_name: '200ml Kit',
    sku: 'MGG-SC-200',
    in_stock: true,
  },
]

export default function HomePage() {
  return (
    <>
      {/* SECTION 1: Hero + Product Carousel */}
      <HeroSection />
      <ProductCarousel products={PLACEHOLDER_PRODUCTS} />

      {/* SECTION 2: Interactive Cleaning Education */}
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
