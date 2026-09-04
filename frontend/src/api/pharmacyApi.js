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

// GET ${VITE_API_URL}/api/pharmacies — every pharmacy with its medicines.
// Powers the public "Pharmacy Network" page.
export async function listPharmacies() {
  const res = await fetch(`${API_URL}/api/pharmacies`)
  if (!res.ok) throw new Error(`Could not load pharmacies (${res.status})`)
  return res.json()
}

// GET ${VITE_API_URL}/api/pharmacy/mine — the signed-in pharmacist's own
// pharmacy + medicines. Requires a JWT with role "pharmacist".
export async function getMyPharmacy(token) {
  const res = await fetch(`${API_URL}/api/pharmacy/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Could not load your pharmacy (${res.status})`)
  return data
}

// POST ${VITE_API_URL}/api/pharmacy/mine/medicine
// Adds a new medicine to the signed-in pharmacist's own pharmacy.
export async function addMyMedicine(token, name, status) {
  const res = await fetch(`${API_URL}/api/pharmacy/mine/medicine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, status }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Could not add the medicine (${res.status})`)
  return data
}

// PUT ${VITE_API_URL}/api/pharmacy/mine/medicine/${medicineId}
// Updates one medicine's status on the signed-in pharmacist's own pharmacy.
export async function updateMyMedicineStatus(token, medicineId, status) {
  const res = await fetch(`${API_URL}/api/pharmacy/mine/medicine/${medicineId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Could not save the update (${res.status})`)
  return data
}

// GET ${VITE_API_URL}/api/critical-shortages — public
// Fetches all medicines globally marked as low stock or out of stock.
export async function getCriticalShortages() {
  const res = await fetch(`${API_URL}/api/critical-shortages`)
  if (!res.ok) throw new Error(`Could not load critical shortages (${res.status})`)
  return res.json()
}
