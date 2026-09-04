const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { ok: false, error: data.error || 'Something went wrong. Please try again.' }
  }
  return { ok: true, token: data.token, user: data.user }
}

function networkErrorResult(err) {
  if (err instanceof TypeError) {
    return { ok: false, error: 'Cannot reach the server. Please check your connection and try again.' }
  }
  throw err
}

// POST ${VITE_API_URL}/api/auth/login
export async function loginRequest({ role, identifier, password }) {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email: identifier, password }),
    })
    return await parseResponse(res)
  } catch (err) {
    return networkErrorResult(err)
  }
}

// POST ${VITE_API_URL}/api/auth/register
export async function registerRequest({ role, name, identifier, password, phone, pharmacyName, slpcId }) {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, name, email: identifier, password, phone, pharmacyName, slpcId }),
    })
    return await parseResponse(res)
  } catch (err) {
    return networkErrorResult(err)
  }
}
