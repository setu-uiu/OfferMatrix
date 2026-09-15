import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { announcements } from '../../data/choiceLegacyData'

const CL = { accent: '#9B1D6A', gold: '#C9A96E' }

export default function CLAnnouncementBar() {
  const [current,   setCurrent]   = useState(0)
  const [dismissed, setDismissed] = useState(false)

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
    <div style={{ backgroundColor: CL.accent }} className="text-white text-xs md:text-sm">
      <div className="max-w-7xl mx-auto px-3 h-9 flex items-center justify-between gap-2">
        <button onClick={prev} aria-label="Previous"
          className="shrink-0 hover:bg-white/20 rounded p-0.5 transition">
          <ChevronLeft size={14} />
        </button>

        <p className="flex-1 text-center font-medium tracking-wide truncate select-none">
          {announcements[current].text}
        </p>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={next} aria-label="Next"
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
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 16 : 6,
              height: 6,
              backgroundColor: i === current ? CL.gold : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
