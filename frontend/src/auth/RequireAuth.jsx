import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { roleHome } from './roles'
import AccessDenied from '../pages/portal/AccessDenied'

/**
 * Route guard. Wrap a set of routes with `<RequireAuth roles={[...]} />`:
 *
 *  - not signed in       -> redirect to /login (remembering where they came from)
 *  - signed in, wrong role -> render the 403 AccessDenied page
 *  - signed in, allowed    -> render the nested route
 *
 * Omit `roles` to allow any authenticated user.
 */
function RequireAuth({ roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <AccessDenied requiredRoles={roles} currentHome={roleHome(user.role)} />
  }

  return <Outlet />
}

export default RequireAuth
