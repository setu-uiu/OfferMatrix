import React from 'react'
import { Shield, CheckCircle2, Zap, Package, Clock, RotateCcw, TrendingUp } from 'lucide-react'
import { sellerTrustData } from '../../../data/kireiData'

function ScoreArc({ score }) {
  // Semi-circle arc
  const r = 54
  const cx = 70
  const cy = 70
  const startAngle = Math.PI            // 180° (left)
  const endAngle   = 0                  // 0°   (right) → full arc = 180°
  const filled     = Math.PI - (score / 100) * Math.PI  // offset from right

  function polarToCartesian(angle) {
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  const start  = polarToCartesian(Math.PI)
  const endPt  = polarToCartesian(0)
  const fillEnd = polarToCartesian(Math.PI - (score / 100) * Math.PI)

  // Track arc (grey)
  const trackPath = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${endPt.x} ${endPt.y}`
  // Filled arc
  const fillPath  = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${fillEnd.x} ${fillEnd.y}`

  const color = score >= 90 ? '#059669' : score >= 75 ? '#D97706' : '#DC2626'
  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Fair'

  return (
    <div className="flex flex-col items-center">
      <svg width={140} height={80} viewBox="0 0 140 80" aria-label={`Trust score ${score} out of 100`}>
        {/* Track */}
        <path d={trackPath} fill="none" stroke="#E5E7EB" strokeWidth={12} strokeLinecap="round" />
        {/* Fill */}
        <path d={fillPath} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
        {/* Score text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={28} fontWeight={900}
          fill={color} fontFamily="Inter, sans-serif">
          {score}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={10} fill="#9CA3AF"
          fontFamily="Inter, sans-serif">
          / 100
        </text>
      </svg>
      <span className="text-sm font-bold mt-1" style={{ color }}>{label}</span>
    </div>
  )
}

const statIcons = {
  'Total Orders':    Package,
  'Return Rate':     RotateCcw,
  'Avg Delivery':    Clock,
  'Response Time':   TrendingUp,
}

export default function SellerTrust() {
  const d = sellerTrustData

  const statEntries = Object.entries(d.stats).map(([key, val]) => ({
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
    value: val,
  }))

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white text-xs font-bold
            px-3 py-1 rounded-full mb-3 shadow">
            <Zap size={12} className="fill-cyan-300 text-cyan-300" />
            OFFERMATRIX VERIFICATION
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Seller Trust Score
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Score card */}
          <div className="md:col-span-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl
            border border-green-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Shield size={24} className="text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Kirei — Trust Score</p>
            <ScoreArc score={d.score} />
            <p className="text-xs text-gray-500 mt-3 max-w-[180px]">
              Based on price history, order fulfilment, authenticity checks and customer feedback.
            </p>
          </div>

          {/* Badges */}
          <div className="md:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Verification Badges
            </p>
            <ul className="flex flex-col gap-3">
              {d.badges.map(b => (
                <li key={b.label} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{b.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#1E3A8A]" />
              Seller Statistics
            </p>
            {statEntries.map(({ label, value }) => {
              const Icon = statIcons[label] || Package
              return (
                <div key={label}
                  className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3
                    flex items-center justify-between hover:border-[#E8A4B8] transition">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FDF0F4] flex items-center justify-center">
                      <Icon size={14} className="text-[#D4527A]" />
                    </div>
                    <span className="text-sm text-gray-500">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{value}</span>
                </div>
              )
            })}

            {/* OM stamp */}
            <div className="mt-auto bg-[#1E3A8A] rounded-xl p-4 text-white flex items-center gap-3">
              <Shield size={28} className="text-cyan-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-cyan-300 uppercase tracking-wide">OfferMatrix Verified</p>
                <p className="text-xs text-blue-200 mt-0.5">Kirei meets all authenticity and pricing standards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
