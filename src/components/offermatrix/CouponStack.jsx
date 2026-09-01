import React, { useState } from 'react'
import { Tag, RotateCcw, Gift, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Zap } from 'lucide-react'

/**
 * Shared OfferMatrix CouponStack (savings waterfall).
 *
 * Props:
 *   data: {
 *     product:   string
 *     basePrice: number
 *     steps: [{ label, amount, type: 'discount'|'coupon'|'cashback'|'reward' }]
 *   }
 *   tips: string[]   — optional tip bullets shown in the right panel
 */

const typeConfig = {
  discount: { icon: Tag,       color: '#E11D48', bg: '#FFF1F2' },
  coupon:   { icon: Tag,       color: '#7C3AED', bg: '#F5F3FF' },
  cashback: { icon: RotateCcw, color: '#059669', bg: '#F0FDF4' },
  reward:   { icon: Gift,      color: '#D97706', bg: '#FFFBEB' },
}

export default function CouponStack({ data, tips = [] }) {
  if (!data) return null
  const { product, basePrice, steps } = data

  const [active,   setActive]   = useState(steps.map(() => true))
  const [expanded, setExpanded] = useState(true)

  const toggle = i => setActive(a => a.map((v, idx) => idx === i ? !v : v))

  const totalSavings = steps.reduce((acc, s, i) => acc + (active[i] ? s.amount : 0), 0)
  const finalPrice   = basePrice - totalSavings
  const savingsPct   = Math.round((totalSavings / basePrice) * 100)

  let running = basePrice
  const waterfall = steps.map((s, i) => {
    const prev    = running
    const applied = active[i]
    if (applied) running -= s.amount
    return { ...s, prev, after: running, applied }
  })

  return (
    <section className="bg-gray-50 py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold
              px-3 py-1.5 rounded-full mb-3 shadow">
              <Zap size={11} className="text-[#F02D7D] fill-[#F02D7D]" />
              OFFERMATRIX SAVINGS ENGINE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Maximum Savings</h2>
            <p className="text-sm text-gray-500 mt-1">Stack multiple discounts for the best price</p>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition"
          >
            {expanded ? <><ChevronUp size={15}/> Collapse</> : <><ChevronDown size={15}/> Expand</>}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Waterfall */}
          {expanded && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 mb-0.5">Product</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{product}</p>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-dashed border-gray-200">
                <span className="text-sm text-gray-500">Original Price</span>
                <span className="text-base font-bold text-gray-700">৳{basePrice.toLocaleString()}</span>
              </div>
              {waterfall.map((step, i) => {
                const cfg  = typeConfig[step.type] || typeConfig.discount
                const Icon = cfg.icon
                return (
                  <div key={i}
                    className={`flex items-center gap-3 px-5 py-3 border-b border-dashed border-gray-100
                      transition-opacity ${!step.applied ? 'opacity-40' : ''}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cfg.bg }}>
                      <Icon size={13} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{step.label}</p>
                      <p className="text-xs text-gray-400">
                        ৳{step.prev.toLocaleString()} → ৳{step.applied ? step.after.toLocaleString() : step.prev.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold" style={{ color: cfg.color }}>
                        -৳{step.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => toggle(i)}
                        aria-label={step.applied ? 'Remove' : 'Apply'}
                        className={`w-10 h-5 rounded-full transition-all relative
                          ${step.applied ? 'bg-green-500' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all
                          ${step.applied ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#1A1A2E] rounded-2xl p-6 text-white shadow-xl">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">Final Price</p>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl sm:text-5xl font-black">৳{finalPrice.toLocaleString()}</span>
                <span className="text-gray-500 line-through text-lg mb-1">৳{basePrice.toLocaleString()}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Total Savings</span>
                  <span className="font-bold text-white">৳{totalSavings.toLocaleString()} ({savingsPct}% off)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="h-2 bg-[#F02D7D] rounded-full transition-all duration-500"
                    style={{ width: `${savingsPct}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {steps.map((s, i) => active[i] && (
                  <span key={i} className="flex items-center gap-1 bg-white/10 text-white
                    text-xs font-medium px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={10} className="text-green-400" />
                    {s.label.split('(')[0].trim()} ৳{s.amount}
                  </span>
                ))}
              </div>
              <a href="#" className="w-full flex items-center justify-center gap-2
                bg-[#F02D7D] hover:bg-[#d4256b] text-white font-bold py-3 rounded-xl transition text-sm">
                GET BEST DEAL <ArrowRight size={14} />
              </a>
            </div>

            {tips.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wide mb-3
                  flex items-center gap-1.5">
                  <Zap size={11} className="text-amber-400 fill-amber-400" />
                  OfferMatrix Tip
                </p>
                <ul className="flex flex-col gap-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
