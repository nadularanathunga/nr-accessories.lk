import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../components/context/CartContext'
import { useAuth } from '../components/context/AuthContext'
import { MinusIcon, PlusIcon, Trash2Icon, ArrowRightIcon, ShoppingBagIcon } from 'lucide-react'

export function Cart() {
  const { cart, loading, error, removeCartItem, updateCartItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const items = cart?.items || []

  // Ensure robust numeric math calculation without NaN risks (Slide 8 & 9)
  const calculateItemTotal = (price: number | undefined, qty: number) => {
    const safePrice = parseFloat(String(price || 0)) || 0
    const safeQty = Math.max(1, parseInt(String(qty || 1), 10) || 1)
    return safePrice * safeQty
  }

  const grandTotal = items.reduce((acc, item) => {
    const unitPrice = item.product?.discountPrice ?? item.product?.price ?? 0
    return acc + calculateItemTotal(unitPrice, item.quantity)
  }, 0)

  const handleQuantityChange = async (productId: string, newQty: number, maxStock = 99) => {
    // QA Requirement: Disallow negative or zero quantities
    if (newQty < 1) return
    const safeQty = Math.min(Math.max(1, newQty), maxStock)
    await updateCartItem(productId, safeQty)
  }

  const handleManualInput = (productId: string, val: string, maxStock = 99) => {
    const parsed = parseInt(val, 10)
    if (isNaN(parsed) || parsed < 1) {
      // Disallow zero & negative values, clamp to minimum 1
      handleQuantityChange(productId, 1, maxStock)
    } else {
      handleQuantityChange(productId, parsed, maxStock)
    }
  }

  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-700 border-t-transparent"></div>
          <p className="text-sm font-semibold text-ink-soft">Loading your cart…</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg min-h-[55vh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 mb-4">
          <ShoppingBagIcon className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Your Cart is Empty</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Looks like you haven't added any accessories yet. Explore our latest collection!
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 font-display text-sm font-bold text-white transition-colors hover:bg-brand-800"
        >
          Browse Products
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-28 pt-4 sm:py-8 lg:px-6">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-xs text-ink-soft sm:text-sm">
            {items.reduce((s, i) => s + (parseInt(String(i.quantity), 10) || 1), 0)} items in your cart
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-semibold text-brand-700 hover:underline sm:text-sm"
        >
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-600 sm:text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cart Item List */}
        <section aria-label="Cart items" className="space-y-4">
          {items.map((item) => {
            const prod = item.product || {}
            const prodId = prod._id || (item as any).productId
            const unitPrice = parseFloat(String(prod.discountPrice ?? prod.price ?? 0)) || 0
            const itemTotal = calculateItemTotal(unitPrice, item.quantity)
            const stock = prod.stockQuantity || 99

            return (
              <div
                key={prodId}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={prod.imageURL || '/fallback.png'}
                    alt={prod.title || 'Product'}
                    className="h-20 w-20 shrink-0 rounded-xl border border-line object-cover"
                  />
                  <div>
                    <h2 className="font-display text-base font-bold text-ink sm:text-lg">
                      {prod.title || 'Product Item'}
                    </h2>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      Unit Price: <span className="font-semibold text-ink">Rs {unitPrice.toLocaleString()}</span>
                    </p>
                    <p className="mt-1 font-display text-sm font-extrabold text-brand-700 sm:text-base">
                      Subtotal: Rs {itemTotal.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between border-t border-line/60 pt-3 sm:border-0 sm:pt-0 sm:gap-4">
                  <div className="flex items-center rounded-xl border border-line-strong bg-white">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                      onClick={() => handleQuantityChange(prodId, item.quantity - 1, stock)}
                      className="flex min-h-[44px] min-w-[40px] items-center justify-center text-ink transition-colors hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={stock}
                      value={item.quantity}
                      onChange={(e) => handleManualInput(prodId, e.target.value, stock)}
                      aria-label="Item quantity"
                      className="h-11 w-12 text-center font-display text-sm font-bold text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={item.quantity >= stock}
                      onClick={() => handleQuantityChange(prodId, item.quantity + 1, stock)}
                      className="flex min-h-[44px] min-w-[40px] items-center justify-center text-ink transition-colors hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeCartItem(prodId)}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span className="sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            )
          })}
        </section>

        {/* Order Summary Box */}
        <aside aria-label="Cart summary" className="h-fit rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
          <h2 className="border-b border-line pb-3 font-display text-lg font-bold text-ink">
            Order Summary
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="font-semibold text-ink">Rs {grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Delivery</span>
              <span className="font-medium text-emerald-600">Calculated at checkout</span>
            </div>
            <div className="border-t border-line pt-3 flex items-baseline justify-between">
              <span className="font-display text-base font-bold text-ink">Estimated Total</span>
              <span className="font-display text-2xl font-extrabold text-ink">
                Rs {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 font-display text-sm font-bold text-white transition-colors hover:bg-brand-800"
            >
              Proceed to Checkout
              <ArrowRightIcon className="h-4 w-4" />
            </button>

            <p className="text-center text-[11px] text-ink-faint">
              Free returns within 7 days · 100% Genuine product warranty
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}