import { useEffect, useState } from 'react'
import MaterialSymbol from '../components/layout/MaterialSymbol'
import StatusBadge from '../components/StatusBadge'
import { listPharmacies } from '../api/pharmacyApi'

const STATUS_TO_SNAKE = {
  'In Stock': 'in_stock',
  'Low Stock': 'low_stock',
  'Out of Stock': 'out_of_stock',
}

/** Public directory: every registered pharmacy and the medicines they stock. */
function PharmacyNetwork() {
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await listPharmacies()
        if (!cancelled) setPharmacies(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setError('Could not load the pharmacy network. Please try again shortly.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-2xl">
      <div className="mb-space-xl">
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-space-2xs">
          Pharmacy Network
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Every registered pharmacy on MediFind LK and the medicines they currently have on file.
        </p>
      </div>

      {loading && <p className="font-body-md text-body-md text-on-surface-variant">Loading pharmacies…</p>}

      {!loading && error && (
        <div
          role="alert"
          className="p-space-md rounded-xl bg-error-container text-on-error-container font-body-md text-body-md"
        >
          {error}
        </div>
      )}

      {!loading && !error && pharmacies.length === 0 && (
        <p className="font-body-md text-body-md text-on-surface-variant">
          No pharmacies are registered yet.
        </p>
      )}

      {!loading && !error && pharmacies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {pharmacies.map((pharmacy) => (
            <div
              key={pharmacy._id}
              className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm"
            >
              <div className="flex items-start gap-space-sm">
                <div className="w-10 h-10 rounded-lg bg-primary-container text-secondary-fixed flex items-center justify-center shrink-0">
                  <MaterialSymbol name="storefront" className="text-[20px]" />
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">{pharmacy.name}</h2>
                  {pharmacy.location && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <MaterialSymbol name="location_on" className="text-[14px]" />
                      {pharmacy.location}
                    </p>
                  )}
                </div>
              </div>

              {!pharmacy.medicines || pharmacy.medicines.length === 0 ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  No medicines on file yet.
                </p>
              ) : (
                <ul className="flex flex-col divide-y divide-outline-variant/30">
                  {pharmacy.medicines.map((med) => (
                    <li
                      key={med._id}
                      className="py-space-2xs flex items-center justify-between gap-space-sm"
                    >
                      <span className="font-body-sm text-body-sm text-on-surface">{med.name}</span>
                      <StatusBadge status={STATUS_TO_SNAKE[med.status] || 'unknown'} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PharmacyNetwork
