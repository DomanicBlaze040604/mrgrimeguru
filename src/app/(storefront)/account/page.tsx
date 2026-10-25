'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Package, MapPin, LogOut, ArrowRight, Shield, Clock, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAccount() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // In demo mode or unauthenticated, provide guest demo profile
        setUser({ email: 'guest@mrgrimeguru.com' })
        setProfile({ full_name: 'Guest Customer', role: 'customer' })
        setOrders([
          {
            id: 'ord_demo_1',
            order_number: 'GG-2026-94812',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: 'processing',
            payment_status: 'paid',
            total_amount_paise: 84800,
            items_count: 2,
          },
        ])
        setIsLoading(false)
        return
      }

      setUser(user)

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) setProfile(profileData)

      // Fetch user's orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_number, created_at, status, payment_status, total_amount_paise, items_count')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (ordersData) setOrders(ordersData)
      setIsLoading(false)
    }

    loadAccount()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast({ title: 'Signed out successfully' })
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#fffbf0]">
        <div className="text-sm font-semibold text-[#75828A]">Loading your account...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffbf0] py-14">
      <div className="container-wide max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#e5dcc9]">
          <div>
            <h1 className="text-3xl font-bold text-[#171714]">My Account</h1>
            <p className="text-sm text-[#75828A]">
              Welcome back, {profile?.full_name || user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {profile?.role && ['owner', 'administrator'].includes(profile.role) && (
              <Button variant="outline" asChild>
                <Link href="/admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#b9460c]" /> Admin Dashboard
                </Link>
              </Button>
            )}
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-red-500" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* User Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-[#e5dcc9] shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#fff2be] text-[#b9460c] flex items-center justify-center font-bold text-2xl mx-auto sm:mx-0">
                {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#171714]">
                  {profile?.full_name || 'GrimeGuru Shopper'}
                </h3>
                <p className="text-xs text-[#75828A]">{user?.email}</p>
              </div>

              <div className="pt-4 border-t border-[#e5dcc9] text-xs space-y-2 text-[#75828A]">
                <div className="flex justify-between">
                  <span>Account Status</span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Tier</span>
                  <span className="font-bold text-[#b9460c]">CleanGuru VIP</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-6 bg-white rounded-3xl border border-[#e5dcc9] shadow-sm divide-y divide-[#e5dcc9]">
              <Link
                href="/account/orders"
                className="py-3 flex items-center justify-between text-sm font-semibold text-[#171714] hover:text-[#b9460c]"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#b9460c]" /> Order History
                </span>
                <ArrowRight className="w-4 h-4 text-[#75828A]" />
              </Link>
              <Link
                href="/faq"
                className="py-3 flex items-center justify-between text-sm font-semibold text-[#171714] hover:text-[#b9460c]"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#b9460c]" /> Help & FAQs
                </span>
                <ArrowRight className="w-4 h-4 text-[#75828A]" />
              </Link>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-[#e5dcc9] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#171714] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#b9460c]" />
                  Recent Orders
                </h2>
                <Link
                  href="/shop"
                  className="text-xs font-bold text-[#b9460c] hover:underline"
                >
                  Shop More Products
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-[#75828A] text-sm">
                  You haven&apos;t placed any orders yet.
                </div>
              ) : (
                <div className="divide-y divide-[#e5dcc9]">
                  {orders.map((order) => (
                    <div key={order.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-sm text-[#171714]">
                            {order.order_number}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full capitalize bg-amber-50 text-amber-800">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#75828A]">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right">
                          <div className="font-bold text-sm text-[#171714]">
                            {formatPrice(order.total_amount_paise)}
                          </div>
                          <div className="text-[11px] text-emerald-600 font-semibold uppercase">
                            {order.payment_status}
                          </div>
                        </div>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/order-success?order_number=${order.order_number}&total=${order.total_amount_paise}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
