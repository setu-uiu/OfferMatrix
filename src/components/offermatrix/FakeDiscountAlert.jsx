import React, { useState } from 'react'
import { AlertTriangle, TrendingUp, Eye, Info, ChevronDown, ChevronUp, Zap } from 'lucide-react'

/**
 * Shared OfferMatrix FakeDiscountAlert.
 *
 * Props:
 *   data: {
 *     product:        string
 *     trueBasePrice:  number
 *     inflatedPrice:  number
 *     salePriceShown: number
 *     inflationDate:  string
 *     saleDate:       string
 *     verdict:        string
 *     message:        string
 *   }
 *   onViewHistory: optional callback — called when "VIEW PRICE HISTORY" is clicked
 */

export default function FakeDiscountAlert({ data, onViewHistory }) {
  const [expanded, setExpanded] = useState(true)
  if (!data) return null

  const {
    product, trueBasePrice, inflatedPrice, salePriceShown,
    inflationDate, verdict, message,
  } = data

  const inflationAmt  = inflatedPrice - trueBasePrice
  const inflationPct  = Math.round((inflationAmt / trueBasePrice) * 100)
  const saleVsBase    = salePriceShown - trueBasePrice
  const saleVsBasePct = Math.round((saleVsBase / trueBasePrice) * 100)
  const apparentDisc  = Math.round(((inflatedPrice - salePriceShown) / inflatedPrice) * 100)

  function handleViewHistory() {
    if (onViewHistory) {
      onViewHistory()
    } else {
      document.getElementById('price-history-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-gray-50 py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white text-xs font-bold
              px-3 py-1.5 rounded-full mb-3 shadow">
              <Zap size={11} className="text-[#F02D7D] fill-[#F02D7D]" />
              OFFERMATRIX INTELLIGENCE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={24} className="text-amber-500" />
              Fake Discount Alert
            </h2>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition"
          >
            {expanded
              ? <><ChevronUp size={14}/> Hide details</>
              : <><ChevronDown size={14}/> Show details</>}
          </button>
        </div>

        {/* Alert card */}
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 overflow-hidden shadow-md">
          <div className="bg-amber-400 px-5 py-3 flex items-center gap-3">
            <AlertTriangle size={17} className="text-amber-900 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-amber-900 font-bold text-sm">⚠️ Potential Fake Discount Detected</p>
              <p className="text-amber-800 text-xs mt-0.5 truncate">
                This product's price was inflated before the sale was announced.
              </p>
            </div>
            <span className="shrink-0 bg-amber-900 text-amber-100 text-xs font-bold
              px-3 py-1 rounded-full">{verdict}</span>
          </div>

          {expanded && (
            <div className="p-5 md:p-6">
              <p className="text-sm text-gray-600 font-medium mb-6">{product}</p>

              {/* Price steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 mb-6">
                {[
                  {
                    num: '1', label: 'True Base Price', value: trueBasePrice,
                    sub: 'Original selling price',
                    numBg: 'bg-green-100', numColor: 'text-green-600',
                    valueCls: 'text-green-700', border: 'border-gray-100',
                  },
                  {
                    num: '2', label: 'Inflated Price', value: inflatedPrice,
                    sub: `+৳${inflationAmt.toLocaleString()} (+${inflationPct}%) on ${inflationDate}`,
                    numBg: 'bg-red-100', numColor: 'text-red-600',
                    valueCls: 'text-red-600', border: 'border-red-200',
                    topBadge: true,
                  },
                  {
                    num: '3', label: 'Current "Sale" Price', value: salePriceShown,
                    sub: `Still ৳${saleVsBase.toLocaleString()} (+${saleVsBasePct}%) above base`,
                    numBg: 'bg-amber-100', numColor: 'text-amber-600',
                    valueCls: 'text-amber-600', border: 'border-gray-100',
                  },
                ].map(item => (
                  <div key={item.num}
                    className={`bg-white rounded-xl border-2 ${item.border} shadow-sm p-4 text-center relative`}>
                    {item.topBadge && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2
                        bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5
                        rounded-full flex items-center gap-1">
                        <TrendingUp size={8}/> Inflated
                      </div>
                    )}
                    <div className={`w-7 h-7 rounded-full ${item.numBg} flex items-center
                      justify-center mx-auto mb-2 mt-1`}>
                      <span className={`${item.numColor} font-bold text-xs`}>{item.num}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className={`text-2xl font-black ${item.valueCls}`}>
                      ৳{item.value.toLocaleString()}
                    </p>
                    <p className={`text-xs mt-1 ${item.topBadge ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price bars */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
                <p className="text-xs font-semibold text-gray-500 mb-3">Price Timeline Comparison</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'True base',         value: trueBasePrice,   color: '#059669' },
                    { label: 'Inflated price',     value: inflatedPrice,   color: '#DC2626' },
                    { label: '"Sale" price shown', value: salePriceShown,  color: '#D97706' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-32 shrink-0">{label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div className="h-2.5 rounded-full transition-all duration-700"
                          style={{ width: `${Math.round((value/inflatedPrice)*100)}%`, backgroundColor: color }} />
                      </div>
                      <span className="text-xs font-bold w-20 text-right" style={{ color }}>
                        ৳{value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="flex items-start gap-3 bg-amber-100 border border-amber-200
                rounded-xl p-4 mb-5">
                <Info size={15} className="text-amber-700 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">{message}</p>
              </div>

              {/* Cards */}
              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="font-semibold text-red-700 mb-1 text-sm">❌ Advertised discount</p>
                  <p className="text-red-600 text-xl font-black">{apparentDisc}% OFF</p>
                  <p className="text-xs text-red-400 mt-0.5">vs the inflated price</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                  <p className="font-semibold text-green-700 mb-1 text-sm">✅ Real change vs base</p>
                  <p className="text-green-600 text-xl font-black">+{saleVsBasePct}% MORE</p>
                  <p className="text-xs text-green-500 mt-0.5">vs true original price</p>
                </div>
              </div>

              <button
                onClick={handleViewHistory}
                className="flex items-center gap-2 text-sm font-bold text-[#1A1A2E]
                  border-2 border-[#1A1A2E] px-5 py-2.5 rounded-full
                  hover:bg-[#1A1A2E] hover:text-white transition"
              >
                <Eye size={14}/> VIEW FULL PRICE HISTORY
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
