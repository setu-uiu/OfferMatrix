import React, { useState } from 'react'
import { Trophy, Tag, RotateCcw, Truck, ArrowRight, Zap, ChevronDown, ChevronUp } from 'lucide-react'

/**
 * Shared OfferMatrix PriceComparison.
 *
 * Props:
 *   data: {
 *     product: string
 *     stores: [{
 *       name, logo, currentPrice, originalPrice, discount,
 *       coupon, couponDiscount, cashback, shipping, isBest
 *     }]
 *   }
 */

function effectivePrice(store) {
  return store.currentPrice - store.couponDiscount - store.cashback + store.shipping
}

function PriceBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-1">
      <div className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

function TableRow({ store, maxPrice, isBest }) {
  const eff = effectivePrice(store)
  return (
    <tr className={isBest ? 'bg-green-50' : 'bg-white hover:bg-gray-50 transition'}>
      <td className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">{store.logo}</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{store.name}</p>
            {isBest && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold
                text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                <Trophy size={8} /> BEST DEAL
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        <p className="font-bold text-gray-900 text-sm">৳{store.currentPrice.toLocaleString()}</p>
        {store.originalPrice > store.currentPrice && (
          <p className="text-xs text-gray-400 line-through">৳{store.originalPrice.toLocaleString()}</p>
        )}
        {store.discount > 0 && (
          <span className="text-[10px] font-bold text-red-500">-{store.discount}%</span>
        )}
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        {store.coupon ? (
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold
              text-violet-700 bg-violet-50 border border-dashed border-violet-300 px-2 py-0.5 rounded">
              <Tag size={9} />{store.coupon}
            </span>
            <p className="text-xs text-violet-600 mt-0.5">-৳{store.couponDiscount}</p>
          </div>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        {store.cashback > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold
            text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
            <RotateCcw size={9} />৳{store.cashback}
          </span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        {store.shipping === 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
            <Truck size={9} /> Free
          </span>
        ) : (
          <span className="text-xs text-gray-500">+৳{store.shipping}</span>
        )}
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        <p className={`font-black text-base ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
          ৳{eff.toLocaleString()}
        </p>
        <PriceBar value={eff} max={maxPrice} color={isBest ? '#059669' : '#CBD5E1'} />
      </td>
      <td className="px-4 py-4 border-b border-gray-100 text-center">
        <a href="#" className={`inline-flex items-center gap-1 text-xs font-bold
          px-3 py-1.5 rounded-full transition
          ${isBest
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
          Buy <ArrowRight size={10} />
        </a>
      </td>
    </tr>
  )
}

function MobileCard({ store, isBest }) {
  const [open, setOpen] = useState(false)
  const eff = effectivePrice(store)
  return (
    <div className={`rounded-2xl border-2 overflow-hidden
      ${isBest ? 'border-green-400 shadow-md shadow-green-100' : 'border-gray-100 shadow-sm'}`}>
      <button
        className={`w-full flex items-center justify-between px-4 py-3 ${isBest ? 'bg-green-50' : 'bg-white'}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{store.logo}</span>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">{store.name}</p>
            {isBest && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold
                text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                <Trophy size={8} /> BEST DEAL
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-black text-base ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
            ৳{eff.toLocaleString()}
          </span>
          {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Listed</p>
            <p className="font-semibold">৳{store.currentPrice.toLocaleString()}
              {store.discount > 0 && <span className="text-red-500 text-xs ml-1">-{store.discount}%</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Coupon</p>
            {store.coupon
              ? <p className="font-semibold text-violet-600 font-mono text-xs">{store.coupon} (-৳{store.couponDiscount})</p>
              : <p className="text-gray-300 text-xs">—</p>}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Cashback</p>
            {store.cashback > 0
              ? <p className="font-semibold text-green-600">৳{store.cashback}</p>
              : <p className="text-gray-300 text-xs">—</p>}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Shipping</p>
            <p className={store.shipping === 0 ? 'text-green-600 font-semibold' : 'text-gray-600'}>
              {store.shipping === 0 ? 'Free' : `+৳${store.shipping}`}
            </p>
          </div>
          <div className="col-span-2 mt-1">
            <a href="#" className={`w-full flex items-center justify-center gap-1.5 text-sm
              font-bold py-2 rounded-xl transition
              ${isBest ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Shop at {store.name} <ArrowRight size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PriceComparison({ data }) {
  if (!data) return null
  const { product, stores } = data
  const maxEff = Math.max(...stores.map(effectivePrice))
  const bestStore = stores.find(s => s.isBest)

  return (
    <section className="bg-white py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold
              px-3 py-1.5 rounded-full mb-3 shadow">
              <Zap size={11} className="text-[#F02D7D] fill-[#F02D7D]" />
              OFFERMATRIX INTELLIGENCE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Price Comparison</h2>
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
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-[#1A1A2E] text-white text-xs font-semibold">
                {['Store','Listed Price','Coupon','Cashback','Shipping','Final Price','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-center first:text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <TableRow key={s.name} store={s} maxPrice={maxEff} isBest={s.isBest} />
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-3">
          {stores.map(s => (
            <MobileCard key={s.name} store={s} isBest={s.isBest} />
          ))}
        </div>

        {/* Best deal callout */}
        {bestStore && (
          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3
            bg-green-50 border border-green-200 rounded-xl px-5 py-3">
            <Trophy size={20} className="text-green-600 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-green-800">
                🏆 Best deal at {bestStore.name} — effective price ৳{effectivePrice(bestStore).toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                {bestStore.coupon && `After coupon ${bestStore.coupon}`}
                {bestStore.cashback > 0 && ` + ৳${bestStore.cashback} cashback`}.
                {' '}Save ৳{(maxEff - effectivePrice(bestStore)).toLocaleString()} vs most expensive option.
              </p>
            </div>
            <a href="#" className="shrink-0 bg-green-600 hover:bg-green-700 text-white
              text-xs font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5">
              GET BEST DEAL <ArrowRight size={11} />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
