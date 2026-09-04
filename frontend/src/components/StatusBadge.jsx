const STATUS_LABELS = {
  in_stock: 'In stock',
  low_stock: 'Low stock',
  out_of_stock: 'Out of stock',
}

// Color-coded pill: green = in stock, yellow = low stock, red = out of stock.
function StatusBadge({ status }) {
  const key = status || 'unknown'
  const label = STATUS_LABELS[key] || 'Unknown'

  return <span className={`status-badge status-badge--${key}`}>{label}</span>
}

export default StatusBadge
