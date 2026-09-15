import React from 'react'
import { Link } from 'react-router-dom'
import { User, ShoppingBag, Heart, Settings, ArrowRight } from 'lucide-react'

const quickLinks = [
  { label: 'My Orders',   icon: ShoppingBag, path: '/',        desc: 'Track and manage your orders' },
  { label: 'My Wishlist', icon: Heart,       path: '/wishlist', desc: 'Products you have saved' },
  { label: 'My Cart',     icon: ShoppingBag, path: '/cart',    desc: 'Items waiting to be ordered' },
  { label: 'Settings',   icon: Settings,    path: '/',        desc: 'Account preferences' },
]

export default function AccountPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E8A4B8] to-[#D4527A] flex items-center justify-center shadow-lg mb-4">
          <User size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        <p className="text-sm text-gray-400 mt-1">Sign in to view your orders, wishlist and more.</p>

        <div className="flex gap-3 mt-5">
          <button className="px-6 py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#162d6e] text-white text-sm font-semibold transition">
            Login
          </button>
          <button className="px-6 py-2.5 rounded-full border-2 border-[#1E3A8A] text-[#1E3A8A] text-sm font-semibold
            hover:bg-blue-50 transition">
            Register
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4">
        {quickLinks.map(({ label, icon: Icon, path, desc }) => (
          <Link
            key={label}
            to={path}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm
              hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-[#1E3A8A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <ArrowRight size={15} className="text-gray-300 shrink-0" />
          </Link>
        ))}
      </div>
    </main>
  )
}
