"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface Manager {
  id: string
  name: string
  email: string
  team?: {
    id: string
    name: string
    shortName: string
    logo?: string | null
  } | null
}

interface AuthContextType {
  manager: Manager | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (managerData: Manager) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Safe version of useAuth that doesn't throw during SSR
export function useAuthSafe() {
  const context = useContext(AuthContext)
  return context || { manager: null, isAuthenticated: false, isLoading: true, login: () => {}, logout: () => {} }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [manager, setManager] = useState<Manager | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    // Only run this on client side
    if (typeof window !== 'undefined') {
      const savedManager = localStorage.getItem("teamManager")
      if (savedManager) {
        try {
          const managerData = JSON.parse(savedManager)
          setManager(managerData)
        } catch (error) {
          console.error("Error parsing saved manager data:", error)
          localStorage.removeItem("teamManager")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = (managerData: Manager) => {
    setManager(managerData)
    if (typeof window !== 'undefined') {
      localStorage.setItem("teamManager", JSON.stringify(managerData))
    }
  }

  const logout = () => {
    setManager(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("teamManager")
    }
  }

  const value: AuthContextType = {
    manager,
    isAuthenticated: !!manager,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 