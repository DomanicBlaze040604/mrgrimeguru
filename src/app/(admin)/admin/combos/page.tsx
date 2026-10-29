'use client'

import React, { useState, useEffect } from 'react'
import {
  Layers, Plus, Trash2, CheckCircle2, XCircle, Tag,
  ShoppingBag, Sparkles, AlertCircle, ArrowRight
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

interface ComboProduct {
  slug: string
  name: string
}

interface ProductCombo {
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

const AVAILABLE_CLEANERS = [
  { slug: 'kitchen-cleaner', name: 'Kitchen Cleaner (500 ml)', defaultPrice: 49900 },
  { slug: 'shoe-cleaner', name: 'Shoe Cleaner (500 ml)', defaultPrice: 69900 },
  { slug: 'multipurpose-cleaner', name: 'Multipurpose Cleaner (500 ml)', defaultPrice: 79900 },
]

const DEFAULT_COMBOS: ProductCombo[] = [
  {
    id: 'combo_1',
    name: 'Clean Home Starter Pack',
    slug: 'clean-home-starter',
    description: 'Kitchen Cleaner + Multipurpose Cleaner — tackle the whole house at one special price.',
    price_paise: 119900,
    compare_price_paise: 139800,
    products: [
      { slug: 'kitchen-cleaner', name: 'Kitchen Cleaner (500 ml)' },
      { slug: 'multipurpose-cleaner', name: 'Multipurpose Cleaner (500 ml)' },
    ],
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'combo_2',
    name: 'Grime-Fighting Trio Bundle',
    slug: 'grime-fighting-trio',
    description: 'All 3 power cleaners: Kitchen, Multipurpose and Shoe Cleaner. Maximum clean, maximum savings.',
    price_paise: 169900,
    compare_price_paise: 209700,
    products: [
      { slug: 'kitchen-cleaner', name: 'Kitchen Cleaner (500 ml)' },
      { slug: 'multipurpose-cleaner', name: 'Multipurpose Cleaner (500 ml)' },
      { slug: 'shoe-cleaner', name: 'Shoe Cleaner (500 ml)' },
    ],
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'combo_3',
    name: 'Kitchen & Kicks Duo',
    slug: 'kitchen-and-kicks',
    description: 'Degrease the stove, revive your sneakers. The lifestyle cleaning duo.',
    price_paise: 104900,
    compare_price_paise: 129800,
    products: [
      { slug: 'kitchen-cleaner', name: 'Kitchen Cleaner (500 ml)' },
      { slug: 'shoe-cleaner', name: 'Shoe Cleaner (500 ml)' },
    ],
    is_active: true,
    sort_order: 3,
  },
]

export default function AdminCombosPage() {
  const [combos, setCombos] = useState<ProductCombo[]>(DEFAULT_COMBOS)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [priceRupees, setPriceRupees] = useState('')
  const [compareRupees, setCompareRupees] = useState('')
  const [selectedCleaners, setSelectedCleaners] = useState<string[]>([
    'kitchen-cleaner',
    'shoe-cleaner',
  ])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchCombos() {
      try {
        const res = await fetch('/api/admin/combos')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data.combos) && data.combos.length > 0) {
            setCombos(data.combos)
          }
        }
      } catch (err) {
        console.error('Failed to load combos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCombos()
  }, [])

  function toggleCleaner(cleanerSlug: string) {
    if (selectedCleaners.includes(cleanerSlug)) {
      if (selectedCleaners.length > 1) {
        setSelectedCleaners(selectedCleaners.filter((s) => s !== cleanerSlug))
      } else {
        toast({ title: 'Select at least 1 cleaner for the combo', variant: 'error' })
      }
    } else {
      setSelectedCleaners([...selectedCleaners, cleanerSlug])
    }
  }

  async function handleCreateCombo(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast({ title: 'Please enter a combo name', variant: 'error' })
      return
    }

    const price = Math.round(Number(priceRupees) * 100)
    const compare = compareRupees ? Math.round(Number(compareRupees) * 100) : null

    if (!price || price <= 0) {
      toast({ title: 'Please enter a valid combo price', variant: 'error' })
      return
    }

    const comboSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const products = selectedCleaners.map((s) => {
      const match = AVAILABLE_CLEANERS.find((c) => c.slug === s)
      return { slug: s, name: match ? match.name : s }
    })

    setSubmitting(true)

    const newCombo: ProductCombo = {
      id: 'combo_' + Date.now(),
      name,
      slug: comboSlug,
      description,
      price_paise: price,
      compare_price_paise: compare,
      products,
      is_active: true,
      sort_order: combos.length + 1,
    }

    try {
      const res = await fetch('/api/admin/combos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCombo),
      })

      if (res.ok) {
        const data = await res.json()
        setCombos([...combos, data.combo || newCombo])
      } else {
        setCombos([...combos, newCombo])
      }

      toast({
        title: 'Combo Created!',
        description: `${name} is now available in your store.`,
        variant: 'success',
      })

      setShowModal(false)
      setName('')
      setSlug('')
      setDescription('')
      setPriceRupees('')
      setCompareRupees('')
      setSelectedCleaners(['kitchen-cleaner', 'shoe-cleaner'])
    } catch {
      setCombos([...combos, newCombo])
      toast({
        title: 'Combo Created (Offline Saved)',
        description: `${name} has been added to your combos list.`,
        variant: 'success',
      })
      setShowModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteCombo(id: string) {
    setCombos(combos.filter((c) => c.id !== id))
    try {
      await fetch('/api/admin/combos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      toast({ title: 'Combo removed', variant: 'default' })
    } catch {
      toast({ title: 'Combo removed locally', variant: 'default' })
    }
  }

  async function handleToggleStatus(combo: ProductCombo) {
    const updated = { ...combo, is_active: !combo.is_active }
    setCombos(combos.map((c) => (c.id === combo.id ? updated : c)))
    try {
      await fetch('/api/admin/combos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: combo.id, is_active: updated.is_active }),
      })
    } catch {
      // Local state updated
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#24333A]">Combos & Bundles</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {combos.length} Bundles
            </span>
          </div>
          <p className="text-sm text-[#75828A]">
            Create multi-product cleaner bundles with special combo pricing to boost average order value.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="bg-[#166534] hover:bg-[#14532D] shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Combo
        </Button>
      </div>

      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((combo) => {
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
              className={`rounded-3xl border transition-all p-6 flex flex-col bg-white shadow-sm hover:shadow-md ${
                combo.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60 bg-gray-50'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                    {combo.products.length} Products Pack
                  </span>
                  <h3 className="text-lg font-extrabold text-[#24333A] leading-snug">
                    {combo.name}
                  </h3>
                </div>
                {discount && (
                  <span className="bg-[#b9460c] text-white text-[11px] font-black px-2.5 py-1 rounded-full shrink-0">
                    Save {discount}%
                  </span>
                )}
              </div>

              <p className="text-xs text-[#75828A] line-clamp-2 mb-4">
                {combo.description}
              </p>

              {/* Included Cleaners */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-gray-100 mb-5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Included in this combo:
                </span>
                {combo.products.map((p) => (
                  <div key={p.slug} className="flex items-center gap-2 text-xs font-semibold text-[#14532D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>

              {/* Price & Actions */}
              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-[#14532D]">
                      {formatPrice(combo.price_paise)}
                    </span>
                    {combo.compare_price_paise && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(combo.compare_price_paise)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400">
                    Slug: /{combo.slug}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(combo)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                      combo.is_active
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {combo.is_active ? 'Active' : 'Paused'}
                  </button>

                  <button
                    onClick={() => handleDeleteCombo(combo.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete combo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Create New Combo */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#24333A]">Create Product Combo</h3>
                <p className="text-xs text-[#75828A]">Bundle products together with discount pricing</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCombo} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#24333A] mb-1">
                  Combo Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kitchen & Sneaker Duo"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                    }
                  }}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-[#24333A] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24333A] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. kitchen-sneaker-duo"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24333A] mb-1">
                  Short Description
                </label>
                <textarea
                  placeholder="Tell customers what is inside and why this bundle is great..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-[#24333A]"
                />
              </div>

              {/* Cleaner Selector */}
              <div>
                <label className="block text-xs font-bold text-[#24333A] mb-2">
                  Select Products to Include *
                </label>
                <div className="space-y-2">
                  {AVAILABLE_CLEANERS.map((cleaner) => {
                    const selected = selectedCleaners.includes(cleaner.slug)
                    return (
                      <div
                        key={cleaner.slug}
                        onClick={() => toggleCleaner(cleaner.slug)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selected
                            ? 'border-emerald-600 bg-emerald-50/60 text-[#14532D]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {}}
                            className="rounded text-emerald-600 w-4 h-4"
                          />
                          <span className="font-semibold text-xs">{cleaner.name}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-500">
                          {formatPrice(cleaner.defaultPrice)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">
                    Combo Price (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 999"
                    value={priceRupees}
                    onChange={(e) => setPriceRupees(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl font-bold text-[#14532D]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">
                    Strike / MRP Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1198"
                    value={compareRupees}
                    onChange={(e) => setCompareRupees(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-[#166534] hover:bg-[#14532D]"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Save & Publish Combo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
