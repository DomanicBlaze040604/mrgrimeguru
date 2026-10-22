import type { Metadata } from 'next'
import { Tag, Plus, CheckCircle2, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Discounts — Admin',
}

export default async function AdminDiscountsPage() {
  const coupons = [
    {
      code: 'CLEAN10',
      type: 'percentage',
      value: 10,
      description: '10% off for first-time customers',
      min_order_paise: 39900,
      times_used: 142,
      is_active: true,
    },
    {
      code: 'FREESHIP',
      type: 'fixed',
      value_paise: 4900,
      description: 'Free shipping on any order',
      min_order_paise: 0,
      times_used: 89,
      is_active: true,
    },
    {
      code: 'FESTIVE20',
      type: 'percentage',
      value: 20,
      description: 'Diwali special cleaning 20% discount',
      min_order_paise: 99900,
      times_used: 47,
      is_active: true,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#24333A]">Promotional Coupons & Discounts</h1>
          <p className="text-sm text-[#75828A]">Manage marketing promo codes, minimum spend, and redemptions</p>
        </div>
      </div>

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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-sm text-[#347F99] bg-[#E6F5F8] px-2.5 py-1 rounded-lg">
                      {c.code}
                    </span>
                    <div className="text-xs text-[#75828A] mt-1">{c.description}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#24333A]">
                    {c.type === 'percentage' ? `${c.value}% OFF` : `₹${(c.value_paise || 0) / 100} OFF`}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#52636a]">
                    {c.min_order_paise > 0 ? formatPrice(c.min_order_paise) : 'No Minimum'}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-xs text-[#24333A]">
                    {c.times_used} times
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      Active
                    </span>
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
