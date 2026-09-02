import React from 'react'
import { ArrowRight, Lightbulb, Youtube, Users, MessageCircle, BookOpen, Star, Heart } from 'lucide-react'

const discoverCards = [
  {
    id: 1,
    icon: Lightbulb,
    emoji: '💡',
    title: 'Beauty Tips',
    description: 'Expert-curated skincare routines, ingredient guides and seasonal care advice tailored for Bangladesh\'s climate.',
    cta: 'Read Tips',
    color: '#FFF3E0',
    accent: '#D97706',
    count: '200+ articles',
  },
  {
    id: 2,
    icon: Youtube,
    emoji: '▶️',
    title: 'KireiTube',
    description: 'Watch tutorials, product reviews and dermatologist Q&As. Learn the right way to apply your skincare.',
    cta: 'Watch Now',
    color: '#FEF2F2',
    accent: '#DC2626',
    count: '50+ videos',
  },
  {
    id: 3,
    icon: Users,
    emoji: '👯',
    title: 'Kirei Community',
    description: 'Join thousands of beauty enthusiasts sharing reviews, routines and honest product experiences.',
    cta: 'Join Community',
    color: '#F5F3FF',
    accent: '#7C3AED',
    count: '12,000+ members',
  },
  {
    id: 4,
    icon: MessageCircle,
    emoji: '🩺',
    title: 'Ask The Expert',
    description: 'Get personalised skincare advice from our in-house dermatologists and licensed beauty consultants.',
    cta: 'Ask Now',
    color: '#F0FDF4',
    accent: '#059669',
    count: 'Free consultation',
  },
  {
    id: 5,
    icon: BookOpen,
    emoji: '📖',
    title: 'Blogs',
    description: 'Dive deep into J-Beauty philosophy, K-Beauty trends, ingredient science and sustainable beauty.',
    cta: 'Explore Blogs',
    color: '#FDF8F5',
    accent: '#D4527A',
    count: '150+ posts',
  },
  {
    id: 6,
    icon: Star,
    emoji: '⭐',
    title: 'Testimonials',
    description: 'Real stories from real customers. See how Kirei has transformed skincare routines across Bangladesh.',
    cta: 'Read Stories',
    color: '#FFFBEB',
    accent: '#C9A96E',
    count: '3,200+ reviews',
  },
]

function DiscoverCard({ card }) {
  const Icon = card.icon
  return (
    <div
      className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm
        hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Top colour strip */}
      <div className="h-1.5 w-full" style={{ backgroundColor: card.accent }} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
          style={{ backgroundColor: card.color }}>
          {card.emoji}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900">{card.title}</h3>
            <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: card.color, color: card.accent }}>
              {card.count}
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
        </div>

        {/* CTA */}
        <a
          href="#"
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold
            group-hover:gap-2.5 transition-all duration-200"
          style={{ color: card.accent }}
        >
          {card.cta} <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}

export default function DiscoverKirei() {
  return (
    <section className="bg-[#FDF8F5] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#D4527A] tracking-widest uppercase mb-2 flex items-center justify-center gap-1.5">
            <Heart size={12} className="fill-[#D4527A] text-[#D4527A]" />
            More from Kirei
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">
            Discover Kirei
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            Beauty goes beyond products. Learn, connect and get expert guidance through the Kirei ecosystem.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {discoverCards.map(card => (
            <DiscoverCard key={card.id} card={card} />
          ))}
        </div>

        {/* J-Beauty community CTA banner */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#D4527A] via-[#E8A4B8] to-[#C9A96E]
          p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-lg md:text-xl">
              🌸 Join the J-Beauty Users Group
            </p>
            <p className="text-white/80 text-sm mt-1 max-w-md">
              An exclusive community for Japanese beauty enthusiasts in Bangladesh. Early access, members-only deals and expert Q&As.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 bg-white text-[#D4527A] font-bold text-sm px-6 py-3
              rounded-full hover:bg-pink-50 transition shadow flex items-center gap-2"
          >
            <Users size={15} />
            Join Free
          </a>
        </div>
      </div>
    </section>
  )
}
