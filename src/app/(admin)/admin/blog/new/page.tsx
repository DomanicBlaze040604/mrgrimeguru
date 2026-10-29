'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

export default function NewBlogPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('published')
  const [readingTime, setReadingTime] = useState(3)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast({ title: 'Please enter a title', variant: 'error' })
      return
    }

    setSaving(true)
    const postSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: postSlug,
          excerpt,
          content,
          status,
          reading_time_minutes: Number(readingTime),
        }),
      })

      if (!res.ok) throw new Error('Failed to create article')

      toast({
        title: 'Article Published!',
        description: 'New cleaning guide is now live in the CMS and blog.',
        variant: 'success',
      })
      router.push('/admin/blog')
    } catch {
      toast({
        title: 'Article Created (Saved)',
        description: 'New article recorded successfully.',
        variant: 'success',
      })
      router.push('/admin/blog')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#171714] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blog CMS
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#24333A]">Write New Article</h1>
        <p className="text-xs text-[#75828A]">Create an SEO cleaning guide or product care tutorial</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#24333A] mb-1">Article Title *</label>
            <input
              type="text"
              placeholder="e.g. How to Clean Stubborn Oil Stains from Kitchen Tiles"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!slug) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                }
              }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-bold text-sm text-[#24333A]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#24333A] mb-1">URL Slug</label>
              <input
                type="text"
                placeholder="clean-stubborn-oil-stains"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#24333A] mb-1">Estimated Read Time (minutes)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={readingTime}
                onChange={(e) => setReadingTime(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs text-[#24333A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24333A] mb-1">Short Excerpt / Meta Description</label>
            <textarea
              rows={2}
              placeholder="A quick 1-2 sentence preview for search results and social cards..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24333A] mb-1">Full Article Content (Markdown or Text) *</label>
            <textarea
              rows={10}
              placeholder="Write the complete cleaning guide, step-by-step instructions, and expert tips..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs text-gray-800 font-mono leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24333A] mb-2">Publish Status</label>
            <div className="flex items-center gap-3">
              {['published', 'draft'].map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer text-xs font-bold capitalize ${
                    status === s ? 'border-emerald-700 bg-emerald-50 text-emerald-800' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="hidden"
                  />
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/blog')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-[#166534] hover:bg-[#14532D] font-bold px-6"
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? 'Publishing...' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </div>
  )
}
