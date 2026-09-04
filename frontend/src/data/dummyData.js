// Fallback data used when the backend is not reachable, so the UI can be
// tested independently. The shape here mirrors what the real API returns.

export const dummyMedicines = [
  { id: 'paracetamol', name: 'Paracetamol 500mg' },
  { id: 'amoxicillin', name: 'Amoxicillin 250mg' },
  { id: 'metformin', name: 'Metformin 500mg' },
  { id: 'losartan', name: 'Losartan 50mg' },
]

// Keyed by a normalised medicine query -> list of pharmacy results.
export const dummyResults = {
  paracetamol: [
    {
      id: 'ph1-paracetamol',
      pharmacyId: 'ph1',
      pharmacyName: 'Union Chemists',
      address: '417 Union Place, Colombo 02',
      phone: '011 234 5678',
      medicineId: 'paracetamol',
      medicineName: 'Paracetamol 500mg',
      status: 'in_stock',
      price: 45,
      updatedAt: '2026-09-03T09:20:00Z',
    },
    {
      id: 'ph2-paracetamol',
      pharmacyId: 'ph2',
      pharmacyName: 'Osusala Nugegoda',
      address: '128 High Level Road, Nugegoda',
      phone: '011 285 1122',
      medicineId: 'paracetamol',
      medicineName: 'Paracetamol 500mg',
      status: 'low_stock',
      price: 42,
      updatedAt: '2026-09-02T16:45:00Z',
    },
  ],
  amoxicillin: [
    {
      id: 'ph3-amoxicillin',
      pharmacyId: 'ph3',
      pharmacyName: 'City Pharmacy Kandy',
      address: '22 Dalada Veediya, Kandy',
      phone: '081 220 3344',
      medicineId: 'amoxicillin',
      medicineName: 'Amoxicillin 250mg',
      status: 'in_stock',
      price: 180,
      updatedAt: '2026-09-04T07:10:00Z',
    },
  ],
  metformin: [
    {
      id: 'ph1-metformin',
      pharmacyId: 'ph1',
      pharmacyName: 'Union Chemists',
      address: '417 Union Place, Colombo 02',
      phone: '011 234 5678',
      medicineId: 'metformin',
      medicineName: 'Metformin 500mg',
      status: 'out_of_stock',
      price: 90,
      updatedAt: '2026-08-30T11:00:00Z',
    },
  ],
}

// Look up fallback results the same way the backend would resolve a query.
export function getDummyResults(query) {
  const key = String(query || '').trim().toLowerCase()
  if (!key) return []

  if (dummyResults[key]) return dummyResults[key]

  // Loose contains match so partial queries still return something useful.
  const match = Object.keys(dummyResults).find(
    (k) => k.includes(key) || key.includes(k),
  )
  return match ? dummyResults[match] : []
}
