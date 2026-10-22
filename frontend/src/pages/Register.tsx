import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckIcon, AlertCircleIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { register } from '../data/api'
import { useAuth } from '../components/context/AuthContext'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const navigate = useNavigate()
  const { setUser } = useAuth()

  // Real-time Validation (Slide 5: instant green checkmarks)
  const isNameValid = name.trim().length >= 3
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const cleanPhone = phone.replace(/[\s-]/g, '')
  const isPhoneValid = /^(?:0|94|\+94)?(7[0-9]{8})$/.test(cleanPhone)
  const isPasswordValid = password.length >= 6

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, phone: true, password: true })

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid) {
      setError('Please resolve the highlighted field errors below.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const user = await register(name, email, password, cleanPhone)
      setUser(user)
      window.location.href = '/' // Refresh state
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4 py-8 sm:py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Create an account</h1>
          <p className="mt-2 text-sm text-ink-soft">Join us to shop for premium smartphone accessories.</p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 sm:text-sm">
            <AlertCircleIcon className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="reg-name" className="mb-1.5 block font-display text-base font-bold text-ink">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => markTouched('name')}
                placeholder="Kasun Perera"
                className={`h-12 w-full rounded-xl border px-3.5 pr-10 text-sm transition-colors focus:outline-none ${
                  touched.name && !isNameValid
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
            {touched.name && !isNameValid && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                Please enter at least 3 characters
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="mb-1.5 block font-display text-base font-bold text-ink">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched('email')}
                placeholder="hello@example.com"
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
              <p className="mt-1 text-xs font-semibold text-red-600">
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="reg-phone" className="mb-1.5 block font-display text-base font-bold text-ink">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-phone"
                type="tel"
                required
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
              <p className="mt-1 text-xs font-semibold text-red-600">
                Please enter a valid 10-digit phone number (e.g., 077 123 4567)
              </p>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-pwd" className="mb-1.5 block font-display text-base font-bold text-ink">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-pwd"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched('password')}
                placeholder="At least 6 characters"
                className={`h-12 w-full rounded-xl border px-3.5 pr-10 text-sm transition-colors focus:outline-none ${
                  touched.password && !isPasswordValid
                    ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                    : isPasswordValid
                    ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                    : 'border-line-strong focus:border-brand-600'
                }`}
              />
              {isPasswordValid && (
                <div className="absolute inset-y-0 right-3 flex items-center text-emerald-600">
                  <CheckIcon className="h-5 w-5 stroke-[2.5]" />
                </div>
              )}
            </div>
            {touched.password && !isPasswordValid && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Creating account…' : 'Sign Up'}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
