import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { categories } from '../../../data/kireiData'

function CategoryCard({ cat }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Browse ${cat.name}`}
      className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer p-4 md:p-5 overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-[#D4527A] focus:ring-offset-2"
      style={{
        backgroundColor: hovered ? cat.color : '#fff',
        borderColor: hovered ? '#D4527A' : '#F5D6E0',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 32px rgba(212,82,122,0.18)'
          : '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Emoji icon */}
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-3xl md:text-4xl transition-transform duration-300"
        style={{
          backgroundColor: cat.color,
          transform: hovered ? 'scale(1.15) rotate(-5deg)' : 'scale(1)',
        }}
      >
        {cat.emoji}
      </div>

      {/* Title */}
      <div className="text-center">
        <p className={`text-sm font-semibold transition-colors duration-200 leading-tight
          ${hovered ? 'text-[#D4527A]' : 'text-gray-800'}`}>
          {cat.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight hidden md:block">
          {cat.description}
        </p>
      </div>

      {/* Arrow on hover */}
      <div className={`flex items-center gap-0.5 text-[11px] font-semibold text-[#D4527A] transition-all duration-200
        ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
        Shop now <ArrowRight size={11} />
      </div>

      {/* Hover glow */}
      {hovered && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${cat.color}80, transparent 70%)` }} />
      )}
    </button>
  )
}

export default function ShopByCategory() {
  return (
    <section id="categories" className="bg-[#FDF8F5] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#D4527A] tracking-widest uppercase mb-1">
              Explore
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">
              Shop By Category
            </h2>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#D4527A] hover:gap-2.5 transition-all"
          >
            All Categories <ArrowRight size={15} />
          </a>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
          {categories.map(cat => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>

        {/* Mobile: view all */}
        <div className="flex justify-center mt-6 sm:hidden">
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-semibold text-[#D4527A] border border-[#E8A4B8]
              px-5 py-2 rounded-full hover:bg-[#FDF0F4] transition"
          >
            All Categories <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
