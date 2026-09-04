import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './useAuth'
import { loginRequest, registerRequest } from '../api/authApi'

/**
 * JWT-backed auth state for MediFind LK. `login()` / `register()` call the
 * `/api/auth/*` endpoints and persist the returned `{ token, role, identifier,
 * name }` session to localStorage.
 */

const STORAGE_KEY = 'medifind.auth'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && parsed.role && parsed.token ? parsed : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  // Persist / clear the session whenever it changes.
  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage failures (private mode, quota) — session stays in memory.
    }
  }, [user])

  // Keep tabs in sync: a sign-out in one tab signs out the others.
  useEffect(() => {
    function sync(event) {
      if (event.key === STORAGE_KEY) setUser(readStoredUser())
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const login = useCallback(async ({ role, identifier, password }) => {
    const result = await loginRequest({ role, identifier, password })
    if (!result.ok) return result

    setUser({
      token: result.token,
      role: result.user.role,
      identifier: result.user.email,
      name: result.user.name,
    })
    return { ok: true }
  }, [])

  /**
   * Create a new account and sign straight in.
   * `fields` = { role, name, identifier, password, phone?, pharmacyName?, slpcId? }
   * Returns `{ ok: true }` or `{ ok: false, error }`.
   */
  const register = useCallback(async (fields) => {
    const result = await registerRequest(fields)
    if (!result.ok) return result

    setUser({
      token: result.token,
      role: result.user.role,
      identifier: result.user.email,
      name: result.user.name,
    })
    return { ok: true }
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      hasRole: (...roles) => Boolean(user) && roles.includes(user.role),
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
