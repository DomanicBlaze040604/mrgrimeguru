'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useSwipeCarousel } from './useSwipeCarousel'

const views = ['Your complete bundle', 'Foam cleaners together', 'Everyday cleaning scenes']

export function ComboGallery({ name, products }: { name: string; products: { slug: string; name: string }[] }) {
  const [selected, setSelected] = useState(0)
  const [focused, setFocused] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const move = (direction: number) => setSelected(index => (index + direction + 3) % 3)
  const swipe = useSwipeCarousel(move)
  useEffect(() => {
    if (focused || swipe.dragging || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = false
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    if (frame.current) observer.observe(frame.current)
    const timer = setInterval(() => { if (visible && !document.hidden) setSelected(index => (index + 1) % 3) }, 3500)
    return () => { clearInterval(timer); observer.disconnect() }
  }, [focused, swipe.dragging])
  return <div ref={frame} className="guru-combo-gallery" role="group" aria-roledescription="carousel" aria-label={`${name} images`} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) } }}>
    <button type="button" className="guru-combo-stage" aria-label={`${name}: ${views[selected]}. Image ${selected + 1} of 3. Swipe or tap for next image.`} {...swipe.handlers} onClick={() => { if (!swipe.consumeClick()) move(1) }}>
      {views.map((view, index) => <span key={view} className={`guru-combo-slide ${index === selected ? 'is-active' : ''} ${index === 2 ? 'is-lifestyle' : ''}`} aria-hidden={index !== selected}>
        {products.map(product => <span key={product.slug} className="guru-combo-product"><Image src={index === 2 ? `/images/products/gallery/${product.slug}-4.png` : `/images/products/${product.slug}-${index === 0 ? 'cutout' : 'foam'}.png`} alt={`${product.name} — ${view.toLowerCase()}`} fill sizes="(max-width: 640px) 40vw, 24vw" draggable={false} /></span>)}
      </span>)}
    </button>
    <div className="guru-combo-caption"><span>{selected + 1} / 3 · Swipe or tap</span><div>{views.map((view, index) => <button key={view} aria-label={`${name}: show ${view.toLowerCase()}`} aria-pressed={selected === index} onClick={() => setSelected(index)} />)}</div></div>
  </div>
}
