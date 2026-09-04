import MaterialSymbol from '../../components/layout/MaterialSymbol'

/** Small metric tile used across the role portals. */
export function StatCard({ icon, value, label }) {
  return (
    <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-2xs">
      <MaterialSymbol name={icon} className="text-secondary text-[22px]" />
      <span className="font-headline-lg text-headline-lg text-primary tracking-tight">{value}</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
    </div>
  )
}

/** Titled content panel. */
export function PanelCard({ icon, title, children, action }) {
  return (
    <section className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between gap-space-sm">
        <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
          <MaterialSymbol name={icon} className="text-secondary text-[20px]" />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
