import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FastrrOrderSync } from '@/components/admin/FastrrOrderSync'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Orders — Admin',
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: dbOrders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      guest_email,
      status,
      payment_status,
      fulfillment_status,
      total_paise,
      subtotal_paise,
      discount_paise,
      shipping_address,
      created_at
    `)
    .order('created_at', { ascending: false })

  const orders = (dbOrders || []).map((o) => {
    const addr = o.shipping_address || {}
    const name = [addr.first_name, addr.last_name].filter(Boolean).join(' ') || 'Customer'
    const city = addr.city || 'India'
    return {
      id: o.id,
      order_number: o.order_number,
      customer_email: o.guest_email || 'Email not provided',
      customer_phone: addr.phone || '',
      shipping_name: name,
      shipping_city: city,
      total_amount_paise: Number(o.total_paise) || 0,
      status: o.status || 'pending',
      payment_status: o.payment_status || 'pending',
      created_at: o.created_at,
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#24333A]">Customer Orders</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {orders.length} Total Orders
            </span>
          </div>
          <p className="text-sm text-[#75828A]">Track shipments, dispatch status, customer payments and fulfillment</p>
        </div>
      </div>

      <FastrrOrderSync />
      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Destination
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Fulfillment Status
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Payment
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Total
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#24333A]">
                    <Link href={`/admin/orders/${ord.id}`} className="hover:text-[#166534] transition-colors">
                      {ord.order_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#24333A]">{ord.shipping_name}</div>
                    <div className="text-xs text-[#75828A]">{ord.customer_email}</div>
                    <div className="text-xs text-[#75828A]">{ord.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-[#52636a]">
                    {ord.shipping_city}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                      ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                      ord.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                      ord.status === 'processing' ? 'bg-purple-50 text-purple-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                      ord.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {ord.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#24333A]">
                    {formatPrice(ord.total_amount_paise)}
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-[#75828A]">
                    {new Date(ord.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-[#166534] hover:text-white transition-colors text-xs font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
