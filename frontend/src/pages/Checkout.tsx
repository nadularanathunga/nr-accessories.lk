import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckIcon, ChevronDownIcon, LockIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useCart } from '../components/context/CartContext'
import { placeOrder, createCheckoutSession } from '../data/api'

const STEPS = ['Contact', 'Delivery', 'Payment']

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card payment', detail: 'Visa, Mastercard, Amex — secured by PayHere' },
  { id: 'koko', label: 'KOKO — pay in 3', detail: 'Rs 5,562 today, rest over 2 months' },
  { id: 'bank_transfer', label: 'Bank transfer', detail: 'Upload the slip after placing your order' },
  { id: 'cash_on_delivery', label: 'Cash on delivery', detail: 'Rs 350 handling fee · Colombo & suburbs' },
]

export function Checkout() {
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [payment, setPayment] = useState(0)
  
  const { cart, loading } = useCart()
  const navigate = useNavigate()

  // Form states
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<'home_delivery' | 'store_pickup'>('home_delivery')
  const [submitting, setSubmitting] = useState(false)

  const items = cart?.items || []
  const subtotal = items.reduce((acc, item) => acc + (item.product.discountPrice ?? item.product.price) * item.quantity, 0)
  const total = subtotal // Add delivery logic if needed

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    try {
      setSubmitting(true)
      const order = await placeOrder({
        deliveryAddress: { addressLine1, addressLine2, city, district },
        deliveryMethod,
        paymentMethod: PAYMENT_METHODS[payment].id as any
      })
      
      if (PAYMENT_METHODS[payment].id === 'card') {
        const session = await createCheckoutSession(order._id);
        window.location.href = session.url;
        return;
      }

      alert('Order placed successfully!')
      navigate('/')
    } catch (err: any) {
      alert(err.message || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading checkout...</div>
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Your Cart is Empty</h2>
        <Link to="/shop" className="inline-block bg-primary text-white px-4 py-2 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-28 pt-4 sm:py-6 md:pb-6 lg:px-6">
      <header className="border-b border-line pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Checkout
        </h1>
        <ol className="mt-4 flex items-center gap-2 sm:gap-3">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-2 sm:gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                  index === 0
                    ? 'bg-brand-700 text-white'
                    : 'border border-line-strong text-ink-faint'
                }`}
              >
                {index === 0 ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={`text-[13px] font-semibold ${
                  index === 0 ? 'text-ink' : 'text-ink-faint'
                }`}
              >
                {step}
              </span>
              {index < STEPS.length - 1 ? (
                <span aria-hidden="true" className="h-px w-5 bg-line sm:w-10" />
              ) : null}
            </li>
          ))}
        </ol>
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px] lg:gap-8">
        <div className="lg:order-1">
          <div className="rounded-2xl border border-line bg-white lg:hidden">
            <button
              type="button"
              onClick={() => setSummaryOpen((prev) => !prev)}
              aria-expanded={summaryOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5"
            >
              <span className="font-display text-sm font-bold text-ink">
                Order summary ({items.length} items)
              </span>
              <span className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
                Rs {total.toLocaleString()}
                <ChevronDownIcon
                  className={`h-4 w-4 text-ink-faint transition-transform duration-150 ease-soft ${
                    summaryOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {summaryOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden border-t border-line"
                >
                  <ul className="divide-y divide-line">
                    {items.map((line) => (
                      <li key={line.product._id} className="flex items-center gap-3 px-4 py-3">
                        <img
                          src={line.product.imageURL || 'fallback'}
                          alt={line.product.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-ink">
                            {line.product.title}
                          </span>
                          <span className="text-[11px] text-ink-faint">Qty {line.quantity}</span>
                        </span>
                        <span className="text-[13px] font-semibold text-ink">Rs {line.product.discountPrice ?? line.product.price}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <form className="mt-4 space-y-4 lg:mt-0" onSubmit={(event) => event.preventDefault()}>
            <fieldset className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <legend className="px-1 font-display text-base font-bold text-ink">
                1 · Contact details
              </legend>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {['Full name', 'Mobile number', 'Email address', 'NIC (optional)'].map((field) => (
                  <label key={field} className="block">
                    <span className="text-[12px] font-semibold text-ink-soft">{field}</span>
                    <input
                      type="text"
                      className="mt-1.5 h-11 w-full rounded-xl border border-line-strong px-3.5 text-sm focus:border-brand-600 focus:outline-none"
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-2xl border border-line bg-white p-4 sm:p-5">
              <legend className="px-1 font-display text-base font-bold text-ink">
                2 · Delivery
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {['Home delivery — 2–4 days', 'Store pickup — Maradana'].map((option, index) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-[13px] font-medium ${
                      index === 0
                        ? 'border-brand-700 bg-brand-50 text-brand-900'
                        : 'border-line-strong text-ink-soft'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      defaultChecked={index === 0}
                      className="h-4 w-4 accent-brand-700"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[12px] font-semibold text-ink-soft">Address line 1</span>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      required
                      className="mt-1.5 h-11 w-full rounded-xl border border-line-strong px-3.5 text-sm focus:border-brand-600 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px] font-semibold text-ink-soft">Address line 2</span>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-line-strong px-3.5 text-sm focus:border-brand-600 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px] font-semibold text-ink-soft">City</span>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="mt-1.5 h-11 w-full rounded-xl border border-line-strong px-3.5 text-sm focus:border-brand-600 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px] font-semibold text-ink-soft">District</span>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      className="mt-1.5 h-11 w-full rounded-xl border border-line-strong px-3.5 text-sm focus:border-brand-600 focus:outline-none"
                    />
                  </label>
              </div>
              <label className="mt-4 flex items-center gap-2.5 text-[13px] text-ink-soft">
                <input type="checkbox" className="h-4 w-4 rounded accent-brand-700" />
                Save this address to my account
              </label>
            </fieldset>

            <fieldset className="overflow-hidden rounded-2xl border border-line bg-white">
              <legend className="px-5 pt-4 font-display text-base font-bold text-ink">
                3 · Payment
              </legend>
              <div className="mt-3 divide-y divide-line">
                {PAYMENT_METHODS.map((method, index) => (
                  <label
                    key={method.label}
                    className={`flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors duration-150 ease-soft sm:px-5 ${
                      payment === index ? 'bg-brand-50' : 'hover:bg-canvas'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === index}
                      onChange={() => setPayment(index)}
                      className="mt-0.5 h-4 w-4 accent-brand-700"
                    />
                    <span>
                      <span className="block text-[13px] font-semibold text-ink">
                        {method.label}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-ink-soft">
                        {method.detail}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </form>
        </div>

        <aside
          aria-label="Order review"
          className="hidden lg:order-2 lg:block lg:sticky lg:top-40 lg:self-start"
        >
          <div className="rounded-2xl border border-line bg-white">
            <h2 className="border-b border-line px-5 py-4 font-display text-base font-bold text-ink">
              Your order
            </h2>
            <ul className="divide-y divide-line">
              {items.map((line) => (
                <li key={line.product._id} className="flex gap-3 px-5 py-3.5">
                  <img
                    src={line.product.imageURL || 'fallback'}
                    alt={line.product.title}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium leading-snug text-ink">{line.product.title}</p>
                    <p className="mt-0.5 text-[11px] text-ink-faint">Qty {line.quantity}</p>
                  </div>
                  <p className="text-[13px] font-semibold text-ink">Rs {line.product.discountPrice ?? line.product.price}</p>
                </li>
              ))}
            </ul>
            <dl className="space-y-2.5 border-t border-line px-5 py-4 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-medium text-ink">Rs {subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Delivery</dt>
                <dd className="font-medium text-ink">Rs 0</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-display text-sm font-bold text-ink">Total</dt>
                <dd className="font-display text-2xl font-extrabold text-ink">Rs {total.toLocaleString()}</dd>
              </div>
            </dl>
            <div className="border-t border-line p-5">
              <Button size="lg" fullWidth onClick={handlePlaceOrder} disabled={submitting}>
                <LockIcon className="h-4 w-4" aria-hidden="true" />
                {submitting ? 'Placing order...' : 'Place order'}
              </Button>
              <p className="mt-2.5 text-center text-[11px] text-ink-faint">
                By placing this order you accept the nr accessories.lk terms.
              </p>
              <Link
                to="/cart"
                className="mt-3 block text-center text-[12px] font-semibold text-brand-700"
              >
                Back to cart
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-[57px] z-30 flex items-center gap-3 border-t border-line bg-white px-4 py-3 md:hidden">
        <div>
          <p className="text-[11px] text-ink-faint">Total</p>
          <p className="font-display text-lg font-extrabold text-ink">Rs {total.toLocaleString()}</p>
        </div>
        <div className="flex-1">
          <Button fullWidth onClick={handlePlaceOrder} disabled={submitting}>
            <LockIcon className="h-4 w-4" aria-hidden="true" />
            {submitting ? 'Placing...' : 'Place order'}
          </Button>
        </div>
      </div>
    </main>
  )
}
