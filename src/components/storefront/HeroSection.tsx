'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProductTrio } from './ProductTrio'
import { OfferBadge } from './OfferBadge'
import { useSwipeCarousel } from './useSwipeCarousel'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

const slides = [
  { image: 'hero-collection.png', label: 'The clean team', line: 'Four gurus. From home to open road.' },
  { image: 'vehicle-cleaner-cutout.png', label: 'Car Cleaner', line: 'Fresh foam. Ready for the next drive.', word: 'DRIVE.' },
  { image: 'kitchen-cleaner-cutout.png', label: 'Kitchen Cleaner', line: 'Grease takes flight. Kitchens shine bright.', word: 'DEGREASE.' },
  { image: 'multipurpose-cleaner-cutout.png', label: 'Multipurpose Cleaner', line: 'Room to room. Make way for foam.', word: 'REFRESH.' },
  { image: 'shoe-cleaner-cutout.png', label: 'Shoe Cleaner', line: 'Lose the grime. Step out in prime.', word: 'REPEAT.' },
]

export function HeroSection() {
  const [active, setActive] = useState(0)
  const swipe = useSwipeCarousel(direction => setActive(index => (index + direction + slides.length) % slides.length))
  useEffect(() => {
    if (swipe.dragging || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive(i => (i + 1) % slides.length), 3500)
    return () => window.clearInterval(timer)
  }, [swipe.dragging])
  return <section className="guru-hero" aria-label="Meet Mr GrimeGuru">
    <div className="guru-container guru-hero-grid">
      <div className="guru-hero-copy">
        <span className="guru-pill">✦ SECRET FORMULA. SERIOUS FOAM.</span>
        <h1>BIG ON FOAM.<br /><span>TOUGH ON</span><br />GRIME.<span className="guru-hero-descriptor">Foam cleaners for cars, kitchen, home &amp; shoes</span></h1>
        <p>Road grime? Kitchen chaos? Sneaker crime? Meet the foam-powered clean team, now with Car Cleaner. From your home to your next drive.</p>
        <div className="guru-actions"><Link className="guru-button" href="#range">Explore the range <ArrowRight size={18} /></Link><Link className="guru-button guru-button-light" href="#see-it-work">See it work <Play size={16} /></Link></div>
        <div className="guru-hero-facts"><div><strong>4 clean machines</strong><span>Cars · Kitchen · Home · Shoes</span></div><div><strong>Our own formula</strong><span>Made by Mr GrimeGuru</span></div><div><strong>Free shipping</strong><span>On orders ₹499+</span></div></div>
      </div>
      <div className="guru-hero-carousel" aria-roledescription="carousel" aria-label="Our cleaner collection">
        <div className="guru-hero-stage" {...swipe.handlers}>
          {slides.map((slide, i) => <div key={slide.image} data-cleaner={slide.image.replace('-cutout.png', '')} className={`guru-hero-slide ${i === active ? 'is-active' : ''} ${i > 0 ? 'is-product' : ''}`} aria-hidden={i !== active}>
            {i > 0 && <><span className="guru-slide-word" aria-hidden="true">{slide.word}</span><span className="guru-slide-star" aria-hidden="true">✦</span></>}
            {i === 0 ? <><span className="guru-trio-title">THE CLEAN TEAM.</span><ProductTrio /><span className="guru-trio-note">CARS. KITCHEN. HOME. SHOES. SORTED.</span></> : <Image src={`/images/products/${slide.image}`} alt={slide.label} fill sizes="(max-width: 900px) 95vw, 55vw" className="guru-slide-image" />}
          </div>)}
          <OfferBadge hero />
        </div>
        <div className="guru-carousel-bottom"><div><span>{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span><strong>{slides[active].line}</strong></div><div className="guru-carousel-controls">{slides.map((s, i) => <button key={s.image} className={i === active ? 'is-active' : ''} onClick={() => setActive(i)} aria-label={`Show ${s.label}`} aria-pressed={active === i} />)}</div></div>
      </div>
    </div>
  </section>
}

