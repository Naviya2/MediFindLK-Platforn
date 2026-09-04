// PLACEHOLDER — a teammate is building the real AI suggestion logic.
// Wire it up by replacing the body below with the actual recommendation UI;
// keep the `medicine` prop as the entry point (whatever query didn't turn up
// nearby stock).
function AISuggestionPanel({ medicine }) {
  return (
    <div className="ai-suggestion-panel" data-placeholder="ai-suggestion-panel">
      <p className="ai-suggestion-panel__tag">AI Suggestions (coming soon)</p>
      <p>
        We'll suggest nearby alternatives or substitutes for &ldquo;{medicine}&rdquo; here once the
        AI recommendation feature is ready.
      </p>
    </div>
  )
}

export default AISuggestionPanel
