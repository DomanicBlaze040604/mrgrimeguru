'use client'

import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

interface Product {
  id: string
  name: string
  slug: string
  price_paise: number
  variant_id?: string
  variant_name?: string
  sku?: string
  image_url?: string
  image?: string
  in_stock: boolean
}

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCartStore()

  const comingSoon = product.slug === 'laundry-pods'
  function handleAddToCart() {
    if (comingSoon) return
    addItem({
      id: product.id,
      product_id: product.id,
      variant_id: product.variant_id,
      quantity: 1,
      name: product.name,
      product_name: product.name,
      variant_name: product.variant_name,
      price_paise: product.price_paise,
      image: product.image || product.image_url || '/images/products/laundry-pods.jpg',
      image_url: product.image_url || product.image || '/images/products/laundry-pods.jpg',
      slug: product.slug,
    })
    toast({ title: 'Added to cart!', description: `${product.name}`, variant: 'success' })
  }

  return (
    <Button
      variant="primary"
      size="sm"
      className="w-full mt-1"
      leftIcon={<ShoppingCart className="h-4 w-4" />}
      onClick={handleAddToCart}
      disabled={comingSoon || !product.in_stock}
    >
      {comingSoon ? 'Coming soon' : product.in_stock ? 'Add to Cart' : 'Out of Stock'}
    </Button>
  )
}
