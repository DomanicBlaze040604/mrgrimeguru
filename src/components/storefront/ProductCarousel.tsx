'use client'
import { OfferBadge } from './OfferBadge'

import React, { useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, ShoppingCart, Tag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { getProductSlides } from '@/lib/product-gallery'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

interface Product {
  id: string
  name: string
  slug: string
  family: string
  short_description: string
  price_paise: number
  compare_price_paise: number | null
  image_url: string
  variant_id: string
  variant_name: string
  sku: string
  in_stock: boolean
}

interface ProductCarouselProps {
  products: Product[]
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [autoplay] = React.useState(
    () => Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    },
    [autoplay]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const { addItem } = useCartStore()

  function handleAddToCart(product: Product) {
    addItem({
      product_id: product.id,
      variant_id: product.variant_id,
      quantity: 1,
      product_name: product.name,
      variant_name: product.variant_name,
      price_paise: product.price_paise,
      image_url: product.image_url,
      slug: product.slug,
    })
    toast({
      title: 'Added to cart!',
      description: `${product.name} — ${product.variant_name}`,
      variant: 'success',
    })
  }

  return (
    <section
      className="section-gap"
      style={{ backgroundColor: '#FFFFFF' }}
      aria-label="Product catalogue"
    >
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#166534] mb-2">
              <Tag className="w-3.5 h-3.5" />
              Bestsellers & New Launches
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#14532D]">
              Most Loved Formulations
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#166534] hover:text-[#166534] hover:bg-[#F0FDF4] transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#166534] hover:text-[#166534] hover:bg-[#F0FDF4] transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container gap-6">
            {products.map((product) => {
              const discount = product.compare_price_paise
                ? Math.round(
                    ((product.compare_price_paise - product.price_paise) /
                      product.compare_price_paise) *
                      100
                  )
                : null

              return (
                <div
                  key={product.id}
                  className="embla__slide"
                  style={{ flex: '0 0 min(300px, 85vw)' }}
                >
                  <article className="product-card group h-full flex flex-col rounded-3xl border border-gray-100 hover:border-emerald-200/90 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden p-3 sm:p-4">
                    {/* Image */}
                    <Link
                      href={`/shop/${product.slug}`}
                      className="relative aspect-square overflow-hidden rounded-2xl bg-[#F8FAF7] block mb-3"
                      aria-label={`View ${product.name}`}
                    >
                      <Image
                        src={getProductSlides(product.slug, product.name, product.image_url)[0].src}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-108"
                        sizes="300px"
                      />
                      {discount && (
                        <div className="absolute top-3 left-3 bg-[#166534] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wide">
                          Save {discount}%
                        </div>
                      )}
                      <OfferBadge />
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                          <span className="font-bold text-sm text-gray-500">Out of Stock</span>
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex flex-col flex-1 gap-1.5 px-1">
                      {/* Rating + Variant Pill */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#059669] font-bold bg-[#F0FDF4] px-2 py-0.5 rounded-md">
                          {product.variant_name}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <span>★</span>
                          <span className="text-gray-700">4.9</span>
                        </div>
                      </div>

                      <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-extrabold text-base text-[#14532D] hover:text-[#166534] transition-colors leading-snug line-clamp-1 mt-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 flex-1 line-clamp-2">
                        {product.short_description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                        <span className="font-black text-lg text-[#14532D]">
                          {formatPrice(product.price_paise)}
                        </span>
                        {product.compare_price_paise && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(product.compare_price_paise)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full mt-2 bg-[#166534] hover:bg-[#14532D] shadow-xs"
                        leftIcon={<ShoppingCart className="h-4 w-4" />}
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.in_stock}
                      >
                        {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="border-2 border-[#166534] text-[#166534] hover:bg-[#F0FDF4]" asChild>
            <Link href="/shop">
              Explore All Natural Cleaners <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
