import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HeartIcon, ShoppingCartIcon, CheckIcon } from 'lucide-react'
import { StarRating } from './StarRating'
import type { Product } from '../data/catalog'
import { addToCart, isLoggedIn } from '../data/api'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  async function handleAddToCart() {
    if (!isLoggedIn()) {
      navigate('/account', { state: { from: '/shop' } })
      return
    }
    try {
      setAdding(true)
      await addToCart(product.id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } catch {
      // Silently ignore — a failed add-to-cart shouldn't break the page.
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-200 ease-soft hover:shadow-lift">
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-canvas">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 ease-soft group-hover:scale-[1.03]"
          />
        </Link>
        {product.discount ? (
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-sale px-2 py-0.5 font-display text-[11px] font-bold text-white">
            {product.discount}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white/90 text-ink-soft transition-colors duration-150 ease-soft hover:text-brand-700"
        >
          <HeartIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-brand-700">
          {product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 font-display text-[13px] font-semibold leading-snug text-ink sm:text-sm">
          <Link to={`/product/${product.id}`} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5">
          <StarRating rating={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-base font-bold text-ink sm:text-lg">
              {product.price}
            </span>
            {product.oldPrice ? (
              <span className="text-xs text-ink-faint line-through">{product.oldPrice}</span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-line-strong bg-white py-2.5 text-[12px] font-semibold text-ink transition-colors duration-150 ease-soft hover:border-brand-700 hover:bg-brand-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13px]"
          >
            {added ? (
              <>
                <CheckIcon className="h-4 w-4" aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
                {adding ? 'Adding…' : 'Add to cart'}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}