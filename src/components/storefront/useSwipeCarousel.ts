'use client'
import { useRef, useState, type PointerEvent } from 'react'

export function useSwipeCarousel(change: (direction: number) => void) {
  const start = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const [dragging, setDragging] = useState(false)
  return {
    dragging,
    consumeClick: () => { const value = swiped.current; swiped.current = false; return value },
    handlers: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        if (event.button !== 0) return
        start.current = { x: event.clientX, y: event.clientY }
        swiped.current = false
        setDragging(true)
        event.currentTarget.setPointerCapture(event.pointerId)
      },
      onPointerUp: (event: PointerEvent<HTMLElement>) => {
        if (start.current) {
          const dx = event.clientX - start.current.x
          const dy = event.clientY - start.current.y
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) { swiped.current = true; change(dx < 0 ? 1 : -1) }
        }
        start.current = null
        setDragging(false)
      },
      onPointerCancel: () => { start.current = null; setDragging(false) },
    },
  }
}
