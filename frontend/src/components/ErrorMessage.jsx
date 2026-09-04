// Small inline error banner shared by Search and Report.
function ErrorMessage({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="error-message" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="link-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
