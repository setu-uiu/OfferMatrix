import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ShoppingBag, UtensilsCrossed, Plane, Tag, RotateCcw, ArrowRight } from 'lucide-react'
import OfferMatrixLogo from '../components/shared/OfferMatrixLogo'

const sections = [
  { label: 'Shopping',    path: '/shopping',  icon: ShoppingBag,    color: 'bg-blue-50   text-blue-600',   desc: 'Compare prices across top stores' },
  { label: 'Food',        path: '/food',       icon: UtensilsCrossed,color: 'bg-orange-50 text-orange-600', desc: 'Deals on restaurants & delivery' },
  { label: 'Travel',      path: '/travel',     icon: Plane,          color: 'bg-sky-50    text-sky-600',    desc: 'Flights, hotels & travel offers' },
  { label: 'Beauty & Care',path: '/beauty',    icon: Sparkles,       color: 'bg-pink-50   text-pink-600',   desc: 'Skincare, makeup & wellness deals' },
  { label: 'Coupons',     path: '/coupons',    icon: Tag,            color: 'bg-violet-50 text-violet-600', desc: 'Verified coupon codes daily' },
  { label: 'Cashback',    path: '/cashback',   icon: RotateCcw,      color: 'bg-green-50  text-green-600',  desc: 'Earn cashback on every purchase' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5 text-sm text-gray-600 font-medium mb-6 shadow-sm">
          <OfferMatrixLogo size="sm" theme="light" asLink={false} />
          Bangladesh's Smart Deal Discovery Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Compare Smarter.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Save Bigger.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          Price comparison, deal discovery, cashback, coupons and savings intelligence — all in one platform.
        </p>
        <Link
          to="/beauty"
          className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#162d6e] text-white font-semibold px-6 py-3 rounded-full transition shadow-lg"
        >
          <Sparkles size={16} />
          Explore Beauty & Care
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Category grid */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {sections.map(({ label, path, icon: Icon, color, desc }) => (
            <Link
              key={path}
              to={path}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
              <span className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-auto">
                Explore <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
