'use client'

import { ComboGallery } from './ComboGallery'
import { ShoppingBag, CheckCircle2, Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/lib/store/cart'
import { toast } from '@/components/ui/Toaster'

interface ComboProduct {
  slug: string
  name: string
}

export interface ProductCombo {
  id: string
  name: string
  slug: string
  description: string
  price_paise: number
  compare_price_paise: number | null
  products: ComboProduct[]
  is_active: boolean
  sort_order: number
}

export function CombosSection({ combos }: { combos: ProductCombo[] }) {
  const { addItem, openDrawer } = useCartStore()

  function handleAddComboToCart(combo: ProductCombo) {
    addItem({
      id: combo.id,
      product_id: combo.id,
      variant_id: combo.id,
      quantity: 1,
      name: combo.name,
      product_name: combo.name,
      variant_name: 'Value Bundle',
      price_paise: combo.price_paise,
      image_url: combo.products[0] ? `/images/products/${combo.products[0].slug}-cutout.png` : '/images/products/hero-collection.png',
      image: combo.products[0] ? `/images/products/${combo.products[0].slug}-cutout.png` : '/images/products/hero-collection.png',
      slug: combo.slug,
    })

    toast({
      title: 'Combo added to cart!',
      description: `${combo.name} is in your cart with bundle savings applied.`,
      variant: 'success',
    })
    openDrawer()
  }

  const activeCombos = combos.filter((c) => c.is_active)
  if (activeCombos.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-[#e5dcc9]" aria-label="Value Combos and Bundles">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b9460c] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Cleaner Bundles
          </div>
          <h2 className="text-3xl font-extrabold text-[#171714]">
            Super Saver Combos
          </h2>
          <p className="text-sm text-[#75828A] mt-1">
            Bundle your favourite cleaners together and unlock instant multi-pack savings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeCombos.map((combo) => {
          const discount = combo.compare_price_paise
            ? Math.round(
                ((combo.compare_price_paise - combo.price_paise) /
                  combo.compare_price_paise) *
                  100
              )
            : null

          return (
            <div
              key={combo.id}
              id={combo.slug}
              className="group rounded-3xl border border-[#e5dcc9] bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden"
            >
              <ComboGallery name={combo.name} products={combo.products} />
              {/* Top Row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {combo.products.length} In 1 Bundle
                </span>
                {discount && (
                  <span className="bg-[#b9460c] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs">
                    Save {discount}%
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-xl text-[#171714] leading-snug mb-1">
                {combo.name}
              </h3>
              <p className="text-xs text-[#75828A] line-clamp-2 mb-4">
                {combo.description}
              </p>

              {/* Product list */}
              <div className="p-3.5 rounded-2xl bg-[#FFFBF0] border border-[#f0e6d2] mb-6 space-y-1.5 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b9460c] block">
                  Included in this box:
                </span>
                {combo.products.map((p) => (
                  <div key={p.slug} className="flex items-center gap-2 text-xs font-semibold text-[#171714]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-2xl text-[#171714]">
                      {formatPrice(combo.price_paise)}
                    </span>
                    {combo.compare_price_paise && (
                      <span className="text-xs text-[#75828A] line-through">
                        {formatPrice(combo.compare_price_paise)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Free shipping included
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddComboToCart(combo)}
                  className="bg-[#171714] text-[#FACC15] hover:bg-[#b9460c] hover:text-white font-bold shadow-xs px-4"
                >
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  Add Bundle
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
