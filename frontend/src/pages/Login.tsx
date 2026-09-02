import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { login } from '../data/api'
import { useAuth } from '../components/context/AuthContext'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      setUser(user)
      window.location.href = '/' // Refresh to sync auth state across app easily
    } catch (err: any) {
      setError(err.message || 'Failed to login')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-soft">Please enter your details to sign in.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line-strong px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line-strong px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
