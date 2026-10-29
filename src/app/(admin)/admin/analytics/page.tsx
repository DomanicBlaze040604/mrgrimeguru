import type { Metadata } from 'next'
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Analytics — Admin',
}

async function getAnalyticsData() {
  try {
    const supabase = await createClient()
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount_paise, status, payment_status, created_at, customer_email')
      .order('created_at', { ascending: false })

    if (!orders?.length) return null

    const paid = orders.filter(o => o.payment_status === 'paid')
    const totalRevenue = paid.reduce((s, o) => s + (o.total_amount_paise || 0), 0)
    const totalOrders = orders.length
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / paid.length) : 0
    const uniqueCustomers = new Set(orders.map(o => o.customer_email).filter(Boolean)).size

    // Revenue by day (last 7 days)
    const now = Date.now()
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now - (6 - i) * 86400000)
      const key = d.toISOString().slice(0, 10)
      const label = d.toLocaleDateString('en-IN', { weekday: 'short' })
      const revenue = paid
        .filter(o => o.created_at?.startsWith(key))
        .reduce((s, o) => s + (o.total_amount_paise || 0), 0)
      return { label, revenue }
    })

    return { totalRevenue, totalOrders, avgOrderValue, uniqueCustomers, days }
  } catch {
    return null
  }
}

const DEMO = {
  totalRevenue: 1284300,
  totalOrders: 18,
  avgOrderValue: 71350,
  uniqueCustomers: 14,
  days: [
    { label: 'Mon', revenue: 139800 },
    { label: 'Tue', revenue: 79900 },
    { label: 'Wed', revenue: 219700 },
    { label: 'Thu', revenue: 159600 },
    { label: 'Fri', revenue: 319800 },
    { label: 'Sat', revenue: 259700 },
    { label: 'Sun', revenue: 105100 },
  ],
}

export default async function AdminAnalyticsPage() {
  const data = (await getAnalyticsData()) ?? DEMO
  const maxRevenue = Math.max(...data.days.map(d => d.revenue), 1)

  const stats = [
    { label: 'Total Revenue', value: formatPrice(data.totalRevenue), icon: TrendingUp, color: '#059669', href: '/admin/orders' },
    { label: 'Total Orders', value: data.totalOrders.toString(), icon: ShoppingBag, color: '#347F99', href: '/admin/orders' },
    { label: 'Avg Order Value', value: formatPrice(data.avgOrderValue), icon: Package, color: '#7C3AED', href: '/admin/orders' },
    { label: 'Unique Customers', value: data.uniqueCustomers.toString(), icon: Users, color: '#B45309', href: '/admin/customers' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#24333A]">Analytics</h1>
        <p className="text-sm text-[#75828A]">Revenue, orders and customer trends</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#75828A]">{label}</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#24333A]">{value}</p>
            <a href={href} className="text-xs font-semibold flex items-center gap-1 mt-auto" style={{ color }}>
              View details <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        ))}
      </div>

      {/* Revenue bar chart (last 7 days) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-[#24333A] mb-6">Revenue — Last 7 Days</h2>
        <div className="flex items-end gap-3 h-40">
          {data.days.map(({ label, revenue }) => {
            const pct = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-[#75828A]">
                  {revenue > 0 ? formatPrice(revenue).replace('₹', '') : '—'}
                </span>
                <div className="w-full relative" style={{ height: `${Math.max(pct, 4)}%`, minHeight: '6px' }}>
                  <div
                    className="w-full h-full rounded-t-lg"
                    style={{ background: revenue > 0 ? 'linear-gradient(to top,#347F99,#9FD8E8)' : '#f3f4f6' }}
                  />
                </div>
                <span className="text-[10px] text-[#75828A] font-medium">{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top products (static — extend with DB query later) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-[#24333A] mb-4">Top Products by Revenue</h2>
        <div className="space-y-3">
          {[
            { name: 'Kitchen Cleaner', price: '₹499', share: 45 },
            { name: 'Shoe Cleaner', price: '₹699', share: 35 },
            { name: 'Multipurpose Cleaner', price: '₹799', share: 20 },
          ].map(({ name, price, share }) => (
            <div key={name} className="flex items-center gap-4">
              <div className="w-32 shrink-0">
                <p className="text-sm font-semibold text-[#24333A]">{name}</p>
                <p className="text-xs text-[#75828A]">{price} each</p>
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div className="h-full rounded-full bg-[#347F99]" style={{ width: `${share}%` }} />
              </div>
              <span className="text-xs font-bold text-[#24333A] w-10 text-right">{share}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

