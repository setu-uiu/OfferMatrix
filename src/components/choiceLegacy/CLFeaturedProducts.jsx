import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import CLProductCard from './CLProductCard'
import { featuredProducts } from '../../data/choiceLegacyData'

const CL = {
  primary: '#1A0A2E',
  gold:    '#C9A96E',
  accent:  '#9B1D6A',
  surface: '#FAF7F2',
  border:  '#E8E0D5',
}

const FILTERS = ['All', 'Skincare', 'Haircare', 'Body Care', 'Makeup', 'Feminine Hygiene', 'Beauty Tools']

export default function CLFeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [cart, setCart] = useState([])

  const filtered = activeFilter === 'All'
    ? featuredProducts
    : featuredProducts.filter(p => p.category === activeFilter)

  return (
    <section id="cl-featured" className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: CL.gold }}>Handpicked for you</p>
            <h2 className="text-2xl md:text-3xl font-bold"
              style={{ color: CL.primary, fontFamily: '"Playfair Display", Georgia, serif' }}>
              Featured Products
            </h2>
          </div>
          <a href="#" className="flex items-center gap-1.5 text-sm font-semibold
            transition-all hover:gap-3" style={{ color: CL.accent }}>
            View all <ArrowRight size={14} />
          </a>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium
                transition-all border"
              style={{
                backgroundColor: activeFilter === f ? CL.primary : 'white',
                color:           activeFilter === f ? '#fff' : CL.primary,
                borderColor:     activeFilter === f ? CL.primary : CL.border,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map(p => (
            <CLProductCard
              key={p.id}
              product={p}
              onAddToCart={p => setCart(c => [...c, p.id])}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No products in this category.</p>
          </div>
        )}

        {/* Cart toast */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50 text-white text-sm font-semibold
            px-5 py-3 rounded-full shadow-xl flex items-center gap-2"
            style={{ backgroundColor: CL.primary }}>
            🛒 {cart.length} item{cart.length > 1 ? 's' : ''} in cart
          </div>
        )}
      </div>
    </section>
  )
}
