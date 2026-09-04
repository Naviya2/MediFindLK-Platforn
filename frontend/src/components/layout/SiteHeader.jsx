import { NavLink } from 'react-router-dom'
import MaterialSymbol from './MaterialSymbol'
import HeaderAuth from './HeaderAuth'

const NAV_LINKS = [
  { label: 'Home', to: '/', end: true },
  { label: 'Search Medicines', to: '/search-medicines' },
  { label: 'Pharmacy Network', to: '#' },
  { label: 'Critical Shortages', to: '#' },
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
          <HeaderAuth />
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
