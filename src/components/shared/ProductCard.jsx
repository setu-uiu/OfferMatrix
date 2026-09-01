import React, { useState } from 'react'
import { Heart, ShoppingCart, Tag, RotateCcw, Eye } from 'lucide-react'
import StarRating from './StarRating'
import DealBadge from './DealBadge'

export default function ProductCard({ product, onAddToCart }) {
  const [wished, setWished] = useState(false)
  const [added,  setAdded]  = useState(false)

  const {
    brand, name, currentPrice, originalPrice,
    discount, rating, reviews, badge, badgeColor,
    cashback, coupon, imageColor, imageEmoji, inStock,
  } = product

  const savings = originalPrice - currentPrice

  function handleAddToCart() {
    setAdded(true)
    onAddToCart && onAddToCart(product)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">

      {/* Product Image Area */}
      <div
        className="relative w-full aspect-square flex items-center justify-center text-6xl cursor-pointer overflow-hidden"
        style={{ background: imageColor || '#FDF8F5' }}
      >
        <span className="group-hover:scale-110 transition-transform duration-300 select-none">
          {imageEmoji}
        </span>

        {/* Badge */}
        {badge && (
          <span className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}

        {/* Discount pill */}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWished(w => !w)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition"
        >
          <Heart
            size={15}
            className={wished ? 'fill-[#D4527A] text-[#D4527A]' : 'text-gray-400'}
          />
        </button>

        {/* Quick view */}
        <button
          aria-label="Quick view"
          className="absolute bottom-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition opacity-0 group-hover:opacity-100"
        >
          <Eye size={15} className="text-gray-500" />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <p className="text-[11px] font-semibold text-[#D4527A] uppercase tracking-wide">{brand}</p>
        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{name}</p>

        <StarRating rating={rating} reviews={reviews} size={12} />

        {/* Prices */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold text-gray-900">৳{currentPrice.toLocaleString()}</span>
          {originalPrice > currentPrice && (
            <span className="text-xs text-gray-400 line-through">৳{originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Deal badges */}
        <div className="flex flex-wrap gap-1">
          {savings > 0 && (
            <DealBadge type="deal" label={`Save ৳${savings.toLocaleString()}`} size="xs" />
          )}
          {cashback > 0 && (
            <DealBadge type="cashback" label={`৳${cashback} cashback`} size="xs" />
          )}
          {coupon && (
            <DealBadge type="coupon" label={coupon} size="xs" />
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200
            ${inStock
              ? added
                ? 'bg-green-500 text-white'
                : 'bg-[#D4527A] hover:bg-[#b8416a] text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <ShoppingCart size={15} />
          {!inStock ? 'Out of Stock' : added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
