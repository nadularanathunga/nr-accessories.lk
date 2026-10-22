import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { CheckIcon, AlertCircleIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { login } from '../data/api'
import { useAuth } from '../components/context/AuthContext'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const isPasswordValid = password.length >= 6

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    if (!isEmailValid || !password) {
      setError('Please provide a valid email and password.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      setUser(user)
      const redirectPath = (location.state as any)?.from || '/'
      window.location.href = redirectPath
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4 py-8 sm:py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-soft">Sign in to your account to manage orders and checkout faster.</p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 sm:text-sm">
            <AlertCircleIcon className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="mb-1.5 block font-display text-base font-bold text-ink">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="login-email"
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

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="login-password" className="font-display text-base font-bold text-ink">
                Password <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched('password')}
                placeholder="Enter your password"
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
                Please enter your password (minimum 6 characters)
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
