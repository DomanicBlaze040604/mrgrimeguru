import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import {
  ShoppingBag, TrendingUp, Package, Users, Star, AlertTriangle,
  ArrowUpRight, Clock, CheckCircle2, XCircle
} from 'lucide-react'
import { formatPrice, formatRelativeTime } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Dashboard — Admin',
}

// Fetch real metrics from Supabase (gracefully handles missing tables during setup)
async function getDashboardData() {
  const supabase = await createClient()

  try {
    const [ordersResult, reviewsResult, productsResult] = await Promise.allSettled([
      supabase
        .from('orders')
        .select('id, status, payment_status, total_paise, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('reviews')
        .select('id, rating, status, created_at')
        .eq('status', 'pending')
        .limit(5),
      supabase
        .from('inventory')
        .select('id, quantity, low_stock_threshold, variant_id')
        .filter('quantity', 'lte', 'low_stock_threshold'),
    ])

    const orders = ordersResult.status === 'fulfilled' ? ordersResult.value.data || [] : []
    const pendingReviews = reviewsResult.status === 'fulfilled' ? reviewsResult.value.data || [] : []
    const lowStockItems = productsResult.status === 'fulfilled' ? productsResult.value.data || [] : []

    const totalOrders = orders.length
    const grossSales = orders
      .filter((o) => o.payment_status === 'paid')
      .reduce((sum, o) => sum + (o.total_paise || 0), 0)
    const pendingFulfillment = orders.filter(
      (o) => o.status === 'confirmed' || o.status === 'processing'
    ).length
    const avgOrderValue = totalOrders > 0 ? Math.round(grossSales / totalOrders) : 0

    return {
      totalOrders,
      grossSales,
      avgOrderValue,
      pendingFulfillment,
      pendingReviews: pendingReviews.length,
      lowStockProducts: lowStockItems.length,
      recentOrders: orders.slice(0, 5),
    }
  } catch {
    // Return empty state during initial setup
    return {
      totalOrders: 0,
      grossSales: 0,
      avgOrderValue: 0,
      pendingFulfillment: 0,
      pendingReviews: 0,
      lowStockProducts: 0,
      recentOrders: [],
    }
  }
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  href,
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  color: string
  href?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#75828A]">{title}</p>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-[#24333A]">{value}</p>
        {subtitle && (
          <p className="text-xs text-[#75828A] mt-1">{subtitle}</p>
        )}
      </div>
      {href && (
        <a
          href={href}
          className="text-xs font-semibold flex items-center gap-1 mt-auto"
          style={{ color }}
        >
          View details <ArrowUpRight className="h-3 w-3" />
        </a>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
    confirmed: { bg: '#DBEAFE', text: '#1E40AF', label: 'Confirmed' },
    processing: { bg: '#E0E7FF', text: '#3730A3', label: 'Processing' },
    shipped: { bg: '#D1FAE5', text: '#065F46', label: 'Shipped' },
    delivered: { bg: '#D1FAE5', text: '#065F46', label: 'Delivered' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
    paid: { bg: '#D1FAE5', text: '#065F46', label: 'Paid' },
    failed: { bg: '#FEE2E2', text: '#991B1B', label: 'Failed' },
  }
  const cfg = map[status] || { bg: '#F3F4F6', text: '#6B7280', label: status }
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  )
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#24333A]">Dashboard</h1>
        <p className="text-sm text-[#75828A] mt-1">
          Overview of your store&apos;s performance
        </p>
      </div>

      {/* Setup notice if no orders */}
      {data.totalOrders === 0 && (
        <div className="bg-[#E6F5F8] border border-[#9FD8E8] rounded-2xl p-4 mb-6 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#347F99] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#24333A]">
              Dashboard is live — connect Supabase to see real metrics
            </p>
            <p className="text-xs text-[#75828A] mt-1">
              Add your Supabase credentials to .env.local and run the database migrations to populate this dashboard with real data.
            </p>
          </div>
        </div>
      )}

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Orders"
          value={data.totalOrders.toString()}
          subtitle="All time"
          icon={ShoppingBag}
          color="#347F99"
          href="/admin/orders"
        />
        <MetricCard
          title="Gross Sales"
          value={formatPrice(data.grossSales)}
          subtitle="From paid orders"
          icon={TrendingUp}
          color="#059669"
          href="/admin/orders"
        />
        <MetricCard
          title="Avg. Order Value"
          value={data.avgOrderValue > 0 ? formatPrice(data.avgOrderValue) : '—'}
          subtitle="Paid orders"
          icon={Package}
          color="#8B5CF6"
        />
        <MetricCard
          title="Pending Fulfillment"
          value={data.pendingFulfillment.toString()}
          subtitle="Orders to process"
          icon={Clock}
          color="#D97706"
          href="/admin/orders?status=pending"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-medium text-[#75828A]">Reviews to Moderate</p>
          </div>
          <p className="text-2xl font-bold text-[#24333A]">{data.pendingReviews}</p>
          {data.pendingReviews > 0 && (
            <a href="/admin/reviews" className="text-xs font-semibold text-amber-600 flex items-center gap-1 mt-2">
              Review queue <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-sm font-medium text-[#75828A]">Low Stock Products</p>
          </div>
          <p className="text-2xl font-bold text-[#24333A]">{data.lowStockProducts}</p>
          {data.lowStockProducts > 0 && (
            <a href="/admin/inventory" className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-2">
              View inventory <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-[#347F99]" />
            <p className="text-sm font-medium text-[#75828A]">Quick Actions</p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {[
              { label: 'Add Product', href: '/admin/products/new' },
              { label: 'Manage Orders', href: '/admin/orders' },
              { label: 'Site Settings', href: '/admin/settings' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-[#347F99] hover:text-[#24333A] transition-colors flex items-center gap-1"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#24333A]">Recent Orders</h2>
          <a href="/admin/orders" className="text-xs font-semibold text-[#347F99] flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        {data.recentOrders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <ShoppingBag className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-[#75828A]">No orders yet</p>
            <p className="text-xs text-gray-400 mt-1">Orders will appear here once customers start purchasing</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Payment</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Total</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#75828A] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentOrders.map((order: Record<string, unknown>) => (
                  <tr key={order.id as string} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#24333A]">
                      <a href={`/admin/orders/${order.id}`} className="hover:text-[#347F99] transition-colors">
                        #{String(order.id).slice(0, 8).toUpperCase()}
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status as string} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.payment_status as string} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-[#24333A]">
                      {formatPrice(order.total_paise as number)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-[#75828A] text-xs">
                      {formatRelativeTime(order.created_at as string)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
