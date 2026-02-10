'use client';

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const USERS_STORAGE_KEY = 'coderefine_users'
const SESSION_STORAGE_KEY = 'coderefine_session'

export interface LocalUser {
  email: string
  name?: string
}

interface StoredUser {
  email: string
  password: string
  name?: string
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveStoredUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function getSession(): LocalUser | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!data) return null
    const session = JSON.parse(data)
    // Also set a cookie so middleware can check auth
    document.cookie = `coderefine_auth=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    return session
  } catch {
    return null
  }
}

function saveSession(user: LocalUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
  document.cookie = `coderefine_auth=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

function clearSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_STORAGE_KEY)
  document.cookie = 'coderefine_auth=; path=/; max-age=0; SameSite=Lax'
}

export function signUp(name: string, email: string, password: string): { success: boolean; error?: string; user?: LocalUser } {
  const users = getStoredUsers()
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    return { success: false, error: 'An account with this email already exists' }
  }
  const newUser: StoredUser = { email, password, name }
  users.push(newUser)
  saveStoredUsers(users)

  const sessionUser: LocalUser = { email, name }
  saveSession(sessionUser)
  return { success: true, user: sessionUser }
}

export function signIn(email: string, password: string): { success: boolean; error?: string; user?: LocalUser } {
  const users = getStoredUsers()
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!found) {
    return { success: false, error: 'No account found with this email' }
  }
  if (found.password !== password) {
    return { success: false, error: 'Invalid password' }
  }
  const sessionUser: LocalUser = { email: found.email, name: found.name }
  saveSession(sessionUser)
  return { success: true, user: sessionUser }
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<LocalUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionUser = getSession()
    setUser(sessionUser)
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    router.push('/')
  }, [router])

  return { user, isLoading, error, logout }
}

export function useProtectedRoute() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  return { user, isLoading }
}
