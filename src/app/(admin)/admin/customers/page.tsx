import type { Metadata } from 'next'
import { Users, Mail, ShoppingBag, MapPin, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Customers — Admin',
}

async function getCustomers() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('orders')
      .select('guest_email, shipping_address, total_paise, created_at')
      .order('created_at', { ascending: false })

    if (!data?.length) return null

    // Aggregate by email
    const map = new Map<string, {
      name: string; email: string; city: string;
      orders: number; spent: number; lastOrder: string
    }>()

    for (const o of data) {
      const email = o.guest_email || 'guest@mrgrimeguru.com'
      const addr = (o.shipping_address as any) || {}
      const name = [addr.first_name, addr.last_name].filter(Boolean).join(' ') || 'Customer'
      const city = addr.city || 'India'
      const amount = Number(o.total_paise) || 0

      const existing = map.get(email)
      if (existing) {
        existing.orders++
        existing.spent += amount
        if (o.created_at > existing.lastOrder) existing.lastOrder = o.created_at
      } else {
        map.set(email, {
          name,
          email,
          city,
          orders: 1,
          spent: amount,
          lastOrder: o.created_at,
        })
      }
    }
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent)
  } catch {
    return null
  }
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers() || []

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((s, c) => s + c.spent, 0)
  const avgOrdersPerCustomer = customers.length > 0
    ? (customers.reduce((s, c) => s + c.orders, 0) / customers.length).toFixed(1)
    : '0'

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#24333A]">Customers</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Live Database ({totalCustomers} Customers)
            </span>
          </div>
          <p className="text-sm text-[#75828A]">Track customer spend, repeat orders, and geographic locations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: totalCustomers.toString(), icon: Users, color: '#347F99' },
          { label: 'Total Customer Spend', value: formatPrice(totalRevenue), icon: ShoppingBag, color: '#059669' },
          { label: 'Avg Orders / Customer', value: avgOrdersPerCustomer, icon: Calendar, color: '#7C3AED' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-[#75828A]">{label}</p>
              <p className="text-xl font-bold text-[#24333A]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Location</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Orders</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Total Spent</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c, i) => (
                <tr key={c.email + i} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#347F99]/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#347F99]">{c.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-[#24333A]">{c.name}</div>
                        <div className="text-xs text-[#75828A] flex items-center gap-1">
                          <Mail className="h-3 w-3" />{c.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#52636a]">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{c.orders}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#24333A]">{formatPrice(c.spent)}</td>
                  <td className="px-6 py-4 text-right text-xs text-[#75828A]">
                    {new Date(c.lastOrder).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
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
