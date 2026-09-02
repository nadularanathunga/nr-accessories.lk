import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { SiteHeader } from './components/SiteHeader'
import { SiteFooter } from './components/SiteFooter'
import { MobileTabBar } from './components/MobileTabBar'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

import { PaymentSuccess } from './pages/PaymentSuccess'
import { PaymentCancel } from './pages/PaymentCancel'

import { AuthProvider } from './components/context/AuthContext'
import { CartProvider } from './components/context/CartContext'
import { AdminLayout } from './components/AdminLayout'
import { AdminProducts } from './pages/AdminProducts'

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
      <div className="flex min-h-screen w-full flex-col bg-canvas pb-14 md:pb-0">
        <SiteHeader />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<AdminProducts />} />
              {/* Other admin routes can be added here later */}
            </Route>

            {/* Catch-all: වෙනත් නැති Route එකකට ගියොත් Home එකට යැවීම */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <SiteFooter />
        <MobileTabBar />
      </div>
    </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}