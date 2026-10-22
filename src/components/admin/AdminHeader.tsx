'use client'

import React from 'react'
import Link from 'next/link'
import { Bell, ExternalLink, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  user: {
    id: string
    full_name: string | null
    email: string
    role: string
    avatar_url: string | null
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-[#24333A]">Admin Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* View site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#75828A] hover:text-[#347F99] transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Site
        </Link>

        {/* Notifications placeholder */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-[#75828A]" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: '#347F99' }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[#24333A] leading-tight">
              {user.full_name || user.email}
            </p>
            <p className="text-xs text-[#75828A] capitalize">
              {user.role.replace('_', ' ')}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 text-[#75828A] transition-colors ml-1"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
