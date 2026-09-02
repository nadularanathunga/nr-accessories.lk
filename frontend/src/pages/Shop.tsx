import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRightIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/ProductCard'
import { FilterPanel, PRICE_BUCKETS, type CategoryOption } from '../components/FilterPanel'
import { fetchRawProducts, fetchCategories, toCatalogProduct, type ApiProduct } from '../data/api'

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'newest'

export function Shop() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('c') || null
  const brandParam = searchParams.get('brand') || null

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [rawProducts, setRawProducts] = useState<ApiProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(brandParam)
  const [selectedPriceBucket, setSelectedPriceBucket] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('popular')

  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])
  
  useEffect(() => {
    setSelectedBrand(brandParam)
  }, [brandParam])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const [products, cats] = await Promise.all([
          fetchRawProducts({ limit: '100' }),
          fetchCategories(),
        ])
        if (cancelled) return
        setRawProducts(products)
        setCategories(cats.map((c) => ({ slug: c.slug, name: c.name, count: c.count })))
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const brands = useMemo(
    () => Array.from(new Set(rawProducts.map((p) => p.brand))).sort(),
    [rawProducts],
  )

  const filtered = useMemo(() => {
    let list = rawProducts

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q))
    }
    if (selectedCategory) {
      list = list.filter((p) => {
        const slug = typeof p.category === 'object' && p.category ? p.category.slug : p.category
        return slug === selectedCategory
      })
    }
    if (selectedBrand) {
      list = list.filter((p) => p.brand === selectedBrand)
    }
    if (selectedPriceBucket !== null) {
      const bucket = PRICE_BUCKETS[selectedPriceBucket]
      list = list.filter((p) => {
        const price = p.discountPrice ?? p.price
        return price >= bucket.min && (bucket.max === null || price <= bucket.max)
      })
    }

    const sorted = [...list]
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price))
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => (a.createdAt ?? '') < (b.createdAt ?? '') ? 1 : -1)
    }
    // 'popular' — keep the order the API returned

    return sorted
  }, [rawProducts, query, selectedCategory, selectedBrand, selectedPriceBucket, sortBy])

  const products = filtered.map(toCatalogProduct)

  const activeChips: { label: string; onClear: () => void }[] = []
  if (selectedCategory) {
    const cat = categories.find((c) => c.slug === selectedCategory)
    if (cat) activeChips.push({ label: cat.name, onClear: () => setSelectedCategory(null) })
  }
  if (selectedBrand) {
    activeChips.push({ label: selectedBrand, onClear: () => setSelectedBrand(null) })
  }
  if (selectedPriceBucket !== null) {
    activeChips.push({
      label: PRICE_BUCKETS[selectedPriceBucket].label,
      onClear: () => setSelectedPriceBucket(null),
    })
  }

  function clearAll() {
    setSelectedCategory(null)
    setSelectedBrand(null)
    setSelectedPriceBucket(null)
  }

  const filterPanelProps = {
    categories,
    brands,
    selectedCategory,
    selectedBrand,
    selectedPriceBucket,
    onCategoryChange: setSelectedCategory,
    onBrandChange: setSelectedBrand,
    onPriceBucketChange: setSelectedPriceBucket,
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-4 sm:py-6 lg:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-ink-faint">
        <Link to="/" className="hover:text-brand-700">
          Home
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-ink">Shop</span>
      </nav>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {query ? `Search results for "${query}"` : 'All products'}
          </h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            {loading ? 'Loading…' : `${products.length} product${products.length === 1 ? '' : 's'}`}
          </p>
        </div>
        {activeChips.length > 0 && (
          <div className="hidden items-center gap-2 lg:flex">
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.onClear}
                className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[12px] font-semibold text-brand-800"
              >
                {chip.label}
                <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="mt-5 grid gap-6 lg:grid-cols-[248px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-40 rounded-2xl border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <h2 className="font-display text-sm font-bold text-ink">Filters</h2>
              <button type="button" onClick={clearAll} className="text-[12px] font-semibold text-brand-700">
                Clear all
              </button>
            </div>
            <FilterPanel idPrefix="desktop" {...filterPanelProps} />
          </div>
        </aside>

        <section aria-label="Products">
          <div className="sticky top-[68px] z-20 -mx-4 flex items-center gap-2 border-y border-line bg-canvas/95 px-4 py-2.5 backdrop-blur lg:static lg:mx-0 lg:rounded-xl lg:border lg:bg-white lg:px-4">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-line-strong bg-white px-3 py-2 text-[13px] font-semibold text-ink lg:hidden"
            >
              <SlidersHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              Filters
              {activeChips.length > 0 && (
                <span className="rounded-full bg-brand-700 px-1.5 text-[10px] font-bold text-white">
                  {activeChips.length}
                </span>
              )}
            </button>
            <p className="hidden text-[13px] text-ink-soft lg:block">
              {loading ? 'Loading…' : `Showing ${products.length} of ${rawProducts.length}`}
            </p>
            <label className="ml-auto flex items-center gap-2 text-[12px] text-ink-soft">
              <span className="hidden sm:inline">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-10 rounded-xl border border-line-strong bg-white px-2.5 text-[13px] font-medium text-ink focus:border-brand-600 focus:outline-none"
              >
                <option value="popular">Most popular</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="newest">Newest first</option>
              </select>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {loading && <p className="col-span-full text-sm text-ink-soft">Loading products…</p>}
            {error && <p className="col-span-full text-sm text-red-600">{error}</p>}
            {!loading && !error && products.length === 0 && (
              <p className="col-span-full text-sm text-ink-soft">No products match these filters.</p>
            )}
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {filtersOpen ? (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
          >
            <motion.button
              type="button"
              aria-label="Close filters"
              onClick={() => setFiltersOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 h-full w-full bg-ink/40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-white"
            >
              <div className="flex items-center justify-between border-b border-line px-4 py-4">
                <h2 className="font-display text-base font-bold text-ink">Filters</h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft"
                >
                  <XIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-5">
                <FilterPanel idPrefix="mobile" {...filterPanelProps} />
              </div>
              <div className="flex gap-2 border-t border-line px-4 py-3">
                <Button variant="secondary" fullWidth onClick={() => { clearAll(); setFiltersOpen(false) }}>
                  Clear all
                </Button>
                <Button fullWidth onClick={() => setFiltersOpen(false)}>
                  Show {products.length} results
                </Button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}