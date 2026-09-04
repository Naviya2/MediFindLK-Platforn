import { useId, useState } from 'react'
import MaterialSymbol from '../../components/layout/MaterialSymbol'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+()\d][\d\s()-]{6,}$/

const EMPTY = {
  name: '',
  pharmacyName: '',
  slpcId: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="font-body-sm text-body-sm text-error flex items-center gap-1">
      <MaterialSymbol name="error" className="text-[15px]" />
      {message}
    </p>
  )
}

/**
 * Self-service account creation. Adapts to the selected role:
 *  - citizen    -> name, email, mobile, password
 *  - pharmacist -> + registered pharmacy name & SLPC registration ID
 *
 * `onSubmit(values)` should return (or resolve to) `{ ok: true }` on success or
 * `{ ok: false, error }` so the form can surface why it was rejected.
 */
function CreateAccountForm({ role, onSubmit }) {
  const baseId = useId()
  const reg = role.register ?? {}
  const needsPharmacy = Boolean(reg.needsPharmacyFields)

  const [values, setValues] = useState(EMPTY)
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (event) => {
      const { value } = event.target
      setValues((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      setFormError('')
    }
  }

  function validate() {
    const next = {}
    if (!values.name.trim()) next.name = 'Enter your name.'

    if (needsPharmacy) {
      if (!values.pharmacyName.trim()) next.pharmacyName = 'Enter the registered pharmacy name.'
      if (!values.slpcId.trim()) next.slpcId = 'Enter your SLPC registration ID.'
    }

    const email = values.email.trim()
    if (!email) next.email = 'Enter an email address.'
    else if (!EMAIL_RE.test(email)) next.email = 'Enter a valid email address.'

    const phone = values.phone.trim()
    if (!phone) next.phone = 'Enter a mobile number.'
    else if (!PHONE_RE.test(phone)) next.phone = 'Enter a valid mobile number.'

    if (!values.password) next.password = 'Choose a password.'
    else if (values.password.length < 8) next.password = 'Use at least 8 characters.'

    if (values.confirmPassword !== values.password) {
      next.confirmPassword = 'Passwords do not match.'
    }
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    if (!agreed) next.agreed = 'Please accept the terms to continue.'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      const result = await onSubmit?.({
        name: values.name.trim(),
        identifier: values.email.trim(),
        password: values.password,
        phone: values.phone.trim(),
        pharmacyName: needsPharmacy ? values.pharmacyName.trim() : undefined,
        slpcId: needsPharmacy ? values.slpcId.trim() : undefined,
      })
      if (result && result.ok === false) {
        setFormError(result.error || 'Could not create the account. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const fields = [
    {
      field: 'name',
      label: needsPharmacy ? 'Contact Person Name' : 'Full Name',
      icon: 'person',
      placeholder: needsPharmacy ? 'e.g. Dr. K. Jayasuriya' : 'e.g. Nimali Perera',
      type: 'text',
      autoComplete: 'name',
      show: true,
    },
    {
      field: 'pharmacyName',
      label: 'Registered Pharmacy Name',
      icon: 'store',
      placeholder: 'e.g. Union Chemists Private Limited',
      type: 'text',
      autoComplete: 'organization',
      show: needsPharmacy,
    },
    {
      field: 'slpcId',
      label: 'SLPC Registration ID',
      icon: 'badge',
      placeholder: 'e.g. SLPC-2024-8891',
      type: 'text',
      autoComplete: 'off',
      show: needsPharmacy,
    },
    {
      field: 'email',
      label: needsPharmacy ? 'Dispensary Email' : 'Email Address',
      icon: 'mail',
      placeholder: needsPharmacy ? 'pharmacy@medifind.lk' : 'you@email.com',
      type: 'email',
      autoComplete: 'email',
      show: true,
    },
    {
      field: 'phone',
      label: 'Contact Mobile',
      icon: 'call',
      placeholder: '+94 77 123 4567',
      type: 'tel',
      autoComplete: 'tel',
      show: true,
    },
  ].filter((f) => f.show)

  const inputClass = (invalid) =>
    `w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-primary font-body-md text-body-md shadow-sm focus:outline-none focus:ring-2 transition-all ${
      invalid ? 'ring-2 ring-error focus:ring-error' : 'focus:ring-secondary'
    }`

  return (
    <form className="flex flex-col gap-space-md" onSubmit={handleSubmit} noValidate>
      {fields.map(({ field, label, icon, placeholder, type, autoComplete }) => {
        const id = `${baseId}-${field}`
        return (
          <div key={field} className="flex flex-col gap-1.5">
            <label htmlFor={id} className="font-label-md text-label-md text-on-surface">
              {label}
            </label>
            <div className="relative flex items-center">
              <MaterialSymbol
                name={icon}
                className="absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none"
              />
              <input
                id={id}
                type={type}
                autoComplete={autoComplete}
                value={values[field]}
                onChange={update(field)}
                placeholder={placeholder}
                aria-invalid={Boolean(errors[field])}
                aria-describedby={errors[field] ? `${id}-err` : undefined}
                className={inputClass(errors[field])}
                style={{ boxShadow: 'inset 0 1px 2px rgba(15, 41, 66, 0.08)' }}
              />
            </div>
            <FieldError id={`${id}-err`} message={errors[field]} />
          </div>
        )
      })}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {['password', 'confirmPassword'].map((field) => {
          const id = `${baseId}-${field}`
          return (
            <div key={field} className="flex flex-col gap-1.5">
              <label htmlFor={id} className="font-label-md text-label-md text-on-surface">
                {field === 'password' ? 'Create Password' : 'Confirm Password'}
              </label>
              <div className="relative flex items-center">
                <MaterialSymbol
                  name="lock"
                  className="absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none"
                />
                <input
                  id={id}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values[field]}
                  onChange={update(field)}
                  placeholder="Min. 8 characters"
                  aria-invalid={Boolean(errors[field])}
                  aria-describedby={errors[field] ? `${id}-err` : undefined}
                  className={inputClass(errors[field])}
                  style={{ boxShadow: 'inset 0 1px 2px rgba(15, 41, 66, 0.08)' }}
                />
              </div>
              <FieldError id={`${id}-err`} message={errors[field]} />
            </div>
          )
        })}
      </div>

      <label className="flex items-center gap-space-xs cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(event) => setShowPassword(event.target.checked)}
          className="w-4 h-4 rounded bg-surface-container-low text-secondary accent-secondary focus:ring-0 cursor-pointer"
        />
        <span className="font-body-sm text-body-sm text-on-surface-variant">Show password</span>
      </label>

      {reg.note && (
        <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-surface-container-low text-on-surface leading-snug">
          <MaterialSymbol
            name={needsPharmacy ? 'gavel' : 'shield'}
            className="text-secondary text-[18px] mt-0.5 flex-shrink-0"
          />
          <p className="font-body-sm text-body-sm text-on-surface-variant">{reg.note}</p>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-space-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => {
              setAgreed(event.target.checked)
              setErrors((prev) => ({ ...prev, agreed: undefined }))
            }}
            className="w-4 h-4 mt-0.5 rounded bg-surface-container-low text-secondary accent-secondary focus:ring-0 cursor-pointer"
          />
          <span className="font-body-sm text-body-sm text-on-surface">
            I agree to the{' '}
            <a href="#" className="text-secondary hover:underline">
              Terms of Use
            </a>{' '}
            and{' '}
            <a href="#" className="text-secondary hover:underline">
              Privacy Notice
            </a>
            .
          </span>
        </label>
        <FieldError id={`${baseId}-agreed-err`} message={errors.agreed} />
      </div>

      {formError && (
        <div
          role="alert"
          className="flex items-start gap-space-xs p-space-sm rounded-xl bg-error-container text-on-error-container leading-snug"
        >
          <MaterialSymbol name="gpp_bad" className="text-[20px] mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm font-semibold">
              Could not create account
            </span>
            <p className="font-body-sm text-body-sm mt-0.5">{formError}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-12 bg-primary hover:bg-secondary text-on-primary rounded-xl font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{submitting ? 'Creating account…' : reg.cta || 'Create Account'}</span>
        <MaterialSymbol
          name={submitting ? 'progress_activity' : 'arrow_forward'}
          className="text-[20px]"
        />
      </button>
    </form>
  )
}

export default CreateAccountForm
