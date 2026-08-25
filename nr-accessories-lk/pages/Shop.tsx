import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRightIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/ProductCard'
import { FilterPanel } from '../components/FilterPanel'
import { bestSellers, flashDeals } from '../data/catalog'

const ACTIVE_FILTERS = ['Chargers', 'Anker', 'In stock']

export function Shop() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const products = [...flashDeals, ...bestSellers]

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-4 sm:py-6 lg:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-ink-faint">
        <Link to="/" className="hover:text-brand-700">
          Home
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-ink">Chargers &amp; Adapters</span>
      </nav>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Chargers &amp; Adapters
          </h1>
          <p className="mt-1 text-[13px] text-ink-soft">233 products · 15 brands</p>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          {ACTIVE_FILTERS.map((filter) => (
            <span
              key={filter}
              className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-[12px] font-semibold text-brand-800"
            >
              {filter}
              <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          ))}
        </div>
      </header>

      <div className="mt-5 grid gap-6 lg:grid-cols-[248px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-40 rounded-2xl border border-line bg-white p-5">
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <h2 className="font-display text-sm font-bold text-ink">Filters</h2>
              <button type="button" className="text-[12px] font-semibold text-brand-700">
                Clear all
              </button>
            </div>
            <FilterPanel />
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
              <span className="rounded-full bg-brand-700 px-1.5 text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <p className="hidden text-[13px] text-ink-soft lg:block">Showing 1–15 of 233</p>
            <label className="ml-auto flex items-center gap-2 text-[12px] text-ink-soft">
              <span className="hidden sm:inline">Sort by</span>
              <select className="h-10 rounded-xl border border-line-strong bg-white px-2.5 text-[13px] font-medium text-ink focus:border-brand-600 focus:outline-none">
                <option>Most popular</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
                <option>Newest first</option>
              </select>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <nav
            aria-label="Pagination"
            className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <Button variant="secondary" size="sm">
              Prev
            </Button>
            {[1, 2, 3, 16].map((page) => (
              <button
                key={page}
                type="button"
                aria-current={page === 1 ? 'page' : undefined}
                className={`h-9 w-9 rounded-xl text-[13px] font-semibold transition-colors duration-150 ease-soft ${
                  page === 1
                    ? 'bg-brand-700 text-white'
                    : 'border border-line-strong bg-white text-ink hover:border-brand-600'
                }`}
              >
                {page}
              </button>
            ))}
            <Button variant="secondary" size="sm">
              Next
            </Button>
          </nav>
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
                <FilterPanel idPrefix="mobile" />
              </div>
              <div className="flex gap-2 border-t border-line px-4 py-3">
                <Button variant="secondary" fullWidth onClick={() => setFiltersOpen(false)}>
                  Clear all
                </Button>
                <Button fullWidth onClick={() => setFiltersOpen(false)}>
                  Show 233 results
                </Button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
