import { Link } from 'react-router-dom'
import MaterialSymbol from './MaterialSymbol'

/**
 * Minimal shell for authentication screens. Deliberately separate from the main
 * site Layout: auth pages get a stripped-back header (logo + "back to search")
 * and a slim support-hotline footer instead of the full nav / mega-footer.
 */
function AuthLayout({ children }) {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <header className="w-full bg-surface-container-lowest shadow-sm">
        <div className="h-16 max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop flex items-center justify-between gap-space-md">
          <Link to="/" className="flex items-center gap-space-xs">
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
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors"
          >
            <MaterialSymbol name="arrow_back" className="text-[18px]" />
            <span>Back to Public Search</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full bg-background flex items-center justify-center p-gutter-mobile md:p-gutter-desktop">
        {children}
      </main>

      <footer className="w-full py-space-md text-center bg-surface-container-lowest text-on-surface-variant text-body-sm border-t border-outline-variant/40">
        <p>
          © 2025 MediFind LK. Official Health Directorate Support Hotline:{' '}
          <a className="text-secondary font-medium hover:underline" href="tel:1907">
            1907
          </a>
        </p>
      </footer>
    </div>
  )
}

export default AuthLayout
