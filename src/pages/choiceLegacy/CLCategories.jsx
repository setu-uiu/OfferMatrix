import React from 'react'
import { ArrowRight } from 'lucide-react'
import { categories } from '../../data/choiceLegacyData'

const CL = {
  primary: '#1A0A2E',
  gold:    '#C9A96E',
  accent:  '#9B1D6A',
  surface: '#FAF7F2',
  border:  '#E8E0D5',
}

function CategoryCard({ cat }) {
  return (
    <button
      aria-label={`Browse ${cat.name}`}
      className="group relative flex flex-col items-center gap-3 rounded-2xl p-4 md:p-5
        border bg-white cursor-pointer text-left w-full transition-all duration-250
        focus:outline-none focus-visible:ring-2"
      style={{
        borderColor: CL.border,
        '--tw-ring-color': CL.gold,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = CL.gold
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(201,169,110,0.18)`
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = CL.border
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Icon circle */}
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center
          text-3xl md:text-4xl transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: cat.color }}
      >
        {cat.emoji}
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-sm font-semibold transition-colors duration-200 group-hover:text-[#9B1D6A]"
          style={{ color: CL.primary }}>
          {cat.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight hidden md:block">
          {cat.description}
        </p>
      </div>

      {/* Hover arrow */}
      <span className="flex items-center gap-0.5 text-[11px] font-semibold opacity-0
        group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: CL.gold }}>
        Shop <ArrowRight size={10} />
      </span>
    </button>
  )
}

export default function CLCategories() {
  return (
    <section id="cl-categories" className="py-10 md:py-14" style={{ backgroundColor: CL.surface }}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: CL.gold }}>Explore</p>
            <h2 className="text-2xl md:text-3xl font-bold"
              style={{
                color: CL.primary,
                fontFamily: '"Playfair Display", Georgia, serif',
              }}>
              Shop By Category
            </h2>
          </div>
          <a href="#"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold
              transition-all hover:gap-3"
            style={{ color: CL.accent }}>
            All Categories <ArrowRight size={14} />
          </a>
        </div>

        {/* Grid: 2 cols mobile → 4 cols tablet → 8 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 md:gap-4">
          {categories.map(cat => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>

        {/* Mobile: view all */}
        <div className="flex justify-center mt-6 sm:hidden">
          <a href="#"
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full border transition"
            style={{ borderColor: CL.gold, color: CL.accent }}>
            All Categories <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}
