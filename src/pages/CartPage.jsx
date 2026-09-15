import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, totalItems, subtotal, removeFromCart, updateQty, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 py-16">
        <ShoppingCart size={64} className="text-gray-200" />
        <h1 className="text-2xl font-bold text-gray-700">Your cart is empty</h1>
        <p className="text-gray-400 text-sm text-center max-w-xs">
          Browse Kirei or Choice Legacy to add products to your cart.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/kirei"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4527A] text-white text-sm font-semibold hover:bg-[#b8416a] transition">
            🌸 Shop Kirei
          </Link>
          <Link to="/choice-legacy"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A0A2E] text-white text-sm font-semibold hover:bg-[#2D1654] transition">
            👑 Shop Choice Legacy
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={24} /> Your Cart
            <span className="text-sm font-normal text-gray-400">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
          </h1>
        </div>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition">
          <ArrowLeft size={15} /> Continue shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Items list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map(item => (
            <div key={item.id}
              className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 items-start">
              {/* Image placeholder */}
              <div
                className="w-20 h-20 shrink-0 rounded-xl flex items-center justify-center text-4xl"
                style={{ background: item.imageColor || '#FDF8F5' }}
              >
                {item.imageEmoji}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#D4527A] uppercase tracking-wide">{item.brand}</p>
                <p className="text-sm font-medium text-gray-800 leading-snug mt-0.5 line-clamp-2">{item.name}</p>
                <p className="text-base font-bold text-gray-900 mt-1">৳{item.currentPrice.toLocaleString()}</p>
              </div>

              {/* Qty controls + remove */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                  className="text-gray-300 hover:text-red-400 transition"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    aria-label="Decrease quantity"
                    className="px-2.5 py-1.5 hover:bg-gray-50 transition text-gray-500"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="px-3 text-sm font-semibold text-gray-700">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    aria-label="Increase quantity"
                    className="px-2.5 py-1.5 hover:bg-gray-50 transition text-gray-500"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  ৳{(item.currentPrice * item.qty).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="self-start text-xs text-red-400 hover:text-red-600 transition flex items-center gap-1.5 mt-1"
          >
            <Trash2 size={13} /> Clear all items
          </button>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
          <h2 className="text-base font-bold text-gray-800 mb-5">Order Summary</h2>

          <div className="flex flex-col gap-2 text-sm text-gray-600 mb-5">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-2 mt-1 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#162d6e]
            text-white font-semibold py-3 rounded-xl transition text-sm">
            <ShoppingBag size={16} />
            Proceed to Checkout
          </button>

          <div className="flex gap-2 mt-3">
            <Link to="/kirei"
              className="flex-1 text-center text-xs text-[#D4527A] border border-[#E8A4B8] py-2 rounded-xl
                hover:bg-[#FDF0F4] transition font-medium">
              🌸 Kirei
            </Link>
            <Link to="/choice-legacy"
              className="flex-1 text-center text-xs text-[#9B1D6A] border border-[#E8E0D5] py-2 rounded-xl
                hover:bg-[#F5EFF9] transition font-medium">
              👑 Choice Legacy
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
