'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getCleanerOffer } from '@/lib/cleaner-offers'
import { getProductSlides } from '@/lib/product-gallery'

export function ProductImageGallery({ slug, name, image, images, className = '', preload = false, informationOnly = false }: { slug: string; name: string; image: string; images?: string[]; className?: string; preload?: boolean; informationOnly?: boolean }) {
  const photos = getProductSlides(slug, name, image, images, informationOnly)
  const [selected, setSelected] = useState(0)
  const [focused, setFocused] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const count = photos.length
  const shown = selected % count
  const current = photos[shown]
  const advance = () => setSelected(index => (index + 1) % count)

  useEffect(() => {
    if (count < 2 || focused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = false
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    if (frame.current) observer.observe(frame.current)
    const timer = window.setInterval(() => { if (visible && !document.hidden) setSelected(index => (index + 1) % count) }, 3500)
    return () => { observer.disconnect(); window.clearInterval(timer) }
  }, [count, focused, slug])

  return <div ref={frame} className={`guru-gallery guru-info-carousel ${current.artwork ? 'has-information' : ''} ${className}`} data-product={getCleanerOffer(slug)?.slug} role="group" aria-roledescription="carousel" aria-label={`${name} images and information`} onFocusCapture={event => setFocused(event.target.matches(':focus-visible'))} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); setSelected(index => (index + (event.key === 'ArrowRight' ? 1 : count - 1)) % count) } }}>
    <button type="button" className="guru-gallery-swap" aria-label={`Next ${name} slide. Showing ${shown + 1} of ${count}: ${current.title}`} onMouseEnter={advance} onClick={advance}>
      {photos.map((slide, i) => (i === shown || i === (shown + 1) % count) && <Image key={slide.src} src={slide.src} alt={slide.title} fill sizes="(max-width: 700px) 90vw, 45vw" preload={preload && i === 0} className={`${i === shown ? 'is-visible' : ''} ${slide.artwork ? 'is-scene' : 'is-packshot'}`} aria-hidden={i !== shown} />)}
    </button>
    {current.artwork && <div className="guru-slide-info" key={current.src}><h3>{current.title}</h3><ul>{current.points.map(point => <li key={point}>{point}</li>)}</ul></div>}
    {count > 1 && <div className="guru-gallery-caption"><span>{shown + 1} / {count} · Hover or tap</span><div>{photos.map((slide, i) => <button key={slide.src} aria-label={`Show ${name}: ${slide.title}`} aria-pressed={shown === i} onClick={() => setSelected(i)} className={shown === i ? 'is-active' : ''} />)}</div></div>}
  </div>
}
