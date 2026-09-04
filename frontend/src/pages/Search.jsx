import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMedicine, isUsingFallback } from '../api/pharmacyApi'
import ResultCard from '../components/ResultCard'
import ErrorMessage from '../components/ErrorMessage'
import AISuggestionPanel from '../components/AISuggestionPanel'

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
]

function Search() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('medicine') || '')
  const [results, setResults] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Tracks whether a search has actually run, so we don't show "No results"
  // before the user has searched for anything.
  const [searched, setSearched] = useState(false)

  async function runSearch(e, value = query) {
    if (e) e.preventDefault()

    const trimmed = value.trim()
    if (!trimmed) return

    setLoading(true)
    setError('')

    try {
      const data = await searchMedicine(trimmed)
      setResults(data)
      setStatusFilter('all')
      setSearched(true)
    } catch {
      // Keep this user-facing message generic — the raw error (network
      // failure, non-2xx status, bad JSON) isn't something a patient needs to
      // see or can act on.
      setError('Something went wrong while searching. Please try again.')
      setResults([])
      setSearched(false)
    } finally {
      setLoading(false)
    }
  }

  // Arriving from the home page's search bar (?medicine=...) runs the search
  // immediately instead of leaving the user to press Search again.
  useEffect(() => {
    const initial = searchParams.get('medicine')
    if (initial && initial.trim()) {
      // Kicks off the network fetch that arrived from the home page; the
      // resulting setState calls happen inside that async call, not
      // synchronously in the effect body.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      runSearch(null, initial)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // "Not found nearby" is about the medicine itself, so it's judged on every
  // result the API returned, not on whatever the status filter narrows to.
  const noneUsable =
    results.length === 0 || results.every((r) => r.status !== 'in_stock')
  const showNotFoundNearby = searched && !loading && !error && noneUsable

  const filteredResults = useMemo(() => {
    if (statusFilter === 'all') return results
    return results.filter((r) => r.status === statusFilter)
  }, [results, statusFilter])

  const showFilterBar = searched && !loading && !error && results.length > 0
  const showFilteredEmpty =
    showFilterBar && !showNotFoundNearby && filteredResults.length === 0

  return (
    <div className="app">
      <section className="page">
        <h1>Find a medicine</h1>
        <p className="page__sub">
          Search for a medicine to see which pharmacies have it in stock.
        </p>

        <form className="search-form" onSubmit={runSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Paracetamol"
            aria-label="Medicine name"
          />
          <button type="submit" disabled={loading || !query.trim()}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {isUsingFallback() && (
          <p className="notice">Backend not reachable — showing sample data.</p>
        )}

        {loading && <p className="loading">Searching pharmacies…</p>}

        <ErrorMessage message={error} onRetry={runSearch} />

        {showFilterBar && (
          <div className="filter-bar" role="group" aria-label="Filter by stock status">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`filter-chip${statusFilter === f.value ? ' is-active' : ''}`}
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {showNotFoundNearby && (
          <div className="empty-state">
            <p>This medicine wasn't found nearby.</p>
            <AISuggestionPanel medicine={query.trim()} />
          </div>
        )}

        {showFilteredEmpty && (
          <p className="empty-state">No results match this filter. Try a different status.</p>
        )}

        {!loading && filteredResults.length > 0 && (
          <div className="result-list">
            {filteredResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Search
