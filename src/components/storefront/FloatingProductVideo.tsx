'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { getCleanerOffer } from '@/lib/cleaner-offers'

function VideoWindow({ slug, name, added }: { slug: string; name: string; added: boolean }) {
  const [closed, setClosed] = useState(false)
  const [failed, setFailed] = useState(false)
  if (closed) return null
  const file = slug === 'multipurpose-cleaner' ? 'multipurpose-1.mp4' : `${slug}-1.mp4`
  return <aside className="guru-mini-video" aria-label={`${name} demonstration`}><div className="guru-mini-video-heading"><div><span>{added ? 'IN YOUR CART. NOW SEE IT WORK.' : 'YOUR GURU IN ACTION'}</span><strong>{name}</strong></div><button onClick={() => setClosed(true)} aria-label="Close product video"><X size={18} /></button></div>{failed ? <p>Video unavailable right now.</p> : <video key={file} src={`/images/products/${file}`} autoPlay muted loop playsInline controls preload="metadata" onError={() => setFailed(true)} aria-label={`${name} product video`} />}</aside>
}

export function FloatingProductVideo() {
  const pathname = usePathname()
  const { lastAddedItem, isInfoPanelOpen, closeInfoPanel } = useCartStore()
  useEffect(() => { closeInfoPanel() }, [pathname, closeInfoPanel])
  const routeSlug = /^\/(shop|products)\/([^/]+)$/.exec(pathname)?.[2]
  const slug = isInfoPanelOpen && lastAddedItem ? lastAddedItem.slug : routeSlug
  const offer = slug ? getCleanerOffer(slug) : undefined
  if (!offer) return null
  return <VideoWindow key={`${pathname}:${offer.slug}:${isInfoPanelOpen}:${lastAddedItem?.quantity ?? 0}`} slug={offer.slug} name={offer.name} added={isInfoPanelOpen} />
}
