'use client'

import { useState, useEffect, useCallback } from 'react'
import { type AdminUser, getAdmin, login as authLogin, logout as authLogout, isAuthenticated } from '@/lib/auth'

interface UseAuthReturn {
  admin: AdminUser | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<AdminUser>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = getAdmin()
    setAdmin(stored)
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AdminUser> => {
    const user = await authLogin(email, password)
    setAdmin(user)
    return user
  }, [])

  const logout = useCallback(() => {
    setAdmin(null)
    authLogout()
  }, [])

  return {
    admin,
    isLoggedIn: isAuthenticated(),
    isLoading,
    login,
    logout,
  }
}
