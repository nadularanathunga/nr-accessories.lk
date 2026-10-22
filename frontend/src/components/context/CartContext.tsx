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

const CART_STORAGE_KEY = 'nr_cart_cache'

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<ApiCart | null>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync to localStorage whenever cart state changes
  useEffect(() => {
    if (cart) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (err) {
        console.warn('Failed to save cart to localStorage', err)
      }
    }
  }, [cart])

  const refreshCart = async () => {
    if (!isAuthenticated) {
      // Retain guest cart from localStorage if present
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY)
        if (saved) {
          setCart(JSON.parse(saved))
        }
      } catch {}
      return
    }
    try {
      setLoading(true)
      const data = await fetchCart()
      setCart(data)
      setError(null)
      if (data) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
      }
    } catch (err: any) {
      // If network fails, fallback to localStorage
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY)
        if (saved) {
          setCart(JSON.parse(saved))
        }
      } catch {}
      setError(err.message || 'Failed to fetch cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [isAuthenticated])

  const addToCart = async (productId: string, quantity = 1) => {
    // QA constraint: Disallow zero and negative quantities
    const safeQty = Math.max(1, parseInt(String(quantity), 10) || 1)
    
    if (!isAuthenticated) {
      // Save to local storage for guest
      setCart((prev) => {
        const currentItems = prev?.items ? [...prev.items] : []
        const existingIdx = currentItems.findIndex(i => (i.product?._id || (i.product as any)) === productId)
        if (existingIdx >= 0) {
          currentItems[existingIdx] = {
            ...currentItems[existingIdx],
            quantity: currentItems[existingIdx].quantity + safeQty
          }
        } else {
          currentItems.push({
            product: { _id: productId, title: 'Item in cart', price: 0, stockQuantity: 99 } as any,
            quantity: safeQty
          })
        }
        return { items: currentItems }
      })
      return
    }

    try {
      setLoading(true)
      const data = await apiAddToCart(productId, safeQty)
      setCart(data)
    } finally {
      setLoading(false)
    }
  }

  const removeCartItem = async (productId: string) => {
    if (!isAuthenticated) {
      setCart((prev) => {
        if (!prev) return null
        const filtered = prev.items.filter(i => (i.product?._id || (i.product as any)) !== productId)
        return { ...prev, items: filtered }
      })
      return
    }
    try {
      setLoading(true)
      const data = await apiRemoveCartItem(productId)
      setCart(data)
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (productId: string, quantity: number) => {
    // QA constraint: Disallow zero and negative quantities
    const safeQty = Math.max(1, parseInt(String(quantity), 10) || 1)

    if (!isAuthenticated) {
      setCart((prev) => {
        if (!prev) return null
        const items = prev.items.map(i => {
          if ((i.product?._id || (i.product as any)) === productId) {
            return { ...i, quantity: safeQty }
          }
          return i
        })
        return { ...prev, items }
      })
      return
    }

    try {
      setLoading(true)
      const data = await apiUpdateCartItem(productId, safeQty)
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
