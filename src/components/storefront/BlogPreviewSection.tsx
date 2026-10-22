import React from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const PLACEHOLDER_POSTS = [
  {
    id: '1',
    slug: 'laundry-pods-vs-detergent',
    title: 'Laundry Pods vs Traditional Detergent: What\'s Right for You?',
    excerpt: 'We compare convenience, performance, and value to help you decide which laundry format fits your routine.',
    category: 'Laundry Care',
    reading_time: 5,
    author: 'GrimeGuru Team',
    published_at: '2026-10-15',
    image_gradient: 'linear-gradient(135deg, #E6F5F8 0%, #9FD8E8 100%)',
    emoji: '🫧',
  },
  {
    id: '2',
    slug: 'floor-cleaning-guide',
    title: 'How to Clean Different Floor Types Without Damaging Them',
    excerpt: 'From marble to vinyl — learn the right technique and dilution for each surface in your home.',
    category: 'Floor Care',
    reading_time: 7,
    author: 'GrimeGuru Team',
    published_at: '2026-10-10',
    image_gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FDE68A 100%)',
    emoji: '🏠',
  },
  {
    id: '3',
    slug: 'shoe-cleaning-tips',
    title: '5 Shoe Cleaning Mistakes You\'re Probably Making',
    excerpt: 'Avoid these common errors to keep your sneakers and leather shoes looking their best for longer.',
    category: 'Shoe Care',
    reading_time: 4,
    author: 'GrimeGuru Team',
    published_at: '2026-10-05',
    image_gradient: 'linear-gradient(135deg, #ECFDF5 0%, #6EE7B7 100%)',
    emoji: '👟',
  },
]

export function BlogPreviewSection() {
  return (
    <section
      className="section-gap"
      style={{ backgroundColor: '#E6F5F8' }}
      aria-label="The GrimeGuru Guide — Blog"
    >
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-caption mb-2" style={{ color: '#347F99' }}>
              The GrimeGuru Guide
            </p>
            <h2 className="text-headline" style={{ color: '#24333A' }}>
              Tips & Cleaning Know-How
            </h2>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog">
              All Articles <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLACEHOLDER_POSTS.map((post) => (
            <article key={post.id} className="product-card group flex flex-col">
              {/* Image area */}
              <Link href={`/blog/${post.slug}`} className="block" aria-label={`Read: ${post.title}`}>
                <div
                  className="aspect-video flex items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-105 overflow-hidden"
                  style={{ background: post.image_gradient }}
                >
                  {post.emoji}
                </div>
              </Link>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 gap-3">
                {/* Category */}
                <span
                  className="text-caption"
                  style={{ color: '#347F99' }}
                >
                  {post.category}
                </span>

                {/* Title */}
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-bold text-base text-[#24333A] group-hover:text-[#347F99] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-sm text-[#75828A] line-clamp-2 flex-1">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-[#75828A] mt-auto pt-3 border-t border-[#E6F5F8]">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.reading_time} min read
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
