import React from 'react'
import { brands, categories } from '../data/catalog'

const PRICE_BUCKETS = ['Under Rs 2,000', 'Rs 2,000 – 5,000', 'Rs 5,000 – 10,000', 'Above Rs 10,000']

export function FilterPanel({ idPrefix = 'desktop' }: { idPrefix?: string }) {
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="font-display text-sm font-bold text-ink">Category</legend>
        <div className="mt-3 space-y-2.5">
          {categories.slice(0, 6).map((category) => (
            <label
              key={category.slug}
              className="flex items-center justify-between gap-2 text-[13px] text-ink-soft"
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  name={`${idPrefix}-category`}
                  className="h-4 w-4 rounded border-line-strong accent-brand-700"
                />
                {category.name}
              </span>
              <span className="text-[11px] text-ink-faint">{category.count}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-t border-line pt-5">
        <legend className="font-display text-sm font-bold text-ink">Price</legend>
        <div className="mt-3 space-y-2.5">
          {PRICE_BUCKETS.map((bucket) => (
            <label key={bucket} className="flex items-center gap-2.5 text-[13px] text-ink-soft">
              <input
                type="radio"
                name={`${idPrefix}-price`}
                className="h-4 w-4 border-line-strong accent-brand-700"
              />
              {bucket}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-t border-line pt-5">
        <legend className="font-display text-sm font-bold text-ink">Brand</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="cursor-pointer rounded-full border border-line-strong px-3 py-1.5 text-[12px] font-medium text-ink-soft transition-colors duration-150 ease-soft hover:border-brand-600 hover:text-brand-700"
            >
              <input type="checkbox" name={`${idPrefix}-brand`} className="sr-only" />
              {brand}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-t border-line pt-5">
        <legend className="font-display text-sm font-bold text-ink">Availability</legend>
        <div className="mt-3 space-y-2.5">
          {['In stock', 'On sale', 'Free delivery'].map((option) => (
            <label key={option} className="flex items-center gap-2.5 text-[13px] text-ink-soft">
              <input
                type="checkbox"
                name={`${idPrefix}-availability`}
                className="h-4 w-4 rounded border-line-strong accent-brand-700"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
