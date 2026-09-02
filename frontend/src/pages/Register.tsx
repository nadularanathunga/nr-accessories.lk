import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(name, email, password, phone)
      setUser(user)
      window.location.href = '/' // Refresh state
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink">Create an account</h1>
          <p className="mt-2 text-sm text-ink-soft">Join us to shop for premium accessories.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-line-strong px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
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
            <label className="mb-1.5 block text-sm font-semibold text-ink">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-line-strong px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              placeholder="07X XXX XXXX"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line-strong px-4 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
              placeholder="Create a password"
            />
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
