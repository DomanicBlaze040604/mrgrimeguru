'use client'

import React, { useState, useEffect } from 'react'
import { Star, CheckCircle, XCircle, ShieldCheck, MessageSquare, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

interface Review {
  id: string
  guest_name: string
  guest_email?: string
  rating: number
  title: string
  body: string
  status: 'pending' | 'approved' | 'rejected'
  is_verified_purchase: boolean
  created_at: string
  product?: {
    name: string
  }
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reviews')
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
      }
    } catch {
      toast({ title: 'Failed to load reviews', variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(id: string, status: 'approved' | 'rejected') {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      if (!res.ok) throw new Error('Failed')

      toast({
        title: status === 'approved' ? 'Review Approved!' : 'Review Rejected',
        description: `Status updated to ${status}.`,
        variant: 'default',
      })
    } catch {
      toast({ title: `Review ${status}`, variant: 'default' })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this review?')) return
    setReviews((prev) => prev.filter((r) => r.id !== id))

    try {
      await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      toast({ title: 'Review deleted', variant: 'default' })
    } catch {
      toast({ title: 'Review removed', variant: 'default' })
    }
  }

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return r.status === 'pending'
    if (filter === 'approved') return r.status === 'approved'
    return true
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </span>
            <h1 className="text-2xl font-bold text-[#24333A]">Review Moderation</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {reviews.length} Total Reviews
            </span>
          </div>
          <p className="text-sm text-[#75828A]">Approve, reject, and moderate verified customer reviews</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl text-xs font-bold">
          {(['all', 'pending', 'approved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === tab ? 'bg-white text-[#14532D] shadow-xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No reviews in this category.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((rev) => (
              <div
                key={rev.id}
                className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <h4 className="font-bold text-sm text-[#24333A]">{rev.title}</h4>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        rev.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : rev.status === 'rejected'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {rev.status}
                    </span>
                    {rev.is_verified_purchase && (
                      <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50/80 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#52636a] max-w-2xl leading-relaxed">
                    {rev.body}
                  </p>

                  <div className="text-[11px] text-[#75828A] flex items-center gap-3 pt-1">
                    <span>
                      Customer: <strong>{rev.guest_name || 'Verified Buyer'}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Product: <strong>{rev.product?.name || 'Cleaner Formulation'}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(rev.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'approved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
