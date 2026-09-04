import { useNavigate } from 'react-router-dom'
import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { useAuth } from '../../auth/useAuth'
import { ROLE_META } from '../../auth/roles'

/**
 * Shared frame for the role portals: page title, the signed-in identity + role
 * badge, a sign-out action, and the role-specific body as `children`.
 */
function PortalShell({ title, subtitle, icon, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const meta = ROLE_META[user.role]

  function handleSignOut() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md mb-space-xl">
        <div className="flex items-start gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-secondary-fixed flex items-center justify-center shrink-0">
            <MaterialSymbol name={icon} className="text-[26px]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm mb-1">
              <MaterialSymbol name={meta.icon} className="text-[14px]" />
              {meta.label}
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">{title}</h1>
            {subtitle && (
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="text-right hidden sm:block">
            <p className="font-label-md text-label-md text-on-surface">{user.name}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{user.identifier}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-space-md h-10 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors"
          >
            <MaterialSymbol name="logout" className="text-[18px]" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {children}
    </div>
  )
}

export default PortalShell
