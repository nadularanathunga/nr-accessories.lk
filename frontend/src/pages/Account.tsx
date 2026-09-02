import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LockIcon, MailIcon, UserIcon, PhoneIcon } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { login, register } from '../data/api'
import { useAuth } from '../components/context/AuthContext'

type Mode = 'login' | 'signup'

export function Account() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from || '/'

  const { setUser } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      let user;
      if (mode === 'login') {
        user = await login(email, password)
      } else {
        user = await register(name, email, password, phone || undefined)
      }
      setUser(user)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-4 py-10 sm:py-16">
      <div className="mb-6 flex rounded-xl border border-line bg-white p-1">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-colors duration-150 ease-soft ${
            mode === 'login' ? 'bg-brand-700 text-white' : 'text-ink-soft hover:text-ink'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-colors duration-150 ease-soft ${
            mode === 'signup' ? 'bg-brand-700 text-white' : 'text-ink-soft hover:text-ink'
          }`}
        >
          Create account
        </button>
      </div>

      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mt-1 text-[13px] text-ink-soft">
        {mode === 'login'
          ? 'Sign in to view your cart and orders.'
          : 'Sign up to start shopping on nr accessories.lk.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">
              Full name
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-line-strong bg-white px-3 focus-within:border-brand-600">
              <UserIcon className="h-4 w-4 text-ink-faint" aria-hidden="true" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full bg-transparent text-sm text-ink focus:outline-none"
                placeholder="Nadula Perera"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">
            Email
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-line-strong bg-white px-3 focus-within:border-brand-600">
            <MailIcon className="h-4 w-4 text-ink-faint" aria-hidden="true" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full bg-transparent text-sm text-ink focus:outline-none"
              placeholder="you@email.com"
            />
          </div>
        </div>

        {mode === 'signup' && (
          <div>
            <label htmlFor="phone" className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">
              Phone (optional)
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-line-strong bg-white px-3 focus-within:border-brand-600">
              <PhoneIcon className="h-4 w-4 text-ink-faint" aria-hidden="true" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 w-full bg-transparent text-sm text-ink focus:outline-none"
                placeholder="07X XXX XXXX"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="password" className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">
            Password
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-line-strong bg-white px-3 focus-within:border-brand-600">
            <LockIcon className="h-4 w-4 text-ink-faint" aria-hidden="true" />
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full bg-transparent text-sm text-ink focus:outline-none"
              placeholder="At least 8 characters"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <Link to="/" className="mt-6 text-center text-[13px] font-semibold text-brand-700">
        Continue browsing without signing in
      </Link>
    </main>
  )
}