import React from 'react'

export type CategoryOption = { slug: string; name: string; count: number }

const PRICE_BUCKETS: { label: string; min: number; max: number | null }[] = [
  { label: 'Under Rs 2,000', min: 0, max: 2000 },
  { label: 'Rs 2,000 – 5,000', min: 2000, max: 5000 },
  { label: 'Rs 5,000 – 10,000', min: 5000, max: 10000 },
  { label: 'Above Rs 10,000', min: 10000, max: null },
]

export { PRICE_BUCKETS }

type FilterPanelProps = {
  idPrefix?: string
  categories: CategoryOption[]
  brands: string[]
  selectedCategory: string | null
  selectedBrand: string | null
  selectedPriceBucket: number | null
  onCategoryChange: (slug: string | null) => void
  onBrandChange: (brand: string | null) => void
  onPriceBucketChange: (index: number | null) => void
}

export function FilterPanel({
  idPrefix = 'desktop',
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedPriceBucket,
  onCategoryChange,
  onBrandChange,
  onPriceBucketChange,
}: FilterPanelProps) {
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="font-display text-sm font-bold text-ink">Category</legend>
        <div className="mt-3 space-y-2.5">
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex items-center justify-between gap-2 text-[13px] text-ink-soft"
            >
              <span className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  name={`${idPrefix}-category`}
                  checked={selectedCategory === category.slug}
                  onChange={() =>
                    onCategoryChange(selectedCategory === category.slug ? null : category.slug)
                  }
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
          {PRICE_BUCKETS.map((bucket, index) => (
            <label key={bucket.label} className="flex items-center gap-2.5 text-[13px] text-ink-soft">
              <input
                type="radio"
                name={`${idPrefix}-price`}
                checked={selectedPriceBucket === index}
                onChange={() => onPriceBucketChange(selectedPriceBucket === index ? null : index)}
                className="h-4 w-4 border-line-strong accent-brand-700"
              />
              {bucket.label}
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
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ease-soft ${
                selectedBrand === brand
                  ? 'border-brand-700 bg-brand-50 text-brand-800'
                  : 'border-line-strong text-ink-soft hover:border-brand-600 hover:text-brand-700'
              }`}
            >
              <input
                type="checkbox"
                name={`${idPrefix}-brand`}
                checked={selectedBrand === brand}
                onChange={() => onBrandChange(selectedBrand === brand ? null : brand)}
                className="sr-only"
              />
              {brand}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}