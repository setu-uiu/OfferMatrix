import React from 'react'
import { Link } from 'react-router-dom'

/**
 * OfferMatrix brand logo — matches the design shown in the app screenshot:
 *  • Pink/coral rounded square icon containing a white "%" symbol
 *  • "Offer" in bold dark text + "Matrix" in bold pink/coral text
 *
 * Props:
 *  size    — 'sm' | 'md' | 'lg'  (default 'md')
 *  theme   — 'light' | 'dark'    (dark = white "Offer" text, for dark backgrounds)
 *  asLink  — bool, wraps in <Link to="/">  (default true)
 *  onClick — optional click handler
 */
export default function OfferMatrixLogo({
  size = 'md',
  theme = 'dark',
  asLink = true,
  onClick,
}) {
  const sizes = {
    sm: { icon: 'w-7 h-7 rounded-lg text-sm',  wordmark: 'text-base' },
    md: { icon: 'w-8 h-8 rounded-xl text-base', wordmark: 'text-lg'  },
    lg: { icon: 'w-10 h-10 rounded-xl text-lg', wordmark: 'text-xl'  },
  }
  const s = sizes[size] || sizes.md

  const offerColor = theme === 'dark' ? 'text-white'      : 'text-[#1A1A2E]'
  const matrixColor                   = 'text-[#F02D7D]'  // brand pink — same as the % icon bg

  const mark = (
    <div className="flex items-center gap-2 select-none" onClick={onClick}>
      {/* % icon square */}
      <div
        className={`${s.icon} bg-[#F02D7D] flex items-center justify-center shadow-sm shrink-0`}
      >
        <span className="text-white font-black leading-none" style={{ fontFamily: 'Inter, sans-serif' }}>
          %
        </span>
      </div>

      {/* Wordmark */}
      <span className={`font-extrabold ${s.wordmark} leading-none tracking-tight`}>
        <span className={offerColor}>Offer</span>
        <span className={matrixColor}>Matrix</span>
      </span>
    </div>
  )

  if (!asLink) return mark

  return (
    <Link to="/" aria-label="OfferMatrix home">
      {mark}
    </Link>
  )
}
