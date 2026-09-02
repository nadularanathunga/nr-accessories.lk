import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { fetchCart, addToCart as apiAddToCart, removeCartItem as apiRemoveCartItem, updateCartItem as apiUpdateCartItem, type ApiCart } from '../../data/api'
import { useAuth } from './AuthContext'

interface CartContextType {
  cart: ApiCart | null
  loading: boolean
  error: string | null
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeCartItem: (productId: string) => Promise<void>
  updateCartItem: (productId: string, quantity: number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<ApiCart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart(null)
      return
    }
    try {
      setLoading(true)
      const data = await fetchCart()
      setCart(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [isAuthenticated])

  const addToCart = async (productId: string, quantity = 1) => {
    if (!isAuthenticated) {
        throw new Error('Please login to add to cart')
    }
    try {
      setLoading(true)
      const data = await apiAddToCart(productId, quantity)
      setCart(data)
    } finally {
      setLoading(false)
    }
  }

  const removeCartItem = async (productId: string) => {
    if (!isAuthenticated) return
    try {
      setLoading(true)
      const data = await apiRemoveCartItem(productId)
      setCart(data)
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return
    try {
      setLoading(true)
      const data = await apiUpdateCartItem(productId, quantity)
      setCart(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CartContext.Provider value={{ cart, loading, error, addToCart, removeCartItem, updateCartItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
