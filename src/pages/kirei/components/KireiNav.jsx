import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, Flame, Percent } from 'lucide-react'

// Category slugs map to /kirei#<anchor> for in-page scroll,
// or /search?q=<term> for filtered discovery
const navItems = [
  { label: 'Home',               to: '/kirei',             highlight: false },
  {
    label: 'J-Beauty',           to: '/search?q=J-Beauty', highlight: false,
    children: [
      { label: 'All J-Beauty',   to: '/search?q=J-Beauty' },
      { label: 'Face Care',      to: '/search?q=face+care' },
      { label: 'Sunscreen',      to: '/search?q=sunscreen' },
      { label: 'Body Care',      to: '/search?q=body+care' },
      { label: 'Hair Care',      to: '/search?q=hair+care' },
      { label: 'Cleansing',      to: '/search?q=cleansing' },
    ],
  },
  {
    label: 'K-Beauty',           to: '/search?q=K-Beauty', highlight: false,
    children: [
      { label: 'All K-Beauty',      to: '/search?q=K-Beauty' },
      { label: 'Toners & Essences', to: '/search?q=toner' },
      { label: 'Serums',            to: '/search?q=serum' },
      { label: 'Sheet Masks',       to: '/search?q=mask' },
      { label: 'Eye Cream',         to: '/search?q=eye+cream' },
      { label: 'Moisturizers',      to: '/search?q=moisturizer' },
    ],
  },
  {
    label: 'International Brands', to: '/search?q=International', highlight: false,
    children: [
      { label: 'La Roche-Posay', to: '/search?q=La+Roche-Posay' },
      { label: 'CeraVe',         to: '/search?q=CeraVe' },
      { label: 'Cetaphil',       to: '/search?q=Cetaphil' },
      { label: 'The Ordinary',   to: '/search?q=The+Ordinary' },
      { label: 'Neutrogena',     to: '/search?q=Neutrogena' },
    ],
  },
  {
    label: 'Offers',             to: '/coupons',           highlight: true,
    icon: Percent,
    children: [
      { label: 'Flash Sale',   to: '/coupons' },
      { label: 'Bundle Deals', to: '/coupons' },
      { label: 'Clearance',    to: '/coupons' },
      { label: 'bKash Offers', to: '/cashback' },
    ],
  },
  { label: 'Baby Care',  to: '/search?q=Baby+Care',        highlight: false },
  { label: 'Combo',      to: '/search?q=Combo',            highlight: false },
  {
    label: 'Makeup',     to: '/search?q=Makeup',           highlight: false,
    children: [
      { label: 'Foundation',          to: '/search?q=foundation' },
      { label: 'Lipstick & Tints',    to: '/search?q=lipstick' },
      { label: 'Eye Makeup',          to: '/search?q=eye+makeup' },
      { label: 'Blush & Highlighter', to: '/search?q=blush' },
    ],
  },
  {
    label: 'Doctor Cosmetics', to: '/search?q=Doctor+Cosmetics', highlight: false,
    children: [
      { label: 'Dermatologist Picks', to: '/search?q=dermatologist' },
      { label: 'Acne & Blemish',      to: '/search?q=acne' },
      { label: 'Sensitive Skin',      to: '/search?q=sensitive' },
      { label: 'Anti-Aging',          to: '/search?q=anti-aging' },
    ],
  },
  { label: 'Travel Kit', to: '/search?q=travel+kit',       highlight: false },
  {
    label: 'More',       to: '/search?q=beauty',           highlight: false,
    children: [
      { label: 'Fragrances',  to: '/search?q=fragrance' },
      { label: 'Wellness',    to: '/search?q=wellness' },
      { label: 'Accessories', to: '/search?q=accessories' },
      { label: 'Gift Sets',   to: '/search?q=gift+set' },
    ],
  },
]

function DropdownMenu({ items }) {
  return (
    <div className="absolute top-full left-0 z-50 mt-0 min-w-[180px] bg-white rounded-b-xl rounded-tr-xl shadow-xl border border-gray-100 py-1.5">
      {items.map(item => (
        <Link
          key={item.label}
          to={item.to}
          className="flex items-center justify-between px-4 py-2 text-sm text-gray-700
            hover:bg-[#FDF0F4] hover:text-[#D4527A] transition group"
        >
          <span>{item.label}</span>
          <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition text-[#D4527A]" />
        </Link>
      ))}
    </div>
  )
}

export default function KireiNav() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav
      ref={navRef}
      className="bg-white border-b border-[#F5D6E0] shadow-sm"
      aria-label="Kirei main navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center overflow-x-auto kirei-scrollbar gap-0 select-none">
          {navItems.map((item) => {
            const isActive = activeDropdown === item.label
            const Icon = item.icon

            return (
              <li
                key={item.label}
                className="relative shrink-0"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.to}
                  onClick={() => setActiveDropdown(null)}
                  className={`flex items-center gap-1 px-3.5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors
                    border-b-2 ${isActive
                      ? 'border-[#D4527A] text-[#D4527A]'
                      : 'border-transparent hover:border-[#E8A4B8] hover:text-[#D4527A] text-gray-700'
                    }
                    ${item.highlight ? 'text-[#D4527A] font-semibold' : ''}
                  `}
                >
                  {Icon && <Icon size={13} />}
                  {item.label === 'Offers' && (
                    <Flame size={13} className="text-orange-500 fill-orange-400" />
                  )}
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 opacity-60 ${isActive ? 'rotate-180' : ''}`}
                    />
                  )}
                </Link>

                {item.children && isActive && (
                  <DropdownMenu items={item.children} />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
