import React, { useState, useEffect } from 'react'
import { Clock, Tag, RotateCcw, Copy, Check, ArrowRight, Zap } from 'lucide-react'
import { specialOffers } from '../../data/choiceLegacyData'

const CL = {
  primary: '#1A0A2E',
  gold:    '#C9A96E',
  accent:  '#9B1D6A',
  surface: '#FAF7F2',
  border:  '#E8E0D5',
}

function Countdown({ hours = 11, minutes = 58, seconds = 30 }) {
  const [rem, setRem] = useState(hours * 3600 + minutes * 60 + seconds)
  useEffect(() => {
    const id = setInterval(() => setRem(r => Math.max(0, r - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const h = String(Math.floor(rem / 3600)).padStart(2, '0')
  const m = String(Math.floor((rem % 3600) / 60)).padStart(2, '0')
  const s = String(rem % 60).padStart(2, '0')
  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      {[h, m, s].map((u, i) => (
        <React.Fragment key={i}>
          <span className="bg-black/25 text-white px-1.5 py-0.5 rounded font-bold">{u}</span>
          {i < 2 && <span className="text-white/60 font-bold">:</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

function CopyCode({ code, accent }) {
  const [copied, setCopied] = useState(false)
  function copy(e) {
    e.stopPropagation()
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 border-2 border-dashed rounded-lg
        px-3 py-1.5 text-xs font-mono font-bold transition"
      style={{ borderColor: accent + '70', color: accent }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = accent + '12')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <Tag size={11} />
      {code}
      {copied
        ? <Check size={11} className="text-green-500" />
        : <Copy size={11} className="opacity-50" />}
    </button>
  )
}

function OfferCard({ offer }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${offer.bg}
      shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}>

      {/* Decorative orb */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: offer.accent }} />

      <div className="relative p-5 md:p-6 flex flex-col gap-4 flex-1">
        {/* Top */}
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full text-white inline-block mb-2"
            style={{ backgroundColor: offer.accent }}>
            {offer.discount}
          </span>
          <h3 className={`text-lg font-bold ${offer.dark ? 'text-white' : ''}`}
            style={!offer.dark ? { color: CL.primary, fontFamily: '"Playfair Display", Georgia, serif' } : {}}>
            {offer.title}
          </h3>
          <p className={`text-sm mt-1 ${offer.dark ? 'text-gray-300' : 'text-gray-500'}`}>
            {offer.description}
          </p>
        </div>

        {/* Brand tags */}
        <div className="flex flex-wrap gap-1.5">
          {offer.tags.map(t => (
            <span key={t}
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                backgroundColor: offer.dark ? 'rgba(255,255,255,0.1)' : CL.gold + '18',
                color: offer.dark ? '#E2D5F0' : CL.primary,
              }}>
              {t}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-wrap items-center gap-3 mt-auto pt-3 border-t"
          style={{ borderColor: offer.dark ? 'rgba(255,255,255,0.1)' : CL.border }}>
          <span className={`flex items-center gap-1.5 text-xs font-medium
            ${offer.dark ? 'text-gray-400' : 'text-gray-400'}`}>
            <Clock size={11} /> {offer.expires}
          </span>
          {offer.cashback && (
            <span className="flex items-center gap-1.5 text-xs font-semibold
              text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              <RotateCcw size={10} /> {offer.cashback}
            </span>
          )}
          <CopyCode code={offer.code} accent={offer.accent} />
          <a href="#cl-featured"
            className="ml-auto flex items-center gap-1.5 text-sm font-bold
              px-4 py-1.5 rounded-full text-white hover:opacity-90 transition"
            style={{ backgroundColor: offer.accent }}>
            Shop <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CLSpecialOffers() {
  return (
    <section style={{ backgroundColor: CL.surface }} className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between gap-3 mb-8">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: CL.gold }}>Limited Time</p>
            <h2 className="text-2xl md:text-3xl font-bold"
              style={{ color: CL.primary, fontFamily: '"Playfair Display", Georgia, serif' }}>
              Special Offers
            </h2>
          </div>
          {/* Live countdown */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl shadow shrink-0"
            style={{ backgroundColor: CL.primary }}>
            <Clock size={12} className="text-white/70" />
            <span className="text-white text-xs font-medium mr-1">Ends in</span>
            <Countdown hours={8} minutes={34} seconds={22} />
          </div>
        </div>

        {/* Offer cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {specialOffers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>

        {/* Nagad cashback strip */}
        <div className="mt-6 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row
          items-center justify-between gap-4 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${CL.primary}, #2D1654)` }}>
          <div className="min-w-0 w-full sm:w-auto text-center sm:text-left">
            <p className="font-bold text-lg"
              style={{ color: CL.gold, fontFamily: '"Playfair Display", Georgia, serif' }}>
              💚 Pay with Nagad & Save More
            </p>
            <p className="text-sm mt-0.5 text-gray-300">
              Get ৳120 instant cashback on orders above ৳1,200 with Nagad
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <CopyCode code="NAGAD120" accent={CL.gold} />
            <a href="#"
              className="font-bold text-sm px-5 py-2 rounded-full hover:opacity-90 transition"
              style={{ backgroundColor: CL.gold, color: CL.primary }}>
              Activate
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
