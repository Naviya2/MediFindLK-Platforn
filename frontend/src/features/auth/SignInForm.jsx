import { useId, useState } from 'react'
import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { PASSWORD_RULES } from './authContent'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Credential sign-in form. Field labels / placeholders / CTA text come from the
 * active role.
 *
 * `onSubmit({ identifier, password, remember })` should return (or resolve to)
 * `{ ok: true }` on success or `{ ok: false, error }` so the form can show why
 * the login was rejected.
 */
function SignInForm({ role, onSubmit }) {
  const identifierId = useId()
  const passwordId = useId()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function clearErrors() {
    setErrors({})
    setAuthError('')
  }

  function validate() {
    const next = {}
    const id = identifier.trim()
    if (!id) next.identifier = 'Enter your email or registration ID.'
    else if (id.includes('@') && !EMAIL_RE.test(id)) next.identifier = 'Enter a valid email address.'

    if (!password) next.password = 'Enter your password.'
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.'
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    setAuthError('')
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      const result = await onSubmit?.({ identifier: identifier.trim(), password, remember })
      if (result && result.ok === false) {
        setAuthError(result.error || 'Sign in failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (invalid) =>
    `w-full h-12 pl-11 pr-11 rounded-xl bg-surface-container-lowest text-primary font-body-md text-body-md shadow-sm focus:outline-none focus:ring-2 transition-all ${
      invalid ? 'ring-2 ring-error focus:ring-error' : 'focus:ring-secondary'
    }`

  return (
    <form className="flex flex-col gap-space-md" onSubmit={handleSubmit} noValidate>
      {/* Identifier */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={identifierId}
          className="font-label-md text-label-md text-on-surface flex items-center justify-between"
        >
          <span>{role.identifierLabel}</span>
          <span className="font-metric-mono text-[11px] text-secondary flex items-center gap-0.5 font-semibold">
            <MaterialSymbol name="check_circle" className="text-[14px]" />
            Valid Licenced Domain
          </span>
        </label>
        <div className="relative flex items-center">
          <MaterialSymbol
            name="badge"
            className="absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none"
          />
          <input
            id={identifierId}
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value)
              clearErrors()
            }}
            placeholder={role.identifierPlaceholder}
            aria-invalid={Boolean(errors.identifier)}
            aria-describedby={errors.identifier ? `${identifierId}-err` : undefined}
            className={inputClass(errors.identifier)}
            style={{ boxShadow: 'inset 0 1px 2px rgba(15, 41, 66, 0.08)' }}
          />
          <MaterialSymbol
            name="verified"
            className="absolute right-3.5 text-secondary text-[20px]"
          />
        </div>
        {errors.identifier && (
          <p id={`${identifierId}-err`} className="font-body-sm text-body-sm text-error flex items-center gap-1">
            <MaterialSymbol name="error" className="text-[15px]" />
            {errors.identifier}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={passwordId} className="font-label-md text-label-md text-on-surface">
            Secure Password
          </label>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Encrypted SHA-256
          </span>
        </div>
        <div className="relative flex items-center">
          <MaterialSymbol
            name="lock"
            className="absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none"
          />
          <input
            id={passwordId}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              clearErrors()
            }}
            placeholder="Enter authorised password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? `${passwordId}-err` : undefined}
            className={inputClass(errors.password)}
            style={{ boxShadow: 'inset 0 1px 2px rgba(15, 41, 66, 0.08)' }}
          />
          <button
            type="button"
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors p-1"
          >
            <MaterialSymbol name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
          </button>
        </div>
        {errors.password ? (
          <p id={`${passwordId}-err`} className="font-body-sm text-body-sm text-error flex items-center gap-1">
            <MaterialSymbol name="error" className="text-[15px]" />
            {errors.password}
          </p>
        ) : (
          <div className="flex items-center gap-space-xs mt-0.5 flex-wrap">
            {PASSWORD_RULES.map((rule) => (
              <span
                key={rule}
                className="font-metric-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-low text-secondary flex items-center gap-1"
              >
                <MaterialSymbol name="check" className="text-[13px]" /> {rule}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Auth failure banner */}
      {authError && (
        <div
          role="alert"
          className="flex items-start gap-space-xs p-space-sm rounded-xl bg-error-container text-on-error-container leading-snug"
        >
          <MaterialSymbol name="gpp_bad" className="text-[20px] mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm font-semibold">Sign in failed</span>
            <p className="font-body-sm text-body-sm mt-0.5">{authError}</p>
          </div>
        </div>
      )}

      {/* 2FA notice */}
      <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-secondary-container/30 text-on-surface leading-snug">
        <MaterialSymbol
          name="sms"
          className="text-secondary text-[20px] mt-0.5 flex-shrink-0"
          style={{ fontVariationSettings: "'FILL' 1" }}
        />
        <div className="flex flex-col">
          <span className="font-headline-sm text-headline-sm text-secondary font-semibold">
            2-Factor Security Challenge Active
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            A one-time authentication token is dispatched to your registered mobile number for
            NMRA licence validation.
          </p>
        </div>
      </div>

      {/* Remember device */}
      <label className="flex items-center gap-space-xs cursor-pointer select-none py-1">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="w-4 h-4 rounded bg-surface-container-low text-secondary accent-secondary focus:ring-0 cursor-pointer"
        />
        <span className="font-body-sm text-body-sm text-on-surface">
          Remember this secure dispensary terminal for 30 days
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-12 bg-primary hover:bg-secondary text-on-primary rounded-xl font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{submitting ? 'Verifying credentials…' : role.cta}</span>
        <MaterialSymbol name={submitting ? 'progress_activity' : 'arrow_forward'} className="text-[20px]" />
      </button>
    </form>
  )
}

export default SignInForm
