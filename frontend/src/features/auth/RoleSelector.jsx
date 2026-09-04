import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { AUTH_ROLES } from './authContent'

/**
 * Segmented "verification role" switcher (Citizen / Pharmacist / System Admin).
 * Controlled: parent owns the selected role id.
 */
function RoleSelector({ selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-space-2xs">
      <div className="flex items-center justify-between px-space-2xs">
        <span className="font-label-md text-label-md text-on-surface-variant">
          Select Verification Role
        </span>
        <span className="font-metric-mono text-metric-mono text-secondary flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary" />
          Govt. Certified Portal
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Account Role Selector"
        className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs p-1.5 bg-surface-container-low rounded-xl"
      >
        {AUTH_ROLES.map((role) => {
          const active = role.id === selectedId
          return (
            <button
              key={role.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(role.id)}
              className={`group text-left flex flex-col justify-between p-space-sm rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-surface-container-lowest shadow-md text-primary'
                  : 'bg-transparent text-on-surface-variant hover:bg-surface-container-lowest/70'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <MaterialSymbol
                  name={role.icon}
                  className={`text-[20px] ${
                    active
                      ? 'text-secondary'
                      : 'text-on-surface-variant group-hover:text-primary'
                  }`}
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                />
                <span
                  className={`text-[10px] font-label-sm px-1.5 py-0.5 rounded ${role.badgeClass}`}
                >
                  {role.badge}
                </span>
              </div>
              <div>
                <p className="font-headline-sm text-[13px] leading-tight font-semibold text-primary">
                  {role.label}
                </p>
                <p className="font-body-sm text-[11px] text-on-surface-variant leading-normal mt-0.5">
                  {role.tagline}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default RoleSelector
