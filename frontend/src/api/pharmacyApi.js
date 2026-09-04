import { getDummyResults } from '../data/dummyData'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Flipped to true the first time a request fails to reach the backend, so the
// rest of the session transparently uses the dummy data fallback.
let useFallback = false

export function isUsingFallback() {
  return useFallback
}

// GET ${VITE_API_URL}/api/search?medicine=${query}
// Resolves to an array of pharmacy results (possibly empty).
export async function searchMedicine(query) {
  const medicine = String(query || '').trim()
  if (!medicine) return []

  if (useFallback) return getDummyResults(medicine)

  try {
    const res = await fetch(
      `${API_URL}/api/search?medicine=${encodeURIComponent(medicine)}`,
    )
    if (!res.ok) throw new Error(`Search failed (${res.status})`)

    const data = await res.json()
    return Array.isArray(data) ? data : data.results || []
  } catch (err) {
    // Network / connection errors mean the backend isn't up yet -> fall back.
    if (isNetworkError(err)) {
      useFallback = true
      return getDummyResults(medicine)
    }
    throw err
  }
}

// PUT ${VITE_API_URL}/api/pharmacy/${pharmacyId}/medicine/${medicineId}
// Body carries the reported stock status.
export async function updateStock(pharmacyId, medicineId, status) {
  if (useFallback) {
    // Pretend the write succeeded so the Report UI can be tested offline.
    return { ok: true, pharmacyId, medicineId, status, fallback: true }
  }

  try {
    const res = await fetch(
      `${API_URL}/api/pharmacy/${pharmacyId}/medicine/${medicineId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      },
    )
    if (!res.ok) throw new Error(`Update failed (${res.status})`)

    return await res.json().catch(() => ({ ok: true }))
  } catch (err) {
    if (isNetworkError(err)) {
      useFallback = true
      return { ok: true, pharmacyId, medicineId, status, fallback: true }
    }
    throw err
  }
}

function isNetworkError(err) {
  return err instanceof TypeError || err.name === 'AbortError'
}
