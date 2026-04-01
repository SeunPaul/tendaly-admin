import Cookies from 'js-cookie'
import api from './api'

export interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  is_suspended: boolean
}

const TOKEN_COOKIE = 'admin_token'
const USER_COOKIE = 'admin_user'

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7, // 7 days
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const response = await api.post('/admin/login', { email, password })
  const { access_token, admin } = response.data.data

  Cookies.set(TOKEN_COOKIE, access_token, COOKIE_OPTIONS)
  Cookies.set(USER_COOKIE, JSON.stringify(admin), COOKIE_OPTIONS)

  return admin
}

export function logout(): void {
  Cookies.remove(TOKEN_COOKIE)
  Cookies.remove(USER_COOKIE)
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE)
}

export function getAdmin(): AdminUser | null {
  const raw = Cookies.get(USER_COOKIE)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
