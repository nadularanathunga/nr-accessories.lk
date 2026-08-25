import React from 'react'
import { Link } from 'react-router-dom'
import { MinusIcon, PlusIcon, ShieldCheckIcon, Trash2Icon, TruckIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/ProductCard'
import { bestSellers, cartLines } from '../data/catalog'

const TOTALS = [
  { label: 'Subtotal (4 items)', value: 'Rs 18,540' },
  { label: 'Delivery', value: 'Free' },
  { label: 'Discount (NR10)', value: '– Rs 1,854' },
]

export function Cart() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-28 pt-4 sm:py-6 md:pb-6 lg:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Shopping cart
          </h1>
          <p className="mt-1 text-[13px] text-ink-soft">3 products reserved for 30 minutes</p>
        </div>
        <Link to="/shop" className="text-[13px] font-semibold text-brand-700">
          Continue shopping
        </Link>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px] lg:gap-6">
        <section aria-label="Cart items" className="space-y-3">
          {cartLines.map((line) => (
            <article
              key={line.id}
              className="flex gap-3 rounded-2xl border border-line bg-white p-3 sm:gap-4 sm:p-4"
            >
              <Link
                to="/product/1"
                className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-canvas sm:h-28 sm:w-28"
              >
                <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                      {line.brand}
                    </p>
                    <h2 className="mt-0.5 font-display text-[13px] font-semibold leading-snug text-ink sm:text-[15px]">
                      <Link to="/product/1" className="hover:text-brand-700">
                        {line.name}
                      </Link>
                    </h2>
                    <p className="mt-1 text-[12px] text-ink-faint">
                      {line.price} each · In stock
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${line.name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-faint transition-colors duration-150 ease-soft hover:bg-canvas hover:text-ink"
                  >
                    <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  <div className="flex h-9 items-center rounded-xl border border-line-strong">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="flex h-full w-9 items-center justify-center text-ink hover:text-brand-700"
                    >
                      <MinusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center text-[13px] font-semibold">{line.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="flex h-full w-9 items-center justify-center text-ink hover:text-brand-700"
                    >
                      <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="font-display text-base font-bold text-ink sm:text-lg">
                    {line.price}
                  </p>
                </div>
              </div>
            </article>
          ))}

          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
            <label htmlFor="promo" className="sr-only">
              Promo code
            </label>
            <input
              id="promo"
              type="text"
              placeholder="Promo code"
              className="h-11 flex-1 rounded-xl border border-line-strong px-3.5 text-sm focus:border-brand-600 focus:outline-none"
            />
            <Button variant="secondary" className="sm:w-auto">
              Apply code
            </Button>
          </div>
        </section>

        <aside aria-label="Order summary" className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-base font-bold text-ink">Order summary</h2>
            <dl className="mt-4 space-y-2.5">
              {TOTALS.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[13px]">
                  <dt className="text-ink-soft">{row.label}</dt>
                  <dd className="font-medium text-ink">{row.value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-display text-sm font-bold text-ink">Total</dt>
                <dd className="font-display text-2xl font-extrabold text-ink">Rs 16,686</dd>
              </div>
            </dl>
            <Link to="/checkout" className="mt-4 block">
              <Button size="lg" fullWidth>
                Proceed to checkout
              </Button>
            </Link>
            <ul className="mt-4 space-y-2 text-[12px] text-ink-soft">
              <li className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                Free delivery applied
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
                Card, KOKO, bank transfer or cash on delivery
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <section aria-labelledby="cart-upsell" className="mt-10 sm:mt-14">
        <h2
          id="cart-upsell"
          className="mb-4 font-display text-xl font-extrabold tracking-tight text-ink sm:mb-5 sm:text-2xl"
        >
          Add these to your order
        </h2>
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {bestSellers.slice(2, 7).map((product) => (
            <div key={product.id} className="w-[58%] shrink-0 snap-start sm:w-auto">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-[57px] z-30 flex items-center gap-3 border-t border-line bg-white px-4 py-3 md:hidden">
        <div>
          <p className="text-[11px] text-ink-faint">Total</p>
          <p className="font-display text-lg font-extrabold text-ink">Rs 16,686</p>
        </div>
        <Link to="/checkout" className="flex-1">
          <Button fullWidth>Checkout</Button>
        </Link>
      </div>
    </main>
  )
}
