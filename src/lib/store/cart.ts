'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, CartTotals } from '@/types'
import { getCleanerOffer } from '@/lib/cleaner-offers'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  isInfoPanelOpen: boolean
  lastAddedItem: CartItem | null
  discountCode: string | null
  discountAmountPaise: number

  addItem: (item: {
    id?: string
    product_id?: string
    variant_id?: string
    quantity?: number
    name?: string
    product_name?: string
    variant_name?: string
    price_paise: number
    image?: string
    image_url?: string | null
    slug: string
  }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  openInfoPanel: (item: CartItem) => void
  closeInfoPanel: () => void
  setDiscount: (code: string, amount: number) => void
  removeDiscount: () => void
  applyDiscount: (code: string, amount: number) => void
  openDrawer: () => void
  subtotalPaise: () => number
  getTotals: () => CartTotals
}

// Shipping calculation (configurable via admin settings in real implementation)
function calculateShipping(subtotalPaise: number): number {
  if (subtotalPaise >= 49900) return 0 // Free above ₹499
  return 4900 // Flat ₹49
}

// Tax calculation (configurable — GST rates vary by product)
function calculateTax(subtotalPaise: number): number {
  return Math.round(subtotalPaise * 0.18) // 18% GST placeholder
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isInfoPanelOpen: false,
      lastAddedItem: null,
      discountCode: null,
      discountAmountPaise: 0,

      addItem: (newItem) => {
        if (newItem.slug === 'laundry-pods') return
        set((state) => {
          const itemKey = newItem.variant_id || newItem.id || newItem.slug
          const existing = state.items.find(
            (item) => item.id === itemKey || (newItem.variant_id && item.variant_id === newItem.variant_id)
          )

          const normalizedName = newItem.name || newItem.product_name || 'Product'
          const normalizedImage = newItem.image || newItem.image_url || '/images/products/laundry-pods.jpg'
          const qty = newItem.quantity || 1

          let items: CartItem[]
          let addedItem: CartItem

          if (existing) {
            items = state.items.map((item) =>
              item === existing
                ? { ...item, variant_name: newItem.variant_name ?? item.variant_name, quantity: item.quantity + qty }
                : item
            )
            addedItem = { ...existing, quantity: existing.quantity + qty }
          } else {
            addedItem = {
              id: itemKey,
              product_id: newItem.product_id || itemKey,
              variant_id: newItem.variant_id || itemKey,
              name: normalizedName,
              product_name: newItem.product_name || normalizedName,
              variant_name: newItem.variant_name || '',
              price_paise: newItem.price_paise,
              image: normalizedImage,
              image_url: newItem.image_url || normalizedImage,
              slug: newItem.slug,
              quantity: qty,
            }
            items = [...state.items, addedItem]
          }

          return {
            items,
            lastAddedItem: addedItem,
            isInfoPanelOpen: true,
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id && item.variant_id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id || item.variant_id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], discountCode: null, discountAmountPaise: 0 })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      openInfoPanel: (item) => set({ isInfoPanelOpen: true, lastAddedItem: item }),
      closeInfoPanel: () => set({ isInfoPanelOpen: false }),

      setDiscount: (code, amount) => {
        set({ discountCode: code, discountAmountPaise: amount })
      },

      removeDiscount: () => {
        set({ discountCode: null, discountAmountPaise: 0 })
      },

      applyDiscount: (code, amount) => get().setDiscount(code, amount),
      openDrawer: () => get().openCart(),

      subtotalPaise: () => get().getTotals().subtotal_paise,

      getTotals: (): CartTotals => {
        const { items, discountAmountPaise = 0 } = get()

        const subtotal_paise = items.reduce(
          (sum, item) => sum + item.price_paise * item.quantity,
          0
        )
        const item_count = items.reduce((sum, item) => sum + item.quantity, 0)
        const shipping_paise = calculateShipping(subtotal_paise)
        const tax_paise = calculateTax(subtotal_paise)
        const total_paise = subtotal_paise - (typeof discountAmountPaise === 'number' ? discountAmountPaise : 0) + shipping_paise + tax_paise

        return {
          subtotal_paise,
          discount_paise: typeof discountAmountPaise === 'number' ? discountAmountPaise : 0,
          shipping_paise,
          tax_paise,
          total_paise: Math.max(0, total_paise),
          item_count,
        }
      },
    }),
    {
      name: 'grimeguru-cart',
      version: 1,
      migrate: (persisted) => {
        const previous = persisted as Partial<CartStore> | undefined
        return {
          ...previous,
          items: (previous?.items ?? []).map(item => {
            const offer = getCleanerOffer(item.slug)
            return offer && /560\s*ml/i.test(`${item.name} ${item.variant_name}`)
              ? { ...item, name: offer.name, product_name: offer.name, variant_name: '500 ml' }
              : item
          }),
        }
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
        discountAmountPaise: state.discountAmountPaise,
      }),
    }
  )
)
