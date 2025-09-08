"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated")
      const loginTime = localStorage.getItem("adminLoginTime")
      
      if (authStatus === "true" && loginTime) {
        // Check if login is not older than 24 hours
        const loginDate = new Date(loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
        
        if (hoursDiff < 24) {
          setIsAuthenticated(true)
          setSessionTimeLeft(24 - hoursDiff)
        } else {
          // Session expired
          localStorage.removeItem("adminAuthenticated")
          localStorage.removeItem("adminLoginTime")
          setIsAuthenticated(false)
          setSessionTimeLeft(0)
        }
      } else {
        setIsAuthenticated(false)
        setSessionTimeLeft(0)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Update session time every minute
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      const loginTime = localStorage.getItem("adminLoginTime")
      if (loginTime) {
        const loginDate = new Date(loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
        
        if (hoursDiff >= 24) {
          // Session expired
          logout()
        } else {
          setSessionTimeLeft(24 - hoursDiff)
        }
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const login = (username: string, password: string): boolean => {
    if (username === "adminPrime5" && password === "123Prime5ports!") {
      localStorage.setItem("adminAuthenticated", "true")
      localStorage.setItem("adminLoginTime", new Date().toISOString())
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminLoginTime")
    setIsAuthenticated(false)
    setSessionTimeLeft(0)
    router.push("/admin/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
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
