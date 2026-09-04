import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { DEMO_ACCOUNTS } from '../../auth/demoAccounts'

/**
 * Dev helper: shows the demo login for the currently selected role so the auth
 * flow can be exercised in the UI. Remove once the real auth backend is wired.
 */
function DemoCredentialsHint({ roleId }) {
  const account = DEMO_ACCOUNTS.find((a) => a.role === roleId)
  if (!account) return null

  return (
    <div className="flex items-start gap-space-xs p-space-sm rounded-lg bg-surface-container-low text-on-surface-variant">
      <MaterialSymbol name="science" className="text-secondary text-[18px] mt-0.5 flex-shrink-0" />
      <p className="font-body-sm text-body-sm">
        <span className="font-semibold text-on-surface">Demo login</span> — try a wrong password to
        see the error:{' '}
        <code className="font-metric-mono text-[12px] bg-surface-container-lowest px-1.5 py-0.5 rounded">
          {account.identifier}
        </code>{' '}
        /{' '}
        <code className="font-metric-mono text-[12px] bg-surface-container-lowest px-1.5 py-0.5 rounded">
          {account.password}
        </code>
      </p>
    </div>
  )
}

export default DemoCredentialsHint
