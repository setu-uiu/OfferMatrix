import React from 'react'
import { Zap, Shield, TrendingDown, PiggyBank, Award, CheckCircle2 } from 'lucide-react'
import { smartDealData } from '../../../data/kireiData'

function ScoreRing({ value, max = 100, color, size = 80 }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / max) * circumference

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#F3F4F6" strokeWidth={8} />
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

function MetricCard({ icon: Icon, label, value, sub, color, bgColor, ring }) {
  return (
    <div className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl p-5 text-center border border-white/60 shadow-sm hover:shadow-md transition-all`}
      style={{ backgroundColor: bgColor }}>
      {ring ? (
        <div className="relative flex items-center justify-center">
          <ScoreRing value={value} color={color} size={72} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black" style={{ color }}>{value}</span>
            {sub && <span className="text-[9px] text-gray-400 font-medium">{sub}</span>}
          </div>
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: color + '20' }}>
          <Icon size={22} style={{ color }} />
        </div>
      )}
      {!ring && (
        <div className="text-2xl font-black" style={{ color }}>
          {typeof value === 'number' && label.includes('Savings') ? `৳${value.toLocaleString()}` : value}
          {label.includes('Drop') && '%'}
        </div>
      )}
      <p className="text-xs font-semibold text-gray-600 leading-tight">{label}</p>
    </div>
  )
}

export default function SmartDeal() {
  const d = smartDealData

  const metrics = [
    {
      icon: Award,
      label: 'Deal Score',
      value: d.dealScore,
      sub: '/100',
      color: '#D4527A',
      bgColor: '#FDF0F4',
      ring: true,
    },
    {
      icon: Shield,
      label: 'Seller Trust',
      value: d.sellerTrust,
      sub: '/100',
      color: '#059669',
      bgColor: '#F0FDF4',
      ring: true,
    },
    {
      icon: TrendingDown,
      label: 'Price Drop',
      value: d.priceDrop,
      color: '#0891B2',
      bgColor: '#F0F9FF',
      ring: false,
    },
    {
      icon: PiggyBank,
      label: 'Potential Savings',
      value: d.potentialSavings,
      color: '#D97706',
      bgColor: '#FFFBEB',
      ring: false,
    },
  ]

  return (
    <section className="py-10 md:py-14"
      style={{ background: 'linear-gradient(135deg, #1E3A8A08 0%, #D4527A08 100%)' }}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white text-xs font-bold
            px-4 py-1.5 rounded-full mb-4 shadow">
            <Zap size={13} className="fill-cyan-300 text-cyan-300" />
            OFFERMATRIX SMART DEAL
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            ✨ Compare Smarter. Save Bigger.
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            Real-time deal analysis for <span className="font-semibold text-gray-700">{d.product}</span>
          </p>
        </div>

        {/* Alert banners */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {d.bestPriceAlert && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700
              text-xs font-semibold px-4 py-2 rounded-full shadow-sm">
              <CheckCircle2 size={14} className="text-green-500" />
              Best Price Available Right Now
            </div>
          )}
          {d.lowestIn30Days && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700
              text-xs font-semibold px-4 py-2 rounded-full shadow-sm">
              <TrendingDown size={14} />
              Lowest Price in 30 Days
            </div>
          )}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
          <Zap size={11} className="text-[#1E3A8A]" />
          Deal analysis updated every hour by OfferMatrix AI
        </p>
      </div>
    </section>
  )
}
