'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Maximize2, X } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { getCleanerOffer } from '@/lib/cleaner-offers'

function VideoWindow({ slug, name, added }: { slug: string; name: string; added: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [failed, setFailed] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const expandButton = useRef<HTMLButtonElement>(null)
  const minimize = () => {
    if (video.current) video.current.muted = true
    setExpanded(false)
    requestAnimationFrame(() => expandButton.current?.focus({ preventScroll: true }))
  }
  const file = slug === 'multipurpose-cleaner' ? 'multipurpose-1.mp4' : `${slug}-1.mp4`
  return <aside className={`guru-mini-video ${expanded ? 'is-expanded' : 'is-collapsed'}`} aria-label={`${name} demonstration`} onKeyDown={event => { if (event.key === 'Escape' && expanded) minimize() }}>
    {expanded && <div className="guru-mini-video-heading"><div><span>{added ? 'IN YOUR CART. NOW SEE IT WORK.' : 'YOUR GURU IN ACTION'}</span><strong>{name}</strong></div><button onClick={minimize} aria-label="Minimize product video" title="Minimize video"><X size={18} /></button></div>}
    {failed ? <p>Video unavailable right now.</p> : <video ref={video} src={`/images/products/${file}`} autoPlay muted loop playsInline controls={expanded} tabIndex={expanded ? 0 : -1} poster={`/images/products/${slug}-1.jpeg`} preload="auto" onError={() => setFailed(true)} aria-label={`${name} product video`} />}
    {!expanded && <button ref={expandButton} className="guru-video-expand" onClick={() => { setExpanded(true); void video.current?.play().catch(() => {}) }} aria-label={`Expand ${name} video`} aria-expanded={false} title={`Watch ${name} in action`}><span><Maximize2 size={12} /></span></button>}
  </aside>
}

export function FloatingProductVideo() {
  const pathname = usePathname()
  const { lastAddedItem, isInfoPanelOpen, closeInfoPanel } = useCartStore()
  useEffect(() => { closeInfoPanel() }, [pathname, closeInfoPanel])
  const routeSlug = /^\/(shop|products)\/([^/]+)$/.exec(pathname)?.[2]
  const slug = isInfoPanelOpen && lastAddedItem ? lastAddedItem.slug : routeSlug
  const offer = slug ? getCleanerOffer(slug) : undefined
  if (!offer) return null
  return <VideoWindow key={`${pathname}:${offer.slug}`} slug={offer.slug} name={offer.name} added={isInfoPanelOpen} />
}
