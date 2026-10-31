'use client'

import React from 'react'
import { Gift, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/Button'
import { getCleanerOffer } from '@/lib/cleaner-offers'

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

export function AddToCartButton({ product, showBuyNow = false }: { product: Product; showBuyNow?: boolean }) {
  const { addItem, closeCart, closeInfoPanel, openCart } = useCartStore()
  const router = useRouter()

  const comingSoon = ['laundry-pods', 'laundry-beads'].includes(product.slug)
  const showOffer = showBuyNow && Boolean(getCleanerOffer(product.slug))
  function handleAddToCart(buyNow = false) {
    if (comingSoon || !product.in_stock) return
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
    if (buyNow) {
      closeCart()
      closeInfoPanel()
      router.push('/cart')
    } else {
      openCart()
    }
  }

  return (
    <div className={showBuyNow ? 'guru-purchase-actions' : ''}>
      {showOffer && <div className="guru-purchase-offer"><Gift size={23} aria-hidden="true" /><div><strong>Buy 1 Get 1 Free</strong><span>Two 500 ml cans. One great deal.</span></div></div>}
      <div className={showBuyNow ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}><Button
      variant={showBuyNow ? 'outline' : 'primary'}
      size="sm"
      className="w-full mt-1 min-h-12"
      leftIcon={<ShoppingCart className="h-4 w-4" />}
      onClick={() => handleAddToCart()}
      disabled={comingSoon || !product.in_stock}
    >
      {comingSoon ? 'Coming soon' : product.in_stock ? showOffer ? 'Add to Cart (1+1 Free)' : 'Add to Cart' : 'Out of Stock'}
    </Button>{showBuyNow && <Button variant="primary" size="sm" className="w-full mt-1 min-h-12" onClick={() => handleAddToCart(true)} disabled={comingSoon || !product.in_stock}>{showOffer ? 'Order Now (1+1 Free)' : 'Buy now'}</Button>}</div></div>
  )
}
