import { NavLink } from 'react-router-dom'
import MaterialSymbol from './MaterialSymbol'

const NAV_LINKS = [
  { label: 'Home', to: '/', end: true },
  { label: 'Search Medicines', to: '/search-medicines' },
  { label: 'Pharmacy Network', to: '#' },
  { label: 'Critical Shortages', to: '#' },
]

const PORTAL_LINKS = [
  { label: 'Pharmacist Portal', icon: 'local_pharmacy', iconClass: 'text-secondary', to: '#' },
  { label: 'Admin & MOH Console', icon: 'admin_panel_settings', iconClass: 'text-primary', to: '#' },
]

function navClass({ isActive }) {
  return isActive
    ? 'text-primary font-bold border-b-2 border-primary transition-colors py-space-xs'
    : 'text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-colors py-space-xs'
}

/** Sticky top navigation bar. */
function SiteHeader() {
  return (
    <header className="sticky top-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/40">
      <div className="h-16 max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop flex items-center justify-between gap-space-md">
        <NavLink to="/" className="flex items-center gap-space-xs">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <MaterialSymbol name="medication" className="text-on-primary text-[18px]" />
          </span>
          <span className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary leading-tight font-bold tracking-tight">
              MediFind<span className="text-secondary font-bold">LK</span>
            </span>
            <span className="font-label-sm text-[10px] text-on-surface-variant leading-none uppercase tracking-wider">
              Sri Lanka Medicine Locator
            </span>
          </span>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-space-lg h-full">
          {NAV_LINKS.map((link) =>
            link.to === '#' ? (
              <a
                key={link.label}
                href="#"
                className="text-on-surface-variant hover:text-on-surface font-label-lg text-label-lg transition-colors py-space-xs"
              >
                {link.label}
              </a>
            ) : (
              <NavLink key={link.label} to={link.to} end={link.end} className={navClass}>
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-space-sm">
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-space-md h-10 rounded bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm"
            >
              <MaterialSymbol name="lock" className="text-[18px]" />
              <span>Portal Access</span>
              <MaterialSymbol name="expand_more" className="text-[16px]" />
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-lg py-1.5 hidden group-hover:block transition-all z-50">
              <div className="px-space-md py-space-2xs text-[11px] font-label-sm text-on-surface-variant border-b border-outline-variant/20 uppercase tracking-wider">
                Select Login Role
              </div>
              {PORTAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.to}
                  className="flex items-center gap-2 px-space-md py-space-xs text-body-sm text-on-surface hover:bg-surface-container-low hover:text-primary"
                >
                  <MaterialSymbol name={link.icon} className={`text-[18px] ${link.iconClass}`} />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <MaterialSymbol name="person" className="text-on-primary text-[18px]" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
