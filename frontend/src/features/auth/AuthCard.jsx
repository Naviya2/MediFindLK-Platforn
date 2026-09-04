import { useState } from 'react'
import MaterialSymbol from '../../components/layout/MaterialSymbol'
import RoleSelector from './RoleSelector'
import SignInForm from './SignInForm'
import CreateAccountForm from './CreateAccountForm'
import { DEFAULT_ROLE_ID, getRole } from './authContent'

/**
 * The main authentication bento panel: role switcher, dynamic role note, and the
 * Sign In / Register Pharmacy tabbed forms.
 */
function AuthCard({ onSignIn, onRegister, initialMode = 'signin' }) {
  const [roleId, setRoleId] = useState(DEFAULT_ROLE_ID)
  const [mode, setMode] = useState(initialMode) // 'signin' | 'register'

  const role = getRole(roleId)
  // Admin accounts are provisioned by the NMRA, so that role has no "create
  // account" tab and is forced back to sign-in.
  const activeMode = role.canRegister ? mode : 'signin'
  const registerTab = role.register?.tab || 'Create Account'

  function handleRole(nextId) {
    setRoleId(nextId)
    if (!getRole(nextId).canRegister) setMode('signin')
  }

  return (
    <div className="w-full max-w-2xl bg-surface-container-lowest shadow-xl rounded-xl p-space-md md:p-space-xl flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-space-xs">
        <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center shadow-sm text-secondary">
          <MaterialSymbol
            name="local_pharmacy"
            className="text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
        </div>
        <div className="flex flex-col gap-space-2xs">
          <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
            Secure Health Grid
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
            Access Healthcare &amp; Telemetry Network
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
            Connect to Sri Lanka&rsquo;s national pharmaceutical stock and dispensary verification
            ecosystem.
          </p>
        </div>
      </div>

      <RoleSelector selectedId={roleId} onSelect={handleRole} />

      {/* Dynamic role context */}
      <div className="flex items-start gap-space-xs p-space-sm bg-surface-container-low rounded-lg">
        <MaterialSymbol name="verified_user" className="text-secondary text-[18px] mt-0.5" />
        <p className="font-body-sm text-body-sm text-on-surface">
          <strong className="font-semibold text-primary">{role.contextTitle}</strong>{' '}
          {role.contextBody}
        </p>
      </div>

      {/* Tabs + form */}
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <TabButton active={activeMode === 'signin'} onClick={() => setMode('signin')}>
              Sign In
            </TabButton>
            {role.canRegister && (
              <TabButton active={activeMode === 'register'} onClick={() => setMode('register')}>
                {registerTab}
              </TabButton>
            )}
          </div>
          {activeMode === 'signin' && (
            <a href="#" className="font-label-sm text-label-sm text-secondary hover:underline">
              Forgot password?
            </a>
          )}
        </div>

        {activeMode === 'signin' ? (
          <>
            <SignInForm role={role} onSubmit={(data) => onSignIn?.({ role: role.id, ...data })} />
            {role.canRegister && (
              <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
                New here?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-secondary font-semibold hover:underline"
                >
                  {registerTab}
                </button>
              </p>
            )}
          </>
        ) : (
          <>
            {role.register?.subtitle && (
              <p className="font-body-sm text-body-sm text-on-surface-variant -mt-space-2xs">
                {role.register.subtitle}
              </p>
            )}
            <CreateAccountForm
              role={role}
              onSubmit={(data) => onRegister?.({ role: role.id, ...data })}
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-secondary font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-headline-sm text-headline-sm pb-1 relative transition-colors ${
        active ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary font-medium'
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full" />
      )}
    </button>
  )
}

export default AuthCard
