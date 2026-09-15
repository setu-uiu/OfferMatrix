import React, { useState } from 'react'
import { RotateCcw, Zap, ChevronDown } from 'lucide-react'

/**
 * Shared OfferMatrix CashbackCalculator.
 *
 * Props:
 *   methods: [{
 *     id, name, logo, rate (%), maxCap (৳), minOrder (৳)
 *   }]
 *   defaultPrice: number
 */

export default function CashbackCalculator({ methods = [], defaultPrice = 1000 }) {
  const [price,    setPrice]    = useState(defaultPrice)
  const [selected, setSelected] = useState(methods[0]?.id || '')

  const method    = methods.find(m => m.id === selected)
  const rawback   = method ? Math.floor((price * method.rate) / 100) : 0
  const cashback  = method ? Math.min(rawback, method.maxCap) : 0
  const eligible  = method ? price >= method.minOrder : false
  const effective = price - (eligible ? cashback : 0)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
      <p className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wide mb-4
        flex items-center gap-1.5">
        <RotateCcw size={12} className="text-[#F02D7D]" />
        Cashback Calculator
      </p>

      {/* Price input */}
      <div className="mb-4">
        <label className="text-xs text-gray-500 mb-1.5 block">Order Amount (৳)</label>
        <input
          type="number"
          value={price}
          min={0}
          onChange={e => setPrice(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold
            text-gray-800 focus:outline-none focus:border-[#F02D7D] transition"
        />
      </div>

      {/* Method selector */}
      <div className="mb-5">
        <label className="text-xs text-gray-500 mb-1.5 block">Payment Method</label>
        <div className="relative">
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5
              text-sm text-gray-800 bg-white focus:outline-none focus:border-[#F02D7D] transition pr-9"
          >
            {methods.map(m => (
              <option key={m.id} value={m.id}>
                {m.logo} {m.name} — {m.rate}% (max ৳{m.maxCap})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {method && price < method.minOrder && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ Min order ৳{method.minOrder.toLocaleString()} required for cashback
          </p>
        )}
      </div>

      {/* Result */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Order total</span>
          <span className="font-semibold text-gray-800">৳{price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Cashback earned</span>
          <span className={`font-bold ${eligible ? 'text-green-600' : 'text-gray-300'}`}>
            {eligible ? `+৳${cashback.toLocaleString()}` : '—'}
          </span>
        </div>
        <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between">
          <span className="text-sm font-semibold text-gray-700">Effective cost</span>
          <span className="text-lg font-black text-gray-900">৳{effective.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
        <Zap size={10} className="text-[#1A1A2E]" />
        Cashback credited within 3–5 business days.
      </p>
    </div>
  )
}
