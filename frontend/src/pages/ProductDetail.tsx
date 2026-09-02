import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { fetchRawProductById, toCatalogProduct, type ApiProduct } from '../data/api'
import { useCart } from '../components/context/CartContext'
import { useAuth } from '../components/context/AuthContext'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const p = await fetchRawProductById(id as string)
        if (!cancelled) setProduct(p)
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Product not found')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  const { addToCart: contextAddToCart } = useCart()
  const { isAuthenticated } = useAuth()

  async function handleAddToCart() {
    if (!id) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }
    try {
      setAdding(true)
      await contextAddToCart(id, quantity)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } catch {
      // ignore
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return <main className="mx-auto w-full max-w-[1280px] px-4 py-16 text-center text-ink-soft">Loading…</main>
  }

  if (error || !product) {
    return (
      <main className="mx-auto w-full max-w-[1280px] px-4 py-16 text-center">
        <p className="text-ink-soft">{error || 'Product not found'}</p>
        <Link to="/shop" className="mt-3 inline-block text-brand-700 font-semibold">Back to shop</Link>
      </main>
    )
  }

  const catalog = toCatalogProduct(product)
  const categoryName =
    typeof product.category === 'object' && product.category ? product.category.name : ''
  const categorySlug =
    typeof product.category === 'object' && product.category ? product.category.slug : ''

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-4 sm:py-6 md:pb-6 lg:px-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-faint">
        <Link to="/" className="hover:text-brand-700">Home</Link>
        <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <Link to={`/shop?category=${categorySlug}`} className="hover:text-brand-700">
          {categoryName || 'Shop'}
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[520px_minmax(0,1fr)_270px]">
        <section aria-label="Product images">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <img src={catalog.image} alt={product.title} referrerPolicy="no-referrer" className="aspect-square w-full object-cover" />
          </div>
        </section>

        <section aria-labelledby="product-title">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-700">{product.brand}</p>
          <h1 id="product-title" className="mt-1.5 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
            {product.title}
          </h1>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            <StarRating rating={product.avgRating ?? 0} reviews={product.reviewCount ?? 0} size="md" />
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y border-line py-4">
            <span className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{catalog.price}</span>
            {catalog.oldPrice ? (
              <span className="text-sm text-ink-faint line-through">{catalog.oldPrice}</span>
            ) : null}
            {catalog.discount ? (
              <span className="rounded-lg bg-sale px-2 py-1 text-[11px] font-bold text-white">
                Save {catalog.discount.replace('-', '')}
              </span>
            ) : null}
          </div>

          <p className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-brand-700">
            <CheckIcon className="h-4 w-4" aria-hidden="true" />
            {product.stockQuantity > 0
              ? `In stock — ${product.stockQuantity} units`
              : 'Out of stock'}
          </p>

          <div className="mt-5 hidden flex-wrap items-center gap-3 md:flex">
            <div className="flex h-12 items-center rounded-xl border border-line-strong">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((v) => Math.max(1, v - 1))} className="flex h-full w-11 items-center justify-center text-ink hover:text-brand-700">
                <MinusIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-ink">{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((v) => Math.min(product.stockQuantity, v + 1))} className="flex h-full w-11 items-center justify-center text-ink hover:text-brand-700">
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <Button size="lg" className="min-w-[190px]" onClick={handleAddToCart} disabled={adding || product.stockQuantity === 0}>
              {added ? 'Added ✓' : adding ? 'Adding…' : 'Add to cart'}
            </Button>
            <button type="button" aria-label="Add to wishlist" className="flex h-12 w-12 items-center justify-center rounded-xl border border-line-strong text-ink-soft transition-colors duration-150 ease-soft hover:border-brand-600 hover:text-brand-700 sm:h-14 sm:w-14">
              <HeartIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </section>

        <aside aria-label="Delivery and warranty" className="space-y-3">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="flex items-center gap-2 font-display text-sm font-bold text-ink">
              <TruckIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Delivery
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              Free islandwide courier over Rs 7,500. Same-day Colombo dispatch for orders before 2pm.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="flex items-center gap-2 font-display text-sm font-bold text-ink">
              <ShieldCheckIcon className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Warranty &amp; returns
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              18-month brand warranty and 7-day exchange on unopened items.
            </p>
          </div>
        </aside>
      </div>

      <section aria-label="Product details" className="mt-10 sm:mt-14">
        <h2 className="mb-3 font-display text-xl font-extrabold tracking-tight text-ink">Description</h2>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          {product.description || 'No description added for this product yet.'}
        </p>
      </section>

      <div className="fixed inset-x-0 bottom-[57px] z-30 flex items-center gap-3 border-t border-line bg-white px-4 py-3 md:hidden">
        <div>
          <p className="font-display text-lg font-extrabold text-ink">{catalog.price}</p>
          {catalog.oldPrice ? <p className="text-[11px] text-ink-faint line-through">{catalog.oldPrice}</p> : null}
        </div>
        <Button fullWidth onClick={handleAddToCart} disabled={adding || product.stockQuantity === 0}>
          {added ? 'Added ✓' : adding ? 'Adding…' : 'Add to cart'}
        </Button>
      </div>
    </main>
  )
}