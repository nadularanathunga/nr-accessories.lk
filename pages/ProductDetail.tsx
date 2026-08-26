import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckIcon,
  ChevronRightIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  TruckIcon,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StarRating } from '../components/StarRating'
import { ProductCard } from '../components/ProductCard'
import { bestSellers, images } from '../data/catalog'

const GALLERY = [images.charger, images.case, images.earbuds, images.promoAudio]
const VARIANTS = ['White', 'Black', 'Grey']
const TABS = ['Description', 'Specifications', 'Reviews (48)', 'Delivery & returns']
const HIGHLIGHTS = [
  'GaN II technology — 40% smaller than a standard 65W brick',
  'USB-C PD 65W and USB-A 18W output at the same time',
  'Charges MacBook Air, iPhone, Galaxy, iPad and Switch',
  '18-month brand warranty handled at our Colombo service desk',
]
const SPECS = [
  ['Max output', '65W total (PD 3.0)'],
  ['Ports', '1 × USB-C, 1 × USB-A'],
  ['Input', '100–240V, travel ready'],
  ['Weight', '112 g'],
  ['Warranty', '18 months'],
  ['In the box', 'Charger, 1m USB-C cable'],
]

export function ProductDetail() {
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState(0)
  const [variant, setVariant] = useState(0)

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-4 sm:py-6 md:pb-6 lg:px-6">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-faint"
      >
        <Link to="/" className="hover:text-brand-700">
          Home
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <Link to="/shop" className="hover:text-brand-700">
          Chargers &amp; Adapters
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-ink">65W GaN Charger</span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[520px_minmax(0,1fr)_270px]">
        <section aria-label="Product images">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <img
              src={GALLERY[activeImage]}
              alt="65W GaN dual-port fast charger"
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-2 sm:gap-3">
            {GALLERY.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeImage}
                className={`h-16 w-16 overflow-hidden rounded-xl border transition-colors duration-150 ease-soft sm:h-20 sm:w-20 ${
                  index === activeImage ? 'border-brand-700' : 'border-line hover:border-line-strong'
                }`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="product-title">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-700">Anker</p>
          <h1
            id="product-title"
            className="mt-1.5 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl"
          >
            65W GaN Dual-Port Fast Charger
          </h1>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <StarRating rating={4.6} reviews={48} size="md" />
            <span className="text-xs text-ink-faint">SKU NR-CH-0065</span>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y border-line py-4">
            <span className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Rs 8,950
            </span>
            <span className="text-sm text-ink-faint line-through">Rs 11,900</span>
            <span className="rounded-lg bg-sale px-2 py-1 text-[11px] font-bold text-white">
              Save 25%
            </span>
          </div>

          <p className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-brand-700">
            <CheckIcon className="h-4 w-4" aria-hidden="true" />
            In stock — 12 units at the Colombo warehouse
          </p>

          <fieldset className="mt-5">
            <legend className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">
              Colour
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {VARIANTS.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setVariant(index)}
                  aria-pressed={variant === index}
                  className={`rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ease-soft ${
                    variant === index
                      ? 'border-brand-700 bg-brand-50 text-brand-800'
                      : 'border-line-strong text-ink-soft hover:border-line-strong hover:text-ink'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 hidden flex-wrap items-center gap-3 md:flex">
            <div className="flex h-12 items-center rounded-xl border border-line-strong">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex h-full w-11 items-center justify-center text-ink hover:text-brand-700"
              >
                <MinusIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-ink">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => value + 1)}
                className="flex h-full w-11 items-center justify-center text-ink hover:text-brand-700"
              >
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <Link to="/cart">
              <Button size="lg" className="min-w-[190px]">
                Add to cart
              </Button>
            </Link>
            <Link to="/checkout">
              <Button size="lg" variant="secondary">
                Buy it now
              </Button>
            </Link>
            <button
              type="button"
              aria-label="Add to wishlist"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-line-strong text-ink-soft transition-colors duration-150 ease-soft hover:border-brand-600 hover:text-brand-700 sm:h-14 sm:w-14"
            >
              <HeartIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
            {HIGHLIGHTS.map((point) => (
              <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </section>

        <aside aria-label="Delivery and warranty" className="space-y-3">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="flex items-center gap-2 font-display text-sm font-bold text-ink">
              <TruckIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Delivery
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              Free islandwide courier over Rs 7,500. Same-day Colombo dispatch for orders before
              2pm.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <label htmlFor="postcode" className="sr-only">
                Postcode
              </label>
              <input
                id="postcode"
                type="text"
                placeholder="Postcode"
                className="h-10 w-full rounded-xl border border-line-strong px-3 text-[13px] focus:border-brand-600 focus:outline-none"
              />
              <Button size="sm" variant="secondary">
                Check
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="flex items-center gap-2 font-display text-sm font-bold text-ink">
              <ShieldCheckIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Warranty &amp; returns
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              18-month brand warranty and 7-day exchange on unopened items, handled in store or by
              courier pickup.
            </p>
          </div>
          <div className="rounded-2xl bg-brand-50 p-4">
            <p className="font-display text-sm font-bold text-brand-900">Pay in 3 with KOKO</p>
            <p className="mt-1 text-[13px] text-brand-800">Rs 2,983 × 3 instalments, 0% interest</p>
          </div>
        </aside>
      </div>

      <section aria-label="Product details" className="mt-10 sm:mt-14">
        <div className="-mx-4 flex gap-2 overflow-x-auto border-b border-line px-4 no-scrollbar sm:mx-0 sm:px-0">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`shrink-0 border-b-2 px-1 pb-3 text-[13px] font-semibold transition-colors duration-150 ease-soft sm:px-2 sm:text-sm ${
                index === activeTab
                  ? 'border-brand-700 text-brand-800'
                  : 'border-transparent text-ink-faint hover:text-ink'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid gap-8 py-6 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div className="space-y-4 text-[14px] leading-relaxed text-ink-soft">
            <p>
              The Anker 65W GaN dual-port charger replaces the bundle of bricks in your bag. GaN II
              components run cooler and let the whole unit stay pocket-sized while still pushing a
              full 65W over USB-C — enough for a MacBook Air, a tablet and a phone through the day.
            </p>
            <img
              src={images.promoAudio}
              alt="Charger and phone on a desk"
              className="w-full rounded-2xl object-cover"
            />
            <p>
              Plug two devices in and power is shared intelligently: 45W to the laptop on USB-C and
              18W to the phone on USB-A. Built-in temperature, surge and short-circuit protection
              keeps both devices safe on unstable mains supply.
            </p>
          </div>
          <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {SPECS.map(([label, value]) => (
              <div key={label} className="grid grid-cols-2 gap-3 px-4 py-3">
                <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">
                  {label}
                </dt>
                <dd className="text-[13px] font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="related" className="mt-6 sm:mt-10">
        <h2
          id="related"
          className="mb-4 font-display text-xl font-extrabold tracking-tight text-ink sm:mb-5 sm:text-2xl"
        >
          Frequently bought together
        </h2>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {bestSellers.slice(0, 5).map((product) => (
            <div key={product.id} className="w-[58%] shrink-0 snap-start sm:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-[57px] z-30 flex items-center gap-3 border-t border-line bg-white px-4 py-3 md:hidden">
        <div>
          <p className="font-display text-lg font-extrabold text-ink">Rs 8,950</p>
          <p className="text-[11px] text-ink-faint line-through">Rs 11,900</p>
        </div>
        <button
          type="button"
          aria-label="Add to wishlist"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-strong text-ink-soft"
        >
          <HeartIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <Link to="/cart" className="flex-1">
          <Button fullWidth>Add to cart</Button>
        </Link>
      </div>
    </main>
  )
}
