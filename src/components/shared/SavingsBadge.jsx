import React from 'react'
import { TrendingDown } from 'lucide-react'

export default function SavingsBadge({ amount, className = '' }) {
  if (!amount || amount <= 0) return null
  return (
    <span className={`inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ${className}`}>
      <TrendingDown size={11} />
      Save ৳{amount.toLocaleString()}
    </span>
  )
}
