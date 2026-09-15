import React from 'react'
import { Shield, CheckCircle2, Zap, Package, Clock, RotateCcw, TrendingUp } from 'lucide-react'

/**
 * Shared OfferMatrix TrustScore panel.
 *
 * Props:
 *   data: {
 *     score:   number (0–100)
 *     badges:  [{ label: string }]
 *     stats:   { totalOrders, returnRate, avgDelivery, responseTime }
 *   }
 *   merchantName: string — shown in the score card and OM stamp
 */

function ScoreArc({ score }) {
  const r  = 54
  const cx = 70
  const cy = 70

  function polar(angle) {
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  const start   = polar(Math.PI)
  const end     = polar(0)
  const fillEnd = polar(Math.PI - (score / 100) * Math.PI)

  const trackPath = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`
  const fillPath  = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${fillEnd.x} ${fillEnd.y}`

  const color = score >= 90 ? '#059669' : score >= 75 ? '#D97706' : '#DC2626'
  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Fair'

  return (
    <div className="flex flex-col items-center">
      <svg width={140} height={82} viewBox="0 0 140 82"
        aria-label={`Trust score ${score} out of 100`}>
        <path d={trackPath} fill="none" stroke="#E5E7EB" strokeWidth={11} strokeLinecap="round" />
        <path d={fillPath}  fill="none" stroke={color}   strokeWidth={11} strokeLinecap="round" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={27} fontWeight={900}
          fill={color} fontFamily="Inter,sans-serif">{score}</text>
        <text x={cx} y={cy + 11} textAnchor="middle" fontSize={10} fill="#9CA3AF"
          fontFamily="Inter,sans-serif">/ 100</text>
      </svg>
      <span className="text-sm font-bold -mt-1" style={{ color }}>{label}</span>
    </div>
  )
}

const statIconMap = {
  totalorders:   Package,
  returnrate:    RotateCcw,
  avgdelivery:   Clock,
  responsetime:  TrendingUp,
}

export default function TrustScore({ data, merchantName = 'This Seller' }) {
  if (!data) return null

  const statEntries = Object.entries(data.stats).map(([key, val]) => ({
    key,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
    value: val,
    Icon: statIconMap[key.toLowerCase().replace(/\s/g, '')] || Package,
  }))

  return (
    <section className="bg-white py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold
            px-3 py-1.5 rounded-full mb-3 shadow">
            <Zap size={11} className="text-[#F02D7D] fill-[#F02D7D]" />
            OFFERMATRIX VERIFICATION
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Seller Trust Score</h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">

          {/* Score arc card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl
            border border-green-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Shield size={22} className="text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">{merchantName} — Trust Score</p>
            <ScoreArc score={data.score} />
            <p className="text-xs text-gray-500 mt-3 max-w-[190px] leading-relaxed">
              Based on price history, fulfilment, authenticity checks and customer feedback.
            </p>
          </div>

          {/* Verification badges */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-green-500" />
              Verification Badges
            </p>
            <ul className="flex flex-col gap-3">
              {data.badges.map(b => (
                <li key={b.label} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={13} className="text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{b.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats + OM stamp */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <TrendingUp size={15} className="text-[#1A1A2E]" />
              Seller Statistics
            </p>
            {statEntries.map(({ label, value, Icon }) => (
              <div key={label}
                className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3
                  flex items-center justify-between hover:border-gray-300 transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200
                    flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500">{label}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{value}</span>
              </div>
            ))}

            {/* OM stamp */}
            <div className="mt-auto bg-[#1A1A2E] rounded-xl p-4 text-white flex items-center gap-3">
              <Shield size={26} className="text-[#F02D7D] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#F02D7D] uppercase tracking-wide">OfferMatrix Verified</p>
                <p className="text-xs text-gray-300 mt-0.5">
                  {merchantName} meets all authenticity and pricing standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
