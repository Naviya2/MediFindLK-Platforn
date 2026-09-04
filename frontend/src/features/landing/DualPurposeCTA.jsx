import { Link } from 'react-router-dom'
import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { focusHeroSearch } from './focusHeroSearch'

/** Side-by-side patient vs. pharmacist calls to action. */
function DualPurposeCTA() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
      <div className="p-space-xl rounded-2xl bg-gradient-to-br from-primary-container to-primary text-on-primary flex flex-col justify-between shadow-xl relative overflow-hidden">
        <div className="space-y-space-sm mb-space-lg relative z-10">
          <div className="inline-flex items-center gap-1 text-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider">
            <MaterialSymbol name="health_and_safety" className="text-[16px]" /> Patient Services
          </div>
          <h3 className="font-headline-lg text-headline-lg font-bold text-white tracking-tight">
            Need Urgent Medicine Right Now?
          </h3>
          <p className="font-body-md text-body-md text-on-primary-container max-w-md">
            Browse current listings across all 25 districts with direct phone lines to on-duty
            pharmacists and verified stock counts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-space-md relative z-10">
          <button
            type="button"
            onClick={focusHeroSearch}
            className="px-space-lg h-12 rounded-xl bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md"
          >
            <MaterialSymbol name="search" className="text-[20px]" />
            <span>Search Inventory Now</span>
          </button>
          <a
            className="px-space-md h-12 rounded-xl bg-primary-container text-secondary-fixed font-label-lg text-label-lg flex items-center gap-2 hover:bg-white/10 transition-colors"
            href="tel:1990"
          >
            <MaterialSymbol name="emergency" className="text-[20px]" />
            <span>1990 Suwa Seriya</span>
          </a>
        </div>
      </div>

      <div className="p-space-xl rounded-2xl bg-surface-container-lowest text-on-surface flex flex-col justify-between shadow-xl">
        <div className="space-y-space-sm mb-space-lg">
          <div className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
            <MaterialSymbol name="domain_add" className="text-[16px]" /> Dispensary Network
          </div>
          <h3 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
            For Licensed Pharmacies: Join the National Network
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Are you an NMRA-registered community pharmacy or hospital dispensary? Reduce walk-in
            congestion and help patients find your medicines instantly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-space-md">
          <Link
            className="px-space-lg h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-2 hover:bg-primary-container transition-all shadow-md"
            to="/login"
          >
            <MaterialSymbol name="badge" className="text-[20px]" />
            <span>Pharmacist Portal Login</span>
          </Link>
          <Link
            to="/login?tab=register"
            className="px-space-md h-12 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors"
          >
            <span>Register New Branch</span>
            <MaterialSymbol name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DualPurposeCTA
