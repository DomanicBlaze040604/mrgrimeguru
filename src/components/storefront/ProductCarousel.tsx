'use client'

import React, { useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingCart, Tag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
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
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
    },
    [autoplay.current]
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
      style={{ backgroundColor: '#FAF8F2' }}
      aria-label="Product catalogue"
    >
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p
              className="text-caption mb-2"
              style={{ color: '#347F99' }}
            >
              Our Products
            </p>
            <h2 className="text-headline" style={{ color: '#24333A' }}>
              The Full Range
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full border-2 border-[#D6E8ED] flex items-center justify-center hover:border-[#347F99] hover:text-[#347F99] transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full border-2 border-[#D6E8ED] flex items-center justify-center hover:border-[#347F99] hover:text-[#347F99] transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container gap-5">
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
                  style={{ flex: '0 0 min(280px, 80vw)' }}
                >
                  <article className="product-card group h-full flex flex-col">
                    {/* Image */}
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
                        sizes="280px"
                      />
                      {discount && (
                        <div className="absolute top-3 left-3 bg-[#24333A] text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{discount}%
                        </div>
                      )}
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <span className="font-semibold text-sm text-[#75828A]">Out of Stock</span>
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1 gap-2">
                      <p className="text-caption" style={{ color: '#347F99' }}>
                        {product.variant_name}
                      </p>
                      <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-bold text-base text-[#24333A] hover:text-[#347F99] transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-[#75828A] flex-1 line-clamp-2">
                        {product.short_description}
                      </p>

                      {/* Price */}
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

                      {/* Add to Cart */}
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full mt-1"
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
          <Button variant="outline" size="lg" asChild>
            <Link href="/shop">
              View All Products <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
