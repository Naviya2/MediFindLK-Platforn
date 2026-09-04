import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const FALLBACK_MESSAGE =
  "We couldn't fetch alternative suggestions right now. Please ask your pharmacist about a substitute."

/**
 * Calls POST /api/ai/suggest for the medicine that wasn't found nearby and
 * renders the AI-suggested alternatives (or a static fallback message if the
 * AI call failed/returned nothing — the backend always responds gracefully).
 */
function AISuggestionPanel({ medicine }) {
  const [suggestions, setSuggestions] = useState([])
  const [fallback, setFallback] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    const trimmed = String(medicine || '').trim()
    if (!trimmed) {
      // No fetch to kick off, so there's nothing to move into an async callback.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError(false)

    fetch(`${API_URL}/api/ai/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicine: trimmed }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : [])
        setFallback(Boolean(data.fallback))
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([])
          setError(true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [medicine])

  const showStaticFallback = !loading && (error || fallback || suggestions.length === 0)

  return (
    <div className="ai-suggestion-panel" data-placeholder="ai-suggestion-panel">
      <p className="ai-suggestion-panel__tag">AI Suggestions</p>

      {loading && <p>Looking for alternatives to &ldquo;{medicine}&rdquo;…</p>}

      {!loading && !showStaticFallback && (
        <>
          <p>
            This medicine wasn&rsquo;t found nearby. You could ask your pharmacist about:{' '}
            <strong>{suggestions.join(', ')}</strong>
          </p>
          <p className="ai-suggestion-panel__disclaimer">
            Suggestion only — not medical advice, please confirm with a pharmacist.
          </p>
        </>
      )}

      {showStaticFallback && <p>{FALLBACK_MESSAGE}</p>}
    </div>
  )
}

export default AISuggestionPanel
