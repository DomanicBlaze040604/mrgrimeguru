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
      .select('customer_email, shipping_name, shipping_city, total_amount_paise, created_at')
      .order('created_at', { ascending: false })
    if (!data?.length) return null

    // Aggregate by email
    const map = new Map<string, {
      name: string; email: string; city: string;
      orders: number; spent: number; lastOrder: string
    }>()
    for (const o of data) {
      const email = o.customer_email || 'guest'
      const existing = map.get(email)
      if (existing) {
        existing.orders++
        existing.spent += o.total_amount_paise || 0
        if (o.created_at > existing.lastOrder) existing.lastOrder = o.created_at
      } else {
        map.set(email, {
          name: o.shipping_name || 'Guest',
          email,
          city: o.shipping_city || 'India',
          orders: 1,
          spent: o.total_amount_paise || 0,
          lastOrder: o.created_at,
        })
      }
    }
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent)
  } catch {
    return null
  }
}

const DEMO_CUSTOMERS = [
  { name: 'Priya Sharma', email: 'priya.sharma@gmail.com', city: 'Mumbai', orders: 3, spent: 254700, lastOrder: new Date(Date.now() - 3600000 * 4).toISOString() },
  { name: 'Arjun Mehta', email: 'arjun.mehta@yahoo.com', city: 'Bengaluru', orders: 2, spent: 139800, lastOrder: new Date(Date.now() - 86400000).toISOString() },
  { name: 'Neha Kapoor', email: 'neha.kapoor@outlook.com', city: 'New Delhi', orders: 4, spent: 319600, lastOrder: new Date(Date.now() - 86400000 * 2).toISOString() },
  { name: 'Rohit Verma', email: 'rohit.verma@gmail.com', city: 'Pune', orders: 1, spent: 69900, lastOrder: new Date(Date.now() - 86400000 * 3).toISOString() },
  { name: 'Simran Kaur', email: 'simran.kaur@hotmail.com', city: 'Chandigarh', orders: 2, spent: 159800, lastOrder: new Date(Date.now() - 86400000 * 5).toISOString() },
  { name: 'Deepak Nair', email: 'deepak.nair@gmail.com', city: 'Kochi', orders: 1, spent: 79900, lastOrder: new Date(Date.now() - 86400000 * 7).toISOString() },
]

export default async function AdminCustomersPage() {
  const dbCustomers = await getCustomers()
  const customers = dbCustomers ?? DEMO_CUSTOMERS

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((s, c) => s + c.spent, 0)
  const avgOrdersPerCustomer = customers.length > 0
    ? (customers.reduce((s, c) => s + c.orders, 0) / customers.length).toFixed(1)
    : '0'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#24333A]">Customers</h1>
          <p className="text-sm text-[#75828A]">Track customer spend, order history and location</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
          {totalCustomers} Unique Customers
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: totalCustomers.toString(), icon: Users, color: '#347F99' },
          { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: ShoppingBag, color: '#059669' },
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

