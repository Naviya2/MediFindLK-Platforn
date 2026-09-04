// Stand-in "user database" until the real /api/auth/* endpoints exist.
// verifyCredentials() is the single place that decides whether a login is valid;
// swap its body for a fetch when the backend lands and keep the return shape.

export const DEMO_ACCOUNTS = [
  {
    role: 'citizen',
    identifier: 'citizen@medifind.lk',
    password: 'citizen123',
    name: 'Nimali Perera',
  },
  {
    role: 'pharmacist',
    identifier: 'pharmacist@medifind.lk',
    password: 'pharma123',
    name: 'Union Chemists',
  },
  {
    role: 'admin',
    identifier: 'admin@health.gov.lk',
    password: 'admin123',
    name: 'NMRA Duty Director',
  },
]

/**
 * @returns the matching account (`{ role, identifier, name }`) on success,
 *          or `null` when the identifier / password / role don't line up.
 */
export function verifyCredentials({ role, identifier, password }) {
  const id = String(identifier || '').trim().toLowerCase()
  const account = DEMO_ACCOUNTS.find(
    (a) => a.role === role && a.identifier.toLowerCase() === id,
  )
  if (!account || account.password !== password) return null

  return { role: account.role, identifier: account.identifier, name: account.name }
}
