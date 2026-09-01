import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronRight, Flame, Percent } from 'lucide-react'

const navItems = [
  {
    label: 'Home',
    href: '#',
    highlight: false,
  },
  {
    label: 'J-Beauty',
    href: '#',
    highlight: false,
    children: [
      { label: 'All J-Beauty',      href: '#' },
      { label: 'Face Care',         href: '#' },
      { label: 'Sunscreen',         href: '#' },
      { label: 'Body Care',         href: '#' },
      { label: 'Hair Care',         href: '#' },
      { label: 'Cleansing',         href: '#' },
    ],
  },
  {
    label: 'K-Beauty',
    href: '#',
    highlight: false,
    children: [
      { label: 'All K-Beauty',      href: '#' },
      { label: 'Toners & Essences', href: '#' },
      { label: 'Serums',            href: '#' },
      { label: 'Sheet Masks',       href: '#' },
      { label: 'Eye Cream',         href: '#' },
      { label: 'Moisturizers',      href: '#' },
    ],
  },
  {
    label: 'International Brands',
    href: '#',
    highlight: false,
    children: [
      { label: 'La Roche-Posay',    href: '#' },
      { label: 'CeraVe',            href: '#' },
      { label: 'Cetaphil',          href: '#' },
      { label: 'The Ordinary',      href: '#' },
      { label: 'Neutrogena',        href: '#' },
    ],
  },
  {
    label: 'Offers',
    href: '#',
    highlight: true,
    icon: Percent,
    children: [
      { label: 'Flash Sale',        href: '#' },
      { label: 'Bundle Deals',      href: '#' },
      { label: 'Clearance',         href: '#' },
      { label: 'bKash Offers',      href: '#' },
    ],
  },
  {
    label: 'Baby Care',
    href: '#',
    highlight: false,
  },
  {
    label: 'Combo',
    href: '#',
    highlight: false,
  },
  {
    label: 'Makeup',
    href: '#',
    highlight: false,
    children: [
      { label: 'Foundation',        href: '#' },
      { label: 'Lipstick & Tints',  href: '#' },
      { label: 'Eye Makeup',        href: '#' },
      { label: 'Blush & Highlighter',href: '#' },
    ],
  },
  {
    label: 'Doctor Cosmetics',
    href: '#',
    highlight: false,
    children: [
      { label: 'Dermatologist Picks',href: '#' },
      { label: 'Acne & Blemish',    href: '#' },
      { label: 'Sensitive Skin',    href: '#' },
      { label: 'Anti-Aging',        href: '#' },
    ],
  },
  {
    label: 'Travel Kit',
    href: '#',
    highlight: false,
  },
  {
    label: 'More',
    href: '#',
    highlight: false,
    children: [
      { label: 'Fragrances',        href: '#' },
      { label: 'Wellness',          href: '#' },
      { label: 'Accessories',       href: '#' },
      { label: 'Gift Sets',         href: '#' },
    ],
  },
]

function DropdownMenu({ items }) {
  return (
    <div className="absolute top-full left-0 z-50 mt-0 min-w-[180px] bg-white rounded-b-xl rounded-tr-xl shadow-xl border border-gray-100 py-1.5 animate-fadeIn">
      {items.map(item => (
        <a
          key={item.label}
          href={item.href}
          className="flex items-center justify-between px-4 py-2 text-sm text-gray-700
            hover:bg-[#FDF0F4] hover:text-[#D4527A] transition group"
        >
          <span>{item.label}</span>
          <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition text-[#D4527A]" />
        </a>
      ))}
    </div>
  )
}

export default function KireiNav() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navRef = useRef(null)

  // Close dropdown on outside click
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
      {/* Desktop: horizontal scroll nav */}
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
                <a
                  href={item.href}
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
                </a>

                {/* Dropdown */}
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
