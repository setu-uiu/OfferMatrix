import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Star, Shield, Zap } from 'lucide-react'
import OfferMatrixLogo from '../../components/shared/OfferMatrixLogo'

const merchants = [
  {
    name: 'Kirei',
    path: '/kirei',
    tagline: 'Your reliable care partner for authentic beauty',
    description: 'Premium Japanese, Korean & International beauty products. Dermatologist-backed skincare, haircare and wellness for every Bangladeshi woman.',
    categories: ['J-Beauty', 'K-Beauty', 'Skincare', 'Doctor Cosmetics', 'Haircare', 'Wellness'],
    badge: 'J-Beauty Specialist',
    emoji: '🌸',
    bg: 'from-[#FDF0F4] to-[#F5D6E0]',
    accent: '#D4527A',
    stats: { products: '500+', brands: '80+', rating: '4.8' },
  },
  {
    name: 'Choice Legacy',
    path: '/choice-legacy',
    tagline: 'Your ultimate beauty destination',
    description: 'Premium personal care platform with authentic products across skincare, haircare, body care, makeup, lingerie and feminine hygiene.',
    categories: ['Skincare', 'Haircare', 'Body Care', 'Makeup', 'Lingerie', 'Feminine Hygiene', 'Beauty Tools'],
    badge: 'Premium Personal Care',
    emoji: '👑',
    bg: 'from-[#1a0a2e] to-[#2d1654]',
    accent: '#C9A96E',
    dark: true,
    stats: { products: '800+', brands: '120+', rating: '4.7' },
  },
]

export default function BeautyHub() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-pink-50 to-rose-100 border-b border-pink-100 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-pink-200 rounded-full px-4 py-1.5 text-sm text-[#D4527A] font-medium mb-4">
            <Sparkles size={14} />
            Beauty & Care —&nbsp;<OfferMatrixLogo size="sm" theme="light" asLink={false} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Compare Beauty Deals Across Top Merchants
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Find the best prices on skincare, makeup and wellness products. Price history, cashback, coupons and verified seller scores — all in one place.
          </p>
        </div>
      </section>

      {/* Merchant cards */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Sparkles size={18} className="text-[#D4527A]" />
          Beauty & Care Merchants
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {merchants.map((m) => (
            <div
              key={m.path}
              className={`rounded-3xl bg-gradient-to-br ${m.bg} overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="p-7 flex flex-col gap-4">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block
                      ${m.dark ? 'bg-white/10 text-amber-300' : 'bg-white/60 text-[#D4527A]'}`}>
                      {m.badge}
                    </span>
                    <h3 className={`text-3xl font-bold mt-1 flex items-center gap-2
                      ${m.dark ? 'text-white' : 'text-gray-900'}`}>
                      <span>{m.emoji}</span> {m.name}
                    </h3>
                    <p className={`text-sm mt-1 ${m.dark ? 'text-gray-300' : 'text-gray-500'}`}>
                      {m.tagline}
                    </p>
                  </div>
                </div>

                <p className={`text-sm leading-relaxed ${m.dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {m.description}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5">
                  {m.categories.map(c => (
                    <span key={c} className={`text-xs px-2.5 py-1 rounded-full font-medium
                      ${m.dark ? 'bg-white/10 text-gray-200' : 'bg-white/70 text-gray-700'}`}>
                      {c}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                  {[
                    { icon: Zap,    label: m.stats.products, sub: 'Products' },
                    { icon: Shield, label: m.stats.brands,   sub: 'Brands' },
                    { icon: Star,   label: m.stats.rating,   sub: 'Rating' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={sub} className="flex items-center gap-1.5">
                      <Icon size={14} style={{ color: m.accent }} />
                      <div>
                        <p className={`text-sm font-bold ${m.dark ? 'text-white' : 'text-gray-800'}`}>{label}</p>
                        <p className={`text-[10px] ${m.dark ? 'text-gray-400' : 'text-gray-500'}`}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to={m.path}
                  style={{ backgroundColor: m.accent }}
                  className="inline-flex items-center gap-2 self-start text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition group-hover:gap-3"
                >
                  Visit {m.name}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
