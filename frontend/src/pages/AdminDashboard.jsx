import { useEffect, useMemo, useState } from 'react'
import MaterialSymbol from '../components/layout/MaterialSymbol'
import PortalShell from './portal/PortalShell'
import { PanelCard, StatCard } from './portal/PortalWidgets'
import { useAuth } from '../auth/useAuth'
import {
  addMedicine,
  createPharmacy,
  deletePharmacy,
  getStats,
  listPharmacies,
  updateMedicine,
  updatePharmacy,
} from '../api/adminApi'

const STATUS_OPTIONS = ['In Stock', 'Low Stock', 'Out of Stock']
const TABS = [
  { id: 'pharmacies', label: 'Pharmacies', icon: 'storefront' },
  { id: 'medicines', label: 'Medicines', icon: 'medication' },
  { id: 'stats', label: 'Stats', icon: 'monitoring' },
]

function Notice({ notice }) {
  if (!notice) return null
  return (
    <div
      role="status"
      className={`p-space-sm rounded-xl font-body-sm text-body-sm mb-space-md ${
        notice.type === 'error'
          ? 'bg-error-container text-on-error-container'
          : 'bg-secondary-container/40 text-on-secondary-container'
      }`}
    >
      {notice.text}
    </div>
  )
}

/**
 * Admin console: manage every pharmacy and its medicines, plus quick network
 * stats. Route access is gated by `<RequireAuth roles={[ROLES.ADMIN]} />` in
 * App.jsx; every call here also carries the JWT for the backend's own check.
 */
function AdminDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('pharmacies')

  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState(null)

  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState('')

  function flash(type, text) {
    setNotice({ type, text })
    if (type === 'success') {
      setTimeout(() => setNotice((current) => (current?.text === text ? null : current)), 3000)
    }
  }

  async function loadPharmacies() {
    setLoading(true)
    setLoadError('')
    try {
      const data = await listPharmacies(user.token)
      setPharmacies(data)
    } catch (err) {
      setLoadError(err.message || 'Could not load pharmacies.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Kicks off the initial fetch; the resulting setState calls happen
    // inside it, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPharmacies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tab !== 'stats') return
    let cancelled = false
    async function loadStats() {
      setStatsLoading(true)
      setStatsError('')
      try {
        const data = await getStats(user.token)
        if (!cancelled) setStats(data)
      } catch (err) {
        if (!cancelled) setStatsError(err.message || 'Could not load stats.')
      } finally {
        if (!cancelled) setStatsLoading(false)
      }
    }
    loadStats()
    return () => {
      cancelled = true
    }
  }, [tab, user.token])

  return (
    <PortalShell
      title="NMRA Telemetry & Oversight Console"
      subtitle="Manage the pharmacy network — add or remove pharmacies and correct their medicine stock."
      icon="monitoring"
    >
      <div className="flex items-center gap-space-xs mb-space-lg border-b border-outline-variant/30">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-1.5 px-space-md h-11 font-label-md text-label-md border-b-2 transition-colors ${
              tab === t.id
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <MaterialSymbol name={t.icon} className="text-[18px]" />
            {t.label}
          </button>
        ))}
      </div>

      <Notice notice={notice} />

      {loading && <p className="font-body-md text-body-md text-on-surface-variant">Loading pharmacies…</p>}

      {!loading && loadError && (
        <div
          role="alert"
          className="p-space-md rounded-xl bg-error-container text-on-error-container font-body-md text-body-md"
        >
          {loadError}
        </div>
      )}

      {!loading && !loadError && tab === 'pharmacies' && (
        <PharmaciesTab
          token={user.token}
          pharmacies={pharmacies}
          setPharmacies={setPharmacies}
          flash={flash}
        />
      )}

      {!loading && !loadError && tab === 'medicines' && (
        <MedicinesTab
          token={user.token}
          pharmacies={pharmacies}
          setPharmacies={setPharmacies}
          flash={flash}
        />
      )}

      {tab === 'stats' && (
        <StatsTab stats={stats} loading={statsLoading} error={statsError} />
      )}
    </PortalShell>
  )
}

// ---------------------------------------------------------------------------

const EMPTY_PHARMACY_FORM = { name: '', location: '' }

function PharmaciesTab({ token, pharmacies, setPharmacies, flash }) {
  const [form, setForm] = useState(EMPTY_PHARMACY_FORM)
  const [formError, setFormError] = useState('')
  const [creating, setCreating] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(EMPTY_PHARMACY_FORM)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setFormError('Pharmacy name is required.')
      return
    }
    setFormError('')
    setCreating(true)
    try {
      const pharmacy = await createPharmacy(token, form)
      setPharmacies((prev) => [...prev, pharmacy])
      setForm(EMPTY_PHARMACY_FORM)
      flash('success', `${pharmacy.name} added.`)
    } catch (err) {
      setFormError(err.message || 'Could not create the pharmacy.')
    } finally {
      setCreating(false)
    }
  }

  function startEdit(pharmacy) {
    setEditingId(pharmacy._id)
    setEditForm({ name: pharmacy.name, location: pharmacy.location || '' })
  }

  async function handleSaveEdit(id) {
    if (!editForm.name.trim()) {
      flash('error', 'Pharmacy name is required.')
      return
    }
    setSavingEdit(true)
    try {
      const updated = await updatePharmacy(token, id, editForm)
      setPharmacies((prev) => prev.map((p) => (p._id === id ? updated : p)))
      setEditingId(null)
      flash('success', 'Pharmacy updated.')
    } catch (err) {
      flash('error', err.message || 'Could not update the pharmacy.')
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleDelete(pharmacy) {
    if (!window.confirm(`Delete "${pharmacy.name}"? This cannot be undone.`)) return
    setDeletingId(pharmacy._id)
    try {
      await deletePharmacy(token, pharmacy._id)
      setPharmacies((prev) => prev.filter((p) => p._id !== pharmacy._id))
      flash('success', `${pharmacy.name} deleted.`)
    } catch (err) {
      flash('error', err.message || 'Could not delete the pharmacy.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <PanelCard icon="add_business" title="Add new pharmacy">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row sm:items-end gap-space-sm">
          <label className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }))
                setFormError('')
              }}
              placeholder="e.g. Suwasetha Pharmacy"
              className="h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </label>
          <label className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Location</span>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Matara"
              className="h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </label>
          <button
            type="submit"
            disabled={creating || !form.name.trim()}
            className="inline-flex items-center justify-center gap-1 h-10 px-space-md rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <MaterialSymbol name={creating ? 'progress_activity' : 'add'} className="text-[16px]" />
            {creating ? 'Adding…' : 'Add pharmacy'}
          </button>
        </form>
        {formError && <p className="font-body-sm text-body-sm text-error mt-space-xs">{formError}</p>}
      </PanelCard>

      <PanelCard icon="table_rows" title={`All pharmacies (${pharmacies.length})`}>
        {pharmacies.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant">No pharmacies yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="py-space-xs pr-space-sm font-label-sm text-label-sm text-on-surface-variant">Name</th>
                  <th className="py-space-xs pr-space-sm font-label-sm text-label-sm text-on-surface-variant">Location</th>
                  <th className="py-space-xs pr-space-sm font-label-sm text-label-sm text-on-surface-variant">Medicines</th>
                  <th className="py-space-xs font-label-sm text-label-sm text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pharmacies.map((pharmacy) => {
                  const isEditing = editingId === pharmacy._id
                  return (
                    <tr key={pharmacy._id} className="border-b border-outline-variant/20 align-top">
                      <td className="py-space-sm pr-space-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="h-9 px-2 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm w-full min-w-[10rem]"
                          />
                        ) : (
                          <span className="font-label-md text-label-md text-on-surface">{pharmacy.name}</span>
                        )}
                      </td>
                      <td className="py-space-sm pr-space-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                            className="h-9 px-2 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm w-full min-w-[8rem]"
                          />
                        ) : (
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            {pharmacy.location || '—'}
                          </span>
                        )}
                      </td>
                      <td className="py-space-sm pr-space-sm font-body-sm text-body-sm text-on-surface-variant">
                        {pharmacy.medicines?.length || 0}
                      </td>
                      <td className="py-space-sm text-right whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(pharmacy._id)}
                              disabled={savingEdit}
                              className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors disabled:opacity-50"
                            >
                              {savingEdit ? 'Saving…' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => startEdit(pharmacy)}
                              className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(pharmacy)}
                              disabled={deletingId === pharmacy._id}
                              className="px-2.5 py-1 rounded-lg bg-error-container text-on-error-container font-label-sm text-label-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                              {deletingId === pharmacy._id ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>
    </div>
  )
}

// ---------------------------------------------------------------------------

function MedicinesTab({ token, pharmacies, setPharmacies, flash }) {
  const [selectedId, setSelectedId] = useState(pharmacies[0]?._id || '')
  const selected = useMemo(
    () => pharmacies.find((p) => p._id === selectedId) || null,
    [pharmacies, selectedId],
  )

  const [newName, setNewName] = useState('')
  const [newStatus, setNewStatus] = useState('In Stock')
  const [adding, setAdding] = useState(false)

  const [draft, setDraft] = useState({})
  const [savingId, setSavingId] = useState(null)

  function replacePharmacy(updated) {
    setPharmacies((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!selected) return
    const trimmed = newName.trim()
    if (!trimmed) {
      flash('error', 'Enter a medicine name.')
      return
    }
    setAdding(true)
    try {
      const updated = await addMedicine(token, selected._id, { name: trimmed, status: newStatus })
      replacePharmacy(updated)
      setNewName('')
      setNewStatus('In Stock')
      flash('success', `${trimmed} added to ${selected.name}.`)
    } catch (err) {
      flash('error', err.message || 'Could not add the medicine.')
    } finally {
      setAdding(false)
    }
  }

  async function handleSaveStatus(medicineId) {
    const status = draft[medicineId]
    if (!status || !selected) {
      flash('error', 'Choose a status before saving.')
      return
    }
    setSavingId(medicineId)
    try {
      const updated = await updateMedicine(token, selected._id, medicineId, { status })
      replacePharmacy(updated)
      setDraft((prev) => {
        const next = { ...prev }
        delete next[medicineId]
        return next
      })
      flash('success', 'Medicine updated.')
    } catch (err) {
      flash('error', err.message || 'Could not update the medicine.')
    } finally {
      setSavingId(null)
    }
  }

  if (pharmacies.length === 0) {
    return (
      <PanelCard icon="medication" title="Medicines">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Add a pharmacy first on the Pharmacies tab.
        </p>
      </PanelCard>
    )
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <PanelCard icon="storefront" title="Select a pharmacy">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-10 px-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary max-w-sm"
        >
          {pharmacies.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </PanelCard>

      {selected && (
        <>
          <PanelCard icon="add_circle" title={`Add a medicine to ${selected.name}`}>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row sm:items-end gap-space-sm">
              <label className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Medicine name</span>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
          </PanelCard>

          <PanelCard icon="table_rows" title="Medicines">
            {selected.medicines.length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant">No medicines on file yet.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-outline-variant/30">
                {selected.medicines.map((med) => {
                  const pending = draft[med._id] ?? ''
                  const saving = savingId === med._id
                  return (
                    <li key={med._id} className="py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <p className="font-label-md text-label-md text-on-surface">{med.name}</p>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">({med.status})</span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <select
                          value={pending}
                          onChange={(e) => setDraft((prev) => ({ ...prev, [med._id]: e.target.value }))}
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
                          onClick={() => handleSaveStatus(med._id)}
                          disabled={saving || !pending}
                          className="inline-flex items-center gap-1 h-9 px-space-sm rounded-lg bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MaterialSymbol name={saving ? 'progress_activity' : 'save'} className="text-[16px]" />
                          {saving ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </PanelCard>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------

function StatsTab({ stats, loading, error }) {
  if (loading) {
    return <p className="font-body-md text-body-md text-on-surface-variant">Loading stats…</p>
  }
  if (error) {
    return (
      <div role="alert" className="p-space-md rounded-xl bg-error-container text-on-error-container font-body-md text-body-md">
        {error}
      </div>
    )
  }
  if (!stats) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-space-md">
      <StatCard icon="storefront" value={stats.totalPharmacies} label="Total pharmacies" />
      <StatCard icon="medication" value={stats.totalMedicines} label="Medicines tracked" />
      <StatCard icon="warning" value={stats.lowOrOutOfStock} label="Low / out of stock" />
    </div>
  )
}

export default AdminDashboard
