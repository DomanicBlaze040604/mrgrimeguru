import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Plus, Eye, Edit, Trash2, Calendar, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { ARTICLES } from '@/app/(storefront)/blog/page'

export const metadata: Metadata = {
  title: 'Blog CMS — Admin',
}

export default async function AdminBlogPage() {
  const supabase = await createClient()

  const { data: dbPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  const posts = (dbPosts && dbPosts.length > 0)
    ? dbPosts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt || '',
        category: 'Cleaning Guide',
        status: p.status || 'published',
        publishedAt: p.published_at
          ? new Date(p.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Draft',
        readingTime: `${p.reading_time_minutes || 3} min read`,
      }))
    : ARTICLES.map((a, i) => ({
        id: `mock_blog_${i}`,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        category: a.category,
        status: 'published',
        publishedAt: a.publishedAt,
        readingTime: a.readTime,
      }))

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#24333A]">Cleaning Guides & Content CMS</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {posts.length} Articles Live
            </span>
          </div>
          <p className="text-sm text-[#75828A]">Manage SEO articles, stain removal hacks, and knowledge base</p>
        </div>

        <Button variant="primary" asChild className="bg-[#166534] hover:bg-[#14532D]">
          <Link href="/admin/blog/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Article
          </Link>
        </Button>
      </div>

      {/* Table */}
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
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Read Time
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Published Date
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((art) => (
                <tr key={art.slug} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 max-w-md">
                    <div className="font-bold text-[#24333A] leading-snug">{art.title}</div>
                    <div className="text-xs text-[#75828A] mt-0.5">/blog/{art.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#347F99] font-semibold">
                    {art.category}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-[#75828A]">
                    {art.readingTime}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                      art.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {art.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-[#75828A]">
                    {art.publishedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${art.id}`}
                        className="p-1.5 text-gray-500 hover:text-[#166534] hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                        title="Edit article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${art.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-[#347F99] hover:bg-gray-100 rounded-lg transition-colors inline-block"
                        title="View live article"
                      >
                        <Eye className="w-4 h-4" />
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
