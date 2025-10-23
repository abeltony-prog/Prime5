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

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [manager, setManager] = useState<Manager | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
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
    setIsLoading(false)
  }, [])

  const login = (managerData: Manager) => {
    setManager(managerData)
    localStorage.setItem("teamManager", JSON.stringify(managerData))
  }

  const logout = () => {
    setManager(null)
    localStorage.removeItem("teamManager")
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