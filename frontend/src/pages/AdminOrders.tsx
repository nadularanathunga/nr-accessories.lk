import React, { useEffect, useState } from 'react'
import { fetchAdminOrders, updateOrderStatusAPI } from '../data/api'
import { RefreshCwIcon, CheckIcon } from 'lucide-react'

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const loadOrders = () => {
    setLoading(true)
    fetchAdminOrders()
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching admin orders:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)
    try {
      await updateOrderStatusAPI(orderId, newStatus)
      setSuccessMsg(`Order #${orderId.substring(orderId.length - 6)} updated to ${newStatus}`)
      setTimeout(() => setSuccessMsg(null), 3000)
      loadOrders()
    } catch (err: any) {
      alert(err.message || 'Failed to update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled']

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Manage Orders</h1>
          <p className="text-sm text-ink-soft">View customer orders & update fulfillment status</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-gray-50"
        >
          <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-ink-soft border-b border-line">
            <tr>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Total Amount</th>
              <th className="px-6 py-4 font-semibold">Payment Status</th>
              <th className="px-6 py-4 font-semibold">Order Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-ink-soft">
                  Loading orders from database...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-ink-soft">
                  No orders found in database.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono font-medium text-ink">
                    #{order._id.substring(order._id.length - 6)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-ink">{order.user?.name || 'Customer'}</div>
                    <div className="text-xs text-ink-soft">{order.user?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-ink">
                    LKR {order.totalAmount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium uppercase ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${
                        order.orderStatus === 'completed' || order.orderStatus === 'shipped'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {order.orderStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      disabled={updatingId === order._id}
                      value={order.orderStatus || 'pending'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-ink shadow-sm focus:border-brand-500 focus:outline-none"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          Set to {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
