import React, { useState } from 'react'
import { Tag, RotateCcw, Zap, Gift, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { couponStackData } from '../../../data/kireiData'

const typeConfig = {
  discount: { icon: Tag,        color: '#D4527A', bg: '#FDF0F4', label: 'Store Discount' },
  coupon:   { icon: Tag,        color: '#7C3AED', bg: '#F5F3FF', label: 'Coupon' },
  cashback: { icon: RotateCcw,  color: '#059669', bg: '#F0FDF4', label: 'Cashback' },
  reward:   { icon: Gift,       color: '#D97706', bg: '#FFFBEB', label: 'Reward' },
}

export default function CouponStacking({ selectedProduct }) {
  const { product, basePrice, steps } = couponStackData

  // Each step can be toggled on/off
  const [active, setActive] = useState(steps.map(() => true))
  const [expanded, setExpanded] = useState(true)

  function toggle(i) {
    setActive(a => a.map((v, idx) => idx === i ? !v : v))
  }

  const totalSavings = steps.reduce((acc, s, i) => acc + (active[i] ? s.amount : 0), 0)
  const finalPrice   = basePrice - totalSavings

  // Build running subtotal for the waterfall
  let running = basePrice
  const waterfall = steps.map((s, i) => {
    const applied = active[i]
    const prev    = running
    if (applied) running -= s.amount
    return { ...s, prev, after: running, applied }
  })

  return (
    <section className="bg-[#FDF8F5] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white text-xs font-bold
              px-3 py-1 rounded-full mb-3 shadow">
              <Zap size={12} className="fill-cyan-300 text-cyan-300" />
              OFFERMATRIX SAVINGS ENGINE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Maximum Savings
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Stack multiple discounts to get the absolute best price
            </p>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition"
          >
            {expanded ? <><ChevronUp size={16} /> Collapse</> : <><ChevronDown size={16} /> Expand</>}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Left — waterfall stack */}
          {expanded && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 mb-0.5">Product</p>
                <p className="text-sm font-semibold text-gray-800">{product}</p>
              </div>

              {/* Base price */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-dashed border-gray-200">
                <span className="text-sm font-medium text-gray-500">Original Price</span>
                <span className="text-base font-bold text-gray-700">৳{basePrice.toLocaleString()}</span>
              </div>

              {/* Discount steps */}
              {waterfall.map((step, i) => {
                const cfg = typeConfig[step.type]
                const Icon = cfg.icon
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-5 py-3 border-b border-dashed border-gray-100 transition
                      ${!step.applied ? 'opacity-40' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cfg.bg }}>
                      <Icon size={14} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{step.label}</p>
                      <p className="text-xs text-gray-400">
                        ৳{step.prev.toLocaleString()} → ৳{step.applied ? step.after.toLocaleString() : step.prev.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: cfg.color }}>
                        -৳{step.amount.toLocaleString()}
                      </span>
                      {/* Toggle */}
                      <button
                        onClick={() => toggle(i)}
                        aria-label={step.applied ? 'Remove discount' : 'Apply discount'}
                        className={`w-10 h-5 rounded-full transition-all relative shrink-0
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

          {/* Right — summary panel */}
          <div className="flex flex-col gap-4">

            {/* Final price card */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] rounded-2xl p-6 text-white shadow-xl">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Final Price</p>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-5xl font-black">৳{finalPrice.toLocaleString()}</span>
                <span className="text-blue-300 line-through text-lg mb-1">৳{basePrice.toLocaleString()}</span>
              </div>

              {/* Savings bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Total Savings</span>
                  <span className="font-bold text-white">৳{totalSavings.toLocaleString()} ({Math.round(totalSavings / basePrice * 100)}% off)</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(totalSavings / basePrice * 100)}%` }}
                  />
                </div>
              </div>

              {/* Breakdown pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {steps.map((s, i) => active[i] && (
                  <span key={i} className="flex items-center gap-1 bg-white/15 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={11} className="text-green-300" />
                    {s.label.split('(')[0].trim()} ৳{s.amount}
                  </span>
                ))}
              </div>

              <a
                href="#"
                className="w-full flex items-center justify-center gap-2 bg-white text-[#1E3A8A]
                  font-bold py-3 rounded-xl hover:bg-blue-50 transition text-sm shadow"
              >
                GET BEST DEAL <ArrowRight size={15} />
              </a>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Zap size={12} className="text-amber-400 fill-amber-400" />
                OfferMatrix Tip
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  'Apply coupon KIREI10 at checkout for an extra 10% off',
                  'Pay with bKash to unlock ৳50 instant cashback',
                  'OfferMatrix rewards accumulate across orders',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle2 size={13} className="text-green-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
