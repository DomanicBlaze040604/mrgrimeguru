'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getCleanerOffer } from '@/lib/cleaner-offers'

export function ProductImageGallery({ slug, name, image, images, className = '', preload = false }: { slug: string; name: string; image: string; images?: string[]; className?: string; preload?: boolean }) {
  const offer = getCleanerOffer(slug)
  const photos = images?.length ? images : offer ? [`/images/products/${offer.slug}-1.jpeg`, `/images/products/${offer.slug}-info.jpeg`] : [image]
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState(false)
  const shown = hovered && photos.length > 1 ? (selected + 1) % photos.length : selected
  return <div className={`guru-gallery ${className}`}>
    <button type="button" className="guru-gallery-swap" aria-label={photos.length > 1 ? `Show next image of ${name}` : name} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => { setSelected((selected + 1) % photos.length); setHovered(false) }}>
      {photos.map((src, i) => <Image key={src} src={src} alt={`${name}${i > 0 ? ' — product details' : ''}`} fill sizes="(max-width: 700px) 90vw, 45vw" preload={preload && i === 0} className={i === shown ? 'is-visible' : ''} aria-hidden={i !== shown} />)}
    </button>
    {photos.length > 1 && <div className="guru-gallery-caption"><span>Hover or tap to explore</span><div>{photos.map((src, i) => <button key={src} aria-label={`Show ${name} image ${i + 1}`} aria-pressed={shown === i} onClick={() => {setSelected(i); setHovered(false)}} className={shown === i ? 'is-active' : ''} />)}</div></div>}
  </div>
}
