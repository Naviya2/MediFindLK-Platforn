import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import AuthCard from '../features/auth/AuthCard'
import AuthTrustSection from '../features/auth/AuthTrustSection'
import MaterialSymbol from '../components/layout/MaterialSymbol'
import { useAuth } from '../auth/useAuth'
import { roleHome } from '../auth/roles'

/**
 * Role-based authentication entry point (Citizen / Pharmacist / System Admin).
 *
 * There is no auth backend yet, so a "sign in" trusts the chosen role, stores a
 * session, and redirects to that role's portal (or wherever the user was headed
 * before the guard bounced them here).
 */
function LoginPage() {
  const { isAuthenticated, user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Already signed in? Skip the form.
  if (isAuthenticated) {
    return <Navigate to={roleHome(user.role)} replace />
  }

  const redirectTo = location.state?.from?.pathname
  const initialMode =
    new URLSearchParams(location.search).get('tab') === 'register' ? 'register' : 'signin'

  async function handleSignIn({ role, identifier, password }) {
    const result = await login({ role, identifier, password })
    if (result.ok) {
      navigate(redirectTo || roleHome(role), { replace: true })
    }
    return result
  }

  async function handleRegister({ role, ...fields }) {
    const result = await register({ role, ...fields })
    if (result.ok) {
      navigate(roleHome(role), { replace: true })
    }
    return result
  }

  return (
    <AuthLayout>
      <div className="relative w-full max-w-container-max mx-auto py-space-xl md:py-space-2xl flex flex-col items-center justify-center">
        {/* Ambient healthcare glow */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="absolute w-[560px] h-[560px] bg-secondary-container/20 rounded-full blur-3xl -top-24 -left-20" />
          <div className="absolute w-[480px] h-[480px] bg-surface-container-highest/60 rounded-full blur-2xl -bottom-24 -right-16" />
        </div>

        {redirectTo && (
          <div className="w-full max-w-2xl mb-space-md flex items-start gap-space-xs p-space-sm rounded-xl bg-primary-container/10 text-on-surface">
            <MaterialSymbol name="lock" className="text-primary text-[18px] mt-0.5" />
            <p className="font-body-sm text-body-sm">
              Please sign in to continue to <strong className="text-primary">{redirectTo}</strong>.
            </p>
          </div>
        )}

        <AuthCard
          onSignIn={handleSignIn}
          onRegister={handleRegister}
          initialMode={initialMode}
        />
        <AuthTrustSection />
      </div>
    </AuthLayout>
  )
}

export default LoginPage
