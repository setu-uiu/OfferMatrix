import React from 'react'
import { Zap, Tag, RotateCcw, TrendingDown, Gift } from 'lucide-react'

const variants = {
  cashback: {
    icon: RotateCcw,
    base: 'bg-green-100 text-green-700 border border-green-200',
  },
  coupon: {
    icon: Tag,
    base: 'bg-violet-100 text-violet-700 border border-violet-200',
  },
  deal: {
    icon: Zap,
    base: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  drop: {
    icon: TrendingDown,
    base: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  gift: {
    icon: Gift,
    base: 'bg-pink-100 text-pink-700 border border-pink-200',
  },
}

export default function DealBadge({ type = 'deal', label, size = 'sm' }) {
  const v = variants[type] || variants.deal
  const Icon = v.icon
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-xs'
  const iconSize = size === 'xs' ? 10 : 12
  const padding  = size === 'xs' ? 'px-1.5 py-0.5' : 'px-2 py-1'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${textSize} ${padding} ${v.base}`}>
      <Icon size={iconSize} />
      {label}
    </span>
  )
}
