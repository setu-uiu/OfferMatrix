import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search, ShoppingBag, User, Menu, X, ChevronDown,
  Home, UtensilsCrossed, Plane, Sparkles, Tag, RotateCcw,
} from 'lucide-react'
import OfferMatrixLogo from '../shared/OfferMatrixLogo'

const navItems = [
  { label: 'Home',       path: '/',          icon: Home },
  { label: 'Shopping',   path: '/shopping',  icon: ShoppingBag },
  { label: 'Food',       path: '/food',      icon: UtensilsCrossed },
  { label: 'Travel',     path: '/travel',    icon: Plane },
  {
    label: 'Beauty & Care',
    path: '/beauty',
    icon: Sparkles,
    children: [
      { label: 'Kirei',         path: '/kirei',        emoji: '🌸' },
      { label: 'Choice Legacy', path: '/choice-legacy', emoji: '👑' },
    ],
  },
  { label: 'Coupons',    path: '/coupons',   icon: Tag },
  { label: 'Cashback',   path: '/cashback',  icon: RotateCcw },
]

export default function OfferMatrixNavbar() {
  const location = useLocation()
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [beautyOpen,   setBeautyOpen]   = useState(false)
  const [mBeautyOpen,  setMBeautyOpen]  = useState(false)

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1E3A8A] shadow-lg">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <OfferMatrixLogo size="md" theme="dark" />

        {/* Search — desktop */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="search"
            placeholder="Search deals, coupons, products…"
            className="w-full pl-4 pr-10 py-2 rounded-full text-sm bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:bg-white/20 focus:border-cyan-300 transition"
          />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200" />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button aria-label="Account" className="hidden md:flex items-center gap-1.5 text-blue-100 hover:text-white text-sm transition">
            <User size={18} />
            <span className="hidden lg:inline">Login</span>
          </button>
          <Link to="/cashback" className="hidden md:flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition">
            <RotateCcw size={13} />
            Cashback
          </Link>
          <button
            aria-label="Toggle menu"
            className="md:hidden text-white"
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Desktop nav strip */}
      <nav className="hidden md:block bg-[#162d6e] border-t border-white/10">
        <ul className="max-w-7xl mx-auto px-4 flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            if (item.children) {
              return (
                <li
                  key={item.path}
                  className="relative group"
                  onMouseEnter={() => setBeautyOpen(true)}
                  onMouseLeave={() => setBeautyOpen(false)}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition whitespace-nowrap
                      ${active ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-blue-100 hover:text-white'}`}
                  >
                    <Icon size={14} />
                    {item.label}
                    <ChevronDown size={12} className="opacity-60" />
                  </Link>
                  {/* Dropdown */}
                  <div className={`absolute top-full left-0 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 transition-all duration-150
                    ${beautyOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
                    {item.children.map(child => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition
                          ${location.pathname === child.path
                            ? 'bg-blue-50 text-[#1E3A8A] font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span>{child.emoji}</span>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </li>
              )
            }

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition whitespace-nowrap
                    ${active ? 'text-cyan-300 border-b-2 border-cyan-300' : 'text-blue-100 hover:text-white'}`}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-[#162d6e] border-t border-white/10 px-4 py-3">
          {/* Mobile search */}
          <div className="relative mb-3">
            <input
              type="search"
              placeholder="Search deals…"
              className="w-full pl-4 pr-9 py-2 rounded-full text-sm bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:bg-white/20"
            />
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200" />
          </div>

          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)

              if (item.children) {
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => setMBeautyOpen(o => !o)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition
                        ${active ? 'bg-white/10 text-cyan-300' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
                    >
                      <span className="flex items-center gap-2"><Icon size={15} />{item.label}</span>
                      <ChevronDown size={14} className={`transition-transform ${mBeautyOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mBeautyOpen && (
                      <ul className="ml-7 mt-1 flex flex-col gap-1">
                        {item.children.map(child => (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
                                ${location.pathname === child.path
                                  ? 'bg-white/10 text-cyan-300 font-semibold'
                                  : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
                            >
                              <span>{child.emoji}</span>{child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              }

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition
                      ${active ? 'bg-white/10 text-cyan-300' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
