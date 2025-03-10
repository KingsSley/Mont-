"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "admin" | "guest"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: UserRole
  login: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("guest")

  // Check for existing auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth")
    if (storedAuth) {
      const { role } = JSON.parse(storedAuth)
      setIsAuthenticated(true)
      setUserRole(role)
    }
  }, [])

  const login = (password: string): boolean => {
    // Admin password check
    if (password === "ASHFAR2017") {
      setIsAuthenticated(true)
      setUserRole("admin")
      // Store auth state in localStorage
      localStorage.setItem("auth", JSON.stringify({ role: "admin" }))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole("guest")
    localStorage.removeItem("auth")
  }

  return <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

