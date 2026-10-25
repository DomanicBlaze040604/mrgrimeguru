'use client'

import React, { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

const PILLARS = [
  { icon: '🧪', title: 'Our Own Formula', body: 'Developed by our own team. Not a white-label import or a licensed formula with our sticker on it.' },
  { icon: '🎯', title: 'Built for the Mess', body: 'Each product is designed around one type of mess — not a single bottle pretending to do everything.' },
  { icon: '💧', title: 'Spray & Wipe', body: 'The formula does the work. Spray it on, give it a moment, wipe it away. Less scrubbing, cleaner result.' },
  { icon: '🏠', title: 'Made for Indian Homes', body: 'Grease from tadka, dust from roads, scuff marks on sneakers — our formula handles what Indian homes deal with every day.' },
]

export function BrandVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setIsPlaying(true) }
    else { v.pause(); setIsPlaying(false) }
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setIsMuted(v.muted)
  }

  return (
    <section className="py-20 bg-[#FAF8F2]" aria-label="Brand story">
      <div className="container-wide">
        {/* Top: headline + video */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Text */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#166534] mb-3">Why Mr GrimeGuru</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#14532D] mb-5 leading-tight">
              We don&apos;t rebrand cleaners.<br />We make them.
            </h2>
            <p className="text-[#52636a] text-base leading-relaxed mb-5">
              Our cleaning formulas are developed by our own team — not bought in from a white-label supplier and relabelled. That means when something needs improving, we fix it at source.
            </p>
            <p className="text-[#52636a] text-base leading-relaxed mb-8">
              Every product is built around a specific type of mess: shoe dirt, kitchen grease, everyday household grime. One product. One purpose. Done right.
            </p>
            <div className="flex flex-wrap gap-8">
              {[
                { num: '4', label: 'Cleaning essentials' },
                { num: '3', label: 'Spray products' },
                { num: '🔒', label: 'Secret formula' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-[#166534]">{num}</p>
                  <p className="text-sm text-[#75828A]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video bg-[#111827]">
            {/* Poster */}
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#14532D] to-[#166534]">
                <span className="text-6xl mb-4">🧴</span>
                <p className="font-black text-white text-xl mb-1">Mr GrimeGuru</p>
                <p className="text-white/60 text-sm">Spray. Wait. Wipe.</p>
              </div>
            )}

            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
              src="/images/products/kitchen-cleaner-1.mp4"
              aria-label="Mr GrimeGuru kitchen cleaner in action"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <track kind="captions" />
            </video>

            <div className="absolute inset-0 flex items-end justify-between p-5 bg-gradient-to-t from-black/50 to-transparent">
              <motion.button
                onClick={togglePlay}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying
                  ? <Pause className="h-6 w-6 text-[#14532D]" />
                  : <Play className="h-6 w-6 text-[#14532D] ml-0.5" />}
              </motion.button>
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted
                  ? <VolumeX className="h-5 w-5 text-white" />
                  : <Volume2 className="h-5 w-5 text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: 4 pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map(({ icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl border border-[#D6E8ED] p-6 shadow-sm">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold text-[#14532D] mb-2">{title}</h3>
              <p className="text-sm text-[#52636a] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
