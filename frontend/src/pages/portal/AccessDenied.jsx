import { Link } from 'react-router-dom'
import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { roleLabel } from '../../auth/roles'

/**
 * Shown when a signed-in user hits a route their role isn't allowed to see.
 * `requiredRoles` is the list the route demands; `currentHome` is where the
 * user's own role lives.
 */
function AccessDenied({ requiredRoles = [], currentHome = '/' }) {
  return (
    <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-3xl">
      <div className="max-w-lg mx-auto text-center flex flex-col items-center gap-space-md">
        <div className="w-14 h-14 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center">
          <MaterialSymbol name="block" className="text-[30px]" />
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          Access restricted
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          This area is limited to{' '}
          <strong className="text-on-surface">
            {requiredRoles.map(roleLabel).join(' / ') || 'authorised staff'}
          </strong>
          . Your account doesn&rsquo;t have the required role.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
          <Link
            to={currentHome}
            className="inline-flex items-center gap-1.5 px-space-md h-10 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors"
          >
            <MaterialSymbol name="dashboard" className="text-[18px]" />
            Go to my portal
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-space-md h-10 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
          >
            <MaterialSymbol name="home" className="text-[18px]" />
            Public home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied
