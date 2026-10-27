import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar, Share2, Sparkles, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ARTICLES } from '../page'
import { AddToCartButton } from '@/components/storefront/AddToCartButton'

interface BlogPostProps {
  params: Promise<{ slug: string }>
}

const ARTICLE_CONTENT: Record<string, {
  body: string[]
  recommendedProduct: {
    id: string
    name: string
    slug: string
    price_paise: number
    image: string
  }
}> = {
  'kitchen-degreasing-guide-chimneys-tiles-stovetops': {
    recommendedProduct: {
      id: 'kitchen-degreaser',
      name: 'Mr GrimeGuru Heavy-Duty Kitchen Degreaser Spray (500ml)',
      slug: 'kitchen-degreaser',
      price_paise: 29900,
      image: '/images/products/kitchen-cleaner-cutout.png',
    },
    body: [
      'Anyone who cooks daily Indian food knows that tadka mustard seeds, hot ghee splatters, and turmeric vapors create a stubborn film that regular dish soap simply smears around.',
      'The biggest mistake most people make is aggressive scrubbing with steel wool on stainless steel chimney baffles or quartz countertops. This micro-scratches the surface, creating tiny crevices where oil bonds even more permanently next time.',
      'Here is the science-backed 3-step degreasing protocol:',
      '1. Target with Solvent Foam: Use a citrus-terpene or surfactant foam. Foam clings to vertical chimney mesh and backsplash tiles instead of dripping down into the stove burner.',
      '2. Dwell Time Matters: Allow exactly 60 to 90 seconds for the alkaline surfactants to saponify (break apart) polymerized oil molecules.',
      '3. Microfiber Wipe, Not Scrub: Use a warm, damp microfiber cloth. The split fibers lift and trap the dissolved oil without leaving a greasy sheen.',
    ],
  },
  'science-of-scent-micro-capsules-laundry-freshness': {
    recommendedProduct: {
      id: 'laundry-beads',
      name: 'Mr GrimeGuru In-Wash Scent Booster Beads (250g)',
      slug: 'laundry-beads',
      price_paise: 44900,
      image: '/images/products/laundry-beads.jpg',
    },
    body: [
      'In hot and humid weather, clothes often smell musty just a few hours after putting them on. Why does this happen even with clean laundry?',
      'Standard liquid fabric softeners use silicone polymers that coat fabric yarns. While this makes clothes feel soft initially, it creates a waterproof layer that traps body sebum, sweat, and odour-causing bacteria deep inside the weave.',
      'In-wash scent beads take an entirely different chemical approach: micro-encapsulation.',
      'Fragrance molecules are encased in microscopic biodegradable shells that fuse into the garment fibers during the rinse cycle. Rather than evaporating all at once, these shells burst incrementally throughout the day when your body moves or touches the fabric.',
      'The result: Up to 12 weeks of crisp freshness in closets, and touch-activated aroma that activates precisely when you need it most.',
    ],
  },
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug)
  if (!article) return { title: 'Cleaning Guide — Mr GrimeGuru' }

  return {
    title: `${article.title} — Mr GrimeGuru`,
    description: article.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params
  const article = ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  const content = ARTICLE_CONTENT[slug] || {
    recommendedProduct: {
      id: 'laundry-pods',
      name: 'Mr GrimeGuru 3-in-1 Power Laundry Pods (Pack of 30)',
      slug: 'laundry-pods',
      price_paise: 39900,
      image: '/images/products/laundry-pods.jpg',
    },
    body: [
      article.excerpt,
      'Effective home hygiene is not about spending hours scrubbing with harsh chemicals. It is about understanding surface chemistry and choosing targeted, concentrated formulas that do the heavy lifting for you.',
      'By replacing abrasive cleaners with bio-enzymatic formulas, you protect your furniture, floors, and garments while keeping your indoor air free of toxic fumes.',
    ],
  }

  return (
    <div className="min-h-screen bg-[#fffbf0] py-12">
      <div className="container-wide max-w-4xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[#b9460c] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cleaning Guides
        </Link>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff2be] text-[#b9460c]">
            <Sparkles className="w-3.5 h-3.5" />
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#171714] tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#75828A] pt-4 border-t border-[#e5dcc9]">
            <span className="font-semibold text-[#171714]">By {article.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {article.publishedAt}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#e5dcc9] mb-12 shadow-sm bg-white">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl border border-[#e5dcc9] p-8 sm:p-12 shadow-sm mb-12 space-y-6 text-[#171714] text-base sm:text-lg leading-relaxed">
          {content.body.map((paragraph, i) => (
            <p key={i} className="text-[#3a4d55]">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Shoppable Product Callout Box */}
        {content.recommendedProduct && (
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#fff2be] via-[#fffbf0] to-[#fffbf0] border border-[#facc15] shadow-sm mb-12">
            <span className="text-xs font-bold text-[#b9460c] uppercase tracking-wider block mb-2">
              Featured Solution in This Guide
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white border border-[#e5dcc9] shrink-0">
                <Image
                  src={content.recommendedProduct.image}
                  alt={content.recommendedProduct.name}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-xl text-[#171714] mb-1">
                  {content.recommendedProduct.name}
                </h3>
                <p className="text-xs text-[#75828A] mb-4">
                  The exact formula engineered to dissolve these stains in seconds.
                </p>
                <div className="max-w-xs">
                  <AddToCartButton
                    product={{
                      id: content.recommendedProduct.id,
                      name: content.recommendedProduct.name,
                      slug: content.recommendedProduct.slug,
                      price_paise: content.recommendedProduct.price_paise,
                      image: content.recommendedProduct.image,
                      in_stock: true,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-[#e5dcc9]">
          <Link
            href="/blog"
            className="font-bold text-sm text-[#b9460c] hover:underline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> All Cleaning Guides
          </Link>
          <Link
            href="/shop"
            className="font-bold text-sm text-[#171714] hover:text-[#b9460c] flex items-center gap-2"
          >
            Explore Cleaning Catalog <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
