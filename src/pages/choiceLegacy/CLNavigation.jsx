import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronRight, Flame } from 'lucide-react'
import { navCategories } from '../../data/choiceLegacyData'

const CL = {
  primary:  '#1A0A2E',
  gold:     '#C9A96E',
  accent:   '#9B1D6A',
  surface:  '#FAF7F2',
  border:   '#E8E0D5',
}

function DropdownPanel({ items, alignRight = false }) {
  return (
    <div
      className="absolute top-full z-50 min-w-[200px] bg-white rounded-b-xl
        shadow-xl py-2 border-t-2"
      style={{
        left: alignRight ? 'auto' : 0,
        right: alignRight ? 0 : 'auto',
        borderTopColor: CL.gold,
        borderLeft: `1px solid ${CL.border}`,
        borderRight: `1px solid ${CL.border}`,
        borderBottom: `1px solid ${CL.border}`,
      }}
    >
      {items.map(item => (
        <a
          key={item}
          href="#"
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
        </a>
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
            const isActive  = activeItem === item.label
            const hasChildren = item.children?.length > 0

            return (
              <li
                key={item.label}
                className="relative shrink-0"
                onMouseEnter={() => hasChildren && setActiveItem(item.label)}
                onMouseLeave={() => setActiveItem(null)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium
                    whitespace-nowrap transition-colors border-b-2"
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
                </a>

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
