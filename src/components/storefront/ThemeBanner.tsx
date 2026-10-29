'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { THEMES, type Theme } from '@/lib/themes'

export function ThemeBanner() {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // 1. Read from cookie/localStorage first for instant preview
    const cachedThemeId =
      (typeof window !== 'undefined' && localStorage.getItem('mgg_active_theme')) ||
      (typeof document !== 'undefined' && document.cookie.match(/mgg_theme=([^;]+)/)?.[1])

    if (cachedThemeId) {
      const found = THEMES.find((t) => t.id === cachedThemeId)
      if (found && found.id !== 'default') setTheme(found)
    }

    // 2. Fetch authoritative theme from API
    fetch('/api/admin/theme')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.themeId) {
          const active = THEMES.find((t) => t.id === data.themeId)
          if (active && active.id !== 'default') {
            setTheme(active)
            // Apply CSS variables dynamically to :root
            if (active.vars) {
              const root = document.documentElement
              Object.entries(active.vars).forEach(([k, v]) => {
                root.style.setProperty(k, v)
              })
            }
          } else {
            setTheme(null)
          }
        }
      })
      .catch(() => {})
  }, [])

  if (!theme || !theme.banner || dismissed) return null

  return (
    <aside
      className="relative z-50 text-xs py-2 px-4 font-bold flex items-center justify-center gap-2 select-none shadow-xs transition-all animate-fadeIn"
      style={{
        backgroundColor: theme.banner.bg,
        color: theme.banner.color,
      }}
      aria-label="Festive announcement"
    >
      <div className="flex items-center gap-2 text-center">
        <span className="text-base leading-none">{theme.emoji}</span>
        <span>{theme.banner.text}</span>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 underline underline-offset-2 ml-1 opacity-90 hover:opacity-100 transition-opacity"
        >
          Shop Festive Offer <ArrowRight className="w-3 h-3 inline" />
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  )
}
