import React from 'react'
import { NavLink } from 'react-router-dom'
import { GridIcon, HomeIcon, ShoppingCartIcon, UserIcon } from 'lucide-react'
import { useCart } from './context/CartContext'
import { useAuth } from './context/AuthContext'

export function MobileTabBar() {
  const { cart } = useCart()
  const { isAuthenticated } = useAuth()
  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

  const tabs = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/shop', label: 'Shop', icon: GridIcon },
    { to: '/cart', label: 'Cart', icon: ShoppingCartIcon, badge: cartCount > 0 ? String(cartCount) : null },
    { to: isAuthenticated ? '/profile' : '/login', label: 'Account', icon: UserIcon },
  ]

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur md:hidden"
    >
      <ul className="flex">
        {tabs.map(({ to, label, icon: Icon, badge }) => (
          <li key={label} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex min-h-[48px] flex-col items-center justify-center gap-1 py-1.5 text-[10px] font-semibold transition-colors duration-150 ease-soft ${
                  isActive ? 'text-brand-700' : 'text-ink-faint'
                }`
              }
            >
              <span className="relative">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {badge ? (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-sale px-1 text-[9px] font-bold text-white">
                    {badge}
                  </span>
                ) : null}
              </span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
