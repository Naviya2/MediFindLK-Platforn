import { Link } from 'react-router-dom'
import MaterialSymbol from '../../components/layout/MaterialSymbol'
import PortalShell from './PortalShell'
import { StatCard, PanelCard } from './PortalWidgets'

const INVENTORY = [
  { medicine: 'Paracetamol 500mg', units: 380, status: 'in' },
  { medicine: 'Metformin 500mg', units: 24, status: 'low' },
  { medicine: 'Amoxicillin Syrup', units: 0, status: 'out' },
  { medicine: 'Losartan 50mg', units: 142, status: 'in' },
]

const STATUS_TONE = {
  in: 'bg-[#ecfdf5] text-[#065f46]',
  low: 'bg-[#fffbeb] text-[#92400e]',
  out: 'bg-error-container text-on-error-container',
}
const STATUS_LABEL = { in: 'In stock', low: 'Low stock', out: 'Out of stock' }

function PharmacistPortal() {
  return (
    <PortalShell
      title="Dispensary Inventory Console"
      subtitle="Keep your public stock levels accurate so patients see what you really have on the shelf."
      icon="inventory_2"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
        <StatCard icon="medication" value="412" label="Tracked medicines" />
        <StatCard icon="warning" value="7" label="Low / out of stock" />
        <StatCard icon="sync" value="6 min" label="Since last sync" />
        <StatCard icon="call" value="18" label="Reservation calls today" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        <div className="lg:col-span-2">
          <PanelCard
            icon="table_rows"
            title="Stock levels"
            action={
              <Link
                to="/report-stock-issue"
                className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary hover:underline"
              >
                Update stock <MaterialSymbol name="edit" className="text-[16px]" />
              </Link>
            }
          >
            <ul className="flex flex-col divide-y divide-outline-variant/30">
              {INVENTORY.map((row) => (
                <li key={row.medicine} className="py-space-sm flex items-center justify-between gap-space-sm">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{row.medicine}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{row.units} units on hand</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap ${STATUS_TONE[row.status]}`}
                  >
                    {STATUS_LABEL[row.status]}
                  </span>
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>

        <PanelCard icon="bolt" title="Quick actions">
          <div className="flex flex-col gap-space-sm">
            <Link
              to="/report-stock-issue"
              className="inline-flex items-center justify-between px-space-md h-11 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors"
            >
              <span>Update a medicine's status</span>
              <MaterialSymbol name="edit_note" className="text-[18px]" />
            </Link>
            <Link
              to="/search-medicines"
              className="inline-flex items-center justify-between px-space-md h-11 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
            >
              <span>Check network availability</span>
              <MaterialSymbol name="travel_explore" className="text-[18px]" />
            </Link>
          </div>
        </PanelCard>
      </div>
    </PortalShell>
  )
}

export default PharmacistPortal
