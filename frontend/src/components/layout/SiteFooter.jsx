import { useState } from 'react'
import { Link } from 'react-router-dom'
import MaterialSymbol from './MaterialSymbol'

const QUICK_ACCESS = [
  { label: 'Search Prescriptions', to: '/search-medicines' },
  { label: 'District Pharmacies', to: '#' },
  { label: 'Essential Drug Shortages', to: '#' },
  { label: 'Report Stock Discrepancy', to: '/report-stock-issue' },
]

const OFFICIAL_RESOURCES = [
  { label: 'Ministry of Health LK', href: 'https://www.health.gov.lk/', external: true },
  { label: 'NMRA Portal', href: 'https://nmra.gov.lk/', external: true },
  { label: 'State Pharmaceuticals (SPC)', href: 'https://spc.lk/', external: true },
  { label: 'Emergency Medical Disclaimer', href: '#', external: false },
]

const LANGUAGES = [
  { code: 'EN', label: 'English (EN)' },
  { code: 'SI', label: 'සිංහල (SI)' },
  { code: 'TA', label: 'தமிழ் (TA)' },
]

function SiteFooter() {
  const [language, setLanguage] = useState('EN')

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 pt-space-2xl pb-space-xl">
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl mb-space-2xl">
          <div className="lg:col-span-2 space-y-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <MaterialSymbol name="medication" className="text-on-primary text-[16px]" />
              </span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                MediFind LK
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Sri Lanka's verified public digital health infrastructure for real-time prescription
              tracking, national pharmacy stock registries, and critical medicine availability
              alerts.
            </p>
            <div className="inline-flex items-center gap-2 px-space-md py-space-xs rounded bg-surface-container-lowest border border-outline-variant/30">
              <MaterialSymbol name="verified_user" className="text-secondary text-[20px]" />
              <span className="text-left">
                <span className="block font-label-sm text-label-sm text-on-surface">
                  NMRA Regulated Pharmacies
                </span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">
                  National Medicines Regulatory Authority Compliance
                </span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">
              Quick Access
            </h4>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              {QUICK_ACCESS.map((item) => (
                <li key={item.label}>
                  {item.to === '#' ? (
                    <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">
              Official Resources
            </h4>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              {OFFICIAL_RESOURCES.map((item) => (
                <li key={item.label}>
                  <a
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                    href={item.href}
                    {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {item.label}
                    {item.external && <MaterialSymbol name="open_in_new" className="text-[14px]" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-space-md uppercase tracking-wider">
              Language / භාෂාව
            </h4>
            <div className="flex flex-col gap-2">
              {LANGUAGES.map((lang) => {
                const active = language === lang.code
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center justify-between px-space-md py-space-xs rounded bg-surface-container-lowest border font-label-sm text-label-sm transition-colors ${
                      active
                        ? 'border-primary text-primary'
                        : 'border-outline-variant/30 text-on-surface-variant hover:border-outline hover:text-on-surface'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {active && <MaterialSymbol name="check" className="text-[16px]" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="pt-space-lg border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-md text-body-sm text-on-surface-variant">
          <p>
            © 2025 MediFind LK. Public Health Information Service for Sri Lanka. All registered
            trademarks belong to respective pharmaceutical licensing bodies.
          </p>
          <div className="flex items-center gap-space-lg">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms &amp; Disclaimers
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
