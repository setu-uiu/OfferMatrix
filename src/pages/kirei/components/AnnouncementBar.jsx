import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { announcements } from '../../../data/kireiData'

export default function AnnouncementBar() {
  const [current,   setCurrent]   = useState(0)
  const [dismissed, setDismissed] = useState(false)

  // Auto-rotate every 4 s
  useEffect(() => {
    if (dismissed) return
    const id = setInterval(() =>
      setCurrent(c => (c + 1) % announcements.length), 4000)
    return () => clearInterval(id)
  }, [dismissed])

  if (dismissed) return null

  const prev = () => setCurrent(c => (c - 1 + announcements.length) % announcements.length)
  const next = () => setCurrent(c => (c + 1) % announcements.length)

  return (
    <div className="bg-[#D4527A] text-white text-xs md:text-sm">
      <div className="max-w-7xl mx-auto px-3 h-9 flex items-center justify-between gap-2">
        {/* Prev */}
        <button onClick={prev} aria-label="Previous announcement"
          className="shrink-0 hover:bg-white/20 rounded p-0.5 transition">
          <ChevronLeft size={14} />
        </button>

        {/* Message */}
        <p className="flex-1 text-center font-medium tracking-wide truncate select-none">
          {announcements[current].text}
        </p>

        {/* Next + dismiss */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={next} aria-label="Next announcement"
            className="hover:bg-white/20 rounded p-0.5 transition">
            <ChevronRight size={14} />
          </button>
          <button onClick={() => setDismissed(true)} aria-label="Dismiss"
            className="hover:bg-white/20 rounded p-0.5 transition ml-1">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1 pb-1">
        {announcements.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Announcement ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
