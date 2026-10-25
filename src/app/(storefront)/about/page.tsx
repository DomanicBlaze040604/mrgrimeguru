import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About Us — Mr GrimeGuru',
  description: 'Everyday cleaning, made more straightforward. Three foam-powered cleaners. One grime-fighting Guru.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fffbf0]">
      {/* Hero */}
      <div className="py-20 text-center px-4" style={{ background: 'linear-gradient(160deg, #fff7df 0%, #fffbf0 100%)' }}>
        <p className="text-xs font-bold uppercase tracking-widest text-[#111111] mb-3">About Mr GrimeGuru</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#171714] tracking-tight mb-5">
          Less Grime. More Good Times.
        </h1>
        <p className="text-[#655e51] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Mr GrimeGuru is built around a simple idea: everyday cleaning should be practical, straightforward, and easier to understand.
        </p>
      </div>

      <div className="container-wide max-w-4xl py-16 space-y-16">

        {/* Story */}
        <section className="space-y-4 text-[#655e51] text-base leading-relaxed">
          <p>
            Different cleaning challenges call for different solutions. Shoes collect dirt, kitchens gather grease, household surfaces need regular attention, and laundry is a part of everyday life.
          </p>
          <p>
            Meet the three cleaners at the heart of our foam-powered range:
          </p>
          <ul className="list-disc list-inside space-y-1 font-semibold text-[#171714]">
            <li>Shoe Cleaner</li>
            <li>Multipurpose Cleaner</li>
            <li>Kitchen Cleaner</li>

          </ul>
          <p>
            We bring these cleaning essentials together to help you find the right product for the task and build a more organised cleaning routine.
          </p>
        </section>

        {/* Our Approach */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#171714] mb-8">Our Approach</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Pick Your Mess. Meet Your Match.',
                body: 'We organise our collection around specific cleaning needs so customers can identify products relevant to their routines.',
                icon: '🎯',
              },
              {
                title: 'Clear Instructions',
                body: 'We aim to provide useful product descriptions, straightforward usage guidance, and clear safety information.',
                icon: '📋',
              },
              {
                title: 'Less Fuss. More Fresh.',
                body: 'We focus on convenient product formats and solutions for common cleaning tasks.',
                icon: '✅',
              },
              {
                title: 'A Better-Informed Customer',
                body: 'We believe customers should understand what a product is intended for, how to use it, and which precautions to follow.',
                icon: '💡',
              },
            ].map(({ title, body, icon }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#e5dcc9] p-6 shadow-sm">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-[#171714] text-base mb-2">{title}</h3>
                <p className="text-sm text-[#655e51] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="bg-[#fff7df] border border-emerald-100 rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#171714]">Our Mission</h2>
          <p className="text-[#655e51] max-w-xl mx-auto leading-relaxed">
            To make everyday cleaning more approachable through practical products, clear information, and a straightforward shopping experience.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#171714]">Find Your Clean.</h2>
          <p className="text-[#655e51] max-w-lg mx-auto">
            Whether you&apos;re refreshing your sneakers, tackling kitchen grease, cleaning household surfaces, or preparing your laundry — Mr GrimeGuru is here to help.
          </p>
          <Button variant="primary" size="lg" className="bg-[#111111] hover:bg-[#171714]" asChild>
            <Link href="/shop" className="flex items-center gap-2">
              Shop All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </section>

      </div>
    </div>
  )
}
