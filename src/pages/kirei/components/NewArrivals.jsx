import React, { useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import ProductCard from '../../../components/shared/ProductCard'
import { newArrivals } from '../../../data/kireiData'

export default function NewArrivals() {
  const scrollRef = useRef(null)

  function scroll(dir) {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section className="bg-white py-10 md:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[#D4527A] tracking-widest uppercase mb-1 flex items-center gap-1.5">
              <Sparkles size={12} /> Just In
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">
              New Arrivals
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Scroll controls */}
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border-2
                border-[#F5D6E0] text-gray-500 hover:border-[#D4527A] hover:text-[#D4527A] transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border-2
                border-[#F5D6E0] text-gray-500 hover:border-[#D4527A] hover:text-[#D4527A] transition"
            >
              <ChevronRight size={16} />
            </button>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-[#D4527A] hover:gap-2.5 transition-all">
              View all <ArrowRight size={15} />
            </a>
          </div>
        </div>

        {/* Scrollable row — desktop horizontal scroll, mobile grid */}
        <div className="hidden sm:block relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3 kirei-scrollbar scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {newArrivals.map(product => (
              <div
                key={product.id}
                className="shrink-0 w-56 md:w-64"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: 2-col grid */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* "New" ribbon strip */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#F5D6E0]" />
          <span className="flex items-center gap-2 text-xs font-semibold text-[#D4527A] bg-[#FDF0F4]
            px-4 py-1.5 rounded-full border border-[#F5D6E0]">
            <Sparkles size={11} />
            New products added every week
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#F5D6E0]" />
        </div>
      </div>
    </section>
  )
}
