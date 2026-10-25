import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
  { id: '2', name: 'Shoe Cleaner', slug: 'shoe-cleaner', family: 'shoe_cleaner' as ProductFamily, short_description: 'A dedicated solution for cleaning compatible footwear and tackling everyday dirt.', price_paise: 44900, compare_price_paise: 54900, image_url: '/images/products/shoe-cleaner-1.jpeg', variant_id: 'v2', variant_name: '200ml Kit', sku: 'MGG-SC-200', in_stock: true },
  { id: '3', name: 'Multipurpose Cleaner', slug: 'multipurpose-cleaner', family: 'multipurpose_cleaner' as ProductFamily, short_description: 'A versatile option for everyday cleaning on approved household surfaces.', price_paise: 39900, compare_price_paise: 49900, image_url: '/images/products/multipurpose-cleaner-1.jpeg', variant_id: 'v3', variant_name: '500ml Spray', sku: 'MGG-MP-500', in_stock: true },
  { id: '4', name: 'Kitchen Cleaner', slug: 'kitchen-cleaner', family: 'kitchen_cleaner' as ProductFamily, short_description: 'A targeted solution for everyday kitchen messes and grease on compatible surfaces.', price_paise: 34900, compare_price_paise: null, image_url: '/images/products/kitchen-cleaner-1.jpeg', variant_id: 'v4', variant_name: '500ml Spray', sku: 'MGG-KC-500', in_stock: true },
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
      query = query.eq('family', family)
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
        const variant = Array.isArray(p.product_variants) ? p.product_variants[0] : p.product_variants
        const heroMedia = Array.isArray(p.product_media)
          ? p.product_media.find((m) => m.is_hero) || p.product_media[0]
          : null
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          family: p.family as ProductFamily,
          short_description: p.short_description,
          price_paise: variant?.price_paise || 0,
          compare_price_paise: variant?.compare_at_price_paise || null,
          image_url: heroMedia?.url || `/images/products/${p.slug}.jpg`,
          variant_id: variant?.id,
          variant_name: variant?.name,
          sku: variant?.sku,
          in_stock: true,
        }
      })
    : family
    ? PLACEHOLDER_PRODUCTS.filter((p) => p.family === family)
    : PLACEHOLDER_PRODUCTS

  const families = Object.entries(FAMILY_LABELS) as [ProductFamily, string][]

  return (
    <div style={{ backgroundColor: '#FAF8F2' }}>
      {/* Header */}
      <div
        className="py-16 text-center"
        style={{ background: 'linear-gradient(160deg, #E6F5F8 0%, #FAF8F2 100%)' }}
      >
        <h1 className="text-4xl font-bold text-[#24333A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
          Shop All Products
        </h1>
        <p className="text-[#75828A] max-w-md mx-auto">
          5 premium cleaning product families for the modern Indian home.
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
                ? 'border-[#347F99] bg-[#347F99] text-white'
                : 'border-[#D6E8ED] text-[#24333A] hover:border-[#347F99]'
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
                  ? 'border-[#347F99] bg-[#347F99] text-white'
                  : 'border-[#D6E8ED] text-[#24333A] hover:border-[#347F99]'
              }`}
            >
              <span>{FAMILY_EMOJIS[key]}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const discount = product.compare_price_paise
              ? Math.round(((product.compare_price_paise - product.price_paise) / product.compare_price_paise) * 100)
              : null

            return (
              <article key={product.id} className="product-card group flex flex-col">
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative aspect-square overflow-hidden block"
                  aria-label={`View ${product.name}`}
                >
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {discount && (
                    <div className="absolute top-3 left-3 bg-[#24333A] text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="text-lg">{FAMILY_EMOJIS[product.family]}</span>
                  </div>
                </Link>

                <div className="p-4 flex flex-col flex-1 gap-2">
                  <p className="text-caption" style={{ color: '#347F99' }}>
                    {product.variant_name}
                  </p>
                  <Link href={`/shop/${product.slug}`}>
                    <h2 className="font-bold text-base text-[#24333A] hover:text-[#347F99] transition-colors leading-snug">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="text-sm text-[#75828A] flex-1 line-clamp-2">
                    {product.short_description}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="font-bold text-lg text-[#24333A]">
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

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-[#24333A] mb-2">No products found</p>
            <Link href="/shop" className="text-sm text-[#347F99] hover:underline">
              View all products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
