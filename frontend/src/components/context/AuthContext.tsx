import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { isLoggedIn, logout as apiLogout, type AuthUser } from '../../data/api'

interface AuthContextType {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  isAuthenticated: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('sg_user')
      if (savedUser) {
        try {
          return JSON.parse(savedUser)
        } catch (e) {
          return null
        }
      }
    }
    return null
  })
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isLoggedIn())

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem('sg_user', JSON.stringify(newUser))
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('sg_user')
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    const authStatus = isLoggedIn()
    setIsAuthenticated(authStatus)
    if (!authStatus) {
      setUser(null)
    }
  }, [])

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
