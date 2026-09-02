import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../components/context/CartContext'
import { useAuth } from '../components/context/AuthContext'

export function Cart() {
  const { cart, loading, error, removeCartItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Please log in to view your cart</h2>
        <Link to="/login" className="inline-block bg-primary text-white px-4 py-2 rounded-lg">
          Log In
        </Link>
      </div>
    )
  }

  if (loading) return <div className="p-8 text-center">Loading cart...</div>

  if (error) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-500 font-semibold">{error}</p>
        <Link to="/shop" className="inline-block text-primary underline">
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
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
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      <div className="space-y-2">
        {cart.items.map((item) => (
          <div key={item._id || item.product._id} className="flex justify-between items-center border p-4 rounded-lg">
            <div className="flex gap-4 items-center">
              <img src={item.product.imageURL || '/fallback.png'} alt={item.product.title} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <h3 className="font-bold">{item.product?.title}</h3>
                <p>Qty: {item.quantity}</p>
                <p className="font-semibold text-brand-700">Rs {item.product.discountPrice ?? item.product.price}</p>
              </div>
            </div>
            <button
              onClick={() => removeCartItem(item.product._id)}
              className="text-red-500 font-semibold text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center mb-4 text-xl font-bold">
          <span>Total:</span>
          <span>
            Rs {cart.items.reduce((acc, item) => acc + (item.product.discountPrice ?? item.product.price) * item.quantity, 0).toLocaleString()}
          </span>
        </div>
        <Link to="/checkout" className="block w-full text-center bg-brand-700 text-white font-bold py-3 rounded-xl hover:bg-brand-800 transition-colors">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}