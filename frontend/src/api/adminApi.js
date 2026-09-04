const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(token, path, options = {}) {
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const listPharmacies = (token) => request(token, '/pharmacies')

export const createPharmacy = (token, { name, location }) =>
  request(token, '/pharmacies', { method: 'POST', body: JSON.stringify({ name, location }) })

export const updatePharmacy = (token, id, { name, location }) =>
  request(token, `/pharmacies/${id}`, { method: 'PUT', body: JSON.stringify({ name, location }) })

export const deletePharmacy = (token, id) =>
  request(token, `/pharmacies/${id}`, { method: 'DELETE' })

export const addMedicine = (token, pharmacyId, { name, status }) =>
  request(token, `/pharmacies/${pharmacyId}/medicines`, {
    method: 'POST',
    body: JSON.stringify({ name, status }),
  })

export const updateMedicine = (token, pharmacyId, medicineId, { name, status }) =>
  request(token, `/pharmacies/${pharmacyId}/medicines/${medicineId}`, {
    method: 'PUT',
    body: JSON.stringify({ name, status }),
  })

export const getStats = (token) => request(token, '/stats')
