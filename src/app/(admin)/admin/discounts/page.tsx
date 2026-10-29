'use client'

import React, { useState, useEffect } from 'react'
import { Tag, Plus, CheckCircle2, XCircle, Trash2, Clock, Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

interface Discount {
  id: string
  code: string
  type: 'percentage' | 'fixed_amount'
  value: number
  min_order_paise: number
  max_uses: number
  used_count: number
  is_active: boolean
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Form State
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percentage' | 'fixed_amount'>('percentage')
  const [value, setValue] = useState('')
  const [minOrderRupees, setMinOrderRupees] = useState('499')
  const [maxUses, setMaxUses] = useState('500')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  async function fetchDiscounts() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/discounts')
      if (res.ok) {
        const data = await res.json()
        setDiscounts(data.discounts || [])
      }
    } catch {
      toast({ title: 'Failed to load discounts', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleStatus(d: Discount) {
    const updated = { ...d, is_active: !d.is_active }
    setDiscounts((prev) => prev.map((item) => (item.id === d.id ? updated : item)))

    try {
      await fetch('/api/admin/discounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: d.id, is_active: updated.is_active }),
      })
      toast({
        title: updated.is_active ? 'Coupon Activated' : 'Coupon Paused',
        variant: 'default',
      })
    } catch {
      // Local state preserved
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    setDiscounts((prev) => prev.filter((d) => d.id !== id))

    try {
      await fetch('/api/admin/discounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      toast({ title: 'Coupon deleted', variant: 'default' })
    } catch {
      toast({ title: 'Coupon removed locally', variant: 'default' })
    }
  }

  async function handleCreateDiscount(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || !value) {
      toast({ title: 'Please provide code and discount value', variant: 'error' })
      return
    }

    setSubmitting(true)
    const min_order_paise = Number(minOrderRupees) * 100

    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          type,
          value: Number(value),
          min_order_paise,
          max_uses: Number(maxUses) || 500,
          is_active: true,
        }),
      })

      if (!res.ok) throw new Error('Create failed')
      const data = await res.json()
      setDiscounts([data.discount, ...discounts])

      toast({
        title: 'Coupon Created!',
        description: `Promo code ${code.toUpperCase()} is now live.`,
        variant: 'success',
      })

      setShowModal(false)
      setCode('')
      setValue('')
    } catch {
      toast({ title: 'Failed to create coupon', variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Tag className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#24333A]">Promotional Coupons & Discounts</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {discounts.length} Active Coupons
            </span>
          </div>
          <p className="text-sm text-[#75828A]">Manage marketing promo codes, minimum spend, and redemptions</p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="bg-[#166534] hover:bg-[#14532D] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Coupon
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Coupon Code
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Discount Value
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Min. Order
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Redemptions
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {discounts.map((c) => (
                <tr key={c.id || c.code} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-sm text-[#166534] bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {c.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#24333A]">
                    {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#52636a]">
                    {c.min_order_paise > 0 ? formatPrice(c.min_order_paise) : 'No Minimum'}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-xs text-[#24333A]">
                    {c.used_count || 0} / {c.max_uses || '∞'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(c)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                        c.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Paused'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#24333A]">Create Promo Code</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleCreateDiscount} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-[#24333A] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. CLEAN20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl font-mono font-bold text-[#166534]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-[#24333A] bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Flat Rupees (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">Value *</label>
                  <input
                    type="number"
                    placeholder={type === 'percentage' ? '15' : '100'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl font-bold text-[#24333A]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">Min. Order (₹)</label>
                  <input
                    type="number"
                    value={minOrderRupees}
                    onChange={(e) => setMinOrderRupees(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs text-gray-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="bg-[#166534] hover:bg-[#14532D]" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Save Coupon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
