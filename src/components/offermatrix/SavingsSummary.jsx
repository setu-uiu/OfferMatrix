import React from 'react'
import { Zap, TrendingDown, Tag, RotateCcw, Gift, ArrowRight } from 'lucide-react'

/**
 * Shared OfferMatrix SavingsSummary strip.
 *
 * Props:
 *   breakdown: [{
 *     type: 'discount'|'coupon'|'cashback'|'reward'
 *     label:  string
 *     amount: number
 *   }]
 *   originalPrice: number
 *   finalPrice:    number
 *   ctaLabel:      string (default 'GET THIS DEAL')
 */

const icons = {
  discount: TrendingDown,
  coupon:   Tag,
  cashback: RotateCcw,
  reward:   Gift,
}
const colors = {
  discount: { text: 'text-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-100' },
  coupon:   { text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  cashback: { text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  reward:   { text: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
}

export default function SavingsSummary({
  breakdown = [],
  originalPrice,
  finalPrice,
  ctaLabel = 'GET THIS DEAL',
}) {
  const totalSaved = originalPrice - finalPrice
  const pct        = originalPrice > 0 ? Math.round((totalSaved / originalPrice) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A1A2E] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#F02D7D] fill-[#F02D7D]" />
          <span className="text-white text-xs font-bold uppercase tracking-wide">OfferMatrix Savings</span>
        </div>
        <span className="text-xs text-gray-400">Best available price</span>
      </div>

      <div className="p-5">
        {/* Breakdown rows */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Original Price</span>
            <span className="font-medium text-gray-700">৳{originalPrice?.toLocaleString()}</span>
          </div>
          {breakdown.map((item, i) => {
            const Icon = icons[item.type] || TrendingDown
            const c    = colors[item.type] || colors.discount
            return (
              <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${c.bg} ${c.border}`}>
                <div className="flex items-center gap-2">
                  <Icon size={13} className={c.text} />
                  <span className={`text-xs font-medium ${c.text}`}>{item.label}</span>
                </div>
                <span className={`text-sm font-bold ${c.text}`}>-৳{item.amount.toLocaleString()}</span>
              </div>
            )
          })}
          <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">Final Price</span>
            <div className="text-right">
              <span className="text-2xl font-black text-gray-900">৳{finalPrice?.toLocaleString()}</span>
              {pct > 0 && (
                <span className="ml-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {pct}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <a href="#" className="w-full flex items-center justify-center gap-2
          bg-[#F02D7D] hover:bg-[#d4256b] text-white font-bold py-2.5 rounded-xl transition text-sm">
          {ctaLabel} <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}
