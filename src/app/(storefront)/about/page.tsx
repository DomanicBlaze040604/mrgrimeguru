import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About Us — Mr GrimeGuru',
  description: 'Everyday cleaning, made more straightforward. Four essential cleaning categories. One simpler routine.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      {/* Hero */}
      <div className="py-20 text-center px-4" style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #FAF8F2 100%)' }}>
        <p className="text-xs font-bold uppercase tracking-widest text-[#166534] mb-3">About Mr GrimeGuru</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#14532D] tracking-tight mb-5">
          Cleaning, With a Little More Thought.
        </h1>
        <p className="text-[#52636a] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Mr GrimeGuru is built around a simple idea: everyday cleaning should be practical, straightforward, and easier to understand.
        </p>
      </div>

      <div className="container-wide max-w-4xl py-16 space-y-16">

        {/* Story */}
        <section className="space-y-4 text-[#52636a] text-base leading-relaxed">
          <p>
            Different cleaning challenges call for different solutions. Shoes collect dirt, kitchens gather grease, household surfaces need regular attention, and laundry is a part of everyday life.
          </p>
          <p>
            Our collection focuses on four essential categories:
          </p>
          <ul className="list-disc list-inside space-y-1 font-semibold text-[#24333A]">
            <li>Shoe Cleaner</li>
            <li>Multipurpose Cleaner</li>
            <li>Kitchen Cleaner</li>
            <li>Laundry Pods</li>
          </ul>
          <p>
            We bring these cleaning essentials together to help you find the right product for the task and build a more organised cleaning routine.
          </p>
        </section>

        {/* Our Approach */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#14532D] mb-8">Our Approach</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Purpose-Driven Products',
                body: 'We organise our collection around specific cleaning needs so customers can identify products relevant to their routines.',
                icon: '🎯',
              },
              {
                title: 'Clear Instructions',
                body: 'We aim to provide useful product descriptions, straightforward usage guidance, and clear safety information.',
                icon: '📋',
              },
              {
                title: 'Everyday Practicality',
                body: 'We focus on convenient product formats and solutions for common cleaning tasks.',
                icon: '✅',
              },
              {
                title: 'A Better-Informed Customer',
                body: 'We believe customers should understand what a product is intended for, how to use it, and which precautions to follow.',
                icon: '💡',
              },
            ].map(({ title, body, icon }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#D6E8ED] p-6 shadow-sm">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-[#24333A] text-base mb-2">{title}</h3>
                <p className="text-sm text-[#52636a] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="bg-[#F0FDF4] border border-emerald-100 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#14532D]">Our Mission</h2>
          <p className="text-[#52636a] max-w-xl mx-auto leading-relaxed">
            To make everyday cleaning more approachable through practical products, clear information, and a straightforward shopping experience.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#14532D]">Find Your Clean.</h2>
          <p className="text-[#52636a] max-w-lg mx-auto">
            Whether you&apos;re refreshing your sneakers, tackling kitchen grease, cleaning household surfaces, or preparing your laundry — Mr GrimeGuru is here to help.
          </p>
          <Button variant="primary" size="lg" className="bg-[#166534] hover:bg-[#14532D]" asChild>
            <Link href="/shop" className="flex items-center gap-2">
              Shop All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </section>

      </div>
    </div>
  )
}
