import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Sparkles, Shield, Droplets } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/storefront/AddToCartButton'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const CATEGORY_META: Record<string, {
  name: string
  tagline: string
  description: string
  heroImage: string
  benefits: string[]
  stats: { value: string; label: string }[]
}> = {
  'laundry-pods': {
    name: 'Laundry Pods',
    tagline: '3-in-1 Power Dissolve in 30 Seconds',
    description: 'Triple-chamber laundry capsules with high-potency stain enzyme action, fabric softeners, and long-lasting freshness in hot or cold water.',
    heroImage: '/images/products/laundry-pods.jpg',
    benefits: ['Zero messy measurement', '100% water-soluble PVA film', 'Safe on whites & colours', 'Plant-derived bio-enzymes'],
    stats: [
      { value: '30s', label: 'Dissolve Time' },
      { value: '3x', label: 'Enzyme Concentration' },
      { value: '99.9%', label: 'Germ Protection' },
    ],
  },
  'laundry-beads': {
    name: 'Laundry Scent Beads',
    tagline: '12-Week Touch-Activated Micro-Capsule Fragrance',
    description: 'In-wash scent booster pearls infused with essential oil micro-capsules that burst slowly throughout wear for unstoppable, luxurious aroma.',
    heroImage: '/images/products/laundry-beads.jpg',
    benefits: ['Up to 12 weeks of freshness', 'Safe for all fabrics & workout wear', 'Dye-free & residue-free formula', '4 signature Indian aroma profiles'],
    stats: [
      { value: '12 Wks', label: 'Scent Longevity' },
      { value: '4 Scents', label: 'Curated Profiles' },
      { value: '0%', label: 'Residue Formula' },
    ],
  },
  'floor-cleaner': {
    name: 'Floor Cleaner Concentrate',
    tagline: 'Streak-Free Shine with Pet & Baby Safe Botanicals',
    description: 'High-dilution botanical floor cleaning elixir that lifts deep dirt, removes grime, and leaves behind citrus botanical brilliance without harsh residue.',
    heroImage: '/images/products/floor-cleaner.jpg',
    benefits: ['Safe for crawling toddlers & pets', 'Quick-drying & non-sticky finish', 'Works on marble, vitrified tiles & granite', 'Natural antibacterial neem & pine'],
    stats: [
      { value: '1 Capful', label: 'Per Half Bucket' },
      { value: '100%', label: 'Pet & Child Safe' },
      { value: 'Quick', label: 'Dry Formulation' },
    ],
  },
  'kitchen-degreaser': {
    name: 'Kitchen Degreaser Spray',
    tagline: 'Melts Burnt-on Indian Tadka Oil in 60 Seconds',
    description: 'Foaming citrus-solvent degreasing formula that penetrates stubborn chimney soot, exhaust grease, stove burn marks, and fryer crust effortlessly.',
    heroImage: '/images/products/kitchen-degreaser.jpg',
    benefits: ['Zero harsh fume inhalation', 'Cuts hard spice oil & ghee deposits', 'Safe on stainless steel, brass & quartz', 'Dual foam & mist trigger nozzle'],
    stats: [
      { value: '60s', label: 'Breakdown Speed' },
      { value: 'Citrus', label: 'Solvent Base' },
      { value: 'Food Safe', label: 'Surface Formula' },
    ],
  },
  'shoe-cleaner': {
    name: 'Shoe & Sneaker Foam Cleaner',
    tagline: 'Instant Dry Foam for Suede, Canvas, Leather & Mesh',
    description: 'No-water-soak cleaning foam with dual-density scrub brush that restores dirty white soles and delicate uppers in under 3 minutes.',
    heroImage: '/images/products/shoe-cleaner.jpg',
    benefits: ['No water soaking needed', 'Prevents yellowing on white sneakers', 'Gentle on nubuck, knit & suede', 'Includes ergonomic hog-hair brush'],
    stats: [
      { value: '3 Mins', label: 'Full Shoe Refresh' },
      { value: '0 Water', label: 'Soak Needed' },
      { value: 'All Types', label: 'Soles & Uppers' },
    ],
  },
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORY_META[slug]
  if (!cat) return { title: 'Product Category — Mr GrimeGuru' }

  return {
    title: `${cat.name} — Mr GrimeGuru`,
    description: cat.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const meta = CATEGORY_META[slug]

  if (!meta) {
    notFound()
  }

  const supabase = await createClient()

  // Fetch category and products
  const { data: categoryData } = await supabase
    .from('product_categories')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  let products: any[] = []
  if (categoryData?.id) {
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, price_paise, compare_at_price_paise, short_description, images, in_stock')
      .eq('category_id', categoryData.id)
      .eq('is_published', true)

    if (data && data.length > 0) {
      products = data
    }
  }

  // Fallback demo product if DB has none yet
  if (products.length === 0) {
    products = [
      {
        id: `mock_${slug}_1`,
        name: `Mr GrimeGuru ${meta.name} (Original)`,
        slug: slug,
        price_paise: 39900,
        compare_at_price_paise: 49900,
        short_description: meta.description,
        images: [meta.heroImage],
        in_stock: true,
      },
      {
        id: `mock_${slug}_2`,
        name: `Mr GrimeGuru ${meta.name} (Value Double Pack)`,
        slug: `${slug}-pack-of-2`,
        price_paise: 69900,
        compare_at_price_paise: 89900,
        short_description: `Double supply of ${meta.name.toLowerCase()} with bonus microfiber cloth. Save 22%.`,
        images: [meta.heroImage],
        in_stock: true,
      },
    ]
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      {/* Category Hero */}
      <section className="bg-gradient-to-b from-[#E6F5F8] via-[#FAF8F2] to-[#FAF8F2] pt-8 pb-14 border-b border-[#D6E8ED]">
        <div className="container-wide">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-[#347F99] hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#9FD8E8]/30 text-[#347F99] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Category Spotlight
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#24333A] mb-4 tracking-tight">
                {meta.name}
              </h1>
              <p className="text-lg sm:text-xl font-medium text-[#347F99] mb-4">
                {meta.tagline}
              </p>
              <p className="text-[#75828A] text-base leading-relaxed mb-8 max-w-2xl">
                {meta.description}
              </p>

              {/* Stat callouts */}
              <div className="grid grid-cols-3 gap-4 border-t border-[#D6E8ED] pt-6">
                {meta.stats.map((stat, i) => (
                  <div key={i} className="text-left">
                    <div className="text-2xl font-bold text-[#24333A]">{stat.value}</div>
                    <div className="text-xs text-[#75828A]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border border-[#D6E8ED] shadow-lg bg-white">
                <Image
                  src={meta.heroImage}
                  alt={meta.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-12 border-b border-[#D6E8ED] bg-white">
        <div className="container-wide">
          <h2 className="text-xl font-bold text-[#24333A] mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#347F99]" />
            Why Choose Mr GrimeGuru {meta.name}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {meta.benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F2] border border-[#E8D8C1]/60"
              >
                <CheckCircle2 className="w-5 h-5 text-[#347F99] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[#24333A]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#24333A]">
              Available In This Collection
            </h2>
            <span className="text-sm text-[#75828A]">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => {
              const imageSrc =
                Array.isArray(p.images) && p.images[0] ? p.images[0] : meta.heroImage
              const hasDiscount =
                p.compare_at_price_paise && p.compare_at_price_paise > p.price_paise
              const discountPercent = hasDiscount
                ? Math.round(
                    ((p.compare_at_price_paise! - p.price_paise) /
                      p.compare_at_price_paise!) *
                      100
                  )
                : 0

              return (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl border border-[#D6E8ED] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <Link
                    href={`/products/${p.slug}`}
                    className="relative aspect-square block overflow-hidden bg-[#F2EBE0]/30"
                  >
                    <Image
                      src={imageSrc}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {hasDiscount && (
                      <span className="absolute top-3 left-3 bg-[#347F99] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        Save {discountPercent}%
                      </span>
                    )}
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="font-bold text-lg text-[#24333A] group-hover:text-[#347F99] transition-colors mb-2 line-clamp-1">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-[#75828A] line-clamp-2 mb-4">
                        {p.short_description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-[#24333A]">
                          {formatPrice(p.price_paise)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-[#75828A] line-through">
                            {formatPrice(p.compare_at_price_paise!)}
                          </span>
                        )}
                      </div>

                      <AddToCartButton
                        product={{
                          id: p.id,
                          name: p.name,
                          slug: p.slug,
                          price_paise: p.price_paise,
                          image: imageSrc,
                          in_stock: p.in_stock,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
