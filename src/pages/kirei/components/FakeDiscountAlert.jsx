import React, { useState } from 'react'
import { AlertTriangle, TrendingUp, Eye, Info, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import { fakeDiscountData } from '../../../data/kireiData'

export default function FakeDiscountAlert() {
  const [expanded, setExpanded] = useState(true)
  const d = fakeDiscountData

  const inflationAmount  = d.inflatedPrice - d.trueBasePrice
  const inflationPct     = Math.round((inflationAmount / d.trueBasePrice) * 100)
  const saleVsBase       = d.salePriceShown - d.trueBasePrice
  const saleVsBasePct    = Math.round((saleVsBase / d.trueBasePrice) * 100)
  const apparentDiscount = Math.round(((d.inflatedPrice - d.salePriceShown) / d.inflatedPrice) * 100)

  return (
    <section className="bg-[#FDF8F5] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white text-xs font-bold
              px-3 py-1 rounded-full mb-3 shadow">
              <Zap size={12} className="fill-cyan-300 text-cyan-300" />
              OFFERMATRIX INTELLIGENCE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={26} className="text-amber-500" />
              Fake Discount Alert
            </h2>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition"
          >
            {expanded ? <><ChevronUp size={15} /> Hide details</> : <><ChevronDown size={15} /> Show details</>}
          </button>
        </div>

        {/* Main alert card */}
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 overflow-hidden shadow-md">

          {/* Alert banner */}
          <div className="bg-amber-400 px-5 py-3 flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-900 shrink-0" />
            <div className="flex-1">
              <p className="text-amber-900 font-bold text-sm">
                ⚠️ Potential Fake Discount Detected
              </p>
              <p className="text-amber-800 text-xs mt-0.5">
                This product's price was artificially inflated before the sale was announced.
              </p>
            </div>
            <span className="shrink-0 bg-amber-900 text-amber-100 text-xs font-bold px-3 py-1 rounded-full">
              {d.verdict}
            </span>
          </div>

          {expanded && (
            <div className="p-5 md:p-6">
              <p className="text-sm text-gray-600 font-medium mb-6">{d.product}</p>

              {/* Price timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                {/* True base */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 font-bold text-xs">1</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">True Base Price</p>
                  <p className="text-2xl font-black text-green-700">৳{d.trueBasePrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">Original selling price</p>
                </div>

                {/* Inflated */}
                <div className="bg-white rounded-xl border-2 border-red-200 shadow-sm p-4 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp size={9} /> Inflated
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2 mt-1">
                    <span className="text-red-600 font-bold text-xs">2</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Inflated Price</p>
                  <p className="text-2xl font-black text-red-600">৳{d.inflatedPrice.toLocaleString()}</p>
                  <p className="text-xs text-red-400 font-semibold mt-1">
                    +৳{inflationAmount.toLocaleString()} (+{inflationPct}%) on {d.inflationDate}
                  </p>
                </div>

                {/* Sale price */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                    <span className="text-amber-600 font-bold text-xs">3</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Current "Sale" Price</p>
                  <p className="text-2xl font-black text-amber-600">৳{d.salePriceShown.toLocaleString()}</p>
                  <p className="text-xs text-amber-500 font-semibold mt-1">
                    Still ৳{saleVsBase.toLocaleString()} (+{saleVsBasePct}%) above base
                  </p>
                </div>
              </div>

              {/* Visual price bar */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
                <p className="text-xs font-semibold text-gray-500 mb-3">Price Timeline Comparison</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'True base',         value: d.trueBasePrice,   max: d.inflatedPrice, color: '#059669' },
                    { label: 'Inflated price',     value: d.inflatedPrice,   max: d.inflatedPrice, color: '#DC2626' },
                    { label: '"Sale" price shown', value: d.salePriceShown,  max: d.inflatedPrice, color: '#D97706' },
                  ].map(({ label, value, max, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-36 shrink-0">{label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full transition-all duration-700"
                          style={{ width: `${Math.round((value / max) * 100)}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="text-xs font-bold w-20 text-right" style={{ color }}>
                        ৳{value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verdict message */}
              <div className="flex items-start gap-3 bg-amber-100 border border-amber-200 rounded-xl p-4 mb-5">
                <Info size={16} className="text-amber-700 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">{d.message}</p>
              </div>

              {/* What this means */}
              <div className="grid sm:grid-cols-2 gap-3 mb-5 text-sm">
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="font-semibold text-red-700 mb-1">❌ Advertised discount</p>
                  <p className="text-red-600 text-xl font-black">{apparentDiscount}% OFF</p>
                  <p className="text-xs text-red-400 mt-0.5">vs the inflated price</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                  <p className="font-semibold text-green-700 mb-1">✅ Real change vs base</p>
                  <p className="text-green-600 text-xl font-black">+{saleVsBasePct}% MORE</p>
                  <p className="text-xs text-green-500 mt-0.5">vs true original price</p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => document.getElementById('price-history-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-sm font-bold text-[#1E3A8A] hover:text-[#162d6e]
                  border-2 border-[#1E3A8A] px-5 py-2.5 rounded-full hover:bg-blue-50 transition"
              >
                <Eye size={15} />
                VIEW FULL PRICE HISTORY
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
