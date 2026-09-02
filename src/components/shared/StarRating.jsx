import React from 'react'
import { Star } from 'lucide-react'

export default function StarRating({ rating, reviews, size = 14, showCount = true }) {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} size={size} className="text-amber-400 fill-amber-400" />
        ))}
        {half && (
          <span className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-gray-300 fill-gray-200" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={size} className="text-amber-400 fill-amber-400" />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} size={size} className="text-gray-300 fill-gray-200" />
        ))}
      </div>
      {showCount && reviews !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({reviews.toLocaleString()})</span>
      )}
    </div>
  )
}
