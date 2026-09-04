import { useEffect, useState } from 'react'
import MaterialSymbol from '../components/layout/MaterialSymbol'
import PortalShell from './portal/PortalShell'
import { PanelCard, StatCard } from './portal/PortalWidgets'
import { useAuth } from '../auth/useAuth'
import { addMyMedicine, getMyPharmacy, updateMyMedicineStatus } from '../api/pharmacyApi'

const STATUS_OPTIONS = ['In Stock', 'Low Stock', 'Out of Stock']

const STATUS_TONE = {
  'In Stock': 'bg-[#ecfdf5] text-[#065f46]',
  'Low Stock': 'bg-[#fffbeb] text-[#92400e]',
  'Out of Stock': 'bg-error-container text-on-error-container',
}

/**
 * Pharmacist's own inventory console: loads the signed-in pharmacist's
 * pharmacy via GET /api/pharmacy/mine and lets them update each medicine's
 * status via PUT /api/pharmacy/mine/medicine/:id. Both calls carry the JWT
 * from the auth context — route access itself is already gated by
 * `<RequireAuth roles={[ROLES.PHARMACIST]} />` in App.jsx.
 */
function PharmacistDashboard() {
  const { user } = useAuth()

  const [pharmacy, setPharmacy] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Per-row pending selection (not yet saved) and per-row status message.
  const [draft, setDraft] = useState({})
  const [savingId, setSavingId] = useState(null)
  const [rowMessage, setRowMessage] = useState({})

  // "Add medicine" form
  const [newName, setNewName] = useState('')
  const [newStatus, setNewStatus] = useState('In Stock')
  const [adding, setAdding] = useState(false)
  const [addMessage, setAddMessage] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setLoadError('')
      try {
        const data = await getMyPharmacy(user.token)
        if (cancelled) return
        setPharmacy(data.pharmacy)
        setMedicines(data.medicines)
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Could not load your pharmacy.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user.token])

  function handleStatusChange(medicineId, value) {
    setDraft((prev) => ({ ...prev, [medicineId]: value }))
    setRowMessage((prev) => ({ ...prev, [medicineId]: null }))
  }

  async function handleSave(medicineId) {
    const status = draft[medicineId]
    if (!status) {
      setRowMessage((prev) => ({
        ...prev,
        [medicineId]: { type: 'error', text: 'Choose a status before saving.' },
      }))
      return
    }

    setSavingId(medicineId)
    setRowMessage((prev) => ({ ...prev, [medicineId]: null }))

    try {
      const data = await updateMyMedicineStatus(user.token, medicineId, status)
      setMedicines(data.medicines)
      setDraft((prev) => {
        const next = { ...prev }
        delete next[medicineId]
        return next
      })
      setRowMessage((prev) => ({ ...prev, [medicineId]: { type: 'success', text: 'Updated.' } }))
    } catch (err) {
      setRowMessage((prev) => ({
        ...prev,
        [medicineId]: { type: 'error', text: err.message || 'Could not save. Please try again.' },
      }))
    } finally {
      setSavingId(null)
    }
  }

  async function handleAddMedicine(e) {
    e.preventDefault()
    const trimmedName = newName.trim()
    if (!trimmedName) {
      setAddMessage({ type: 'error', text: 'Enter a medicine name.' })
      return
    }

    setAdding(true)
    setAddMessage(null)
    try {
      const data = await addMyMedicine(user.token, trimmedName, newStatus)
      setMedicines(data.medicines)
      setNewName('')
      setNewStatus('In Stock')
      setAddMessage({ type: 'success', text: `${trimmedName} added.` })
    } catch (err) {
      setAddMessage({ type: 'error', text: err.message || 'Could not add the medicine. Please try again.' })
    } finally {
      setAdding(false)
    }
  }

  const lowOrOutCount = medicines.filter((m) => m.status !== 'In Stock').length

  return (
    <PortalShell
      title="Dispensary Inventory Console"
      subtitle="Keep your public stock levels accurate so patients see what you really have on the shelf."
      icon="inventory_2"
    >
      {loading && <p className="font-body-md text-body-md text-on-surface-variant">Loading your pharmacy…</p>}

      {!loading && loadError && (
        <div
          role="alert"
          className="p-space-md rounded-xl bg-error-container text-on-error-container font-body-md text-body-md"
        >
          {loadError}
        </div>
      )}

      {!loading && !loadError && pharmacy && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
            <StatCard icon="medication" value={medicines.length} label="Tracked medicines" />
            <StatCard icon="warning" value={lowOrOutCount} label="Low / out of stock" />
            <StatCard icon="storefront" value={pharmacy.name} label="Pharmacy" />
            <StatCard icon="location_on" value={pharmacy.location || '—'} label="Location" />
          </div>

          <div className="flex flex-col gap-space-lg">
          <PanelCard icon="add_circle" title="Add a medicine">
            <form
              onSubmit={handleAddMedicine}
              className="flex flex-col sm:flex-row sm:items-end gap-space-sm"
            >
              <label className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Medicine name</span>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value)
                    setAddMessage(null)
                  }}
                  placeholder="e.g. Ibuprofen"
                  className="h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Initial status</span>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="h-10 pl-2.5 pr-7 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                disabled={adding || !newName.trim()}
                className="inline-flex items-center justify-center gap-1 h-10 px-space-md rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <MaterialSymbol name={adding ? 'progress_activity' : 'add'} className="text-[16px]" />
                {adding ? 'Adding…' : 'Add medicine'}
              </button>
            </form>

            {addMessage && (
              <p
                role="status"
                className={`font-body-sm text-body-sm mt-space-xs ${
                  addMessage.type === 'error' ? 'text-error' : 'text-secondary'
                }`}
              >
                {addMessage.text}
              </p>
            )}
          </PanelCard>

          <PanelCard icon="table_rows" title="Stock levels">
            {medicines.length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant">
                No medicines on file yet.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-outline-variant/30">
                {medicines.map((med) => {
                  const pending = draft[med.id] ?? ''
                  const saving = savingId === med.id
                  const message = rowMessage[med.id]

                  return (
                    <li key={med.id} className="py-space-sm flex flex-col gap-space-xs">
                      <div className="flex flex-wrap items-center justify-between gap-space-sm">
                        <div className="flex items-center gap-space-sm">
                          <p className="font-label-md text-label-md text-on-surface">{med.name}</p>
                          <span
                            className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap ${STATUS_TONE[med.status] || ''}`}
                          >
                            {med.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-space-xs">
                          <select
                            value={pending}
                            onChange={(e) => handleStatusChange(med.id, e.target.value)}
                            aria-label={`Change status for ${med.name}`}
                            className="h-9 pl-2.5 pr-7 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                          >
                            <option value="">Select status…</option>
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleSave(med.id)}
                            disabled={saving || !pending}
                            className="inline-flex items-center gap-1 h-9 px-space-sm rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MaterialSymbol name={saving ? 'progress_activity' : 'save'} className="text-[16px]" />
                            {saving ? 'Saving…' : 'Save'}
                          </button>
                        </div>
                      </div>

                      {message && (
                        <p
                          role="status"
                          className={`font-body-sm text-body-sm ${
                            message.type === 'error' ? 'text-error' : 'text-secondary'
                          }`}
                        >
                          {message.text}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </PanelCard>
          </div>
        </>
      )}
    </PortalShell>
  )
}

export default PharmacistDashboard
