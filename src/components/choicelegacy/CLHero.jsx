import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Shield, Truck, Star } from 'lucide-react'
import { heroSlides } from '../../data/choiceLegacyData'

const CL = {
  primary: '#1A0A2E',
  gold:    '#C9A96E',
  accent:  '#9B1D6A',
  surface: '#FAF7F2',
}

// Per-slide illustration
function Illustration({ type, dark }) {
  if (type === 'bottles') {
    return (
      <div className="relative w-full h-full flex items-center justify-center select-none">
        <div className="relative flex items-end gap-3">
          {/* Tall bottle */}
          <div className="relative">
            <div className="w-14 h-32 md:w-16 md:h-40 rounded-t-full rounded-b-2xl shadow-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(160deg,#C9A96E,#8B6A3E)' }}>
              <span className="text-white font-serif font-bold text-lg opacity-80">CL</span>
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-4 rounded-t-md"
              style={{ backgroundColor: '#C9A96E' }} />
          </div>
          {/* Wide bottle */}
          <div className="w-20 h-24 md:w-24 md:h-28 rounded-2xl shadow-xl flex items-center justify-center mb-2"
            style={{ background: 'linear-gradient(135deg,#2D1654,#1A0A2E)' }}>
            <span className="text-2xl">✨</span>
          </div>
          {/* Small jar */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#9B1D6A,#6B0F4A)' }}>
            <span className="text-white text-xl">💧</span>
          </div>
        </div>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: CL.gold }} />
        </div>
      </div>
    )
  }

  if (type === 'makeup') {
    return (
      <div className="relative w-full h-full flex items-center justify-center select-none">
        <div className="grid grid-cols-2 gap-3">
          {[
            { bg: 'from-[#9B1D6A] to-[#6B0F4A]', emoji: '💄', label: 'Lip' },
            { bg: 'from-[#C9A96E] to-[#8B6A3E]', emoji: '🌟', label: 'Glow' },
            { bg: 'from-[#2D1654] to-[#1A0A2E]', emoji: '👁️', label: 'Eye' },
            { bg: 'from-[#9B1D6A] to-[#C9A96E]', emoji: '🎨', label: 'Face' },
          ].map(({ bg, emoji, label }) => (
            <div key={label}
              className={`w-16 h-20 md:w-20 md:h-24 bg-gradient-to-br ${bg} rounded-2xl
                shadow-lg flex flex-col items-center justify-center gap-1`}>
              <span className="text-2xl">{emoji}</span>
              <span className="text-white text-[10px] font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // bundles
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="relative">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl shadow-2xl flex flex-col items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${CL.gold}, #8B6A3E)` }}>
          <span className="text-4xl md:text-5xl">🎁</span>
          <span className="text-white text-xs font-bold tracking-wide uppercase">Bundle</span>
        </div>
        {['💧','💆','💄','🧴'].map((e, i) => (
          <span key={i}
            className="absolute text-xl animate-bounce"
            style={{
              top:  `${[-20,60,-15,75][i]}%`,
              left: `${[105,-30,115,-25][i]}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2.2s',
            }}>{e}</span>
        ))}
      </div>
    </div>
  )
}

const trustItems = [
  { icon: Shield, label: '100% Authentic'      },
  { icon: Truck,  label: 'Nationwide Delivery'  },
  { icon: Star,   label: 'Dermatologist Approved'},
]

export default function CLHero() {
  const [current,   setCurrent]   = useState(0)
  const [animating, setAnimating] = useState(false)
  const total = heroSlides.length

  const goTo = useCallback(idx => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 500)
  }, [animating])

  const prev = () => goTo((current - 1 + total) % total)
  const next = () => goTo((current + 1) % total)

  useEffect(() => {
    const id = setInterval(() => goTo((current + 1) % total), 5500)
    return () => clearInterval(id)
  }, [current, goTo, total])

  const slide = heroSlides[current]
  const isDark = slide.theme === 'dark'

  return (
    <section className="relative w-full overflow-hidden" aria-label="Hero banner">
      <div
        className={`w-full transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background: isDark
            ? `linear-gradient(135deg, #1A0A2E 0%, #2D1654 60%, #1A0A2E 100%)`
            : `linear-gradient(135deg, ${CL.surface} 0%, #F0E8F5 60%, ${CL.surface} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

            {/* ── Text column ─────────────────────────────── */}
            <div className="flex-1 text-center md:text-left">

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px w-6" style={{ backgroundColor: slide.accent }} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: slide.accent }}>
                  {slide.eyebrow}
                </span>
                <div className="h-px w-6" style={{ backgroundColor: slide.accent }} />
              </div>

              {/* Heading */}
              <h1
                className="font-extrabold leading-tight mb-4"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                  color: isDark ? '#FAF7F2' : CL.primary,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  whiteSpace: 'pre-line',
                }}
              >
                {slide.heading}
              </h1>

              {/* Sub */}
              <p className="text-sm md:text-base mb-6 max-w-md mx-auto md:mx-0 leading-relaxed"
                style={{ color: isDark ? '#C4B5D4' : '#5A4870' }}>
                {slide.subheading}
              </p>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: slide.accent }}>
                  {slide.badge}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 items-center md:items-start justify-center md:justify-start">
                <a
                  href="#cl-featured"
                  className="inline-flex items-center gap-2 text-white font-bold px-7 py-3
                    rounded-lg shadow-lg hover:opacity-90 transition text-sm"
                  style={{ backgroundColor: slide.accent }}
                >
                  {slide.cta} <ArrowRight size={15} />
                </a>
                <a
                  href="#cl-categories"
                  className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg
                    border text-sm hover:opacity-80 transition"
                  style={{
                    borderColor: isDark ? CL.gold + '60' : CL.accent + '40',
                    color: isDark ? CL.gold : CL.accent,
                  }}
                >
                  {slide.ctaSecondary}
                </a>
              </div>

              {/* Trust items */}
              <div className="flex flex-wrap gap-3 mt-7 justify-center md:justify-start">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div key={label}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,10,46,0.06)',
                      color: isDark ? '#C4B5D4' : CL.primary,
                    }}>
                    <Icon size={11} style={{ color: slide.accent }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Illustration ─────────────────────────────── */}
            <div className="w-52 h-52 md:w-72 md:h-72 shrink-0">
              <Illustration type={slide.illustration} dark={isDark} />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button onClick={prev} aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
          bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center
          text-white transition z-10">
        <ChevronLeft size={17} />
      </button>
      <button onClick={next} aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
          bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center
          text-white transition z-10">
        <ChevronRight size={17} />
      </button>

      {/* Pagination */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width:  i === current ? 24 : 8,
              height: 8,
              backgroundColor: i === current ? CL.gold : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
