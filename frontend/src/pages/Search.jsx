import { useState } from 'react'
import { searchMedicine, isUsingFallback } from '../api/pharmacyApi'
import ResultCard from '../components/ResultCard'
import ErrorMessage from '../components/ErrorMessage'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Tracks whether a search has actually run, so we don't show "No results"
  // before the user has searched for anything.
  const [searched, setSearched] = useState(false)

  async function runSearch(e) {
    if (e) e.preventDefault()

    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setError('')

    try {
      const data = await searchMedicine(trimmed)
      setResults(data)
      setSearched(true)
    } catch (err) {
      setError(
        err.message || 'Something went wrong while searching. Please try again.',
      )
      setResults([])
      setSearched(false)
    } finally {
      setLoading(false)
    }
  }

  const showNoResults = searched && !loading && !error && results.length === 0

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
        <p className="notice">
          Backend not reachable — showing sample data.
        </p>
      )}

      {loading && <p className="loading">Searching pharmacies…</p>}

      <ErrorMessage message={error} onRetry={runSearch} />

      {showNoResults && (
        <p className="empty-state">
          No results found for “{query.trim()}”. Try another spelling or
          medicine name.
        </p>
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

export default Search
