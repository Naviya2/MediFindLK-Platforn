import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MaterialSymbol from './MaterialSymbol'
import { useAuth } from '../../auth/useAuth'
import { ROLE_META, roleHome } from '../../auth/roles'

/**
 * Header account control: a "Portal Login" button when signed out, or the
 * signed-in identity with a menu (My portal / Sign out) when signed in.
 */
function HeaderAuth() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!user) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 px-space-md h-10 rounded bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm"
      >
        <MaterialSymbol name="lock" className="text-[18px]" />
        <span>Portal Login</span>
      </Link>
    )
  }

  const meta = ROLE_META[user.role]

  function handleSignOut() {
    setOpen(false)
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 pl-1.5 pr-space-sm h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <MaterialSymbol name={meta.icon} className="text-on-primary text-[16px]" />
        </span>
        <span className="hidden sm:flex flex-col items-start leading-tight">
          <span className="font-label-sm text-label-sm text-on-surface">{user.name}</span>
          <span className="font-body-sm text-[10px] text-on-surface-variant">{meta.short}</span>
        </span>
        <MaterialSymbol name="expand_more" className="text-on-surface-variant text-[16px]" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-lg py-1.5 z-50">
            <div className="px-space-md py-space-2xs border-b border-outline-variant/20">
              <p className="font-label-md text-label-md text-on-surface">{user.name}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{meta.label}</p>
            </div>
            <Link
              to={roleHome(user.role)}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-space-md py-space-xs text-body-sm text-on-surface hover:bg-surface-container-low hover:text-primary"
            >
              <MaterialSymbol name="dashboard" className="text-[18px] text-secondary" />
              My portal
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-space-md py-space-xs text-body-sm text-on-surface hover:bg-surface-container-low hover:text-primary"
            >
              <MaterialSymbol name="logout" className="text-[18px] text-on-surface-variant" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default HeaderAuth
