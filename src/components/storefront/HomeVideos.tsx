'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

const videos = [
  { file: 'kitchen-cleaner-1.mp4', category: 'Kitchen', title: 'Grease out. Gleam on.', copy: 'Let your kitchen meet its Guru.' },
  { file: 'multipurpose-1.mp4', category: 'Multipurpose', title: 'Mess today. Gone away.', copy: 'A fresh start for everyday surfaces.' },
  { file: 'kitchen-cleaner-2.mp4', category: 'Kitchen', title: 'Cook a feast. Beat the grease.', copy: 'For the clean-up after the cook-up.' },
  { file: 'shoe-cleaner-1.mp4', category: 'Shoes', title: 'Street grime? Shine time.', copy: 'Give your kicks the Guru treatment.' },
  { file: 'multipurpose-2.mp4', category: 'Multipurpose', title: 'Room by room. Boom, foam.', copy: 'Small spray. Fresh-day energy.' },
]

function Reel({ video }: { video: typeof videos[number] }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [failed, setFailed] = useState(false)
  async function toggle() {
    if (!ref.current) return
    if (playing) ref.current.pause()
    else { try { await ref.current.play(); setFailed(false) } catch { setFailed(true) } }
  }
  return (
    <article className="guru-reel">
      <video
        ref={ref}
        src={`/images/products/${video.file}#t=0.1`}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={`${video.category} cleaner demonstration`}
      />
      <div className="guru-reel-shade" />
      <span className="guru-reel-category">{video.category}</span>
      <button className="guru-reel-play" onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} ${video.title}`}>
        {playing ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <button className="guru-reel-sound" onClick={() => setMuted(m => !m)} aria-label={muted ? 'Unmute video' : 'Mute video'}>
        {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>
      <div className="guru-reel-caption">
        <h3>{video.title}</h3>
        <p>{failed ? 'Tap play to try again.' : video.copy}</p>
      </div>
    </article>
  )
}

export function HomeVideos() {
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const posRef = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const SPEED = 0.5 // px per frame — smooth & relaxed

    function step() {
      if (!track) return
      if (!pausedRef.current) {
        posRef.current += SPEED
        // Seamless loop: reset when we've scrolled half the duplicated list
        const halfWidth = track.scrollWidth / 2
        if (posRef.current >= halfWidth) posRef.current = 0
        track.style.transform = `translateX(-${posRef.current}px)`
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)

    const outer = track.parentElement
    const pause = () => { pausedRef.current = true }
    const resume = () => { pausedRef.current = false }
    outer?.addEventListener('mouseenter', pause)
    outer?.addEventListener('mouseleave', resume)
    outer?.addEventListener('touchstart', pause, { passive: true })
    outer?.addEventListener('touchend', resume)

    return () => {
      cancelAnimationFrame(animRef.current)
      outer?.removeEventListener('mouseenter', pause)
      outer?.removeEventListener('mouseleave', resume)
      outer?.removeEventListener('touchstart', pause)
      outer?.removeEventListener('touchend', resume)
    }
  }, [])

  // Duplicate list for seamless infinite scroll
  const allVideos = [...videos, ...videos]

  return (
    <section className="guru-section guru-videos" id="see-it-work">
      <div className="guru-container">
        <div className="guru-video-heading">
          <span className="guru-eyebrow">03 / THE GURU IN ACTION</span>
          <h2>A little spray.<br /><span>Grime, out of the way.</span></h2>
          <p>Press play. Meet your mess-fighting match. Real product demos, all Guru energy.</p>
        </div>
      </div>
      <div className="guru-reels-outer">
        <div className="guru-reels-track" ref={trackRef}>
          {allVideos.map((video, i) => <Reel video={video} key={video.file + i} />)}
        </div>
      </div>
    </section>
  )
}
