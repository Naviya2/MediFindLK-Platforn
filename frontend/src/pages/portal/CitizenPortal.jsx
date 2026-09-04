import { Link } from 'react-router-dom'
import MaterialSymbol from '../../components/layout/MaterialSymbol'
import PortalShell from './PortalShell'
import { StatCard, PanelCard } from './PortalWidgets'

const WATCHLIST = [
  { medicine: 'Thyroxine 50mcg', district: 'Colombo', status: 'In stock at 4 pharmacies' },
  { medicine: 'Insulin (Mixtard)', district: 'Gampaha', status: 'Low stock — 1 pharmacy' },
  { medicine: 'Salbutamol Inhaler', district: 'Kandy', status: 'Out of stock' },
]

function CitizenPortal() {
  return (
    <PortalShell
      title="My Medicine Watchlist"
      subtitle="Track availability for the medicines you depend on and get alerted the moment stock changes near you."
      icon="favorite"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
        <StatCard icon="notifications_active" value="3" label="Active alerts" />
        <StatCard icon="check_circle" value="2" label="In stock nearby" />
        <StatCard icon="history" value="12" label="Searches this month" />
        <StatCard icon="local_pharmacy" value="8" label="Saved pharmacies" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        <div className="lg:col-span-2">
          <PanelCard
            icon="bookmark"
            title="Watchlist"
            action={
              <Link
                to="/search-medicines"
                className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary hover:underline"
              >
                Add medicine <MaterialSymbol name="add" className="text-[16px]" />
              </Link>
            }
          >
            <ul className="flex flex-col divide-y divide-outline-variant/30">
              {WATCHLIST.map((row) => (
                <li key={row.medicine} className="py-space-sm flex items-center justify-between gap-space-sm">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{row.medicine}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{row.district} District</p>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-right">{row.status}</span>
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>

        <PanelCard icon="tips_and_updates" title="Quick actions">
          <div className="flex flex-col gap-space-sm">
            <Link
              to="/search-medicines"
              className="inline-flex items-center justify-between px-space-md h-11 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors"
            >
              <span>Search medicine stock</span>
              <MaterialSymbol name="search" className="text-[18px]" />
            </Link>
            <Link
              to="/report-stock-issue"
              className="inline-flex items-center justify-between px-space-md h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
            >
              <span>Report a stock discrepancy</span>
              <MaterialSymbol name="flag" className="text-[18px]" />
            </Link>
          </div>
        </PanelCard>
      </div>
    </PortalShell>
  )
}

export default CitizenPortal
