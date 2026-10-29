import type { Metadata } from 'next'
import { Image as ImageIcon, Upload, Folder, HardDrive } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Media Library — Admin',
}

async function getMedia() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('product_media')
      .select('url, type, is_hero, sort_order, product_id')
      .eq('type', 'image')
      .order('sort_order')
    return data?.length ? data : null
  } catch {
    return null
  }
}

const DEMO_MEDIA = [
  { url: '/images/products/kitchen-cleaner-cutout.png', label: 'Kitchen Cleaner Cutout', product: 'Kitchen Cleaner' },
  { url: '/images/products/multipurpose-cleaner-cutout.png', label: 'Multipurpose Cleaner Cutout', product: 'Multipurpose Cleaner' },
  { url: '/images/products/shoe-cleaner-cutout.png', label: 'Shoe Cleaner Cutout', product: 'Shoe Cleaner' },
  { url: '/images/products/hero-collection.png', label: 'Hero Collection', product: 'All Products' },
]

export default async function AdminMediaPage() {
  const dbMedia = await getMedia()

  const mediaItems = dbMedia
    ? dbMedia.map(m => ({ url: m.url, label: m.is_hero ? 'Hero Image' : 'Product Image', product: m.product_id }))
    : DEMO_MEDIA

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#24333A]">Media Library</h1>
          <p className="text-sm text-[#75828A]">Manage product images and brand assets</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#347F99] text-white rounded-xl text-sm font-semibold hover:bg-[#2a6a80] transition-colors"
          disabled
          title="Upload coming soon"
        >
          <Upload className="h-4 w-4" />
          Upload Image
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Images', value: mediaItems.length.toString(), icon: ImageIcon, color: '#347F99' },
          { label: 'Product Folders', value: '3', icon: Folder, color: '#7C3AED' },
          { label: 'Storage Used', value: '~12 MB', icon: HardDrive, color: '#059669' },
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

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-[#24333A] mb-4">Product Images</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item, i) => (
            <div key={item.url + i} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-[#f8f6f0]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.label}
                className="w-full h-full object-contain p-3 transition-transform group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] font-semibold truncate">{item.label}</p>
                <p className="text-white/70 text-[9px] truncate">{item.product}</p>
              </div>
            </div>
          ))}
          {/* Upload placeholder */}
          <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 cursor-not-allowed">
            <Upload className="h-6 w-6" />
            <span className="text-xs font-medium">Add Image</span>
            <span className="text-[10px]">Coming soon</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#75828A] text-center">
        Images are currently managed via product listings. Full media upload coming in a future update.
      </p>
    </div>
  )
}

