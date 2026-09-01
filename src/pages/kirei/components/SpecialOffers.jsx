import React, { useState, useEffect } from 'react'
import { Tag, RotateCcw, Clock, Copy, Check, ArrowRight, Zap } from 'lucide-react'
import { specialOffers } from '../../../data/kireiData'

function CountdownTimer({ hours = 23, minutes = 47, seconds = 12 }) {
  const total = hours * 3600 + minutes * 60 + seconds
  const [remaining, setRemaining] = useState(total)

  useEffect(() => {
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const h = String(Math.floor(remaining / 3600)).padStart(2, '0')
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0')
  const s = String(remaining % 60).padStart(2, '0')

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      {[h, m, s].map((unit, i) => (
        <React.Fragment key={i}>
          <span className="bg-black/20 text-white px-1.5 py-0.5 rounded font-bold">{unit}</span>
          {i < 2 && <span className="text-white/70 font-bold">:</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

function CouponCode({ code }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 border-2 border-dashed border-white/50 bg-white/10
        hover:bg-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-mono font-bold
        transition group"
      aria-label={`Copy coupon code ${code}`}
    >
      <Tag size={12} />
      {code}
      {copied
        ? <Check size={12} className="text-green-300" />
        : <Copy size={12} className="opacity-50 group-hover:opacity-100 transition" />}
    </button>
  )
}

function OfferCard({ offer, index }) {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${offer.color} shadow-lg
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
        style={{ backgroundColor: offer.accent }} />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: offer.accent }} />

      <div className="relative p-5 md:p-6 flex flex-col gap-4 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: offer.accent }}>
                {offer.discount}
              </span>
              {index === 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                  <Zap size={10} className="fill-orange-500 text-orange-500" /> Flash Deal
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{offer.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
          </div>
        </div>

        {/* Product brands */}
        <div className="flex flex-wrap gap-1.5">
          {offer.products.map(p => (
            <span key={p} className="text-xs px-2.5 py-1 bg-white/60 rounded-full text-gray-700 font-medium">
              {p}
            </span>
          ))}
        </div>

        {/* Bottom action row */}
        <div className="flex flex-wrap items-center gap-3 mt-auto pt-3 border-t border-black/5">
          {/* Expiry */}
          <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Clock size={12} />
            {offer.expires}
          </span>

          {/* Cashback */}
          {offer.cashback && (
            <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full font-medium">
              <RotateCcw size={11} />
              {offer.cashback}
            </span>
          )}

          {/* Coupon */}
          {offer.code && (
            <div className="flex items-center gap-1.5 border-2 border-dashed rounded-lg px-3 py-1"
              style={{ borderColor: offer.accent }}>
              <Tag size={11} style={{ color: offer.accent }} />
              <span className="text-xs font-mono font-bold" style={{ color: offer.accent }}>
                {offer.code}
              </span>
              <CopyInline code={offer.code} accent={offer.accent} />
            </div>
          )}

          {/* Shop CTA */}
          <a
            href="#featured"
            className="ml-auto flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full
              text-white hover:opacity-90 transition"
            style={{ backgroundColor: offer.accent }}
          >
            Shop Now <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}

function CopyInline({ code, accent }) {
  const [copied, setCopied] = useState(false)
  function handleCopy(e) {
    e.stopPropagation()
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="ml-1 transition" aria-label="Copy coupon">
      {copied
        ? <Check size={11} className="text-green-500" />
        : <Copy size={11} style={{ color: accent }} className="opacity-60 hover:opacity-100" />}
    </button>
  )
}

export default function SpecialOffers() {
  return (
    <section className="bg-[#FDF8F5] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#D4527A] tracking-widest uppercase mb-1">
              Limited Time
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">
              Special Offers
            </h2>
          </div>
          {/* Live countdown */}
          <div className="flex items-center gap-2 bg-[#D4527A] px-3 py-2 rounded-xl shadow">
            <Clock size={13} className="text-white/80" />
            <span className="text-white text-xs font-medium mr-1">Ends in</span>
            <CountdownTimer hours={5} minutes={23} seconds={47} />
          </div>
        </div>

        {/* Offer cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {specialOffers.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} index={i} />
          ))}
        </div>

        {/* Bottom banner */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#D4527A] to-[#E8A4B8] p-5 md:p-6
          flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-lg">📱 Pay with bKash & Save More</p>
            <p className="text-white/80 text-sm mt-0.5">Get ৳100 instant cashback on orders above ৳1,500 with bKash</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <CouponCode code="BKASH100" />
            <a href="#" className="bg-white text-[#D4527A] font-bold text-sm px-5 py-2 rounded-full hover:bg-pink-50 transition">
              Activate
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
