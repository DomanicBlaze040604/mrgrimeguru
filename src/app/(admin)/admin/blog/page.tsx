import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Plus, Eye, Calendar, Clock } from 'lucide-react'
import { ARTICLES } from '@/app/(storefront)/blog/page'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Blog CMS — Admin',
}

export default function AdminBlogPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#24333A]">Cleaning Guides & Content CMS</h1>
          <p className="text-sm text-[#75828A]">Manage SEO articles, stain removal hacks, and knowledge base</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Article Title
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Author
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Published Date
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ARTICLES.map((art) => (
                <tr key={art.slug} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#24333A] max-w-md">
                    {art.title}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#347F99] font-semibold">
                    {art.category}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#52636a]">
                    {art.author}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-[#75828A]">
                    {art.publishedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/blog/${art.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-[#347F99] transition-colors inline-block"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
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
