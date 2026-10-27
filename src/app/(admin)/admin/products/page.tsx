import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

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
      price_paise,
      compare_at_price_paise,
      in_stock,
      is_published,
      images,
      created_at,
      category:product_categories(name)
    `)
    .order('created_at', { ascending: false })

  const fallbackProducts = [
    {
      id: 'mock_1',
      name: 'Mr GrimeGuru 3-in-1 Power Laundry Pods (Pack of 30)',
      slug: 'laundry-pods',
      price_paise: 39900,
      compare_at_price_paise: 49900,
      in_stock: true,
      is_published: true,
      images: ['/images/products/laundry-pods.jpg'],
      category: { name: 'Laundry Care' },
    },
    {
      id: 'mock_2',
      name: 'Mr GrimeGuru In-Wash Scent Booster Beads (250g)',
      slug: 'laundry-beads',
      price_paise: 44900,
      compare_at_price_paise: 54900,
      in_stock: true,
      is_published: true,
      images: ['/images/products/laundry-beads.jpg'],
      category: { name: 'Fragrance Boosters' },
    },
    {
      id: 'mock_3',
      name: 'Mr GrimeGuru Botanical Floor Cleaner Concentrate (1L)',
      slug: 'floor-cleaner',
      price_paise: 34900,
      compare_at_price_paise: 42900,
      in_stock: true,
      is_published: true,
      images: ['/images/products/multipurpose-cleaner-cutout.png'],
      category: { name: 'Surface Care' },
    },
    {
      id: 'mock_4',
      name: 'Mr GrimeGuru Heavy-Duty Kitchen Degreaser Spray (500ml)',
      slug: 'kitchen-degreaser',
      price_paise: 29900,
      compare_at_price_paise: 37900,
      in_stock: true,
      is_published: true,
      images: ['/images/products/kitchen-cleaner-cutout.png'],
      category: { name: 'Kitchen Care' },
    },
    {
      id: 'mock_5',
      name: 'Mr GrimeGuru Instant Shoe & Sneaker Foam Cleaner (200ml)',
      slug: 'shoe-cleaner',
      price_paise: 32900,
      compare_at_price_paise: 39900,
      in_stock: true,
      is_published: true,
      images: ['/images/products/shoe-cleaner-cutout.png'],
      category: { name: 'Footwear Care' },
    },
  ]

  const products = dbProducts && dbProducts.length > 0 ? dbProducts : fallbackProducts

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#24333A]">Product Catalog</h1>
          <p className="text-sm text-[#75828A]">Manage formulations, pricing, and stock visibility</p>
        </div>
        <Button variant="primary" asChild>
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
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Price
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Inventory
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
              {products.map((p) => {
                const img = Array.isArray(p.images) && p.images[0] ? p.images[0] : '/images/products/laundry-pods.jpg'
                return (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F2] border border-gray-100 shrink-0">
                          <Image src={img} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-[#24333A] line-clamp-1">{p.name}</div>
                          <div className="text-xs text-[#75828A]">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#52636a] text-xs">
                      {(p.category as any)?.name || 'General'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-[#24333A]">{formatPrice(p.price_paise)}</div>
                      {p.compare_at_price_paise && (
                        <div className="text-xs text-[#75828A] line-through">
                          {formatPrice(p.compare_at_price_paise)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.in_stock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {p.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.is_published ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-[#347F99] transition-colors"
                          title="View live page"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
