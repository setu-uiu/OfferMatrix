import React from 'react'
import { Zap, Award, TrendingDown, PiggyBank, CheckCircle2 } from 'lucide-react'

/**
 * Shared OfferMatrix DealScore panel.
 *
 * Props:
 *   data: {
 *     product:          string
 *     dealScore:        number (0–100)
 *     priceDrop:        number (%)
 *     potentialSavings: number (৳)
 *     bestPriceAlert:   bool
 *     lowestIn30Days:   bool
 *   }
 *   accentColor: optional hex for the score ring (default OM pink)
 */

function ScoreRing({ value, max = 100, color = '#F02D7D', size = 72 }) {
  const r             = (size - 10) / 2
  const circumference = 2 * Math.PI * r
  const offset        = circumference - (value / max) * circumference
  return (
    <svg width={size} height={size} className="rotate-[-90deg]" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#F3F4F6" strokeWidth={7} />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
    </svg>
  )
}

export default function DealScore({ data, accentColor = '#F02D7D' }) {
  if (!data) return null
  const { product, dealScore, priceDrop, potentialSavings, bestPriceAlert, lowestIn30Days } = data

  const metrics = [
    {
      icon: Award,
      label: 'Deal Score',
      ring: true,
      value: dealScore,
      color: accentColor,
      bg: accentColor + '12',
    },
    {
      icon: TrendingDown,
      label: 'Price Drop',
      ring: false,
      display: `${priceDrop}%`,
      color: '#0891B2',
      bg: '#F0F9FF',
    },
    {
      icon: PiggyBank,
      label: 'Potential Savings',
      ring: false,
      display: `৳${potentialSavings.toLocaleString()}`,
      color: '#059669',
      bg: '#F0FDF4',
    },
  ]

  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* OM badge + heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold
            px-4 py-1.5 rounded-full mb-4 shadow">
            <Zap size={12} className="text-[#F02D7D] fill-[#F02D7D]" />
            OFFERMATRIX SMART DEAL
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Compare Smarter. Save Bigger.
          </h2>
          {product && (
            <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
              Live deal analysis for <span className="font-semibold text-gray-700">{product}</span>
            </p>
          )}
        </div>

        {/* Alert pills */}
        {(bestPriceAlert || lowestIn30Days) && (
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {bestPriceAlert && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700
                text-xs font-semibold px-4 py-2 rounded-full">
                <CheckCircle2 size={13} className="text-green-500" />
                Best Price Available Right Now
              </div>
            )}
            {lowestIn30Days && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700
                text-xs font-semibold px-4 py-2 rounded-full">
                <TrendingDown size={13} />
                Lowest Price in 30 Days
              </div>
            )}
          </div>
        )}

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {metrics.map(m => {
            const Icon = m.icon
            return (
              <div key={m.label}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl p-5
                  text-center border border-gray-100 shadow-sm hover:shadow-md transition-all"
                style={{ backgroundColor: m.bg }}>
                {m.ring ? (
                  <div className="relative flex items-center justify-center">
                    <ScoreRing value={m.value} color={m.color} size={72} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-black" style={{ color: m.color }}>{m.value}</span>
                      <span className="text-[9px] text-gray-400 font-medium">/100</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: m.color + '18' }}>
                    <Icon size={20} style={{ color: m.color }} />
                  </div>
                )}
                {!m.ring && (
                  <span className="text-2xl font-black" style={{ color: m.color }}>{m.display}</span>
                )}
                <p className="text-xs font-semibold text-gray-600">{m.label}</p>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
          <Zap size={10} className="text-[#1A1A2E]" />
          Deal analysis updated every hour by OfferMatrix AI
        </p>
      </div>
    </section>
  )
}
