import React from 'react'
import { NavLink } from 'react-router-dom'
import { GridIcon, HomeIcon, ShoppingCartIcon, UserIcon } from 'lucide-react'

const TABS = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/shop', label: 'Shop', icon: GridIcon },
  { to: '/cart', label: 'Cart', icon: ShoppingCartIcon, badge: '3' },
  { to: '/checkout', label: 'Account', icon: UserIcon },
]

export function MobileTabBar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur md:hidden"
    >
      <ul className="flex">
        {TABS.map(({ to, label, icon: Icon, badge }) => (
          <li key={label} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors duration-150 ease-soft ${
                  isActive ? 'text-brand-700' : 'text-ink-faint'
                }`
              }
            >
              <span className="relative">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {badge ? (
                  <span className="absolute -right-2 -top-1.5 rounded-full bg-sale px-1 text-[9px] font-bold text-white">
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
