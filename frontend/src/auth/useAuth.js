import { createContext, useContext } from 'react'

/**
 * Auth context object + hook. Kept in a plain module (no component export) so
 * the provider file (AuthContext.jsx) stays fast-refresh friendly.
 */
export const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>')
  return ctx
}
