import React from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRightIcon,
  HeadphonesIcon,
  ShieldCheckIcon,
  TruckIcon,
  UndoIcon,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/ProductCard'
import { CategoryTile } from '../components/CategoryTile'
import { bestSellers, brands, categories, flashDeals, images } from '../data/catalog'

const SERVICE_POINTS = [
  { icon: TruckIcon, label: 'Islandwide delivery', detail: 'Free over Rs 7,500' },
  { icon: ShieldCheckIcon, label: '6-month warranty', detail: 'On all electronics' },
  { icon: UndoIcon, label: '7-day returns', detail: 'No-question exchange' },
  { icon: HeadphonesIcon, label: 'Real support', detail: '9am–7pm, every day' },
]

export function Home() {
  return (
    <main className="w-full">
      <div className="mx-auto max-w-[1280px] px-4 py-4 sm:py-6 lg:px-6">
        <section aria-label="Featured" className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <nav
            aria-label="All categories"
            className="hidden overflow-hidden rounded-2xl border border-line bg-white lg:block"
          >
            <h2 className="border-b border-line px-4 py-3 font-display text-sm font-bold text-ink">
              All categories
            </h2>
            <ul className="py-1">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to="/shop"
                    className="flex items-center justify-between gap-2 px-4 py-[9px] text-[13px] text-ink-soft transition-colors duration-150 ease-soft hover:bg-brand-50 hover:text-brand-800"
                  >
                    <span>{category.name}</span>
                    <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
            <div className="relative overflow-hidden rounded-2xl bg-brand-900">
              <img
                src={images.hero}
                alt="Phone chargers, cables, earbuds, case and power bank arranged on a teal surface"
                className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[400px]"
              />
              <div className="absolute inset-0 bg-brand-900/70 sm:bg-brand-900/60" />
              <div className="absolute inset-0 flex flex-col justify-center gap-3 p-5 sm:gap-4 sm:p-8 lg:p-10">
                <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                  New arrivals
                </span>
                <h1 className="max-w-sm font-display text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
                  Everything for your phone, in one place
                </h1>
                <p className="max-w-xs text-sm text-white/85 sm:max-w-sm sm:text-base">
                  Genuine chargers, cases and audio from Anker, Spigen, Baseus and more — with
                  warranty and same-day Colombo delivery.
                </p>
                <div className="mt-1 flex flex-wrap gap-2 sm:gap-3">
                  <Link to="/shop">
                    <Button size="lg">Shop now</Button>
                  </Link>
                  <Link
                    to="/shop"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/50 px-6 font-display text-sm font-semibold text-white transition-colors duration-150 ease-soft hover:bg-white/15 sm:h-14 sm:px-8 sm:text-base"
                  >
                    View deals
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <Link
                to="/shop"
                className="group relative overflow-hidden rounded-2xl border border-line bg-white"
              >
                <img
                  src={images.charger}
                  alt="Fast charger with braided cable"
                  className="h-32 w-full object-cover transition-transform duration-300 ease-soft group-hover:scale-105 xl:h-[186px]"
                />
                <div className="p-4">
                  <p className="font-display text-sm font-bold text-ink">Charging week</p>
                  <p className="mt-0.5 text-xs text-ink-soft">Up to 30% off adapters</p>
                </div>
              </Link>
              <Link
                to="/shop"
                className="group relative overflow-hidden rounded-2xl border border-line bg-white"
              >
                <img
                  src={images.promoAudio}
                  alt="Wireless earbuds case held beside a smartphone"
                  className="h-32 w-full object-cover transition-transform duration-300 ease-soft group-hover:scale-105 xl:h-[186px]"
                />
                <div className="p-4">
                  <p className="font-display text-sm font-bold text-ink">Audio bundle</p>
                  <p className="mt-0.5 text-xs text-ink-soft">Earbuds + case from Rs 13,900</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-label="Service promises"
          className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:mt-6 lg:grid-cols-4"
        >
          {SERVICE_POINTS.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-center gap-3 bg-white px-3 py-3.5 sm:px-5 sm:py-4">
              <Icon className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate font-display text-[13px] font-bold text-ink">{label}</p>
                <p className="truncate text-[11px] text-ink-soft sm:text-xs">{detail}</p>
              </div>
            </div>
          ))}
        </section>

        <section aria-labelledby="flash-deals" className="mt-10 sm:mt-14">
          <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
            <div>
              <h2
                id="flash-deals"
                className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl"
              >
                Flash deals
              </h2>
              <p className="mt-1 text-xs text-ink-soft sm:text-sm">
                Ends in <span className="font-semibold text-sale">04 : 12 : 39</span>
              </p>
            </div>
            <Link
              to="/shop"
              className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand-700"
            >
              See all
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
            {flashDeals.map((product) => (
              <div key={product.id} className="w-[58%] shrink-0 snap-start sm:w-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="categories" className="mt-10 sm:mt-14">
          <h2
            id="categories"
            className="mb-4 font-display text-xl font-extrabold tracking-tight text-ink sm:mb-5 sm:text-2xl"
          >
            Shop by category
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {categories.map((category) => (
              <CategoryTile key={category.slug} category={category} />
            ))}
          </div>
        </section>

        <section aria-labelledby="best-sellers" className="mt-10 sm:mt-14">
          <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
            <div>
              <h2
                id="best-sellers"
                className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl"
              >
                Best sellers
              </h2>
              <p className="mt-1 text-xs text-ink-soft sm:text-sm">
                Most ordered in the last 30 days
              </p>
            </div>
            <Link
              to="/shop"
              className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand-700"
            >
              See all
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section aria-labelledby="brands" className="mt-10 sm:mt-14">
          <h2
            id="brands"
            className="mb-4 font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl"
          >
            Official brand partners
          </h2>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
            {brands.map((brand) => (
              <div
                key={brand}
                className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl border border-line bg-white font-display text-sm font-bold text-ink-soft sm:w-auto"
              >
                {brand}
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="newsletter"
          className="mt-10 rounded-2xl bg-brand-900 p-6 sm:mt-14 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10"
        >
          <div>
            <h2
              id="newsletter"
              className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl"
            >
              Get restock and deal alerts
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/80">
              One email a week — new arrivals and price drops, nothing else.
            </p>
          </div>
          <form
            className="mt-5 flex w-full max-w-md flex-col gap-2 sm:flex-row lg:mt-0"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@email.com"
              className="h-12 w-full rounded-xl border border-white/25 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
            />
            <Button type="submit" size="lg" variant="secondary" className="shrink-0">
              Subscribe
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}
