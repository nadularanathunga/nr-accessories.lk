import React from 'react'
import { StarIcon } from 'lucide-react'

type StarRatingProps = {
  rating: number
  reviews?: number
  size?: 'sm' | 'md'
}

export function StarRating({ rating, reviews, size = 'sm' }: StarRatingProps) {
  const dimension = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'

  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            className={`${dimension} ${
              index < Math.round(rating) ? 'fill-sale text-sale' : 'text-line-strong'
            }`}
          />
        ))}
      </span>
      <span className={`${size === 'sm' ? 'text-[11px]' : 'text-xs'} text-ink-faint`}>
        {rating.toFixed(1)}
        {typeof reviews === 'number' ? ` (${reviews})` : ''}
        <span className="sr-only"> out of 5 stars</span>
      </span>
    </div>
  )
}
