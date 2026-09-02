import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, Mail, Phone, MapPin,
  Facebook, Instagram, Youtube,
  ArrowRight, Shield, Truck, RotateCcw, Star,
} from 'lucide-react'
import OfferMatrixLogo from '../shared/OfferMatrixLogo'

const CL = {
  primary: '#1A0A2E',
  dark:    '#0D0618',
  gold:    '#C9A96E',
  accent:  '#9B1D6A',
  muted:   '#6B5E7A',
  border:  '#2D1654',
}

const columns = [
  {
    heading: 'CHOICE LEGACY',
    links: [
      'About Us',
      'Our Story',
      'Authenticity Promise',
      'Sustainability',
      'Press & Media',
      'Careers',
    ],
  },
  {
    heading: 'CUSTOMER SERVICE',
    links: [
      'FAQ',
      'Shipping Policy',
      'Returns & Exchanges',
      'Track Your Order',
      'Payment Methods',
      'Contact Us',
    ],
  },
  {
    heading: 'MORE INFORMATION',
    links: [
      'Privacy Policy',
      'Terms of Service',
      'Cookie Policy',
      'Authenticity Guarantee',
      'Seller Information',
      'Sitemap',
    ],
  },
  {
    heading: 'DISCOVER',
    links: [
      'Beauty Blog',
      'Skincare Guide',
      'Hair Care Tips',
      'Community',
      'Expert Picks',
      'Testimonials',
    ],
  },
]

const trustItems = [
  { icon: Shield, label: '100% Authentic'       },
  { icon: Truck,  label: 'Free Nationwide Delivery' },
  { icon: RotateCcw, label: 'Easy Returns'      },
  { icon: Star,   label: 'Premium Quality'       },
]

const socials = [
  { icon: Facebook,  label: 'Facebook',  href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube,   label: 'YouTube',   href: '#' },
]

export default function CLFooter() {
  const [email,      setEmail]      = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (email.trim()) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer style={{ backgroundColor: CL.dark, color: '#C4B5D4' }}>

      {/* ── Trust strip ─────────────────────────────────────── */}
      <div style={{ backgroundColor: CL.accent }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label}
                className="flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-medium">
                <Icon size={14} className="shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <div style={{ backgroundColor: CL.primary, borderBottom: `1px solid ${CL.border}` }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <p className="font-bold text-lg"
                style={{ color: '#FAF7F2', fontFamily: '"Playfair Display", Georgia, serif' }}>
                Be the First to Know
              </p>
              <p className="text-sm mt-1" style={{ color: CL.muted }}>
                Exclusive deals, new arrivals and expert beauty tips — straight to your inbox.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: CL.gold }}>
                <Heart size={15} className="fill-current" />
                Thank you for subscribing! 👑
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-lg text-sm bg-white/8
                    placeholder-gray-500 focus:outline-none transition"
                  style={{
                    border: `1px solid ${CL.border}`,
                    color: '#FAF7F2',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                  }}
                  onFocus={e  => (e.target.style.borderColor = CL.gold)}
                  onBlur={e   => (e.target.style.borderColor = CL.border)}
                />
                <button
                  type="submit"
                  className="shrink-0 text-white font-bold text-sm px-5 py-2.5
                    rounded-lg flex items-center gap-1.5 transition hover:opacity-90"
                  style={{ backgroundColor: CL.gold, color: CL.dark }}
                >
                  Subscribe <ArrowRight size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            {/* Logo mark */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
                style={{ background: `linear-gradient(135deg, ${CL.accent}, #6B0F4A)` }}>
                <span className="text-lg" style={{ color: CL.gold }}>👑</span>
              </div>
              <div className="leading-none">
                <span className="block font-extrabold text-lg tracking-wide"
                  style={{
                    color: '#FAF7F2',
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}>Choice</span>
                <span className="block font-semibold tracking-[0.18em] uppercase"
                  style={{ fontSize: '0.58rem', color: CL.gold }}>Legacy</span>
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-4" style={{ color: CL.muted }}>
              Your trusted destination for premium, 100% authentic personal care products
              across Bangladesh.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2 mb-5">
              {[
                { icon: Phone,  text: '+880 1800-000000'       },
                { icon: Mail,   text: 'hello@choicelegacy.com' },
                { icon: MapPin, text: 'Dhaka, Bangladesh'       },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs"
                  style={{ color: CL.muted }}>
                  <Icon size={11} style={{ color: CL.gold }} className="shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition"
                  style={{
                    border: `1px solid ${CL.border}`,
                    color: CL.muted,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = CL.accent
                    e.currentTarget.style.borderColor = CL.accent
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = CL.border
                    e.currentTarget.style.color = CL.muted
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.heading}>
              <h4 className="text-xs font-bold tracking-[0.15em] mb-4 uppercase"
                style={{ color: CL.gold }}>
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs transition flex items-center gap-1 group"
                      style={{ color: CL.muted }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#FAF7F2')}
                      onMouseLeave={e => (e.currentTarget.style.color = CL.muted)}
                    >
                      <ArrowRight size={9}
                        className="opacity-0 group-hover:opacity-100 transition shrink-0"
                        style={{ color: CL.gold }} />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${CL.border}` }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row
          items-center justify-between gap-3 text-xs" style={{ color: CL.muted }}>
          <p>© 2026 Choice Legacy Bangladesh. All rights reserved.</p>

          {/* OfferMatrix attribution */}
          <div className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ border: `1px solid ${CL.border}`, backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <span style={{ color: CL.muted }}>Price intelligence by</span>
            <OfferMatrixLogo size="sm" theme="dark" />
          </div>

          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" className="transition hover:text-white"
                style={{ color: CL.muted }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
