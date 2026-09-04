import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './useAuth'
import { verifyCredentials } from './demoAccounts'
import { createAccount, verifyStoredCredentials } from './accountStore'

/**
 * Client-side auth state for MediFind LK.
 *
 * There is no auth backend yet, so `login()` checks the submitted credentials
 * against the demo accounts in `demoAccounts.js` and persists a session to
 * localStorage on success. When the real `/api/auth/*` endpoints land, replace
 * the `verifyCredentials` call with a fetch and keep the `{ ok, error }` shape.
 */

const STORAGE_KEY = 'medifind.auth'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && parsed.role ? parsed : null
  } catch {
    return null
  }
}

/** Turn an email / SLPC id into a friendly display name for the portal header. */
function deriveName(identifier) {
  const value = String(identifier || '').trim()
  if (!value) return 'Signed-in user'
  const local = value.includes('@') ? value.split('@')[0] : value
  return local.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
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

  const login = useCallback(({ role, identifier, password }) => {
    // Demo accounts first, then anything the visitor has registered locally.
    const account =
      verifyCredentials({ role, identifier, password }) ||
      verifyStoredCredentials({ role, identifier, password })
    if (!account) {
      return { ok: false, error: 'Incorrect email / ID or password for the selected role.' }
    }
    setUser({
      role: account.role,
      identifier: account.identifier,
      name: account.name || deriveName(account.identifier),
    })
    return { ok: true }
  }, [])

  /**
   * Create a new account and sign straight in.
   * `fields` = { role, name, identifier, password, phone?, pharmacyName?, slpcId? }
   * Returns `{ ok: true }` or `{ ok: false, error }`.
   */
  const register = useCallback((fields) => {
    const result = createAccount(fields)
    if (!result.ok) return result

    const { account } = result
    setUser({
      role: account.role,
      identifier: account.identifier,
      name: account.name || deriveName(account.identifier),
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
