'use client'

import React, { useState, useEffect } from 'react'
import {
  Palette, Sparkles, CheckCircle2, Eye, RefreshCw,
  Zap, Save, ExternalLink, Sliders
} from 'lucide-react'
import { THEMES, type Theme } from '@/lib/themes'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

export default function AdminThemesPage() {
  const [activeThemeId, setActiveThemeId] = useState<string>('default')
  const [customBanner, setCustomBanner] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch('/api/admin/theme')
        if (res.ok) {
          const data = await res.json()
          if (data.themeId) {
            setActiveThemeId(data.themeId)
            const currentTheme = THEMES.find((t) => t.id === data.themeId)
            if (currentTheme?.banner?.text) {
              setCustomBanner(currentTheme.banner.text)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load theme:', err)
      } finally {
        setFetching(false)
      }
    }
    loadTheme()
  }, [])

  async function handleActivateTheme(theme: Theme) {
    setActiveThemeId(theme.id)
    if (theme.banner?.text) {
      setCustomBanner(theme.banner.text)
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId: theme.id }),
      })

      if (res.ok) {
        // Also persist locally for immediate preview
        if (typeof window !== 'undefined') {
          localStorage.setItem('mgg_active_theme', theme.id)
          document.cookie = `mgg_theme=${theme.id}; path=/; max-age=31536000`
        }
        toast({
          title: `${theme.emoji} ${theme.label} Theme Activated!`,
          description: `The storefront is now decorated with the ${theme.label} theme.`,
          variant: 'success',
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch {
      // Fallback local persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('mgg_active_theme', theme.id)
        document.cookie = `mgg_theme=${theme.id}; path=/; max-age=31536000`
      }
      toast({
        title: `${theme.emoji} Theme Selected!`,
        description: `Theme saved in session. View storefront to check live preview.`,
        variant: 'success',
      })
    } finally {
      setLoading(false)
    }
  }

  const currentTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0]

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Palette className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#24333A]">Theme Studio</h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Live Storefront Sync
            </span>
          </div>
          <p className="text-sm text-[#75828A]">
            Switch festive themes, seasonal campaigns, banners, and store accents in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            Open Storefront
            <ExternalLink className="w-3.5 h-3.5 ml-0.5 text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Current Theme Highlight Bar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-amber-50 border border-amber-200 shrink-0">
              {currentTheme.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#75828A]">Active Theme</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Now
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#24333A]">
                {currentTheme.label} Theme
              </h2>
              <p className="text-xs text-[#75828A] mt-0.5">{currentTheme.description}</p>
            </div>
          </div>

          {currentTheme.banner && (
            <div
              className="px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 max-w-md"
              style={{
                backgroundColor: currentTheme.banner.bg,
                color: currentTheme.banner.color,
              }}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{currentTheme.banner.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Available Themes Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#24333A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Preset Festival & Seasonal Themes
          </h3>
          <span className="text-xs text-[#75828A]">{THEMES.length} themes ready to apply</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEMES.map((theme) => {
            const isActive = theme.id === activeThemeId
            return (
              <div
                key={theme.id}
                className={`relative rounded-3xl border-2 transition-all p-5 flex flex-col bg-white shadow-sm hover:shadow-md ${
                  isActive
                    ? 'border-[#b9460c] ring-2 ring-[#b9460c]/20'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-3 right-5 bg-[#b9460c] text-white text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" /> Live
                  </span>
                )}

                {/* Theme Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gray-50 border border-gray-100 shrink-0">
                    {theme.emoji}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#24333A] text-lg leading-tight">
                      {theme.label}
                    </h4>
                    <span className="text-xs text-[#75828A] line-clamp-1">
                      {theme.description}
                    </span>
                  </div>
                </div>

                {/* Color Palette Preview */}
                <div className="my-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Palette Swatches
                  </span>
                  <div className="flex items-center gap-2">
                    {theme.vars && Object.keys(theme.vars).length > 0 ? (
                      Object.entries(theme.vars).slice(0, 5).map(([key, val]) => (
                        <div
                          key={key}
                          className="w-7 h-7 rounded-lg border border-black/10 shadow-xs transition-transform hover:scale-110"
                          style={{ backgroundColor: val }}
                          title={`${key}: ${val}`}
                        />
                      ))
                    ) : (
                      <>
                        <div className="w-7 h-7 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: '#FACC15' }} title="Yellow" />
                        <div className="w-7 h-7 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: '#F97316' }} title="Orange" />
                        <div className="w-7 h-7 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: '#171714' }} title="Dark Ink" />
                        <div className="w-7 h-7 rounded-lg border border-black/10 shadow-xs" style={{ backgroundColor: '#FFFBF0' }} title="Cream" />
                      </>
                    )}
                  </div>
                </div>

                {/* Banner Preview */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                    Announcement Banner
                  </span>
                  <div
                    className="p-2.5 rounded-xl text-xs font-semibold truncate border border-black/5"
                    style={{
                      backgroundColor: theme.banner?.bg || '#111111',
                      color: theme.banner?.color || '#FFFFFF',
                    }}
                  >
                    {theme.banner?.text || 'Standard 1+1 Hydrogen Foam Offer'}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-2">
                  <Button
                    variant={isActive ? 'outline' : 'primary'}
                    size="sm"
                    className="w-full justify-center font-bold"
                    disabled={isActive || loading}
                    onClick={() => handleActivateTheme(theme)}
                  >
                    {isActive ? (
                      <span className="flex items-center gap-1.5 text-[#b9460c]">
                        <CheckCircle2 className="w-4 h-4" /> Currently Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4" /> Activate {theme.label}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* How It Works Guidance Card */}
      <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-3">
        <h4 className="font-bold text-amber-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-700" />
          How Theme Studio Works
        </h4>
        <ul className="text-xs text-amber-900/80 space-y-1.5 list-disc list-inside">
          <li>
            Selecting a theme (e.g. <strong>Diwali 🪔</strong>) instantly applies the festive announcement banner and celebration colors across the storefront.
          </li>
          <li>
            All product links, cart, 1+1 offers, and Fastrr checkout continue functioning normally with the updated festive styling.
          </li>
          <li>
            You can revert to the classic packaging theme at any time by clicking <strong>Activate Default</strong>.
          </li>
        </ul>
      </div>
    </div>
  )
}
