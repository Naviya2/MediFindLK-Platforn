import { Link } from 'react-router-dom'
import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { TRUST_BADGES } from './authContent'

/** Regulatory trust badges + the "no login needed" public-search reminder. */
function AuthTrustSection() {
  return (
    <div className="mt-space-lg w-full max-w-2xl mx-auto flex flex-col items-center gap-space-sm text-center">
      <div className="flex items-center justify-center gap-space-md text-on-surface-variant flex-wrap">
        {TRUST_BADGES.map((badge, index) => (
          <div key={badge.label} className="flex items-center gap-space-md">
            {index > 0 && <span className="inline-block w-1 h-1 rounded-full bg-outline-variant" />}
            <span className="flex items-center gap-1.5 font-label-sm text-label-sm">
              <MaterialSymbol
                name={badge.icon}
                className="text-[16px] text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
              <span>{badge.label}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="w-full bg-surface-container-low rounded-xl p-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-xs shadow-sm">
        <div className="flex items-center gap-space-xs text-left">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
            <MaterialSymbol name="search" className="text-[18px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-[13px] text-primary font-semibold">
              Looking for medicine urgently as a patient?
            </span>
            <span className="font-body-sm text-[11px] text-on-surface-variant">
              Zero login or identification required to query real-time pharmacy availability.
            </span>
          </div>
        </div>
        <Link
          to="/search-medicines"
          className="px-space-md py-1.5 bg-surface-container-lowest text-primary hover:text-secondary rounded-lg font-label-md text-label-md font-semibold whitespace-nowrap shadow-sm hover:shadow transition-all flex items-center gap-1"
        >
          <span>Search Stocks Now</span>
          <MaterialSymbol name="arrow_outward" className="text-[16px]" />
        </Link>
      </div>
    </div>
  )
}

export default AuthTrustSection
