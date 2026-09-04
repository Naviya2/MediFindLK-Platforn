import { useEffect, useState } from 'react'
import { getCriticalShortages, isUsingFallback } from '../api/pharmacyApi'
import ResultCard from '../components/ResultCard'
import ErrorMessage from '../components/ErrorMessage'

function CriticalShortages() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const data = await getCriticalShortages()
      setResults(data)
    } catch (err) {
      setError('Failed to load critical shortages. Please try again later.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const outOfStockCount = results.filter((r) => r.status === 'out_of_stock').length
  const lowStockCount = results.filter((r) => r.status === 'low_stock').length

  return (
    <div className="app">
      <section className="page">
        <h1>Critical Shortages</h1>
        <p className="page__sub">
          Monitor medicines that are currently running low or out of stock across our network.
        </p>

        {isUsingFallback() && (
          <p className="notice">Backend not reachable — showing dummy data fallback (if available).</p>
        )}

        {loading && <p className="loading">Loading shortage data…</p>}

        <ErrorMessage message={error} onRetry={loadData} />

        {!loading && !error && results.length > 0 && (
          <div className="mb-6 flex gap-4 text-label-lg text-on-surface-variant font-medium">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-error"></span>
              {outOfStockCount} Out of Stock
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              {lowStockCount} Low Stock
            </span>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="empty-state">
            <p>No critical shortages reported at this time. All systems normal!</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="result-list">
            {results.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default CriticalShortages
