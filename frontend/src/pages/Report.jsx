import { useState } from 'react'
import { updateStock, isUsingFallback } from '../api/pharmacyApi'
import ErrorMessage from '../components/ErrorMessage'
import { dummyMedicines } from '../data/dummyData'

const STATUS_OPTIONS = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
]

const EMPTY_FORM = { pharmacyId: '', medicineId: '', status: '' }

function Report() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate that every field is filled.
    if (!form.pharmacyId.trim() || !form.medicineId.trim() || !form.status) {
      setError('Please fill in all fields before submitting.')
      return
    }

    setSubmitting(true)

    try {
      await updateStock(form.pharmacyId.trim(), form.medicineId.trim(), form.status)
      setSuccess('Thanks! The stock status has been updated.')
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(
        err.message || 'Could not submit your report. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app">
      <section className="page">
      <h1>Report stock</h1>
      <p className="page__sub">
        Pharmacy staff can update whether a medicine is currently available.
      </p>

      {isUsingFallback() && (
        <p className="notice">
          Backend not reachable — submissions are simulated.
        </p>
      )}

      <form className="report-form" onSubmit={handleSubmit}>
        <label>
          Pharmacy ID
          <input
            type="text"
            value={form.pharmacyId}
            onChange={(e) => update('pharmacyId', e.target.value)}
            placeholder="e.g. ph1"
          />
        </label>

        <label>
          Medicine
          <input
            type="text"
            list="medicine-options"
            value={form.medicineId}
            onChange={(e) => update('medicineId', e.target.value)}
            placeholder="e.g. paracetamol"
          />
          <datalist id="medicine-options">
            {dummyMedicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </datalist>
        </label>

        <label>
          Status
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
          >
            <option value="">Select status…</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit report'}
        </button>
      </form>

      <ErrorMessage message={error} />

      {success && (
        <p className="success-message" role="status">
          {success}
        </p>
      )}
      </section>
    </div>
  )
}

export default Report
