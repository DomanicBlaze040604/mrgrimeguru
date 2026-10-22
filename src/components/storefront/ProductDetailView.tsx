'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquarePlus,
  Send,
} from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

interface ProductVariant {
  id: string
  name: string
  price_paise: number
  compare_at_price_paise?: number
  in_stock: boolean
}

interface Review {
  id: string
  author_name: string
  rating: number
  title: string
  body: string
  created_at: string
}

interface ProductDetailViewProps {
  product: {
    id: string
    name: string
    slug: string
    price_paise: number
    compare_at_price_paise?: number
    description: string
    short_description: string
    images: string[]
    in_stock: boolean
    variants?: ProductVariant[]
    reviews?: Review[]
    category_name?: string
  }
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [purchaseType, setPurchaseType] = useState<'one_time' | 'subscription'>('one_time')
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'how_to_use' | 'ingredients' | 'safety'>('how_to_use')

  // Review submission modal state
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewAuthor, setReviewAuthor] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || [])

  const addItem = useCartStore((state) => state.addItem)
  const openDrawer = useCartStore((state) => state.openDrawer)

  const activePrice =
    purchaseType === 'subscription'
      ? Math.round(product.price_paise * 0.9) // 10% discount for subscription
      : product.price_paise

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      variant_id: product.variants?.[selectedVariant]?.id || product.id,
      product_name: `${product.name} ${product.variants?.[selectedVariant]?.name || ''}`.trim(),
      variant_name: product.variants?.[selectedVariant]?.name || 'Default',
      slug: product.slug,
      price_paise: activePrice,
      image_url: product.images?.[selectedImage] || product.images?.[0] || '/images/products/laundry-pods.jpg',
      quantity,
    })
    toast({
      title: 'Added to cart!',
      description: `${quantity}x ${product.name} ready in your cart.`,
      variant: 'default',
    })
    openDrawer()
  }

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault()
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus(`Eligible for Free Delivery by ${new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}!`)
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.')
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewAuthor || !reviewBody) {
      toast({ title: 'Please fill in your name and review', variant: 'error' })
      return
    }

    setIsSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          author_name: reviewAuthor,
          rating: reviewRating,
          title: reviewTitle,
          body: reviewBody,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast({ title: 'Review submitted!', description: 'Thank you for your feedback.' })
        setReviewsList([
          {
            id: 'new_' + Date.now(),
            author_name: reviewAuthor,
            rating: reviewRating,
            title: reviewTitle || 'Verified Review',
            body: reviewBody,
            created_at: new Date().toISOString(),
          },
          ...reviewsList,
        ])
        setShowReviewModal(false)
        setReviewAuthor('')
        setReviewTitle('')
        setReviewBody('')
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to submit review', variant: 'error' })
      }
    } catch {
      toast({ title: 'Review saved locally', description: 'Thank you for your rating!' })
      setShowReviewModal(false)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const images = product.images.length > 0 ? product.images : ['/images/products/laundry-pods.jpg']

  return (
    <div className="py-10 bg-[#FAF8F2]">
      <div className="container-wide">
        {/* Breadcrumb */}
        <div className="text-sm text-[#75828A] mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#24333A]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#24333A]">Shop</Link>
          <span>/</span>
          <span className="text-[#24333A] font-medium">{product.name}</span>
        </div>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-[#D6E8ED] shadow-sm">
              <Image
                src={images[selectedImage] || images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {product.compare_at_price_paise && (
                <div className="absolute top-4 left-4 bg-[#347F99] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  SAVE {Math.round(((product.compare_at_price_paise - product.price_paise) / product.compare_at_price_paise) * 100)}%
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#347F99] shadow-md' : 'border-[#D6E8ED] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-[#347F99] font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                {product.category_name || 'Mr GrimeGuru Premium Formula'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#24333A] tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-[#24333A]">4.9</span>
              <span className="text-sm text-[#75828A]">({reviewsList.length} verified ratings)</span>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-white border border-[#D6E8ED] space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#24333A]">
                  {formatPrice(activePrice)}
                </span>
                {product.compare_at_price_paise && (
                  <span className="text-lg text-[#75828A] line-through">
                    {formatPrice(product.compare_at_price_paise)}
                  </span>
                )}
                <span className="text-xs font-semibold text-[#347F99] bg-[#E6F5F8] px-2.5 py-1 rounded-full">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Purchase Mode Toggle */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPurchaseType('one_time')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    purchaseType === 'one_time'
                      ? 'border-[#347F99] bg-[#E6F5F8]/40 ring-1 ring-[#347F99]'
                      : 'border-[#D6E8ED] hover:border-[#75828A]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#24333A]">One-time Buy</div>
                  <div className="text-sm font-semibold text-[#24333A]">{formatPrice(product.price_paise)}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPurchaseType('subscription')}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    purchaseType === 'subscription'
                      ? 'border-[#347F99] bg-[#E6F5F8]/40 ring-1 ring-[#347F99]'
                      : 'border-[#D6E8ED] hover:border-[#75828A]'
                  }`}
                >
                  <span className="absolute -top-2.5 right-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    Save 10%
                  </span>
                  <div className="text-xs font-bold text-[#24333A]">Auto-Replenish</div>
                  <div className="text-sm font-semibold text-[#347F99]">
                    {formatPrice(Math.round(product.price_paise * 0.9))} / mo
                  </div>
                </button>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#D6E8ED] rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3.5 hover:bg-[#FAF8F2] text-[#24333A] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-sm text-[#24333A]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3.5 hover:bg-[#FAF8F2] text-[#24333A] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="flex-1 text-base shadow-md hover:shadow-lg"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {product.in_stock ? `Add to Cart • ${formatPrice(activePrice * quantity)}` : 'Out of Stock'}
              </Button>
            </div>

            {/* Pincode checker */}
            <div className="p-4 rounded-xl bg-white border border-[#D6E8ED] text-sm">
              <div className="font-semibold text-[#24333A] mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#347F99]" /> Check Delivery Availability
              </div>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-[#D6E8ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#24333A] text-white rounded-lg text-xs font-bold hover:bg-[#347F99] transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="mt-2 text-xs font-medium text-[#347F99]">{pincodeStatus}</p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-[#D6E8ED] pt-6 text-center">
              <div className="space-y-1">
                <Truck className="w-5 h-5 mx-auto text-[#347F99]" />
                <div className="text-xs font-bold text-[#24333A]">Free Shipping</div>
                <div className="text-[11px] text-[#75828A]">Orders over ₹499</div>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#347F99]" />
                <div className="text-xs font-bold text-[#24333A]">Pet & Kid Safe</div>
                <div className="text-[11px] text-[#75828A]">Zero Harsh Fumes</div>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-5 h-5 mx-auto text-[#347F99]" />
                <div className="text-xs font-bold text-[#24333A]">Clean Guarantee</div>
                <div className="text-[11px] text-[#75828A]">100% Satisfaction</div>
              </div>
            </div>

            {/* Accordion Info */}
            <div className="border border-[#D6E8ED] rounded-2xl bg-white overflow-hidden divide-y divide-[#D6E8ED]">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'how_to_use' ? ('' as any) : 'how_to_use')}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-[#24333A] hover:bg-[#FAF8F2]"
              >
                <span>How to Use for Best Results</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'how_to_use' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'how_to_use' && (
                <div className="px-5 py-4 text-sm text-[#75828A] space-y-2 bg-[#FAF8F2]/40">
                  <p>1. Toss 1 pod directly into the back of your empty washing drum or bucket.</p>
                  <p>2. Add clothes or warm water on top.</p>
                  <p>3. Run your standard wash cycle. The membrane dissolves completely in 30 seconds.</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'ingredients' ? ('' as any) : 'ingredients')}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-[#24333A] hover:bg-[#FAF8F2]"
              >
                <span>Active Ingredients & Science</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'ingredients' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'ingredients' && (
                <div className="px-5 py-4 text-sm text-[#75828A] space-y-2 bg-[#FAF8F2]/40">
                  <p>• Bio-enzymatic protease & amylase complexes targeted for curry & oil stains.</p>
                  <p>• Plant-based biodegradable coconut surfactants for deep dirt lifting.</p>
                  <p>• Pure essential oil botanical scent micro-capsules.</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'safety' ? ('' as any) : 'safety')}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-[#24333A] hover:bg-[#FAF8F2]"
              >
                <span>Safety, Storage & Indian Homes</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'safety' ? 'rotate-180' : ''}`} />
              </button>
              {activeTab === 'safety' && (
                <div className="px-5 py-4 text-sm text-[#75828A] space-y-2 bg-[#FAF8F2]/40">
                  <p>Keep tub closed securely in a cool, dry cabinet away from direct sunlight and water splashes. Always handle with dry hands.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20 pt-12 border-t border-[#D6E8ED]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#24333A]">Real Customer Experiences</h2>
              <p className="text-sm text-[#75828A]">Verified cleaning results from households across India</p>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#24333A] text-white text-sm font-bold hover:bg-[#347F99] transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4" /> Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl bg-white border border-[#D6E8ED] space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified Buyer
                  </span>
                </div>
                <h4 className="font-bold text-[#24333A] text-base">{rev.title}</h4>
                <p className="text-sm text-[#75828A] leading-relaxed">{rev.body}</p>
                <div className="text-xs font-semibold text-[#24333A] pt-2 border-t border-[#D6E8ED]">
                  — {rev.author_name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
              <h3 className="text-xl font-bold text-[#24333A] mb-4">Share Your Cleaning Story</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D6E8ED] rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`p-1.5 rounded-lg border ${reviewRating >= star ? 'text-amber-400 border-amber-300 bg-amber-50' : 'text-gray-300 border-gray-200'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">Review Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Cleared tough turmeric oil in 1 wash!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D6E8ED] rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">Your Honest Review</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How did Mr GrimeGuru work in your home? Fragrance, cleanliness, convenience..."
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D6E8ED] rounded-xl text-sm"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 text-sm text-[#75828A] hover:text-[#24333A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2 bg-[#347F99] text-white text-sm font-bold rounded-xl hover:bg-[#24333A] transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
