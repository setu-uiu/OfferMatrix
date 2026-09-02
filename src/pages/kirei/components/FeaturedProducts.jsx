import React, { useState } from 'react'
import { ArrowRight, LayoutGrid, LayoutList } from 'lucide-react'
import ProductCard from '../../../components/shared/ProductCard'
import { featuredProducts } from '../../../data/kireiData'

const FILTERS = ['All', 'J-Beauty', 'K-Beauty', 'Skincare', 'Doctor Cosmetics', 'Baby Care']

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [cart, setCart]                 = useState([])
  const [gridCols, setGridCols]         = useState(4)

  const filtered = activeFilter === 'All'
    ? featuredProducts
    : featuredProducts.filter(p => p.category === activeFilter)

  function handleAddToCart(product) {
    setCart(c => [...c, product.id])
  }

  return (
    <section id="featured" className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-[#D4527A] tracking-widest uppercase mb-1">
              Handpicked for you
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">
              Featured Products
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Grid toggle — desktop */}
            <div className="hidden md:flex items-center border border-gray-200 rounded-lg overflow-hidden">
              {[4, 3].map(cols => (
                <button
                  key={cols}
                  onClick={() => setGridCols(cols)}
                  aria-label={`${cols} column grid`}
                  className={`p-2 transition ${gridCols === cols ? 'bg-[#D4527A] text-white' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                >
                  {cols === 4 ? <LayoutGrid size={16} /> : <LayoutList size={16} />}
                </button>
              ))}
            </div>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-[#D4527A] hover:gap-2.5 transition-all">
              View all <ArrowRight size={15} />
            </a>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto kirei-scrollbar pb-2 mb-6">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border
                ${activeFilter === f
                  ? 'bg-[#D4527A] text-white border-[#D4527A] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8A4B8] hover:text-[#D4527A]'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${gridCols} gap-4`}>
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No products found in this category.</p>
          </div>
        )}

        {/* Cart toast */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#D4527A] text-white text-sm font-semibold
            px-5 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
            🛒 {cart.length} item{cart.length > 1 ? 's' : ''} in cart
          </div>
        )}
      </div>
    </section>
  )
}
