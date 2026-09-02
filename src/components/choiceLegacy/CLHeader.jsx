import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, ShoppingCart, Heart, User, Menu, X,
  Phone, MapPin, Bell, ChevronDown,
} from 'lucide-react'

// Choice Legacy brand colours
const CL = {
  primary:  '#1A0A2E',
  gold:     '#C9A96E',
  accent:   '#9B1D6A',
  surface:  '#FAF7F2',
  border:   '#E8E0D5',
}

export default function CLHeader() {
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query,      setQuery]      = useState('')
  const [cartCount]                  = useState(3)
  const [wishCount]                  = useState(7)

  return (
    <header className="bg-white" style={{ borderBottom: `1px solid ${CL.border}` }}>

      {/* ── Top utility bar — desktop ──────────────────────────── */}
      <div className="hidden md:block" style={{ backgroundColor: CL.surface, borderBottom: `1px solid ${CL.border}` }}>
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone size={11} className="text-gray-400" />
              +880 1800-000000
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={11} className="text-gray-400" />
              Dhaka, Bangladesh
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span style={{ color: CL.gold }} className="font-medium">
              Free delivery above ৳1,200
            </span>
            <span className="text-gray-400">|</span>
            <span>100% Authentic Products</span>
          </div>
        </div>
      </div>

      {/* ── Main header bar ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16 md:h-20">

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg transition"
            style={{ color: CL.primary }}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* ── Logo ──────────────────────────────────────────── */}
          <Link to="/choice-legacy" className="flex items-center gap-2.5 shrink-0">
            {/* Crown icon mark */}
            <div
              className="w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center shadow-md shrink-0"
              style={{ background: `linear-gradient(135deg, ${CL.primary}, #2D1654)` }}
            >
              <span className="text-lg md:text-xl" style={{ color: CL.gold }}>👑</span>
            </div>
            <div className="hidden sm:block leading-none">
              <span
                className="block font-extrabold tracking-wide"
                style={{
                  fontSize: '1.2rem',
                  color: CL.primary,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  letterSpacing: '0.02em',
                }}
              >
                Choice
              </span>
              <span
                className="block font-semibold tracking-[0.18em] uppercase"
                style={{ fontSize: '0.62rem', color: CL.gold }}
              >
                Legacy
              </span>
            </div>
          </Link>

          {/* ── Search bar — desktop ───────────────────────────── */}
          <div className="hidden md:flex flex-1 min-w-0 max-w-xl mx-4 relative">
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search skincare, makeup, haircare…"
              className="w-full pl-5 pr-12 py-2.5 text-sm bg-white text-gray-800
                placeholder-gray-400 focus:outline-none transition"
              style={{
                border: `1.5px solid ${CL.border}`,
                borderRadius: '8px',
              }}
              onFocus={e => (e.target.style.borderColor = CL.gold)}
              onBlur={e  => (e.target.style.borderColor = CL.border)}
            />
            <button
              aria-label="Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9
                flex items-center justify-center rounded-lg transition text-white"
              style={{ backgroundColor: CL.primary }}
            >
              <Search size={15} />
            </button>
          </div>

          {/* ── Right icons ───────────────────────────────────── */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Mobile search */}
            <button
              className="md:hidden p-2 transition"
              style={{ color: CL.primary }}
              onClick={() => setSearchOpen(o => !o)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="hidden sm:flex relative p-2 transition"
              style={{ color: CL.primary }}
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: CL.accent }} />
            </button>

            {/* Wishlist */}
            <Link
              to="#"
              aria-label="Wishlist"
              className="relative p-2 transition"
              style={{ color: CL.primary }}
            >
              <Heart size={20} />
              {wishCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center
                    justify-center text-white text-[9px] font-bold rounded-full"
                  style={{ backgroundColor: CL.accent }}
                >
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="#"
              aria-label="Cart"
              className="relative p-2 transition"
              style={{ color: CL.primary }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center
                    justify-center text-white text-[9px] font-bold rounded-full"
                  style={{ backgroundColor: CL.accent }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <button
              className="hidden sm:flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-lg
                text-sm font-semibold border transition"
              style={{
                borderColor: CL.border,
                color: CL.primary,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = CL.gold
                e.currentTarget.style.color = CL.gold
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = CL.border
                e.currentTarget.style.color = CL.primary
              }}
            >
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
                className="w-full pl-4 pr-11 py-2.5 text-sm focus:outline-none"
                style={{
                  border: `1.5px solid ${CL.gold}`,
                  borderRadius: '8px',
                  color: CL.primary,
                }}
              />
              <button
                aria-label="Search"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9
                  flex items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: CL.primary }}
              >
                <Search size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-3"
          style={{ backgroundColor: CL.surface, borderColor: CL.border }}
        >
          <nav className="flex flex-col gap-0.5">
            {[
              'Home','Skincare','Haircare','Body Care','Makeup',
              'Intimate & Hygiene','Beauty Tools','Offers',
            ].map(item => (
              <a
                key={item}
                href="#"
                className="px-3 py-2.5 rounded-lg text-sm font-medium transition"
                style={{ color: CL.primary }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#F0E8F5'
                  e.currentTarget.style.color = CL.accent
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = CL.primary
                }}
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
