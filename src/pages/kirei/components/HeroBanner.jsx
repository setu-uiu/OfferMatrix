import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Shield, Truck } from 'lucide-react'
import { heroSlides } from '../../../data/kireiData'

// SVG illustration per slide type
function SlideIllustration({ type }) {
  if (type === 'skincare') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Bottle silhouette */}
        <div className="relative">
          <div className="w-24 h-36 md:w-32 md:h-48 bg-gradient-to-b from-[#E8A4B8] to-[#D4527A] rounded-t-full rounded-b-2xl shadow-2xl flex items-center justify-center">
            <span className="text-white text-3xl md:text-5xl font-serif italic font-bold opacity-80">K</span>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-[#C9A96E] rounded-t-lg" />
          {/* Floating petals */}
          {['🌸','✨','🌺','💮'].map((e, i) => (
            <span key={i} className="absolute text-lg animate-bounce"
              style={{
                top: `${[-20, 10, -10, 30][i]}%`,
                left: `${[110, -30, 130, -20][i]}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: '2s',
              }}>
              {e}
            </span>
          ))}
        </div>
        {/* Circle decorations */}
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-[#E8A4B8]/30 blur-xl" />
        <div className="absolute bottom-12 left-8 w-20 h-20 rounded-full bg-[#D4527A]/20 blur-2xl" />
      </div>
    )
  }
  if (type === 'kbeauty') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-2 gap-3">
          {[
            { bg: 'from-blue-200 to-blue-300', emoji: '💧', label: 'Toner' },
            { bg: 'from-sky-200 to-cyan-300',  emoji: '✨', label: 'Essence' },
            { bg: 'from-indigo-200 to-blue-300',emoji: '🌊', label: 'Serum' },
            { bg: 'from-cyan-200 to-sky-300',  emoji: '🫧', label: 'Mask' },
          ].map(({ bg, emoji, label }) => (
            <div key={label}
              className={`w-16 h-20 md:w-20 md:h-24 bg-gradient-to-b ${bg} rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1`}>
              <span className="text-2xl">{emoji}</span>
              <span className="text-[10px] font-semibold text-blue-800">{label}</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-blue-300/20 blur-3xl" />
        </div>
      </div>
    )
  }
  // doctor
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#8BAF8E] to-[#3A8A5E] shadow-2xl flex items-center justify-center">
        <span className="text-5xl md:text-6xl">🩺</span>
      </div>
      {['🌿','⚗️','🔬','💊'].map((e, i) => (
        <span key={i} className="absolute text-xl animate-pulse"
          style={{
            top: `${[15, 65, 25, 70][i]}%`,
            left: `${[75, 80, 15, 10][i]}%`,
            animationDelay: `${i * 0.5}s`,
          }}>
          {e}
        </span>
      ))}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-40 h-40 rounded-full bg-green-300/20 blur-3xl" />
      </div>
    </div>
  )
}

const trustBadges = [
  { icon: Shield,   label: '100% Authentic' },
  { icon: Truck,    label: 'Fast Delivery' },
  { icon: Sparkles, label: 'Dermatologist Approved' },
]

export default function HeroBanner() {
  const [current,   setCurrent]   = useState(0)
  const [animating, setAnimating] = useState(false)
  const total = heroSlides.length

  const goTo = useCallback((idx) => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const prev = () => goTo((current - 1 + total) % total)
  const next = () => goTo((current + 1) % total)

  // Auto-advance every 5 s
  useEffect(() => {
    const id = setInterval(() => goTo((current + 1) % total), 5000)
    return () => clearInterval(id)
  }, [current, goTo, total])

  const slide = heroSlides[current]

  return (
    <section className="relative w-full overflow-hidden" aria-label="Hero banner">
      {/* Slide */}
      <div
        className={`w-full transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}
        style={{ background: `linear-gradient(135deg, ${slide.bgGradient.replace('from-', '').split(' ')[0]}, #fff)` }}
      >
        <div className={`w-full bg-gradient-to-br ${slide.bgGradient}`}>
          <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                {/* Badge */}
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 text-white"
                  style={{ backgroundColor: slide.accentColor }}
                >
                  {slide.badge}
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-serif leading-tight mb-3">
                  {slide.heading}
                </h1>
                <p className="text-lg md:text-xl font-medium text-gray-700 mb-2">
                  {slide.subheading}
                </p>
                <p className="text-sm md:text-base text-gray-500 mb-8 max-w-md mx-auto md:mx-0">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-center md:items-start justify-center md:justify-start">
                  <a
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 text-white font-bold px-7 py-3 rounded-full shadow-lg
                      hover:opacity-90 hover:scale-105 transition-all duration-200 text-sm"
                    style={{ backgroundColor: slide.accentColor }}
                  >
                    {slide.cta}
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href="#categories"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full border-2
                      hover:bg-white/60 transition"
                    style={{ borderColor: slide.accentColor, color: slide.accentColor }}
                  >
                    Browse Categories
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                  {trustBadges.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 bg-white/70 backdrop-blur rounded-full px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                      <Icon size={12} style={{ color: slide.accentColor }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Illustration */}
              <div className="w-56 h-56 md:w-72 md:h-72 shrink-0">
                <SlideIllustration type={slide.illustration} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center
          rounded-full bg-white/80 backdrop-blur shadow hover:bg-white transition z-10"
      >
        <ChevronLeft size={18} className="text-gray-700" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center
          rounded-full bg-white/80 backdrop-blur shadow hover:bg-white transition z-10"
      >
        <ChevronRight size={18} className="text-gray-700" />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2.5 bg-[#D4527A]'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-[#E8A4B8]'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-3 right-4 text-xs text-gray-400 font-medium z-10">
        {current + 1} / {total}
      </div>
    </section>
  )
}
