import { LaundryComingSoon } from '@/components/storefront/LaundryComingSoon'
import { getCleanerOffer, getDatabaseFamily } from '@/lib/cleaner-offers'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductImageGallery } from '@/components/storefront/ProductImageGallery'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/storefront/AddToCartButton'
import { Filter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shop All Products — Mr GrimeGuru',
  description: 'Browse the full Mr GrimeGuru range — Shoe Cleaner, Multipurpose Cleaner, Kitchen Cleaner, and Laundry Pods.',
}

type ProductFamily = 'shoe_cleaner' | 'multipurpose_cleaner' | 'kitchen_cleaner' | 'laundry_pods'

const FAMILY_LABELS: Record<ProductFamily, string> = {
  shoe_cleaner: 'Shoe Cleaner',
  multipurpose_cleaner: 'Multipurpose Cleaner',
  kitchen_cleaner: 'Kitchen Cleaner',
  laundry_pods: 'Laundry Pods',
}

const FAMILY_EMOJIS: Record<ProductFamily, string> = {
  shoe_cleaner: '👟',
  multipurpose_cleaner: '🧹',
  kitchen_cleaner: '🍳',
  laundry_pods: '🫧',
}

const PLACEHOLDER_PRODUCTS = [
  { id: '1', name: 'Laundry Pods', slug: 'laundry-pods', family: 'laundry_pods' as ProductFamily, short_description: 'Pre-measured detergent pods designed to simplify your wash routine.', price_paise: 89900, compare_price_paise: 109900, image_url: '/images/products/laundry-pods.jpg', variant_id: 'v1', variant_name: '30 Pods', sku: 'MGG-LP-30', in_stock: true },
  { id: '2', name: 'Shoe Cleaner', slug: 'shoe-cleaner', family: 'shoe_cleaner' as ProductFamily, short_description: 'A dedicated solution for cleaning compatible footwear and tackling everyday dirt.', price_paise: 59900, compare_price_paise: 69900, image_url: '/images/products/shoe-cleaner-cutout.png', variant_id: 'v2', variant_name: '500 ml', sku: 'MGG-SC-200', in_stock: true },
  { id: '3', name: 'Multipurpose Cleaner', slug: 'multipurpose-cleaner', family: 'multipurpose_cleaner' as ProductFamily, short_description: 'A versatile option for everyday cleaning on approved household surfaces.', price_paise: 49900, compare_price_paise: 59900, image_url: '/images/products/multipurpose-cleaner-cutout.png', variant_id: 'v3', variant_name: '500 ml', sku: 'MGG-MP-500', in_stock: true },
  { id: '4', name: 'Kitchen Cleaner', slug: 'kitchen-cleaner', family: 'kitchen_cleaner' as ProductFamily, short_description: 'A targeted solution for everyday kitchen messes and grease on compatible surfaces.', price_paise: 49900, compare_price_paise: 59900, image_url: '/images/products/kitchen-cleaner-cutout.png', variant_id: 'v4', variant_name: '500 ml', sku: 'MGG-KC-500', in_stock: true },
]

async function getProducts(family?: string) {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('products')
      .select(`
        id, name, slug, family, short_description, status,
        product_variants!inner(id, name, sku, price_paise, compare_at_price_paise, is_default),
        product_media(url, is_hero, sort_order)
      `)
      .eq('status', 'active')
      .eq('product_variants.is_default', true)
      .order('sort_order')

    if (family) {
      query = query.eq('family', getDatabaseFamily(family))
    }

    const { data, error } = await query.limit(20)
    if (error || !data?.length) return null
    return data
  } catch {
    return null
  }
}

interface ShopPageProps {
  searchParams: Promise<{ family?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const family = params.family

  const dbProducts = await getProducts(family)

  // Use DB products if available, otherwise use placeholders filtered by family
  const products = dbProducts
    ? dbProducts.map((p) => {
        const offer = getCleanerOffer(p.slug)
        const variant = Array.isArray(p.product_variants) ? p.product_variants[0] : p.product_variants
        const heroMedia = Array.isArray(p.product_media)
          ? p.product_media.find((m) => m.is_hero) || p.product_media[0]
          : null
        return {
          id: p.id,
          name: offer?.name ?? p.name,
          slug: offer?.slug ?? p.slug,
          family: (offer?.family ?? p.family) as ProductFamily,
          short_description: offer?.description ?? p.short_description,
          price_paise: offer?.price ?? variant?.price_paise ?? 0,
          compare_price_paise: offer?.original ?? variant?.compare_at_price_paise ?? null,
          image_url: (offer ? `/images/products/${offer.slug}-cutout.png` : heroMedia?.url) || `/images/products/${p.slug}.jpg`,
          variant_id: variant?.id,
          variant_name: offer ? '500 ml' : variant?.name,
          sku: variant?.sku,
          in_stock: true,
        }
      })
    : family
    ? PLACEHOLDER_PRODUCTS.filter((p) => p.family === family)
    : PLACEHOLDER_PRODUCTS

  const families = Object.entries(FAMILY_LABELS).filter(([key]) => key !== 'laundry_pods') as [ProductFamily, string][]

  return (
    <div style={{ backgroundColor: '#fffbf0' }}>
      {/* Header */}
      <div
        className="py-16 text-center"
        style={{ background: 'linear-gradient(160deg, #fff2be 0%, #fffbf0 100%)' }}
      >
        <h1 className="text-4xl font-bold text-[#171714] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          Shop All Products
        </h1>
        <p className="text-[#75828A] max-w-md mx-auto">
          Find your Guru for kitchens, shoes and everyday home messes.
        </p>
      </div>

      <div className="container-wide py-12">
        {/* Family filter */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#75828A] mr-2">
            <Filter className="h-4 w-4" /> Filter:
          </div>
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
              !family
                ? 'border-[#b9460c] bg-[#b9460c] text-white'
                : 'border-[#e5dcc9] text-[#171714] hover:border-[#b9460c]'
            }`}
          >
            All Products
          </Link>
          {families.map(([key, label]) => (
            <Link
              key={key}
              href={`/shop?family=${key}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                family === key
                  ? 'border-[#b9460c] bg-[#b9460c] text-white'
                  : 'border-[#e5dcc9] text-[#171714] hover:border-[#b9460c]'
              }`}
            >
              <span>{FAMILY_EMOJIS[key]}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.filter(product => !['laundry-pods', 'laundry-beads'].includes(product.slug)).map((product) => {
            const discount = product.compare_price_paise
              ? Math.round(((product.compare_price_paise - product.price_paise) / product.compare_price_paise) * 100)
              : null

            return (
              <article key={product.id} className="product-card group flex flex-col">
                <div className="guru-shop-product-art relative aspect-square overflow-hidden block"><ProductImageGallery slug={product.slug} name={product.name} image={product.image_url} />{discount && <span className="guru-discount-badge">-{discount}%</span>}</div>

                <div className="p-4 flex flex-col flex-1 gap-2">
                  <p className="text-caption" style={{ color: '#b9460c' }}>
                    {product.variant_name}
                  </p>
                  <Link href={`/shop/${product.slug}`}>
                    <h2 className="font-bold text-base text-[#171714] hover:text-[#b9460c] transition-colors leading-snug">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="text-sm text-[#75828A] flex-1 line-clamp-2">
                    {product.short_description}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="font-bold text-lg text-[#171714]">
                      {formatPrice(product.price_paise)}
                    </span>
                    {product.compare_price_paise && (
                      <span className="text-sm text-[#75828A] line-through">
                        {formatPrice(product.compare_price_paise)}
                      </span>
                    )}
                  </div>
                  <AddToCartButton product={product} />
                </div>
              </article>
            )
          })}
        </div>

        {(!family || family === 'laundry_pods') && <LaundryComingSoon />}

        {products.length === 0 && family !== 'laundry_pods' && (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-[#171714] mb-2">No products found</p>
            <Link href="/shop" className="text-sm text-[#b9460c] hover:underline">
              View all products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
