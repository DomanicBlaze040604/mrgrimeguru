'use client'

import React, { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

export function BrandVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setIsPlaying(true)
    } else {
      v.pause()
      setIsPlaying(false)
    }
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setIsMuted(v.muted)
  }

  return (
    <section
      className="section-gap"
      style={{ backgroundColor: '#FAF8F2' }}
      aria-label="Brand story"
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-caption mb-3" style={{ color: '#347F99' }}>
              Our Story
            </p>
            <h2 className="text-headline mb-5" style={{ color: '#24333A' }}>
              Cleaning reimagined for modern India.
            </h2>
            <p className="text-body-lg mb-5" style={{ color: '#75828A' }}>
              Mr GrimeGuru was born from a simple belief: cleaning products should be as smart and modern as the homes they clean. We obsess over formulas, fragrances, and formats — so your cleaning routine is always one step ahead.
            </p>
            <p className="text-body mb-6" style={{ color: '#75828A' }}>
              From powerful laundry pods to long-lasting scented beads, sparkling floor cleaners to kitchen degreasers and shoe care — every product is crafted with the modern Indian household in mind.
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { num: '5', label: 'Product families' },
                { num: '4', label: 'Bead scents' },
                { num: '★4.8', label: 'Average rating' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold" style={{ color: '#347F99' }}>{num}</p>
                  <p className="text-sm" style={{ color: '#75828A' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Video */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video bg-[#24333A]">
            {/* Poster / placeholder */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #24333A 0%, #347F99 100%)' }}
            >
              <div className="text-center text-white px-8">
                <div className="text-6xl mb-4">🧹</div>
                <p className="font-bold text-xl mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Mr GrimeGuru
                </p>
                <p className="text-sm opacity-70">Brand video coming soon</p>
              </div>
            </div>

            {/* Actual video (replace src with real video URL from admin) */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-0"
              muted
              playsInline
              preload="none"
              aria-label="Mr GrimeGuru brand video"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <track kind="captions" />
            </video>

            {/* Controls overlay */}
            <div className="absolute inset-0 flex items-end justify-between p-5 bg-gradient-to-t from-[#24333A]/60 to-transparent">
              <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-[#24333A]" />
                ) : (
                  <Play className="h-6 w-6 text-[#24333A] ml-0.5" />
                )}
              </motion.button>
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-white" />
                ) : (
                  <Volume2 className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
