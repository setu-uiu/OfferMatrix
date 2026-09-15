import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

export default function WishlistPage() {
  const { items, totalItems, removeFromWishlist } = useWishlist()
  const { addToCart, isInCart }                   = useCart()

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 py-16">
        <Heart size={64} className="text-gray-200" />
        <h1 className="text-2xl font-bold text-gray-700">Your wishlist is empty</h1>
        <p className="text-gray-400 text-sm text-center max-w-xs">
          Heart a product on Kirei or Choice Legacy to save it here.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/kirei"
            className="px-5 py-2.5 rounded-full bg-[#D4527A] text-white text-sm font-semibold hover:bg-[#b8416a] transition">
            🌸 Browse Kirei
          </Link>
          <Link to="/choice-legacy"
            className="px-5 py-2.5 rounded-full bg-[#1A0A2E] text-white text-sm font-semibold hover:bg-[#2D1654] transition">
            👑 Browse Choice Legacy
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart size={22} className="text-[#D4527A]" /> Wishlist
          <span className="text-sm font-normal text-gray-400">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
        </h1>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition">
          <ArrowLeft size={15} /> Continue shopping
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id}
            className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md
              transition-all duration-300 overflow-hidden flex flex-col">
            {/* Image */}
            <div
              className="relative w-full aspect-square flex items-center justify-center text-5xl"
              style={{ background: item.imageColor || '#FDF8F5' }}
            >
              {item.imageEmoji}
              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                aria-label="Remove from wishlist"
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full
                  bg-white/80 backdrop-blur-sm shadow hover:bg-white transition"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-3 gap-1.5">
              <p className="text-[11px] font-semibold text-[#D4527A] uppercase tracking-wide">{item.brand}</p>
              <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{item.name}</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-sm font-bold text-gray-900">৳{item.currentPrice.toLocaleString()}</span>
                {item.originalPrice > item.currentPrice && (
                  <span className="text-xs text-gray-400 line-through">৳{item.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <button
                onClick={() => addToCart(item)}
                disabled={!item.inStock}
                className={`mt-auto w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
                  ${!item.inStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isInCart(item.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-[#D4527A] hover:bg-[#b8416a] text-white'
                  }`}
              >
                <ShoppingCart size={13} />
                {!item.inStock ? 'Out of Stock' : isInCart(item.id) ? 'In Cart ✓' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
