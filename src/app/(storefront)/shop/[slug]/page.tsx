import { ProductImageGallery } from '@/components/storefront/ProductImageGallery'
import { getCleanerOffer } from '@/lib/cleaner-offers'
import { getProductSlides } from '@/lib/product-gallery'
import { CONTACT } from '@/lib/contact'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Sparkles, Clock, ShoppingBag } from 'lucide-react'
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
  infoImage?: string
  videos?: string[]
  benefits: string[]
  howToUse: string[]
  comingSoon?: boolean
  stats: { value: string; label: string }[]
  accentColor: string
  bgColor: string
}> = {
  'shoe-cleaner': {
    name: 'Shoe Cleaner',
    tagline: 'Give Your Footwear a Fresh Start.',
    description: 'A dedicated shoe-cleaning solution designed to help remove everyday dirt and surface marks from compatible footwear materials. Check the label for approved materials before use.',
    heroImage: '/images/products/shoe-cleaner-cutout.png',
    infoImage: '/images/products/shoe-cleaner-info.jpeg',
    videos: [
      '/images/products/shoe-cleaner-1.mp4',
      '/images/products/shoe-cleaner-2.mp4',
      '/images/products/shoe-cleaner-3.mp4',
    ],
    benefits: [
      'Designed for footwear cleaning',
      'Helps tackle everyday dirt & surface marks',
      'Practical for your shoe-care routine',
      'Check label for compatible materials',
    ],
    howToUse: [
      'Remove loose dirt and dust from the shoe.',
      'Check the footwear care label and the cleaner\'s label.',
      'Test on a small, inconspicuous area first.',
      'Apply the recommended amount using the method on the packaging.',
      'Wipe or rinse as directed and allow to dry naturally.',
    ],
    stats: [
      { value: 'Spray', label: '& Wipe' },
      { value: 'All', label: 'Compatible Materials' },
      { value: '🔒', label: 'Secret Formula' },
    ],
    accentColor: '#4338CA',
    bgColor: '#EDE9FE',
  },
  'multipurpose-cleaner': {
    name: 'Multipurpose Cleaner',
    tagline: 'One Cleaner for Everyday Messes.',
    description: 'A versatile cleaning solution for compatible household surfaces, everyday spills, and routine cleaning tasks. Always check the label for approved surfaces.',
    heroImage: '/images/products/multipurpose-cleaner-cutout.png',
    infoImage: '/images/products/multipurpose-cleaner-info.jpeg',
    videos: [
      '/images/products/multipurpose-1.mp4',
      '/images/products/multipurpose-2.mp4',
    ],
    benefits: [
      'Designed for routine household cleaning',
      'Suitable for approved surfaces on the label',
      'Spray on, wait, wipe clean',
      'Our own formula — not a white-label product',
    ],
    howToUse: [
      'Read the product label and confirm the surface is compatible.',
      'Remove loose dirt where appropriate.',
      'Apply using the method and quantity on the packaging.',
      'Observe any stated contact time.',
      'Wipe or rinse as instructed and allow to dry.',
    ],
    stats: [
      { value: 'Spray', label: '& Wipe' },
      { value: 'Multi', label: 'Surface' },
      { value: '🔒', label: 'Secret Formula' },
    ],
    accentColor: '#D97706',
    bgColor: '#FEF9C3',
  },
  'kitchen-cleaner': {
    name: 'Kitchen Cleaner',
    tagline: 'Take on Everyday Kitchen Messes.',
    description: 'Designed to help tackle everyday kitchen residue and grease on compatible surfaces. Spray it on, let the formula work, wipe it away.',
    heroImage: '/images/products/kitchen-cleaner-cutout.png',
    infoImage: '/images/products/kitchen-cleaner-info.jpeg',
    videos: [
      '/images/products/kitchen-cleaner-1.mp4',
      '/images/products/kitchen-cleaner-2.mp4',
      '/images/products/kitchen-cleaner-3.mp4',
    ],
    benefits: [
      'Designed for kitchen cleaning',
      'Tackles everyday grease & surface residue',
      'Spray on — formula clings and lifts',
      'Check label for compatible kitchen surfaces',
    ],
    howToUse: [
      'Read the instructions and check surface compatibility.',
      'Keep food, utensils, and exposed food items away.',
      'Apply the cleaner as directed on the packaging.',
      'Allow the recommended contact time if specified.',
      'Wipe and rinse the surface as required. Rinse food-prep surfaces before use.',
    ],
    stats: [
      { value: 'Spray', label: '& Wipe' },
      { value: 'Kitchen', label: 'Surfaces' },
      { value: '🔒', label: 'Secret Formula' },
    ],
    accentColor: '#BE123C',
    bgColor: '#FFE4E6',
  },
  'laundry-pods': {
    name: 'Laundry Pods',
    tagline: 'Make Laundry Day Simpler.',
    description: 'Pre-measured detergent pods designed to help clean clothes without the need to measure liquid or powder for every load. Coming soon.',
    heroImage: '/images/products/laundry-pods.jpg',
    benefits: [
      'Pre-measured detergent format',
      'Designed for laundry cleaning as directed',
      'Convenient for regular washing routines',
      'Simplifies detergent dosing',
    ],
    howToUse: [
      'Read packaging and garment care labels before washing.',
      'Check the recommended number of pods for your load size.',
      'Handle pods with dry hands and place as per packaging instructions.',
      'Add clothes and select an appropriate wash cycle.',
      'Store unused pods in original packaging, away from children and pets.',
    ],
    comingSoon: true,
    stats: [
      { value: 'Pre', label: 'Measured' },
      { value: 'All', label: 'Machine Types' },
      { value: '🔜', label: 'Coming Soon' },
    ],
    accentColor: '#111111',
    bgColor: '#fff0bc',
  },
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORY_META[slug]
  if (!cat) return { title: 'Product — Mr GrimeGuru' }
  return {
    title: `${cat.name} — Mr GrimeGuru`,
    description: cat.description,
  }
}

function VideoPlayer({ src, label, accentColor }: { src: string; label: string; accentColor: string }) {
  'use client'
  return (
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-lg">
      <video
        className="w-full h-full object-contain"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        aria-label={`${label} video`}
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  )
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  if (slug === 'laundry-pods') redirect('/shop#coming-soon')
  const meta = CATEGORY_META[slug]

  if (!meta) notFound()
  const productInformation = getProductSlides(slug, meta.name, meta.heroImage).filter(slide => slide.artwork)

  // Try DB first
  const supabase = await createClient()
  let products: Array<{
    id: string; name: string; slug: string; price_paise: number;
    compare_at_price_paise: number | null; short_description: string;
    images: string[]; in_stock: boolean; variant_id?: string; variant_name?: string;
  }> = []

  try {
    const offer = getCleanerOffer(slug)
    const { data } = await supabase.from('products')
      .select('id, name, slug, short_description, product_variants!inner(id, name, price_paise, compare_at_price_paise, is_default)')
      .in('slug', Array.from(new Set([slug, offer?.legacySlug ?? slug])))
      .eq('status', 'active')
      .eq('product_variants.is_default', true)
    if (data?.length) products = data.map(product => {
      const variant = product.product_variants[0]
      return {
        id: product.id,
        name: offer?.name ?? product.name,
        slug,
        price_paise: offer?.price ?? variant.price_paise,
        compare_at_price_paise: offer?.original ?? variant.compare_at_price_paise,
        short_description: meta.description,
        images: [meta.heroImage],
        in_stock: true,
        variant_id: variant.id,
        variant_name: offer ? '500 ml' : variant.name,
      }
    })
  } catch { /* no DB yet */ }

  // Fallback placeholder
  if (products.length === 0 && !meta.comingSoon) {
    products = [
      {
        id: `mock_${slug}_1`,
        name: `Mr GrimeGuru ${meta.name}`,
        slug,
        price_paise: slug === 'shoe-cleaner' ? 59900 : 49900,
        compare_at_price_paise: slug === 'shoe-cleaner' ? 69900 : 59900,
        short_description: meta.description,
        images: [meta.heroImage],
        in_stock: true,
      },
    ]
  }

  return (
    <div className="min-h-screen bg-[#fffbf0]">

      {/* ── Hero ── */}
      <section
        className="pt-8 pb-16 border-b border-gray-100"
        style={{ background: `linear-gradient(160deg, ${meta.bgColor} 0%, #fffbf0 100%)` }}
      >
        <div className="container-wide">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#111111] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to All Products
          </Link>

          <div className="guru-product-intro grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ backgroundColor: meta.bgColor, color: meta.accentColor }}>
                <Sparkles className="w-3.5 h-3.5" />
                {meta.comingSoon ? 'Coming Soon' : 'Secret Formula'}
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-[#111827] mb-3 tracking-tight">
                {meta.name}
              </h1>
              <p className="text-xl font-semibold mb-4" style={{ color: meta.accentColor }}>
                {meta.tagline}
              </p>
              <p className="text-[#655e51] text-base leading-relaxed mb-8 max-w-lg">
                {meta.description}
              </p>

              {/* Stats */}
              <div className="flex gap-8 border-t border-gray-200 pt-6">
                {meta.stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-[#111827]">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="guru-product-description">
                <span className="guru-eyebrow">KNOW YOUR GURU</span>
                <h2>A little know-how.<br />A cleaner home.</h2>
                <p>What it does, where to use it, and how to get started.</p>
                <div className="guru-product-accordions">
                  {productInformation.map((info, index) => <details key={info.src} open={index === 0}>
                    <summary>{info.title}<span aria-hidden="true">+</span></summary>
                    <ul>{info.points.map(point => <li key={point}>{point}</li>)}</ul>
                  </details>)}
                </div>
                <div className="guru-product-help"><Link href="/shipping">Free shipping ₹499+</Link><Link href="/returns">7-day return requests</Link><a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">Ask your Guru ↗</a></div>
            </div>

            {/* Purchase panel stays beside the introduction, before the demos. */}
            <div className="guru-purchase-panel">
              <div className="guru-purchase-image"><ProductImageGallery slug={slug} name={meta.name} image={meta.heroImage} preload /></div>
              {products.map(p => <div className="guru-purchase-details" key={p.id}><div><span className="guru-eyebrow">500 ML</span><h2>{p.name}</h2><p>{p.short_description}</p></div><div className="guru-purchase-price"><strong>{formatPrice(p.price_paise)}</strong>{p.compare_at_price_paise && <s>{formatPrice(p.compare_at_price_paise)}</s>}<span>Free shipping</span></div><AddToCartButton product={{...p, image:meta.heroImage}} showBuyNow /></div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Videos ── */}
      {meta.videos && meta.videos.length > 0 && (
        <section className="py-16 bg-[#111827]" aria-label="Product videos">
          <div className="container-wide">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: meta.accentColor }}>
                Watch It Work
              </p>
              <h2 className="text-3xl font-black text-white">Real results. Our secret formula.</h2>
              <p className="text-gray-400 mt-1">Spray. Wait. Wipe.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {meta.videos.map((src, i) => (
                <div key={src} className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-lg">
                  <video
                    className="w-full h-full object-contain"
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`${meta.name} video ${i + 1}`}
                  >
                    <source src={src} type="video/mp4" />
                    <track kind="captions" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-semibold text-sm">{meta.name}</p>
                    <p className="text-white/60 text-xs">Clip {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits ── */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container-wide">
          <h2 className="text-xl font-black text-[#111827] mb-6">Why {meta.name}?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {meta.benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 p-4 rounded-xl bg-[#fffbf0] border border-gray-100">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: meta.accentColor }} />
                <span className="text-sm font-medium text-[#171714]">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to Use + Info Image ── */}
      <section className="py-16 bg-[#fffbf0]">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-black text-[#111827] mb-6">How to Use</h2>
              <ol className="space-y-4">
                {meta.howToUse.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-white text-sm"
                      style={{ backgroundColor: meta.accentColor }}
                    >
                      {i + 1}
                    </div>
                    <p className="text-[#655e51] text-base leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {meta.infoImage && (
              <div className="guru-product-info-art relative aspect-square">
                <ProductImageGallery slug={slug} name={meta.name} image={meta.heroImage} informationOnly />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── All Products CTA ── */}
      <section className="py-12 bg-[#fffbf0] border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-3">Explore the full range</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: meta.accentColor }}
        >
          <ShoppingBag className="w-4 h-4" /> Shop All Products
        </Link>
      </section>

    </div>
  )
}
