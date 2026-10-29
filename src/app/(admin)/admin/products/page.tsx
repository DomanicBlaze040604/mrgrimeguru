import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle, ArrowUpRight, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { getCleanerOffer } from '@/lib/cleaner-offers'

export const metadata: Metadata = {
  title: 'Products — Admin',
}

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: dbProducts } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      family,
      status,
      short_description,
      is_featured,
      created_at,
      category:product_categories(name),
      product_variants(id, name, sku, price_paise, compare_at_price_paise, is_default, is_active),
      product_media(url, is_hero)
    `)
    .order('sort_order', { ascending: true })

  const products = (dbProducts || []).map((p) => {
    const offer = getCleanerOffer(p.slug)
    const variants = Array.isArray(p.product_variants) ? p.product_variants : []
    const defaultVariant = variants.find((v: any) => v.is_default) || variants[0]
    const price_paise = offer?.price ?? defaultVariant?.price_paise ?? 49900
    const compare_price_paise = offer?.original ?? defaultVariant?.compare_at_price_paise ?? null
    const heroMedia = Array.isArray(p.product_media) ? p.product_media.find((m: any) => m.is_hero) || p.product_media[0] : null
    const image = (offer ? `/images/products/${offer.slug}-cutout.png` : heroMedia?.url) || `/images/products/${p.slug}.jpg`

    return {
      id: p.id,
      name: offer?.name ?? p.name,
      slug: offer?.slug ?? p.slug,
      category_name: (p.category as any)?.name || 'Cleaners',
      price_paise,
      compare_price_paise,
      sku: defaultVariant?.sku || 'MGG-GEN-500',
      status: p.status || 'active',
      in_stock: true,
      image,
      variantCount: variants.length || 1,
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#24333A]">Product Catalog</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Live Database ({products.length} Products)
            </span>
          </div>
          <p className="text-sm text-[#75828A]">Manage formulations, pricing, and stock visibility</p>
        </div>
        <Button variant="primary" asChild className="bg-[#166534] hover:bg-[#14532D]">
          <Link href="/admin/products/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Live Price
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F2] border border-gray-100 shrink-0">
                        <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="48px" />
                      </div>
                      <div>
                        <div className="font-bold text-[#24333A] line-clamp-1">{p.name}</div>
                        <div className="text-xs text-[#75828A]">/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#52636a] text-xs font-medium">
                    {p.category_name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#75828A]">
                    {p.sku}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-[#14532D] text-base">{formatPrice(p.price_paise)}</div>
                    {p.compare_price_paise && (
                      <div className="text-xs text-[#75828A] line-through">
                        {formatPrice(p.compare_price_paise)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                      p.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-2 text-gray-500 hover:text-[#166534] hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <Link
                        href={`/shop/${p.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-[#347F99] hover:bg-gray-100 rounded-lg transition-colors inline-block"
                        title="View on store"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
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
