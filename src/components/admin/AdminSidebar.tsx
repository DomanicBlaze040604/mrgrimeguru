'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Star,
  FileText, Image, Settings, BarChart3, Tag, ChevronRight,
  Menu, X, Warehouse, Palette, Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'

type UserRole = 'owner' | 'administrator' | 'operations' | 'content_editor' | 'customer_support'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
  badge?: string
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['owner', 'administrator', 'operations', 'content_editor', 'customer_support'],
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: Package,
    roles: ['owner', 'administrator', 'operations', 'content_editor'],
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    roles: ['owner', 'administrator', 'operations', 'customer_support'],
  },
  {
    label: 'Inventory',
    href: '/admin/inventory',
    icon: Warehouse,
    roles: ['owner', 'administrator', 'operations'],
  },
  {
    label: 'Customers',
    href: '/admin/customers',
    icon: Users,
    roles: ['owner', 'administrator', 'customer_support'],
  },
  {
    label: 'Reviews',
    href: '/admin/reviews',
    icon: Star,
    roles: ['owner', 'administrator', 'content_editor', 'customer_support'],
  },
  {
    label: 'Blog & CMS',
    href: '/admin/blog',
    icon: FileText,
    roles: ['owner', 'administrator', 'content_editor'],
  },
  {
    label: 'Discounts',
    href: '/admin/discounts',
    icon: Tag,
    roles: ['owner', 'administrator'],
  },
  {
    label: 'Combos & Bundles',
    href: '/admin/combos',
    icon: Layers,
    roles: ['owner', 'administrator', 'operations'],
    badge: 'New',
  },
  {
    label: 'Theme Studio',
    href: '/admin/themes',
    icon: Palette,
    roles: ['owner', 'administrator'],
    badge: 'Live',
  },
  {
    label: 'Media Library',
    href: '/admin/media',
    icon: Image,
    roles: ['owner', 'administrator', 'content_editor'],
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    roles: ['owner', 'administrator'],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['owner', 'administrator'],
  },
]

interface AdminSidebarProps {
  userRole: string
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const visibleItems = navItems.filter((item) =>
    item.roles.includes(userRole as UserRole)
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#9FD8E8] flex items-center justify-center shrink-0">
            <span className="text-[#24333A] font-bold text-sm">G</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Mr GrimeGuru</p>
            <p className="text-[#9FD8E8] text-xs">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar" aria-label="Admin navigation">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('admin-nav-item mb-1', isActive && 'active')}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-[#9FD8E8]/20 text-[#9FD8E8] rounded-full px-2 py-0.5">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Role badge */}
      <div className="px-5 py-4 border-t border-white/10">
        <span
          className="inline-block text-xs px-2.5 py-1 rounded-full font-medium capitalize"
          style={{ backgroundColor: 'rgba(159,216,232,0.15)', color: '#9FD8E8' }}
        >
          {userRole.replace('_', ' ')}
        </span>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="admin-sidebar hidden lg:flex flex-col w-60 shrink-0 h-full"
        aria-label="Admin sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#24333A] text-white shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="admin-sidebar lg:hidden fixed left-0 top-0 bottom-0 z-40 w-60"
            aria-label="Admin sidebar"
          >
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
