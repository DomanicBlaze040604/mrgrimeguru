'use client'

import { useRef, useState, useEffect, type PointerEvent } from 'react'
import { Play, Pause, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

const videos = [
  { file: 'car cleaner 1.mp4', category: 'Car Care', title: 'Road dirt. Meet your Guru.', copy: 'Meet the Car Cleaner in action.' },
  { file: 'kitchen-cleaner-1.mp4', category: 'Kitchen', title: 'Grease out. Gleam on.', copy: 'Let your kitchen meet its Guru.' },
  { file: 'multipurpose-1.mp4', category: 'Multipurpose', title: 'Mess today. Gone away.', copy: 'A fresh start for everyday surfaces.' },
  { file: 'car cleaner 2.mp4', category: 'Car Care', title: 'Fresh foam. Next drive.', copy: 'Make room for a little car care.' },
  { file: 'kitchen-cleaner-2.mp4', category: 'Kitchen', title: 'Cook a feast. Beat the grease.', copy: 'For the clean-up after the cook-up.' },
  { file: 'shoe-cleaner-1.mp4', category: 'Shoes', title: 'Street grime? Shine time.', copy: 'Give your kicks the Guru treatment.' },
  { file: 'car cleaner 3.mp4', category: 'Car Care', title: 'Your car. Your clean.', copy: 'Foam-powered care for compatible car surfaces.' },
  { file: 'multipurpose-2.mp4', category: 'Multipurpose', title: 'Room by room. Boom, foam.', copy: 'Small spray. Fresh-day energy.' },
]

type Demo = typeof videos[number]

// Measure one complete set, including the gap between copies, to avoid a jump at the seam.
function positionTrack(track: HTMLDivElement, offset: number) {
  const first = track.children[0] as HTMLElement | undefined
  const next = track.children[videos.length] as HTMLElement | undefined
  const cycle = first && next ? next.offsetLeft - first.offsetLeft : 0
  const position = cycle > 0 ? ((offset % cycle) + cycle) % cycle : 0
  track.style.transform = `translateX(-${position}px)`
  return position
}

export function HomeVideos() {
  const trackRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const position = useRef(0)
  const drag = useRef<{ x: number; y: number; lastX: number } | null>(null)
  const dragged = useRef(false)
  const resumeAt = useRef(0)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)
  const keyboardFocus = useRef(false)
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<Demo | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    const outer = outerRef.current
    if (!track || !outer) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let previous = 0
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(outer)
    function step(now: number) {
      const elapsed = previous ? Math.min(now - previous, 50) : 0
      previous = now
      if (track && visible && !document.hidden && !reducedMotion.matches && !paused && !selected && !drag.current && !keyboardFocus.current && now >= resumeAt.current) {
        position.current = positionTrack(track, position.current + elapsed * 0.03)
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [paused, selected])

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    drag.current = { x: event.clientX, y: event.clientY, lastX: event.clientX }
    dragged.current = false
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current
    const track = trackRef.current
    if (!start || !track) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (!dragged.current && (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy))) return
    dragged.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    position.current = positionTrack(track, position.current + start.lastX - event.clientX)
    start.lastX = event.clientX
  }

  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    drag.current = null
    resumeAt.current = performance.now() + 800
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function openVideo(video: Demo, trigger: HTMLButtonElement) {
    lastTrigger.current = trigger
    setFailed(false)
    setSelected(video)
  }

  return (
    <Dialog.Root open={selected !== null} onOpenChange={open => { if (!open) setSelected(null) }}>
      <section className="guru-section guru-videos" id="see-it-work">
        <div className="guru-container">
          <div className="guru-video-heading">
            <span className="guru-eyebrow">03 / THE GURU IN ACTION</span>
            <h2>A little spray.<br /><span>Grime, out of the way.</span></h2>
            <p>Swipe to explore. Tap to watch. Real product demos, all Guru energy.</p>
          </div>
        </div>
        <div className="guru-reels-outer" ref={outerRef} role="region" aria-label="Product demonstration videos" aria-roledescription="carousel"
          onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
          onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false } }}
          onFocusCapture={event => { keyboardFocus.current = event.target.matches(':focus-visible') }}
          onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) keyboardFocus.current = false }}>
          <div className="guru-reels-track" ref={trackRef}>
            {[...videos, ...videos, ...videos].map((video, index) => <article className="guru-reel" key={video.file + index} aria-hidden={index >= videos.length || undefined}>
              <video src={`/images/products/${video.file}#t=0.1`} muted playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
              <div className="guru-reel-shade" />
              <span className="guru-reel-category">{video.category}</span>
              <div className="guru-reel-caption"><h3>{video.title}</h3><p>{video.copy}</p></div>
              <button type="button" className="guru-reel-open" aria-label={`Watch ${video.title}`} tabIndex={index < videos.length ? 0 : -1}
                onFocus={event => {
                  if (event.currentTarget.matches(':focus-visible') && trackRef.current) {
                    const card = event.currentTarget.parentElement
                    if (card) position.current = positionTrack(trackRef.current, card.offsetLeft)
                  }
                }}
                onClick={event => openVideo(video, event.currentTarget)}>
                <span className="guru-reel-play"><Play size={24} /></span>
              </button>
            </article>)}
          </div>
        </div>
        <div className="guru-reel-navigation">
          <span>Swipe or drag · Tap any video to play</span>
          <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume video carousel' : 'Pause video carousel'}>{paused ? <Play size={15} /> : <Pause size={15} />}<span>{paused ? 'Resume' : 'Pause'}</span></button>
        </div>
      </section>
      <Dialog.Portal>
        <Dialog.Overlay className="guru-reel-modal-overlay" />
        <Dialog.Content className="guru-reel-modal" onCloseAutoFocus={event => { event.preventDefault(); lastTrigger.current?.focus({ preventScroll: true }) }}>
          <div className="guru-reel-modal-heading">
            <div><span>{selected?.category}</span><Dialog.Title>{selected?.title}</Dialog.Title></div>
            <Dialog.Close className="guru-reel-modal-close" aria-label="Close video"><X size={22} /></Dialog.Close>
          </div>
          {selected && <video key={selected.file} className="guru-reel-modal-video" src={`/images/products/${selected.file}`} autoPlay controls playsInline preload="auto" aria-label={`${selected.category} cleaner demonstration`} onError={() => setFailed(true)} />}
          <Dialog.Description className="guru-reel-modal-description">{failed ? 'This video could not load. Close it and tap the video to try again.' : selected?.copy}</Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
