import React, { useEffect, useState } from 'react'
import { fetchAdminStats } from '../data/api'
import { PackageIcon, ShoppingCartIcon, AlertTriangleIcon, CheckCircle2Icon } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalProducts: number
    totalOrders: number
    lowStockCount: number
    recentOrders: any[]
  }>({
    totalProducts: 0,
    totalOrders: 0,
    lowStockCount: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load admin stats:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Store Admin Dashboard</h1>
          <p className="text-sm text-ink-soft">Week 08: Database Integration & Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 border border-emerald-200 w-fit">
          <CheckCircle2Icon className="h-4 w-4" />
          <span>Database connected ✓</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border border-line bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-soft">Products</p>
            <p className="font-display text-3xl font-bold text-ink mt-1">
              {loading ? '...' : stats.totalProducts}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <PackageIcon className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-soft">Orders</p>
            <p className="font-display text-3xl font-bold text-ink mt-1">
              {loading ? '...' : stats.totalOrders}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <ShoppingCartIcon className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-soft">Low Stock Items</p>
            <p className="font-display text-3xl font-bold text-amber-600 mt-1">
              {loading ? '...' : stats.lowStockCount}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <AlertTriangleIcon className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-ink">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-brand-600 hover:underline">
            View all orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-ink-soft border-b border-line">
              <tr>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink-soft">
                    Loading recent orders...
                  </td>
                </tr>
              ) : stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink-soft">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono font-medium text-ink">
                      #{order._id.substring(order._id.length - 6)}
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {order.user?.name || 'Customer'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                          order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.orderStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-ink">
                      LKR {order.totalAmount?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
