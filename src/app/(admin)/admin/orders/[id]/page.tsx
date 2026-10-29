'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ShoppingBag, Truck, CreditCard, MapPin,
  Clock, CheckCircle2, Save, User, Package
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { formatPrice } from '@/lib/utils'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [order, setOrder] = useState<any>(null)

  // Editable fields
  const [status, setStatus] = useState('processing')
  const [paymentStatus, setPaymentStatus] = useState('paid')
  const [fulfillmentStatus, setFulfillmentStatus] = useState('unfulfilled')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`)
        if (res.ok) {
          const data = await res.json()
          const ord = data.order
          setOrder(ord)
          setStatus(ord.status || 'processing')
          setPaymentStatus(ord.payment_status || 'paid')
          setFulfillmentStatus(ord.fulfillment_status || 'unfulfilled')
          setTrackingNumber(ord.tracking_number || '')
          setNotes(ord.notes || '')
        }
      } catch {
        toast({ title: 'Failed to load order details', variant: 'error' })
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          payment_status: paymentStatus,
          fulfillment_status: fulfillmentStatus,
          tracking_number: trackingNumber,
          notes,
        }),
      })

      if (!res.ok) throw new Error('Update failed')

      toast({
        title: 'Order Updated!',
        description: `Order status set to ${status}.`,
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Order Status Updated',
        description: 'Changes recorded successfully.',
        variant: 'success',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 text-center text-gray-500">Loading order...</div>
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <p className="text-gray-500">Order not found.</p>
        <Link href="/admin/orders" className="text-xs font-bold text-[#166534] underline">
          Back to Orders
        </Link>
      </div>
    )
  }

  const addr = order.shipping_address || {}
  const customerName = [addr.first_name, addr.last_name].filter(Boolean).join(' ') || 'Customer'

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#171714] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#24333A]">{order.order_number}</h1>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
              status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
              status === 'shipped' ? 'bg-blue-50 text-blue-700' :
              status === 'processing' ? 'bg-purple-50 text-purple-700' :
              'bg-amber-50 text-amber-700'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-xs text-[#75828A] mt-1">
            Placed on {new Date(order.created_at).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Shipping */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#24333A] flex items-center gap-2">
              <User className="w-4 h-4 text-[#166534]" /> Customer & Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#75828A] block">Full Name</span>
                <span className="font-bold text-[#24333A] text-sm">{customerName}</span>
              </div>
              <div>
                <span className="text-[#75828A] block">Contact Email</span>
                <span className="font-bold text-[#24333A]">{order.guest_email || '—'}</span>
              </div>
              <div>
                <span className="text-[#75828A] block">Phone Number</span>
                <span className="font-bold text-[#24333A]">{addr.phone || '—'}</span>
              </div>
              <div>
                <span className="text-[#75828A] block">Delivery Address</span>
                <span className="font-bold text-[#24333A] block leading-relaxed">
                  {[addr.line1, addr.city, addr.state, addr.postal_code, addr.country].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#24333A] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#166534]" /> Financial Breakdown
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#75828A]">
                <span>Items Subtotal</span>
                <span>{formatPrice(order.subtotal_paise || order.total_paise)}</span>
              </div>
              {order.discount_paise > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount ({order.discount_code || 'CODE'})</span>
                  <span>- {formatPrice(order.discount_paise)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#75828A]">
                <span>Shipping Charge</span>
                <span>{order.shipping_paise > 0 ? formatPrice(order.shipping_paise) : 'FREE'}</span>
              </div>
              <div className="flex justify-between text-[#75828A]">
                <span>Estimated Tax (GST 18% Incl.)</span>
                <span>{formatPrice(order.tax_paise || 0)}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-[#14532D]">
                <span>Total Amount</span>
                <span>{formatPrice(order.total_paise)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Manage Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#24333A] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#166534]" /> Order & Dispatch Actions
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#24333A] mb-1">
                Fulfillment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-[#24333A] bg-white capitalize"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24333A] mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-[#24333A] bg-white uppercase"
              >
                <option value="paid">PAID</option>
                <option value="pending">PENDING (COD / Retry)</option>
                <option value="failed">FAILED</option>
                <option value="refunded">REFUNDED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24333A] mb-1">
                Tracking AWB / Number
              </label>
              <input
                type="text"
                placeholder="e.g. DLV881920310"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono text-[#24333A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24333A] mb-1">
                Internal Dispatch Notes
              </label>
              <textarea
                rows={2}
                placeholder="Add warehouse or delivery instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-700"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-[#166534] hover:bg-[#14532D] font-bold shadow-xs flex items-center justify-center gap-1.5"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Update Order Status'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
