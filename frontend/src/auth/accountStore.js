// Local "database" for self-registered accounts, until the real /api/auth/*
// endpoints exist. Sits alongside the read-only DEMO_ACCOUNTS: sign-in checks
// the demo list first, then whatever a visitor has registered here.
//
// Stored shape (one entry per account):
//   { role, name, identifier, password, phone?, pharmacyName?, slpcId?, createdAt }

import { DEMO_ACCOUNTS } from './demoAccounts'

const STORAGE_KEY = 'medifind.accounts'

function normalise(identifier) {
  return String(identifier || '').trim().toLowerCase()
}

export function listAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveAccounts(accounts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
  } catch {
    // Storage unavailable (private mode / quota) — the account still works for
    // this session because register() also sets the active user.
  }
}

/** True when an identifier is already taken by a demo or registered account. */
export function identifierExists(identifier) {
  const id = normalise(identifier)
  if (!id) return false
  const inDemo = DEMO_ACCOUNTS.some((a) => normalise(a.identifier) === id)
  const inStore = listAccounts().some((a) => normalise(a.identifier) === id)
  return inDemo || inStore
}

/**
 * Validate a sign-in against registered accounts.
 * @returns `{ role, identifier, name }` on success, or `null`.
 */
export function verifyStoredCredentials({ role, identifier, password }) {
  const id = normalise(identifier)
  const account = listAccounts().find(
    (a) => normalise(a.identifier) === id && (!role || a.role === role),
  )
  if (!account || account.password !== password) return null
  return { role: account.role, identifier: account.identifier, name: account.name }
}

/**
 * Persist a new account.
 * @returns `{ ok: true, account }` or `{ ok: false, error }`.
 */
export function createAccount({ role, name, identifier, password, phone, pharmacyName, slpcId }) {
  const id = String(identifier || '').trim()
  if (!role || !id || !password) {
    return { ok: false, error: 'Missing required account details.' }
  }
  if (identifierExists(id)) {
    return { ok: false, error: 'An account already exists for that email or ID. Try signing in.' }
  }

  const account = {
    role,
    name: String(name || '').trim() || id,
    identifier: id,
    password,
    phone: String(phone || '').trim() || undefined,
    pharmacyName: String(pharmacyName || '').trim() || undefined,
    slpcId: String(slpcId || '').trim() || undefined,
    createdAt: new Date().toISOString(),
  }

  saveAccounts([...listAccounts(), account])
  return { ok: true, account }
}
