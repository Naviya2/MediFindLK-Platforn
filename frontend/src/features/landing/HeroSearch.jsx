import { useRef, useState } from 'react'
import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { DISTRICTS, MOCK_RESULTS, POPULAR_SEARCHES } from './landingContent'

const STATUS_TONES = {
  in: 'bg-[#ecfdf5] text-[#065f46]',
  low: 'bg-[#fffbeb] text-[#92400e]',
}
const STATUS_DOTS = {
  in: 'bg-[#10b981] animate-pulse',
  low: 'bg-[#f59e0b]',
}

function MockResultCard({ row }) {
  return (
    <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-space-sm mb-space-sm">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-label-sm text-secondary bg-surface-container-lowest px-2 py-0.5 rounded uppercase font-bold">
            <MaterialSymbol name="verified" className="text-[13px]" /> {row.nmra}
          </span>
          <h4 className="font-headline-sm text-headline-sm text-primary mt-1">{row.name}</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{row.address}</p>
        </div>
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm whitespace-nowrap ${
            STATUS_TONES[row.status.tone]
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${STATUS_DOTS[row.status.tone]}`} />
          <span>{row.status.label}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-space-xs">
        <span className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
          <MaterialSymbol name="schedule" className="text-[15px]" /> {row.verified}
        </span>
        <div className="flex items-center gap-2">
          <a
            className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm flex items-center gap-1 hover:opacity-90 transition-opacity"
            href={`tel:${row.phone}`}
          >
            <MaterialSymbol name="call" className="text-[16px]" /> Call Desk
          </a>
          <a
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm flex items-center gap-1 hover:bg-surface-container transition-colors"
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
          >
            <MaterialSymbol name="directions" className="text-[16px]" /> Map
          </a>
        </div>
      </div>
    </div>
  )
}

function HeroSearch() {
  const [medicine, setMedicine] = useState('')
  const [district, setDistrict] = useState('colombo')
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)

  const districtLabel = DISTRICTS.find((d) => d.value === district)?.label ?? ''

  function runSearch(value = medicine) {
    const trimmed = value.trim()
    if (!trimmed) {
      inputRef.current?.focus()
      return
    }
    setShowResults(true)
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    runSearch()
  }

  function applyTag(name) {
    setMedicine(name)
    runSearch(name)
  }

  function clearInput() {
    setMedicine('')
    setShowResults(false)
    inputRef.current?.focus()
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low via-surface-container-lowest to-surface pt-space-xl pb-space-3xl">
      <div className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-20 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl" />

      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg">
          <div className="inline-flex items-center gap-2 px-space-md py-space-2xs rounded-full bg-secondary-container/40 text-on-secondary-container border border-secondary/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span className="font-label-sm text-label-sm tracking-wide uppercase font-bold">
              Public Healthcare Initiative • Sri Lanka
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <MaterialSymbol name="verified" className="text-secondary text-[16px]" />
            <span>NMRA Compliant Pharmacy Stock Sync System</span>
          </div>
        </div>

        <div className="max-w-4xl mb-space-xl">
          <h1 className="font-headline-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight font-bold mb-space-md">
            Find Available Prescription &amp; Essential Medicines Across Sri Lanka
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Connecting patients directly with real-time stock levels in verified community and
            hospital pharmacies — saving critical hours when every dose matters.
          </p>
        </div>

        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl p-space-md md:p-space-lg mb-space-md transition-all">
          <form className="space-y-space-md" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm md:gap-space-md items-center">
              <div className="lg:col-span-7 relative flex items-center">
                <MaterialSymbol
                  name="search"
                  className="absolute left-4 text-on-surface-variant/70 text-[22px] pointer-events-none"
                />
                <input
                  ref={inputRef}
                  id="medInput"
                  autoComplete="off"
                  type="text"
                  value={medicine}
                  onChange={(event) => setMedicine(event.target.value)}
                  className="w-full h-14 pl-12 pr-10 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all shadow-inner"
                  placeholder="Search by brand name, generic formula (e.g. Paracetamol, Metformin, Thyroxine)..."
                />
                {medicine.length > 0 && (
                  <button
                    type="button"
                    onClick={clearInput}
                    className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1"
                    aria-label="Clear search"
                  >
                    <MaterialSymbol name="close" className="text-[18px]" />
                  </button>
                )}
              </div>

              <div className="lg:col-span-3 relative flex items-center">
                <MaterialSymbol
                  name="location_on"
                  className="absolute left-3 text-secondary text-[20px] pointer-events-none"
                />
                <select
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  aria-label="District"
                  className="w-full h-14 pl-10 pr-9 rounded-xl bg-surface-container-low text-on-surface font-label-lg text-label-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all appearance-none cursor-pointer"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <MaterialSymbol
                  name="expand_more"
                  className="absolute right-3 text-on-surface-variant pointer-events-none text-[20px]"
                />
              </div>

              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full h-14 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <MaterialSymbol name="manage_search" className="text-[20px]" />
                  <span>Search Stock</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mr-1">
                <MaterialSymbol
                  name="local_fire_department"
                  className="text-[16px] text-on-tertiary-container"
                />{' '}
                High Demand:
              </span>
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => applyTag(tag)}
                  className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-secondary/15 hover:text-secondary text-label-sm font-label-sm transition-colors flex items-center gap-1"
                >
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-space-sm px-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <div className="flex items-center gap-2">
            <MaterialSymbol name="lock_open" className="text-secondary text-[18px]" />
            <span>
              Free for all citizens • No login, registration, or prescription upload required to
              browse stocks
            </span>
          </div>
          <div className="flex items-center gap-2 text-primary font-label-sm">
            <MaterialSymbol name="sync" className="text-[16px]" />
            <span>Direct Pharmacist POS &amp; Dispenser Telemetry Sync</span>
          </div>
        </div>

        {showResults && (
          <div
            ref={resultsRef}
            className="mt-space-lg w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl space-y-space-md"
          >
            <div className="flex items-center justify-between pb-space-xs">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                  <MaterialSymbol name="inventory" className="text-secondary" />
                  <span>Available Verified Stock</span>
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Showing verified pharmacies holding &ldquo;{medicine.trim()}&rdquo; in{' '}
                  {districtLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
                aria-label="Close results"
              >
                <MaterialSymbol name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
              {MOCK_RESULTS.map((row) => (
                <MockResultCard key={row.id} row={row} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroSearch
