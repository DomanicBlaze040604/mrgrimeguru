import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Cleaning Guides & Tips — Mr GrimeGuru',
  description: 'Expert cleaning advice, fabric care tips, kitchen degreasing hacks, and home hygiene insights for modern Indian households.',
}

export const ARTICLES = [
  {
    slug: 'kitchen-degreasing-guide-chimneys-tiles-stovetops',
    title: 'The Ultimate Indian Kitchen Degreasing Guide: Chimneys, Tiles & Stovetops',
    excerpt: 'Tadka splatters, turmeric oil, and sticky exhaust fan build-up require specific solvent chemistry. Here is how to dissolve grease without damaging stainless steel.',
    category: 'Kitchen Care',
    image: '/images/products/kitchen-cleaner-cutout.png',
    readTime: '4 min read',
    publishedAt: 'Oct 18, 2026',
    author: 'Guru Cleaning Labs',
  },
  {
    slug: 'science-of-scent-micro-capsules-laundry-freshness',
    title: 'Why Clothes Lose Freshness in Humid Weather: The Science of In-Wash Beads',
    excerpt: 'Traditional fabric softeners coat clothes in wax that traps bacteria. Micro-capsule beads release botanical essential oils on friction, keeping fabrics fresh for up to 12 weeks.',
    category: 'Laundry Science',
    image: '/images/products/laundry-beads.jpg',
    readTime: '5 min read',
    publishedAt: 'Oct 14, 2026',
    author: 'Dr. S. Kulkarni',
  },
  {
    slug: 'pet-safe-floor-cleaners-botanical-guide',
    title: 'Is Your Floor Cleaner Safe for Dogs & Crawling Toddlers?',
    excerpt: 'Chemical floor disinfectants leave invisible residues that pets absorb through paw pads. Why pH-neutral botanical cleaners with neem extracts are revolutionising Indian homes.',
    category: 'Pet & Child Health',
    image: '/images/products/multipurpose-cleaner-cutout.png',
    readTime: '6 min read',
    publishedAt: 'Oct 10, 2026',
    author: 'Dr. Priya Varma',
  },
  {
    slug: 'restore-white-sneakers-in-3-minutes-waterless',
    title: 'How to Restore Dirty White Sneakers in Under 3 Minutes Without Soaking',
    excerpt: 'Dunking canvas or leather sneakers in water weakens adhesives and turns white midsoles yellow. Step-by-step dry foam brushing technique used by sneakerheads.',
    category: 'Footwear Care',
    image: '/images/products/shoe-cleaner-cutout.png',
    readTime: '3 min read',
    publishedAt: 'Oct 06, 2026',
    author: 'Sneaker Care Pro',
  },
  {
    slug: 'laundry-pods-vs-liquid-detergent-truth',
    title: 'Laundry Pods vs Liquid Detergent: Which Actually Saves You Money?',
    excerpt: 'Over-dosing liquid detergent is the #1 cause of washing machine drum sludge. How pre-measured triple enzyme pods protect machines and cut detergent wastage by 40%.',
    category: 'Laundry Care',
    image: '/images/products/laundry-pods.jpg',
    readTime: '5 min read',
    publishedAt: 'Oct 01, 2026',
    author: 'Guru Cleaning Labs',
  },
]

export default async function BlogListingPage() {
  const supabase = await createClient()

  // Try fetching articles from Supabase
  const { data: dbPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, published_at, reading_time_minutes')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const posts = dbPosts && dbPosts.length > 0
    ? dbPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || 'Read practical cleaning advice from our in-house experts.',
        category: 'Cleaning Guide',
        image: p.featured_image || '/images/brand/product-range.jpg',
        readTime: `${p.reading_time_minutes || 5} min read`,
        publishedAt: new Date(p.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: 'Mr GrimeGuru Editorial',
      }))
    : ARTICLES

  return (
    <div className="min-h-screen bg-[#fffbf0] py-14">
      <div className="container-wide">
        {/* Page Hero */}
        <div className="max-w-2xl mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fff2be] text-[#b9460c] mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Knowledge Base & Practical Hacks
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#171714] tracking-tight mb-4">
            Cleaning Guides for Real Life
          </h1>
          <p className="text-[#75828A] text-base sm:text-lg leading-relaxed">
            No endless jargon or unrealistic methods. Just clear, science-backed solutions for tough Indian stains, hard water grime, and daily home maintenance.
          </p>
        </div>

        {/* Featured Article */}
        {posts[0] && (
          <div className="mb-14 bg-white rounded-3xl border border-[#e5dcc9] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[320px] bg-[#fffbf0]">
                <Image
                  src={posts[0].image}
                  alt={posts[0].title}
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#b9460c] uppercase tracking-wider">
                    {posts[0].category}
                  </span>
                  <Link href={`/blog/${posts[0].slug}`}>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#171714] hover:text-[#b9460c] transition-colors mt-2 mb-4 leading-snug">
                      {posts[0].title}
                    </h2>
                  </Link>
                  <p className="text-sm text-[#75828A] leading-relaxed mb-6">
                    {posts[0].excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-[#75828A] pt-4 border-t border-[#e5dcc9]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {posts[0].publishedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {posts[0].readTime}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${posts[0].slug}`}
                    className="font-bold text-[#b9460c] hover:underline flex items-center gap-1"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remaining Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((article) => (
            <div
              key={article.slug}
              className="bg-white rounded-2xl border border-[#e5dcc9] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <Link href={`/blog/${article.slug}`} className="relative aspect-[16/10] block overflow-hidden bg-[#fffbf0]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#b9460c] uppercase tracking-wider">
                    {article.category}
                  </span>
                  <Link href={`/blog/${article.slug}`}>
                    <h3 className="font-bold text-lg text-[#171714] hover:text-[#b9460c] transition-colors mt-1 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-[#75828A] line-clamp-3 mb-6">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-[#75828A] pt-4 border-t border-[#e5dcc9]">
                  <span>{article.readTime}</span>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="font-bold text-[#b9460c] hover:underline flex items-center gap-1"
                  >
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
