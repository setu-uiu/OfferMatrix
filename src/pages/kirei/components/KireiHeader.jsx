import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, ShoppingCart, User, Heart, Menu, X,
  Phone, MapPin, ChevronDown, Bell,
} from 'lucide-react'

export default function KireiHeader() {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [cartCount]                   = useState(2)
  const [wishCount]                   = useState(5)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [query,       setQuery]       = useState('')

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      {/* Top utility bar — desktop only */}
      <div className="hidden md:block bg-[#FDF8F5] border-b border-[#F5D6E0]">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={11} /> +880 1700-000000
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} /> Dhaka, Bangladesh
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Free shipping on orders above ৳1,500</span>
            <span className="text-[#D4527A] font-medium">J-Beauty Users Group →</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16 md:h-20">

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-600 hover:text-[#D4527A] transition"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/kirei" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#E8A4B8] to-[#D4527A] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-base md:text-lg font-serif italic">K</span>
            </div>
            <div className="hidden sm:block">
              <span className="block text-xl md:text-2xl font-bold text-[#2C2C2C] font-serif tracking-wide leading-none">
                Kirei
              </span>
              <span className="block text-[9px] md:text-[10px] text-[#D4527A] font-medium tracking-[0.15em] uppercase leading-none mt-0.5">
                Authentic Beauty
              </span>
            </div>
          </Link>

          {/* Search bar — desktop */}
          <div className="hidden md:flex flex-1 max-w-xl relative mx-4">
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for skincare, J-Beauty, K-Beauty products…"
              className="w-full pl-5 pr-12 py-2.5 rounded-full border-2 border-[#F5D6E0] bg-[#FDF8F5] text-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:border-[#D4527A] transition"
            />
            <button
              aria-label="Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center
                bg-[#D4527A] hover:bg-[#b8416a] text-white rounded-full transition"
            >
              <Search size={15} />
            </button>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">

            {/* Mobile search toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-[#D4527A] transition"
              onClick={() => setSearchOpen(o => !o)}
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="hidden sm:flex relative p-2 text-gray-500 hover:text-[#D4527A] transition"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4527A] rounded-full" />
            </button>

            {/* Wishlist */}
            <Link
              to="#"
              aria-label="Wishlist"
              className="relative p-2 text-gray-500 hover:text-[#D4527A] transition"
            >
              <Heart size={20} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center
                  bg-[#D4527A] text-white text-[9px] font-bold rounded-full">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="#"
              aria-label="Cart"
              className="relative p-2 text-gray-500 hover:text-[#D4527A] transition"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center
                  bg-[#D4527A] text-white text-[9px] font-bold rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <button className="hidden sm:flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-full border-2 border-[#E8A4B8]
              text-sm font-medium text-[#D4527A] hover:bg-[#FDF0F4] transition">
              <User size={15} />
              <span className="hidden lg:inline">Account</span>
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products…"
                autoFocus
                className="w-full pl-4 pr-12 py-2.5 rounded-full border-2 border-[#F5D6E0] bg-[#FDF8F5] text-sm
                  focus:outline-none focus:border-[#D4527A] transition"
              />
              <button
                aria-label="Search"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center
                  bg-[#D4527A] text-white rounded-full transition"
              >
                <Search size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#F5D6E0] px-4 py-4">
          <nav className="flex flex-col gap-1">
            {[
              'Home', 'J-Beauty', 'K-Beauty', 'International Brands',
              'Offers', 'Baby Care', 'Combo', 'Makeup',
              'Doctor Cosmetics', 'Travel Kit',
            ].map(item => (
              <a
                key={item}
                href="#"
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#FDF0F4] hover:text-[#D4527A] transition"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
