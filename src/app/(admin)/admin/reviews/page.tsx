import type { Metadata } from 'next'
import { Star, CheckCircle, XCircle, ShieldCheck, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Reviews — Admin',
}

export default async function AdminReviewsPage() {
  const supabase = await createClient()

  const { data: dbReviews } = await supabase
    .from('reviews')
    .select(`
      id,
      author_name,
      rating,
      title,
      body,
      status,
      created_at,
      product:products(name)
    `)
    .order('created_at', { ascending: false })

  const fallbackReviews = [
    {
      id: 'rev_1',
      author_name: 'Ananya Verma',
      rating: 5,
      title: 'Dissolved completely even in cold monsoon wash',
      body: 'No white sticky residue like ordinary detergents. Got rid of greasy collar grime effortlessly.',
      status: 'published',
      created_at: '2026-10-18T00:00:00Z',
      product: { name: 'Laundry Pods 3-in-1' },
    },
    {
      id: 'rev_2',
      author_name: 'Vikram Joshi',
      rating: 5,
      title: 'Cleaned greasy chimney filters in 60s',
      body: 'Sprayed, waited 60 seconds, and rinsed with hot water. The brown sticky oil literally dripped right off.',
      status: 'published',
      created_at: '2026-10-14T00:00:00Z',
      product: { name: 'Kitchen Degreaser Spray' },
    },
    {
      id: 'rev_3',
      author_name: 'Pooja Bhatt',
      rating: 4,
      title: 'Very pleasant mild citrus smell',
      body: 'Happy to find something that is truly safe for pets without that toxic phenol hospital odor.',
      status: 'pending',
      created_at: '2026-10-10T00:00:00Z',
      product: { name: 'Botanical Floor Cleaner' },
    },
  ]

  const reviews = dbReviews && dbReviews.length > 0 ? dbReviews : fallbackReviews

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#24333A]">Review Moderation</h1>
          <p className="text-sm text-[#75828A]">Approve and manage verified customer testimonials</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E6F5F8] text-[#347F99]">
          {reviews.length} Total Reviews
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <h4 className="font-bold text-sm text-[#24333A]">{rev.title}</h4>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    rev.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {rev.status}
                  </span>
                </div>

                <p className="text-xs text-[#52636a] max-w-2xl leading-relaxed">
                  {rev.body}
                </p>

                <div className="text-[11px] text-[#75828A] flex items-center gap-3 pt-1">
                  <span>Author: <strong>{rev.author_name}</strong></span>
                  <span>•</span>
                  <span>Product: <strong>{(rev.product as any)?.name || 'Product'}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
