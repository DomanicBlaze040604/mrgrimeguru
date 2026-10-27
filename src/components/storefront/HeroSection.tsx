'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProductTrio } from './ProductTrio'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

const slides = [
  { image: 'hero-collection.png', label: 'The grime-fighting trio', line: 'Three gurus. One clean home.' },
  { image: 'kitchen-cleaner-cutout.png', label: 'Kitchen Cleaner', line: 'Grease takes flight. Kitchens shine bright.' },
  { image: 'multipurpose-cleaner-cutout.png', label: 'Multipurpose Cleaner', line: 'Room to room. Make way for foam.' },
  { image: 'shoe-cleaner-cutout.png', label: 'Shoe Cleaner', line: 'Lose the grime. Step out in prime.' },
]

export function HeroSection() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive(i => (i + 1) % slides.length), 3500)
    return () => window.clearInterval(timer)
  }, [])
  return <section className="guru-hero" aria-label="Meet Mr GrimeGuru">
    <div className="guru-container guru-hero-grid">
      <div className="guru-hero-copy">
        <span className="guru-pill">✦ SECRET FORMULA. SERIOUS FOAM.</span>
        <h1>BIG ON FOAM.<br /><span>TOUGH ON</span><br />GRIME.</h1>
        <p>Kitchen chaos? Sneaker crime? Call the Guru, skip the grime. Meet our foam-powered trio for the messes life throws at you.</p>
        <div className="guru-actions"><Link className="guru-button" href="#range">Explore the range <ArrowRight size={18} /></Link><Link className="guru-button guru-button-light" href="#see-it-work">See it work <Play size={16} /></Link></div>
        <div className="guru-hero-facts"><div><strong>3 clean machines</strong><span>Kitchen · Home · Shoes</span></div><div><strong>Our own formula</strong><span>Made by Mr GrimeGuru</span></div><div><strong>Free shipping</strong><span>On orders ₹499+</span></div></div>
      </div>
      <div className="guru-hero-carousel" aria-roledescription="carousel" aria-label="Our cleaner collection">
        <div className="guru-hero-stage">
          {slides.map((slide, i) => <div key={slide.image} className={`guru-hero-slide ${i === active ? 'is-active' : ''} ${i > 0 ? 'is-product' : ''}`} aria-hidden={i !== active}>
            {i > 0 && <><span className="guru-slide-word" aria-hidden="true">{i === 1 ? 'DEGREASE.' : i === 2 ? 'REFRESH.' : 'REPEAT.'}</span><span className="guru-slide-star" aria-hidden="true">✦</span></>}
            {i === 0 ? <><span className="guru-trio-title">THE CLEAN TEAM.</span><ProductTrio /><span className="guru-trio-note">KITCHEN. HOME. SHOES. SORTED.</span></> : <Image src={`/images/products/${slide.image}`} alt={slide.label} fill sizes="(max-width: 900px) 95vw, 55vw" className="guru-slide-image" />}
          </div>)}
        </div>
        <div className="guru-carousel-bottom"><div><span>{String(active + 1).padStart(2, '0')} / 04</span><strong>{slides[active].line}</strong></div><div className="guru-carousel-controls">{slides.map((s, i) => <button key={s.image} className={i === active ? 'is-active' : ''} onClick={() => setActive(i)} aria-label={`Show ${s.label}`} aria-pressed={active === i} />)}</div></div>
      </div>
    </div>
  </section>
}

