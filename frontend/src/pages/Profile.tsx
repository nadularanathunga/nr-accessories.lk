import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/context/AuthContext'
import { updateProfile } from '../data/api'
import { Button } from '../components/ui/Button'
import { UserIcon, PhoneIcon, MapPinIcon } from 'lucide-react'

export function Profile() {
  const { user, setUser, logout } = useAuth()
  
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  
  const [addressLine1, setAddressLine1] = useState(user?.addresses?.[0]?.addressLine1 || '')
  const [city, setCity] = useState(user?.addresses?.[0]?.city || '')
  const [district, setDistrict] = useState(user?.addresses?.[0]?.district || '')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
      setAddressLine1(user.addresses?.[0]?.addressLine1 || '')
      setCity(user.addresses?.[0]?.city || '')
      setDistrict(user.addresses?.[0]?.district || '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const payload = {
        name,
        phone,
        addresses: [{ addressLine1, city, district, label: 'Home' }]
      }
      const res = await updateProfile(payload)
      setUser(res.user)
      setMessage({ text: 'Profile updated successfully!', type: 'success' })
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update profile', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col px-4 py-10 sm:py-16">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-6">
        My Profile
      </h1>
      
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-ink">Personal Information</h2>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Full Name</label>
                <div className="flex items-center gap-2 rounded-xl border border-line-strong bg-white px-3 focus-within:border-brand-600">
                  <UserIcon className="h-4 w-4 text-ink-faint" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full bg-transparent text-sm text-ink focus:outline-none"
                    placeholder="Your Name"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Phone</label>
                <div className="flex items-center gap-2 rounded-xl border border-line-strong bg-white px-3 focus-within:border-brand-600">
                  <PhoneIcon className="h-4 w-4 text-ink-faint" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 w-full bg-transparent text-sm text-ink focus:outline-none"
                    placeholder="07X XXX XXXX"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
                <div className="flex items-center gap-2 rounded-xl border border-line-strong bg-white px-3 opacity-60">
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="h-11 w-full bg-transparent text-sm text-ink focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-ink">Shipping Address</h2>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Address Line 1</label>
                <div className="flex items-center gap-2 rounded-xl border border-line-strong bg-white px-3 focus-within:border-brand-600">
                  <MapPinIcon className="h-4 w-4 text-ink-faint" />
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="h-11 w-full bg-transparent text-sm text-ink focus:outline-none"
                    placeholder="123 Main St"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-11 w-full rounded-xl border border-line-strong px-3 text-sm focus:border-brand-600 focus:outline-none"
                  placeholder="Colombo"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="h-11 w-full rounded-xl border border-line-strong px-3 text-sm focus:border-brand-600 focus:outline-none"
                  placeholder="Colombo"
                />
              </div>
            </div>
          </div>

          {message && (
            <div className={`rounded-xl p-3 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="secondary" onClick={() => { logout(); window.location.href = '/' }}>
              Sign out
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
