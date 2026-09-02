import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube,
  ArrowRight, Shield, Truck, RotateCcw,
} from 'lucide-react'
import OfferMatrixLogo from "../../../components/shared/OfferMatrixLogo.jsx";

const footerColumns = [
  {
    heading: 'KIREI',
    links: [
      { label: 'About Kirei',         href: '#' },
      { label: 'Our Story',           href: '#' },
      { label: 'Dermatologist Team',  href: '#' },
      { label: 'Sustainability',      href: '#' },
      { label: 'Press & Media',       href: '#' },
      { label: 'Careers',             href: '#' },
    ],
  },
  {
    heading: 'CUSTOMER SERVICE',
    links: [
      { label: 'FAQ',                 href: '#' },
      { label: 'Shipping Policy',     href: '#' },
      { label: 'Returns & Exchanges', href: '#' },
      { label: 'Track Your Order',    href: '#' },
      { label: 'Payment Methods',     href: '#' },
      { label: 'Contact Us',          href: '#' },
    ],
  },
  {
    heading: 'MORE INFORMATION',
    links: [
      { label: 'Privacy Policy',      href: '#' },
      { label: 'Terms of Service',    href: '#' },
      { label: 'Cookie Policy',       href: '#' },
      { label: 'Authenticity Guarantee', href: '#' },
      { label: 'Seller Information',  href: '#' },
      { label: 'Sitemap',             href: '#' },
    ],
  },
  {
    heading: 'BEAUTY HUB',
    links: [
      { label: 'Beauty Tips',         href: '#' },
      { label: 'KireiTube',           href: '#' },
      { label: 'Blogs',               href: '#' },
      { label: 'Testimonials',        href: '#' },
      { label: 'Community',           href: '#' },
      { label: 'Ask The Expert',      href: '#' },
    ],
  },
]

const trustBadges = [
  { icon: Shield, label: '100% Authentic' },
  { icon: Truck,  label: 'Fast Delivery'  },
  { icon: RotateCcw, label: 'Easy Returns' },
  { icon: Heart,  label: 'Dermatologist Approved' },
]

const socialLinks = [
  { icon: Facebook,  href: '#', label: 'Facebook',  color: 'hover:bg-[#1877F2]' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-[#F58529] hover:to-[#DD2A7B]' },
  { icon: Youtube,   href: '#', label: 'YouTube',   color: 'hover:bg-[#FF0000]' },
]

export default function KireiFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-[#2C2C2C] text-gray-300">

      {/* Trust strip */}
      <div className="bg-[#D4527A]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 text-white text-sm font-medium">
                <Icon size={16} className="shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-[#1A1A2E] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-white font-bold text-lg font-serif">Stay Beautiful with Kirei</p>
              <p className="text-gray-400 text-sm mt-1">
                Subscribe for exclusive deals, J-Beauty launches and expert skincare tips.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                <Heart size={16} className="fill-green-400" />
                Thank you for subscribing! 🌸
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 md:w-72 px-4 py-2.5 rounded-full bg-white/10 border border-white/20
                    text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#E8A4B8] transition"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-[#D4527A] hover:bg-[#b8416a] text-white font-bold text-sm
                    px-5 py-2.5 rounded-full transition flex items-center gap-1.5"
                >
                  Subscribe <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8A4B8] to-[#D4527A]
                flex items-center justify-center shadow">
                <span className="text-white font-bold text-base font-serif italic">K</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-white font-serif">Kirei</span>
                <span className="block text-[9px] text-[#E8A4B8] tracking-[0.15em] uppercase">Authentic Beauty</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Your reliable care partner for authentic beauty. Personalized skincare and wellness solutions for every Bangladeshi woman.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2 mb-5">
              {[
                { icon: Phone,  text: '+880 1700-000000' },
                { icon: Mail,   text: 'support@kireibd.com' },
                { icon: MapPin, text: 'Dhaka, Bangladesh' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                  <Icon size={12} className="text-[#E8A4B8] shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                    text-gray-300 hover:text-white transition ${color}`}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map(col => (
            <div key={col.heading}>
              <h4 className="text-white text-xs font-bold tracking-widest mb-4 uppercase">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-gray-400 hover:text-[#E8A4B8] transition flex items-center gap-1 group"
                    >
                      <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition text-[#E8A4B8]" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 Kirei Bangladesh. All rights reserved.</p>

          {/* OfferMatrix attribution */}
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
            <span className="text-gray-400 text-xs">Price intelligence powered by</span>
            <OfferMatrixLogo size="sm" theme="dark" />
          </div>

          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms</a>
            <a href="#" className="hover:text-gray-300 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
