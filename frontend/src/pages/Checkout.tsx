import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckIcon, ChevronDownIcon, LockIcon, AlertCircleIcon, ShieldCheckIcon, CreditCardIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useCart } from '../components/context/CartContext'
import { useAuth } from '../components/context/AuthContext'
import { placeOrder, createCheckoutSession } from '../data/api'
import { PAYHERE_CONFIG, calculatePayHereHash } from '../utils/payhere'

const STEPS = ['Contact', 'Delivery', 'Payment']

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card payment', detail: 'Visa, Mastercard, Amex — secured by PayHere' },
  { id: 'koko', label: 'KOKO — pay in 3', detail: 'Pay 1/3 today, remainder over 2 months' },
  { id: 'bank_transfer', label: 'Bank transfer', detail: 'Upload the deposit slip after order submission' },
  { id: 'cash_on_delivery', label: 'Cash on delivery', detail: 'Rs 350 handling fee · Colombo & suburbs' },
]

export function Checkout() {
  const { user } = useAuth()
  const { cart, loading } = useCart()
  const navigate = useNavigate()

  const [summaryOpen, setSummaryOpen] = useState(false)
  const [payment, setPayment] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Form states
  const [fullName, setFullName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [email, setEmail] = useState(user?.email || '')
  const [nic, setNic] = useState('')

  const [deliveryMethod, setDeliveryMethod] = useState<'home_delivery' | 'store_pickup'>('home_delivery')
  const [addressLine1, setAddressLine1] = useState(user?.addresses?.[0]?.addressLine1 || '')
  const [addressLine2, setAddressLine2] = useState(user?.addresses?.[0]?.addressLine2 || '')
  const [city, setCity] = useState(user?.addresses?.[0]?.city || '')
  const [district, setDistrict] = useState(user?.addresses?.[0]?.district || '')

  // Touched states for friendly validation alerts (Slide 4 & 5)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user) {
      if (!fullName && user.name) setFullName(user.name)
      if (!email && user.email) setEmail(user.email)
      if (!phone && user.phone) setPhone(user.phone)
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0]
        if (!addressLine1 && addr.addressLine1) setAddressLine1(addr.addressLine1)
        if (!city && addr.city) setCity(addr.city)
        if (!district && addr.district) setDistrict(addr.district)
      }
    }
  }, [user])

  const items = cart?.items || []

  // Ensure calculations never result in NaN (Slide 9 & 10)
  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(String(item.product?.discountPrice ?? item.product?.price ?? 0)) || 0
    const qty = Math.max(1, parseInt(String(item.quantity ?? 1), 10) || 1)
    return acc + (price * qty)
  }, 0)

  const deliveryFee = deliveryMethod === 'store_pickup' ? 0 : (payment === 3 ? 350 : (subtotal >= 7500 ? 0 : 350))
  const total = subtotal + deliveryFee

  // Validation predicates
  const isNameValid = fullName.trim().length >= 3
  // Validates Sri Lankan mobile formats: 07XXXXXXXX or +947XXXXXXXX
  const cleanPhone = phone.replace(/[\s-]/g, '')
  const isPhoneValid = /^(?:0|94|\+94)?(7[0-9]{8})$/.test(cleanPhone)
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const isAddressValid = deliveryMethod === 'store_pickup' || addressLine1.trim().length >= 4
  const isCityValid = deliveryMethod === 'store_pickup' || city.trim().length >= 2
  const isDistrictValid = deliveryMethod === 'store_pickup' || district.trim().length >= 2

  const isFormValid = isNameValid && isPhoneValid && isEmailValid && isAddressValid && isCityValid && isDistrictValid

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handlePlaceOrder = async () => {
    // Mark all required fields as touched
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      addressLine1: true,
      city: true,
      district: true,
    })

    if (!isFormValid) {
      setErrorMessage('Please fill in all required fields marked above before placing your order.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.')
      return
    }

    try {
      setSubmitting(true)
      setErrorMessage(null)

      const orderPayload = {
        deliveryAddress: {
          addressLine1: deliveryMethod === 'store_pickup' ? 'Store Pickup (Maradana)' : addressLine1,
          addressLine2,
          city: deliveryMethod === 'store_pickup' ? 'Colombo' : city,
          district: deliveryMethod === 'store_pickup' ? 'Colombo' : district,
        },
        deliveryMethod,
        paymentMethod: PAYMENT_METHODS[payment].id as any,
      }

      // PayHere Card Payment Handler (Slide 8, 9, 10)
      if (PAYMENT_METHODS[payment].id === 'card') {
        let orderId = 'ORD-' + Date.now()
        let merchantId = PAYHERE_CONFIG.MERCHANT_ID
        let exactAmountFormatted = Number(total).toFixed(2)
        let hash = ''
        let itemsString = items.map(i => i.product?.title || 'Accessory').join(', ') || 'Phone Accessories'

        try {
          // Attempt backend order creation and checkout session
          const order = await placeOrder(orderPayload)
          if (order?._id) {
            orderId = order._id
            const session: any = await createCheckoutSession(order._id)
            if (session?.hash) {
              hash = session.hash
              merchantId = session.merchant_id || merchantId
              exactAmountFormatted = Number(session.amount || total).toFixed(2)
              itemsString = session.items || itemsString
            }
          }
        } catch (apiErr) {
          console.warn('Backend order session fallback to client PayHere signing:', apiErr)
        }

        // If backend was offline, guest mode, or didn't return hash, calculate valid MD5 hash locally
        if (!hash) {
          hash = calculatePayHereHash(
            merchantId,
            orderId,
            exactAmountFormatted,
            PAYHERE_CONFIG.CURRENCY,
            PAYHERE_CONFIG.MERCHANT_SECRET
          )
        }

        const paymentDetails = {
          sandbox: true,
          merchant_id: merchantId,
          return_url: `${window.location.origin}/payment-success?order_id=${orderId}`,
          cancel_url: `${window.location.origin}/payment-cancel?order_id=${orderId}`,
          notify_url: 'http://localhost:5001/api/payment/confirm',
          order_id: orderId,
          items: itemsString,
          amount: exactAmountFormatted,
          currency: PAYHERE_CONFIG.CURRENCY,
          hash: hash,
          first_name: fullName.split(' ')[0] || 'Customer',
          last_name: fullName.split(' ').slice(1).join(' ') || '',
          email: email || 'customer@example.com',
          phone: cleanPhone || '0771234567',
          address: addressLine1 || 'Colombo',
          city: city || 'Colombo',
          country: 'Sri Lanka',
        }

        const payhere = (window as any).payhere
        if (!payhere) {
          throw new Error('PayHere payment gateway library failed to initialize.')
        }

        payhere.onCompleted = async function onCompleted(completedOrderId: string) {
          try {
            const token = localStorage.getItem('token') || localStorage.getItem('sg_token')
            await fetch('http://localhost:5001/api/payment/confirm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ orderId: completedOrderId || orderId }),
            })
          } catch (e) {
            console.warn('Payment confirmation ping failed:', e)
          }
          // Clear cart on successful transaction
          localStorage.removeItem('nr_cart_cache')
          navigate(`/payment-success?order_id=${completedOrderId || orderId}`)
        }

        payhere.onDismissed = function onDismissed() {
          setSubmitting(false)
        }

        payhere.onError = function onError(error: any) {
          setErrorMessage(`Payment failed: ${error}`)
          setSubmitting(false)
        }

        payhere.startPayment(paymentDetails)
        return
      }

      // Non-card order success (COD, Bank Transfer, Koko)
      const order = await placeOrder(orderPayload)
      navigate(`/payment-success?order_id=${order._id}`)
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && items.length === 0) {
    return <div className="p-8 text-center text-ink-soft">Loading checkout…</div>
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Your Cart is Empty</h2>
        <p className="mt-2 text-sm text-ink-soft">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-brand-700 px-6 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-brand-800"
        >
          Return to Shop
        </Link>
      </div>
    )
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-28 pt-4 sm:py-8 md:pb-8 lg:px-6">
      <header className="border-b border-line pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Secure Checkout
        </h1>
        <ol className="mt-4 flex items-center gap-2 sm:gap-3">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-2 sm:gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                  index <= 1 ? 'bg-brand-700 text-white' : 'border border-line-strong text-ink-faint'
                }`}
              >
                {index <= 1 ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
              </span>
              <span className={`text-[13px] font-semibold ${index <= 1 ? 'text-ink' : 'text-ink-faint'}`}>
                {step}
              </span>
              {index < STEPS.length - 1 ? (
                <span aria-hidden="true" className="h-px w-5 bg-line sm:w-10" />
              ) : null}
            </li>
          ))}
        </ol>
      </header>

      {errorMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          <AlertCircleIcon className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
        {/* Left Column: Form Steps */}
        <div className="space-y-6">
          {/* Mobile Accordion Summary */}
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm lg:hidden">
            <button
              type="button"
              onClick={() => setSummaryOpen((prev) => !prev)}
              aria-expanded={summaryOpen}
              className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-3.5"
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
                      <li key={line.product?._id} className="flex items-center gap-3 px-4 py-3">
                        <img
                          src={line.product?.imageURL || '/fallback.png'}
                          alt={line.product?.title || 'Product'}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-ink">
                            {line.product?.title}
                          </span>
                          <span className="text-[11px] text-ink-faint">Qty {line.quantity}</span>
                        </span>
                        <span className="text-[13px] font-semibold text-ink">
                          Rs {((line.product?.discountPrice ?? line.product?.price ?? 0) * line.quantity).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }} className="space-y-6">
            {/* 1. Contact Details (Slide 5 Standards: Bold labels on top >=16px, Height 48px, Instant checkmarks) */}
            <fieldset className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
              <legend className="px-1 font-display text-lg font-bold text-ink">
                1 · Contact Details
              </legend>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label htmlFor="checkout-name" className="mb-1.5 block font-display text-base font-bold text-ink">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="checkout-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => markTouched('fullName')}
                      placeholder="e.g., Kasun Perera"
                      className={`h-12 w-full rounded-xl border px-3.5 pr-10 text-sm transition-colors focus:outline-none ${
                        touched.fullName && !isNameValid
                          ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                          : isNameValid
                          ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                          : 'border-line-strong focus:border-brand-600'
                      }`}
                    />
                    {isNameValid && (
                      <div className="absolute inset-y-0 right-3 flex items-center text-emerald-600">
                        <CheckIcon className="h-5 w-5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                  {touched.fullName && !isNameValid && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600">
                      Please enter your full name (at least 3 characters)
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="checkout-phone" className="mb-1.5 block font-display text-base font-bold text-ink">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => markTouched('phone')}
                      placeholder="077 123 4567"
                      className={`h-12 w-full rounded-xl border px-3.5 pr-10 text-sm transition-colors focus:outline-none ${
                        touched.phone && !isPhoneValid
                          ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                          : isPhoneValid
                          ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                          : 'border-line-strong focus:border-brand-600'
                      }`}
                    />
                    {isPhoneValid && (
                      <div className="absolute inset-y-0 right-3 flex items-center text-emerald-600">
                        <CheckIcon className="h-5 w-5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                  {touched.phone && !isPhoneValid ? (
                    <p className="mt-1.5 text-xs font-semibold text-red-600">
                      Please enter a valid 10-digit phone number (e.g., 077 123 4567)
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-ink-faint">
                      Used for SMS delivery updates and courier dispatch
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="checkout-email" className="mb-1.5 block font-display text-base font-bold text-ink">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="checkout-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => markTouched('email')}
                      placeholder="kasun@example.com"
                      className={`h-12 w-full rounded-xl border px-3.5 pr-10 text-sm transition-colors focus:outline-none ${
                        touched.email && !isEmailValid
                          ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                          : isEmailValid
                          ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                          : 'border-line-strong focus:border-brand-600'
                      }`}
                    />
                    {isEmailValid && (
                      <div className="absolute inset-y-0 right-3 flex items-center text-emerald-600">
                        <CheckIcon className="h-5 w-5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                  {touched.email && !isEmailValid && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600">
                      Please enter a valid email address (e.g., kasun@example.com)
                    </p>
                  )}
                </div>

                {/* Optional NIC */}
                <div>
                  <label htmlFor="checkout-nic" className="mb-1.5 block font-display text-base font-bold text-ink">
                    National ID (NIC) <span className="text-xs font-normal text-ink-faint">(Optional)</span>
                  </label>
                  <input
                    id="checkout-nic"
                    type="text"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    placeholder="e.g., 199512345678"
                    className="h-12 w-full rounded-xl border border-line-strong px-3.5 text-sm transition-colors focus:border-brand-600 focus:outline-none"
                  />
                </div>
              </div>
            </fieldset>

            {/* 2. Delivery Details (Slide 5 Standards: Bold labels on top >=16px, Height 48px) */}
            <fieldset className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
              <legend className="px-1 font-display text-lg font-bold text-ink">
                2 · Delivery Information
              </legend>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[13px] font-medium transition-colors ${
                    deliveryMethod === 'home_delivery'
                      ? 'border-brand-700 bg-brand-50 text-brand-900'
                      : 'border-line-strong text-ink-soft hover:bg-canvas'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'home_delivery'}
                    onChange={() => setDeliveryMethod('home_delivery')}
                    className="h-4 w-4 accent-brand-700"
                  />
                  <span>
                    <span className="block font-bold">Home Delivery — 2–4 days</span>
                    <span className="text-[11px] text-ink-faint">Islandwide courier service</span>
                  </span>
                </label>

                <label
                  className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[13px] font-medium transition-colors ${
                    deliveryMethod === 'store_pickup'
                      ? 'border-brand-700 bg-brand-50 text-brand-900'
                      : 'border-line-strong text-ink-soft hover:bg-canvas'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'store_pickup'}
                    onChange={() => setDeliveryMethod('store_pickup')}
                    className="h-4 w-4 accent-brand-700"
                  />
                  <span>
                    <span className="block font-bold">Store Pickup (Free)</span>
                    <span className="text-[11px] text-ink-faint">Collection at Maradana showroom</span>
                  </span>
                </label>
              </div>

              {deliveryMethod === 'home_delivery' && (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-addr1" className="mb-1.5 block font-display text-base font-bold text-ink">
                      Delivery Address * <span className="text-xs font-normal text-ink-faint">(Height: 48px, Label: ≥16px)</span>
                    </label>
                    <div className="relative">
                      <input
                        id="checkout-addr1"
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        onBlur={() => markTouched('addressLine1')}
                        placeholder="No. 45, Galle Road"
                        className={`h-12 w-full rounded-xl border px-3.5 pr-10 text-sm transition-colors focus:outline-none ${
                          touched.addressLine1 && !isAddressValid
                            ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                            : isAddressValid
                            ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                            : 'border-line-strong focus:border-brand-600'
                        }`}
                      />
                      {isAddressValid && (
                        <div className="absolute inset-y-0 right-3 flex items-center text-emerald-600">
                          <CheckIcon className="h-5 w-5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                    {touched.addressLine1 && !isAddressValid && (
                      <p className="mt-1.5 text-xs font-semibold text-red-600">
                        Please enter a valid street address (e.g., No. 45, Galle Road)
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="checkout-addr2" className="mb-1.5 block font-display text-base font-bold text-ink">
                      Address Line 2 <span className="text-xs font-normal text-ink-faint">(Optional)</span>
                    </label>
                    <input
                      id="checkout-addr2"
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Apartment, suite, or unit"
                      className="h-12 w-full rounded-xl border border-line-strong px-3.5 text-sm transition-colors focus:border-brand-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-city" className="mb-1.5 block font-display text-base font-bold text-ink">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="checkout-city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={() => markTouched('city')}
                        placeholder="Colombo"
                        className={`h-12 w-full rounded-xl border px-3.5 pr-10 text-sm transition-colors focus:outline-none ${
                          touched.city && !isCityValid
                            ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                            : isCityValid
                            ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                            : 'border-line-strong focus:border-brand-600'
                        }`}
                      />
                      {isCityValid && (
                        <div className="absolute inset-y-0 right-3 flex items-center text-emerald-600">
                          <CheckIcon className="h-5 w-5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                    {touched.city && !isCityValid && (
                      <p className="mt-1.5 text-xs font-semibold text-red-600">
                        Please enter your city
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-district" className="mb-1.5 block font-display text-base font-bold text-ink">
                      District <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="checkout-district"
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        onBlur={() => markTouched('district')}
                        placeholder="Colombo / Gampaha / Kandy"
                        className={`h-12 w-full rounded-xl border px-3.5 pr-10 text-sm transition-colors focus:outline-none ${
                          touched.district && !isDistrictValid
                            ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                            : isDistrictValid
                            ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                            : 'border-line-strong focus:border-brand-600'
                        }`}
                      />
                      {isDistrictValid && (
                        <div className="absolute inset-y-0 right-3 flex items-center text-emerald-600">
                          <CheckIcon className="h-5 w-5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                    {touched.district && !isDistrictValid && (
                      <p className="mt-1.5 text-xs font-semibold text-red-600">
                        Please enter your district
                      </p>
                    )}
                  </div>
                </div>
              )}
            </fieldset>

            {/* 3. Payment Method */}
            <fieldset className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <legend className="px-5 pt-5 font-display text-lg font-bold text-ink">
                3 · Payment Method
              </legend>
              <div className="mt-4 divide-y divide-line">
                {PAYMENT_METHODS.map((method, index) => (
                  <label
                    key={method.label}
                    className={`flex min-h-[48px] cursor-pointer items-start gap-3.5 px-5 py-3.5 transition-colors ${
                      payment === index ? 'bg-brand-50/80' : 'hover:bg-canvas'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === index}
                      onChange={() => setPayment(index)}
                      className="mt-1 h-4 w-4 accent-brand-700"
                    />
                    <div className="flex-1">
                      <span className="block text-sm font-bold text-ink">
                        {method.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-soft">
                        {method.detail}
                      </span>
                    </div>
                    {index === 0 && (
                      <CreditCardIcon className="h-5 w-5 text-brand-700" />
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
          </form>
        </div>

        {/* Right Column: Order Summary (Sticky Desktop) */}
        <aside
          aria-label="Order summary"
          className="hidden lg:order-2 lg:block lg:sticky lg:top-28 lg:self-start"
        >
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
            <h2 className="border-b border-line pb-4 font-display text-lg font-bold text-ink">
              Order Summary ({items.length} items)
            </h2>

            <ul className="divide-y divide-line max-h-72 overflow-y-auto">
              {items.map((line) => {
                const itemPrice = parseFloat(String(line.product?.discountPrice ?? line.product?.price ?? 0)) || 0
                return (
                  <li key={line.product?._id} className="flex gap-3 py-3.5">
                    <img
                      src={line.product?.imageURL || '/fallback.png'}
                      alt={line.product?.title || 'Product'}
                      className="h-14 w-14 shrink-0 rounded-xl border border-line object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-ink">{line.product?.title}</p>
                      <p className="mt-0.5 text-[11px] text-ink-faint">Qty: {line.quantity}</p>
                      <p className="mt-1 text-xs font-bold text-brand-700">
                        Rs {(itemPrice * line.quantity).toLocaleString()}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <dl className="space-y-2.5 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Delivery</span>
                <span className="font-semibold text-ink">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `Rs ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t border-line pt-3 flex items-baseline justify-between">
                <span className="font-display text-base font-bold text-ink">Total Amount</span>
                <span className="font-display text-2xl font-extrabold text-ink">
                  Rs {total.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-ink-faint">
                PayHere transaction amount: <span className="font-mono font-bold text-ink">Rs {total.toFixed(2)}</span>
              </p>
            </dl>

            <div className="mt-5 border-t border-line pt-4">
              <Button
                size="lg"
                fullWidth
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                <LockIcon className="h-4 w-4" aria-hidden="true" />
                {submitting ? 'Processing Payment…' : `Pay Rs ${total.toFixed(2)}`}
              </Button>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                <span>256-Bit SSL Secured Checkout</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Sticky Checkout Bar (Finger-friendly min-h-[48px], no sideways overflow) */}
      <div className="fixed inset-x-0 bottom-[57px] z-30 flex items-center justify-between gap-3 border-t border-line bg-white/95 backdrop-blur px-4 py-3 md:hidden">
        <div>
          <p className="text-[11px] font-medium text-ink-faint">Total Due</p>
          <p className="font-display text-lg font-extrabold text-ink">Rs {total.toLocaleString()}</p>
        </div>
        <div className="w-1/2">
          <Button fullWidth onClick={handlePlaceOrder} disabled={submitting}>
            <LockIcon className="h-4 w-4" />
            {submitting ? 'Placing…' : 'Place Order'}
          </Button>
        </div>
      </div>
    </main>
  )
}
