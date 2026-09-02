import React, { useState } from 'react'
import { Trophy, Tag, RotateCcw, Truck, ArrowRight, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { priceComparisonData } from '../../../data/kireiData'

function effectivePrice(store) {
  return store.currentPrice - store.couponDiscount - store.cashback + store.shipping
}

function PriceBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

// Desktop comparison table row
function TableRow({ store, maxPrice, isBest }) {
  const effective = effectivePrice(store)
  return (
    <tr className={`transition ${isBest ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}`}>
      {/* Store */}
      <td className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{store.logo}</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{store.name}</p>
            {isBest && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                <Trophy size={9} /> BEST DEAL
              </span>
            )}
          </div>
        </div>
      </td>
      {/* Listed price */}
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        <p className="font-bold text-gray-900">৳{store.currentPrice.toLocaleString()}</p>
        {store.originalPrice > store.currentPrice && (
          <p className="text-xs text-gray-400 line-through">৳{store.originalPrice.toLocaleString()}</p>
        )}
        {store.discount > 0 && (
          <span className="text-[10px] font-bold text-red-500">-{store.discount}%</span>
        )}
      </td>
      {/* Coupon */}
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        {store.coupon ? (
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-violet-700 bg-violet-50 border border-dashed border-violet-300 px-2 py-0.5 rounded">
              <Tag size={10} />{store.coupon}
            </span>
            <p className="text-xs text-violet-600 mt-0.5">-৳{store.couponDiscount.toLocaleString()}</p>
          </div>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>
      {/* Cashback */}
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        {store.cashback > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
            <RotateCcw size={10} />৳{store.cashback}
          </span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>
      {/* Shipping */}
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        {store.shipping === 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
            <Truck size={10} /> Free
          </span>
        ) : (
          <span className="text-xs text-gray-500">+৳{store.shipping}</span>
        )}
      </td>
      {/* Final */}
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        <p className={`font-black text-base ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
          ৳{effective.toLocaleString()}
        </p>
        <PriceBar value={effective} max={maxPrice} color={isBest ? '#059669' : '#94A3B8'} />
      </td>
      {/* CTA */}
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        <a
          href="#"
          className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition
            ${isBest
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          Buy <ArrowRight size={11} />
        </a>
      </td>
    </tr>
  )
}

// Mobile stacked card
function MobileCard({ store, isBest }) {
  const [open, setOpen] = useState(false)
  const effective = effectivePrice(store)

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition
      ${isBest ? 'border-green-400 shadow-green-100 shadow-lg' : 'border-gray-100 shadow-sm'}`}>
      {/* Card header */}
      <button
        className={`w-full flex items-center justify-between px-4 py-3 ${isBest ? 'bg-green-50' : 'bg-white'}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{store.logo}</span>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">{store.name}</p>
            {isBest && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                <Trophy size={9} /> BEST DEAL
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-black text-lg ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
            ৳{effective.toLocaleString()}
          </span>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded details */}
      {open && (
        <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Listed Price</p>
            <p className="font-semibold">৳{store.currentPrice.toLocaleString()}
              {store.discount > 0 && <span className="text-red-500 text-xs ml-1">-{store.discount}%</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Coupon</p>
            {store.coupon
              ? <p className="font-semibold text-violet-600 font-mono">{store.coupon} (-৳{store.couponDiscount})</p>
              : <p className="text-gray-300">—</p>}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Cashback</p>
            {store.cashback > 0
              ? <p className="font-semibold text-green-600">৳{store.cashback}</p>
              : <p className="text-gray-300">—</p>}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Shipping</p>
            <p className={store.shipping === 0 ? 'text-green-600 font-semibold' : 'text-gray-600'}>
              {store.shipping === 0 ? 'Free' : `+৳${store.shipping}`}
            </p>
          </div>
          <div className="col-span-2 mt-1">
            <a href="#"
              className={`w-full flex items-center justify-center gap-1.5 text-sm font-bold py-2 rounded-xl transition
                ${isBest ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Shop at {store.name} <ArrowRight size={13} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PriceComparison({ selectedProduct }) {
  const { product, stores } = priceComparisonData
  const maxEffective = Math.max(...stores.map(effectivePrice))

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white text-xs font-bold
              px-3 py-1 rounded-full mb-3 shadow">
              <Zap size={12} className="fill-cyan-300 text-cyan-300" />
              OFFERMATRIX INTELLIGENCE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Price Comparison
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Comparing: <span className="font-semibold text-gray-700">{product}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live prices — updated hourly
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1E3A8A] text-white text-xs font-semibold">
                {['Store', 'Listed Price', 'Coupon', 'Cashback', 'Shipping', 'Final Price', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-center first:text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <TableRow
                  key={store.name}
                  store={store}
                  maxPrice={maxEffective}
                  isBest={store.isBest}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden flex flex-col gap-3">
          {stores.map(store => (
            <MobileCard key={store.name} store={store} isBest={store.isBest} />
          ))}
        </div>

        {/* Best deal callout */}
        <div className="mt-5 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
          <Trophy size={20} className="text-green-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-green-800">
              🏆 Best deal at Kirei — effective price ৳{effectivePrice(stores.find(s => s.isBest)).toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              After applying coupon KIREI10 + ৳50 bKash cashback. {' '}
              <span className="font-semibold">You save ৳{(maxEffective - effectivePrice(stores.find(s => s.isBest))).toLocaleString()} vs most expensive option.</span>
            </p>
          </div>
          <a href="#"
            className="shrink-0 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-full transition flex items-center gap-1">
            GET BEST DEAL <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </section>
  )
}
