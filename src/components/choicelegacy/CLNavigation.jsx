import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Flame } from 'lucide-react'
import { navCategories } from '../../data/choiceLegacyData'

const CL = {
  primary:  '#1A0A2E',
  gold:     '#C9A96E',
  accent:   '#9B1D6A',
  surface:  '#FAF7F2',
  border:   '#E8E0D5',
}

// Map each nav label to a React Router path
function toPath(label) {
  const map = {
    'Home':               '/choice-legacy',
    'Skincare':           '/search?q=Skincare',
    'Haircare':           '/search?q=Haircare',
    'Body Care':          '/search?q=Body+Care',
    'Makeup':             '/search?q=Makeup',
    'Intimate & Hygiene': '/search?q=Hygiene',
    'Beauty Tools':       '/search?q=Beauty+Tools',
    'Offers':             '/coupons',
    // child items
    'Moisturizers':       '/search?q=moisturizer',
    'Serums':             '/search?q=serum',
    'Sunscreen':          '/search?q=sunscreen',
    'Face Wash':          '/search?q=face+wash',
    'Toners':             '/search?q=toner',
    'Eye Cream':          '/search?q=eye+cream',
    'Shampoo':            '/search?q=shampoo',
    'Conditioner':        '/search?q=conditioner',
    'Hair Oil':           '/search?q=hair+oil',
    'Hair Mask':          '/search?q=hair+mask',
    'Body Lotion':        '/search?q=body+lotion',
    'Body Wash':          '/search?q=body+wash',
    'Scrubs':             '/search?q=scrub',
    'Foundation':         '/search?q=foundation',
    'Lipstick':           '/search?q=lipstick',
    'Eye Makeup':         '/search?q=eye+makeup',
    'Blush':              '/search?q=blush',
    'Sanitary Pads':      '/search?q=sanitary',
    'Intimate Wash':      '/search?q=intimate',
    'Flash Sale':         '/coupons',
    'Bundle Deals':       '/coupons',
    'bKash Cashback':     '/cashback',
    'Nagad Offers':       '/cashback',
  }
  return map[label] || `/search?q=${encodeURIComponent(label)}`
}

function DropdownPanel({ items, alignRight = false }) {
  return (
    <div
      className="absolute top-full z-50 min-w-[200px] bg-white rounded-b-xl shadow-xl py-2 border-t-2"
      style={{
        left: alignRight ? 'auto' : 0,
        right: alignRight ? 0 : 'auto',
        borderTopColor: CL.gold,
        borderLeft:   `1px solid ${CL.border}`,
        borderRight:  `1px solid ${CL.border}`,
        borderBottom: `1px solid ${CL.border}`,
      }}
    >
      {items.map(item => (
        <Link
          key={item}
          to={toPath(item)}
          className="flex items-center justify-between px-4 py-2 text-sm transition group"
          style={{ color: CL.primary }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#F5EFF9'
            e.currentTarget.style.color = CL.accent
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = CL.primary
          }}
        >
          {item}
          <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition"
            style={{ color: CL.accent }} />
        </Link>
      ))}
    </div>
  )
}

export default function CLNavigation() {
  const [activeItem, setActiveItem] = useState(null)
  const navRef = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (navRef.current && !navRef.current.contains(e.target)) setActiveItem(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <nav
      ref={navRef}
      className="hidden md:block border-b"
      style={{ backgroundColor: CL.primary, borderColor: '#2D1654' }}
      aria-label="Choice Legacy navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {navCategories.map(item => {
            const isActive    = activeItem === item.label
            const hasChildren = item.children?.length > 0

            return (
              <li
                key={item.label}
                className="relative shrink-0"
                onMouseEnter={() => hasChildren && setActiveItem(item.label)}
                onMouseLeave={() => setActiveItem(null)}
              >
                <Link
                  to={toPath(item.label)}
                  onClick={() => setActiveItem(null)}
                  className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2"
                  style={{
                    color: isActive
                      ? CL.gold
                      : item.highlight
                        ? '#F4C97A'
                        : '#D4C5E2',
                    borderBottomColor: isActive ? CL.gold : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.color = CL.gold
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.color = item.highlight ? '#F4C97A' : '#D4C5E2'
                  }}
                >
                  {item.label === 'Offers' && (
                    <Flame size={13} className="text-orange-400 fill-orange-300" />
                  )}
                  {item.label}
                  {hasChildren && (
                    <ChevronDown
                      size={12}
                      className="opacity-60 transition-transform duration-200"
                      style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0)' }}
                    />
                  )}
                </Link>

                {hasChildren && isActive && (
                  <DropdownPanel
                    items={item.children}
                    alignRight={['Beauty Tools', 'Offers'].includes(item.label)}
                  />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
