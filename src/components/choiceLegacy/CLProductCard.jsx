import React, { useState } from 'react'
import { Heart, ShoppingCart, Eye, Tag, RotateCcw } from 'lucide-react'
import StarRating from '../shared/StarRating'

const CL = {
  primary: '#1A0A2E',
  gold:    '#C9A96E',
  accent:  '#9B1D6A',
  surface: '#FAF7F2',
  border:  '#E8E0D5',
}

/**
 * Choice Legacy product card.
 * Distinct from Kirei: dark plum accents, gold badge treatment,
 * serif brand label, square-ish image area.
 */
export default function CLProductCard({ product, onAddToCart }) {
  const [wished, setWished] = useState(false)
  const [added,  setAdded]  = useState(false)

  const {
    brand, name, currentPrice, originalPrice,
    discount, rating, reviews, badge, badgeColor,
    cashback, coupon, imageColor, imageEmoji, inStock,
  } = product

  const savings = originalPrice - currentPrice

  function handleAdd() {
    setAdded(true)
    onAddToCart?.(product)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden flex flex-col
        transition-all duration-300 hover:shadow-xl"
      style={{ border: `1px solid ${CL.border}` }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = CL.gold + '80')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = CL.border)}
    >
      {/* ── Image area ─────────────────────────────────────── */}
      <div
        className="relative w-full aspect-square flex items-center justify-center text-6xl overflow-hidden"
        style={{ backgroundColor: imageColor || CL.surface }}
      >
        <span className="group-hover:scale-110 transition-transform duration-300 select-none">
          {imageEmoji}
        </span>

        {/* Discount pill */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold
            px-2 py-0.5 rounded-full"
            style={{ backgroundColor: CL.accent }}>
            -{discount}%
          </span>
        )}

        {/* Badge */}
        {badge && (
          <span
            className="absolute top-2.5 right-2.5 text-white text-[10px] font-bold
              px-2 py-0.5 rounded-full"
            style={{ backgroundColor: badgeColor || CL.primary }}
          >
            {badge}
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={() => setWished(w => !w)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 flex items-center justify-center
            rounded-full bg-white shadow transition-transform hover:scale-110"
          style={{ border: `1px solid ${CL.border}` }}
        >
          <Heart
            size={14}
            className={wished ? '' : 'text-gray-400'}
            style={wished ? { fill: CL.accent, color: CL.accent } : {}}
          />
        </button>

        {/* Quick view */}
        <button
          aria-label="Quick view"
          className="absolute bottom-2.5 left-2.5 w-8 h-8 flex items-center justify-center
            rounded-full bg-white shadow transition opacity-0 group-hover:opacity-100"
          style={{ border: `1px solid ${CL.border}` }}
        >
          <Eye size={14} className="text-gray-500" />
        </button>
      </div>

      {/* ── Info ───────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3.5 gap-1.5">

        {/* Brand — gold, serif feel */}
        <p className="text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ color: CL.gold, fontFamily: '"Playfair Display", Georgia, serif' }}>
          {brand}
        </p>

        {/* Name */}
        <p className="text-sm font-medium leading-snug line-clamp-2"
          style={{ color: CL.primary }}>
          {name}
        </p>

        {/* Rating */}
        <StarRating rating={rating} reviews={reviews} size={12} />

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-black" style={{ color: CL.primary }}>
            ৳{currentPrice.toLocaleString()}
          </span>
          {originalPrice > currentPrice && (
            <span className="text-xs text-gray-400 line-through">
              ৳{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Deal chips */}
        <div className="flex flex-wrap gap-1">
          {savings > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold
              px-2 py-0.5 rounded-full"
              style={{ backgroundColor: CL.gold + '18', color: '#8B6A3E' }}>
              Save ৳{savings.toLocaleString()}
            </span>
          )}
          {cashback > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold
              text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
              <RotateCcw size={9} /> ৳{cashback} back
            </span>
          )}
          {coupon && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold
              text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-dashed border-violet-200">
              <Tag size={9} />{coupon}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5
            rounded-xl text-sm font-bold transition-all duration-200"
          style={{
            backgroundColor: !inStock
              ? '#F3F4F6'
              : added
                ? '#059669'
                : CL.primary,
            color: !inStock ? '#9CA3AF' : '#fff',
          }}
        >
          <ShoppingCart size={14} />
          {!inStock ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
