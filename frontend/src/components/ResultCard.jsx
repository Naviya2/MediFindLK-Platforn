const STATUS_LABELS = {
  in_stock: 'In stock',
  low_stock: 'Low stock',
  out_of_stock: 'Out of stock',
}

function formatUpdated(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString()
}

// Renders one pharmacy's availability for a searched medicine.
function ResultCard({ result }) {
  const statusKey = result.status || 'unknown'
  const statusLabel = STATUS_LABELS[statusKey] || 'Unknown'
  const updated = formatUpdated(result.updatedAt)

  return (
    <article className="result-card">
      <div className="result-card__head">
        <h3>{result.pharmacyName}</h3>
        <span className={`status-badge status-badge--${statusKey}`}>
          {statusLabel}
        </span>
      </div>

      <p className="result-card__medicine">{result.medicineName}</p>

      {result.address && (
        <p className="result-card__meta">{result.address}</p>
      )}
      {result.phone && (
        <p className="result-card__meta">{result.phone}</p>
      )}

      <div className="result-card__foot">
        {result.price != null && <span>Rs. {result.price}</span>}
        {updated && <span>Updated {updated}</span>}
      </div>
    </article>
  )
}

export default ResultCard
