'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react'

interface VideoItem {
  src: string
  label: string
  caption: string
}

interface ProductVideoSectionProps {
  videos: VideoItem[]
  title?: string
  subtitle?: string
  accentColor?: string
}

function VideoPlayer({ video, accentColor }: { video: VideoItem; accentColor: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  function toggle() {
    if (!ref.current) return
    if (ref.current.paused) { ref.current.play(); setPlaying(true) }
    else { ref.current.pause(); setPlaying(false) }
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] shadow-xl group">
      <video
        ref={ref}
        src={video.src}
        className="w-full h-full object-cover"
        muted={muted}
        playsInline
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <track kind="captions" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-0.5">{video.label}</p>
        <p className="text-sm font-semibold text-white leading-snug">{video.caption}</p>
      </div>

      {/* Play button center */}
      {!playing && (
        <button
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Play video"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            <Play className="h-7 w-7 text-white ml-1" />
          </div>
        </button>
      )}

      {/* Controls bar */}
      <div className="absolute top-3 right-3 flex gap-2">
        {playing && (
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
            aria-label="Pause"
          >
            <Pause className="h-4 w-4 text-white" />
          </button>
        )}
        <button
          onClick={() => {
            if (!ref.current) return
            ref.current.muted = !ref.current.muted
            setMuted(ref.current.muted)
          }}
          className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
        </button>
      </div>
    </div>
  )
}

export function ProductVideoSection({
  videos,
  title = 'See It Work.',
  subtitle = 'Real results. Our own secret formula.',
  accentColor = '#166534',
}: ProductVideoSectionProps) {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 3
  const canPrev = startIndex > 0
  const canNext = startIndex + visibleCount < videos.length

  return (
    <section className="py-16 md:py-20 bg-[#111827]" aria-label="Product videos">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
              Watch It Clean
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white">{title}</h2>
            <p className="text-gray-400 mt-2 text-base">{subtitle}</p>
          </div>
          {videos.length > visibleCount && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
                disabled={!canPrev}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white disabled:opacity-30 hover:border-white/50 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setStartIndex((i) => Math.min(videos.length - visibleCount, i + 1))}
                disabled={!canNext}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white disabled:opacity-30 hover:border-white/50 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {videos.slice(startIndex, startIndex + visibleCount).map((video, i) => (
            <motion.div
              key={video.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <VideoPlayer video={video} accentColor={accentColor} />
            </motion.div>
          ))}
        </div>

        {/* "Our own formula" badge */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-white/10 bg-white/5">
            <span className="text-xl">🧪</span>
            <p className="text-sm text-gray-300">
              <span className="font-bold text-white">Our own secret formula</span> — developed and made by us. Not a white-label product.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
