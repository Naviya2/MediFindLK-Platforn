import MaterialSymbol from '../../components/layout/MaterialSymbol'
import PortalShell from './PortalShell'
import { StatCard, PanelCard } from './PortalWidgets'

const PENDING_PHARMACIES = [
  { name: 'Suwasetha Pharmacy', slpc: 'SLPC-2025-1183', district: 'Matara' },
  { name: 'Green Cross Dispensary', slpc: 'SLPC-2025-1190', district: 'Kurunegala' },
  { name: 'CarePoint Chemists', slpc: 'SLPC-2025-1201', district: 'Jaffna' },
]

const SHORTAGES = [
  { medicine: 'Insulin (Mixtard)', districts: 6, severity: 'Critical' },
  { medicine: 'Adrenaline 1mg/ml', districts: 3, severity: 'High' },
  { medicine: 'Thyroxine 100mcg', districts: 2, severity: 'Moderate' },
]

function AdminPortal() {
  return (
    <PortalShell
      title="NMRA Telemetry & Oversight Console"
      subtitle="Regulatory view of the national pharmacy network — verifications, shortage hotspots, and sync health."
      icon="monitoring"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
        <StatCard icon="local_pharmacy" value="1,420" label="Verified pharmacies" />
        <StatCard icon="pending_actions" value="3" label="Pending verifications" />
        <StatCard icon="crisis_alert" value="11" label="Active shortage alerts" />
        <StatCard icon="wifi_tethering" value="97.4%" label="Network sync health" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        <PanelCard icon="fact_check" title="Pharmacy verification queue">
          <ul className="flex flex-col divide-y divide-outline-variant/30">
            {PENDING_PHARMACIES.map((row) => (
              <li key={row.slpc} className="py-space-sm flex items-center justify-between gap-space-sm">
                <div>
                  <p className="font-label-md text-label-md text-on-surface">{row.name}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {row.slpc} • {row.district}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors"
                  >
                    Review
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard icon="warning_amber" title="National shortage hotspots">
          <ul className="flex flex-col divide-y divide-outline-variant/30">
            {SHORTAGES.map((row) => (
              <li key={row.medicine} className="py-space-sm flex items-center justify-between gap-space-sm">
                <div>
                  <p className="font-label-md text-label-md text-on-surface">{row.medicine}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Affecting {row.districts} districts
                  </p>
                </div>
                <span className="font-label-sm text-label-sm text-on-tertiary-container flex items-center gap-1">
                  <MaterialSymbol name="priority_high" className="text-[16px]" />
                  {row.severity}
                </span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
    </PortalShell>
  )
}

export default AdminPortal
