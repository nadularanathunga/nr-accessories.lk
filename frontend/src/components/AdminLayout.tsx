import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { PackageIcon, UsersIcon, SettingsIcon, LogOutIcon } from 'lucide-react'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  // Protect Admin route
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
          <p className="text-ink-soft mb-4">You do not have permission to view this page.</p>
          <Link to="/" className="text-brand-600 underline">Return to Home</Link>
        </div>
      </div>
    )
  }

  const navItems = [
    { name: 'Products', path: '/admin/products', icon: PackageIcon },
    { name: 'Users', path: '/admin/users', icon: UsersIcon },
    { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
  ]

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar */}
      <aside className="w-64 border-r border-line bg-white hidden md:block">
        <div className="p-6">
          <h2 className="font-display text-xl font-bold text-ink">Admin Panel</h2>
        </div>
        <nav className="space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-line p-4">
           <button 
             onClick={() => { logout(); window.location.href = '/' }}
             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
           >
             <LogOutIcon className="h-5 w-5" />
             Sign out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
