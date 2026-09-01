import React, { useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import CLProductCard from './CLProductCard'
import { newArrivals } from '../../data/choiceLegacyData'

const CL = {
  primary: '#1A0A2E',
  gold:    '#C9A96E',
  accent:  '#9B1D6A',
  border:  '#E8E0D5',
}

export default function CLNewArrivals() {
  const scrollRef = useRef(null)

  function scroll(dir) {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -scrollRef.current.clientWidth * 0.75 : scrollRef.current.clientWidth * 0.75,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-white py-10 md:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1
              flex items-center gap-1.5" style={{ color: CL.gold }}>
              <Sparkles size={11} /> Just In
            </p>
            <h2 className="text-2xl md:text-3xl font-bold"
              style={{ color: CL.primary, fontFamily: '"Playfair Display", Georgia, serif' }}>
              New Arrivals
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} aria-label="Scroll left"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full
                border transition"
              style={{ borderColor: CL.border, color: CL.primary }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = CL.gold
                e.currentTarget.style.color = CL.gold
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = CL.border
                e.currentTarget.style.color = CL.primary
              }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full
                border transition"
              style={{ borderColor: CL.border, color: CL.primary }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = CL.gold
                e.currentTarget.style.color = CL.gold
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = CL.border
                e.currentTarget.style.color = CL.primary
              }}>
              <ChevronRight size={16} />
            </button>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold
              transition-all hover:gap-3" style={{ color: CL.accent }}>
              View all <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Desktop horizontal scroll */}
        <div className="hidden sm:block">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
          >
            {newArrivals.map(p => (
              <div key={p.id} className="shrink-0 w-56 md:w-64"
                style={{ scrollSnapAlign: 'start' }}>
                <CLProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile 2-col grid */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {newArrivals.map(p => (
            <CLProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Footer strip */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${CL.gold}40)` }} />
          <span className="flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border"
            style={{ color: CL.accent, borderColor: CL.border, backgroundColor: '#FAF7F2' }}>
            <Sparkles size={11} /> New arrivals added weekly
          </span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${CL.gold}40)` }} />
        </div>
      </div>
    </section>
  )
}
