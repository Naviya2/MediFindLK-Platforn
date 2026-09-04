import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import MaterialSymbol from '../components/layout/MaterialSymbol'

/**
 * Public-facing home page: hero + search, a short "about this problem"
 * section, and a CTA into the full Search page.
 *
 * NOTE: this repo's "/" route currently renders `LandingPage.jsx`, a more
 * built-out home (hero, crisis/about section, stats, dual CTAs) already
 * wired up. This file is a standalone alternative built to the requested
 * spec — swap it into `App.jsx` in place of `LandingPage` if it should
 * become the canonical home page.
 */
function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/search-medicines?medicine=${encodeURIComponent(trimmed)}` : '/search-medicines')
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="w-full bg-gradient-to-b from-surface-container-low via-surface-container-lowest to-surface py-space-3xl">
        <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop text-center flex flex-col items-center">
          <h1 className="font-headline-lg text-display-lg-mobile md:text-display-lg text-primary font-bold tracking-tight mb-space-sm">
            MediFind<span className="text-secondary">LK</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-xl">
            Find which pharmacies near you have the medicine you need — in real time, island-wide.
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-xl p-space-sm flex items-center gap-space-sm"
          >
            <div className="relative flex-1 flex items-center">
              <MaterialSymbol
                name="search"
                className="absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for a medicine, e.g. Paracetamol"
                aria-label="Medicine name"
                className="w-full h-12 pl-11 pr-3 rounded-xl bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-space-lg rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-all shadow-md shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* About this problem */}
      <section className="w-full py-space-2xl bg-surface">
        <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop max-w-3xl">
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mb-space-sm">
            The problem we're solving
          </h2>
          {/* Placeholder copy — a teammate will refine this. */}
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-sm">
            Sri Lanka has faced recurring medicine shortages, and patients often don't know which
            pharmacy actually has the drug they need in stock. Families waste hours calling around
            or travelling from pharmacy to pharmacy, which is especially dangerous for urgent or
            chronic conditions.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            MediFind LK aims to close that information gap by giving pharmacies a simple way to
            report stock status, and giving patients a single place to search it — instantly.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-space-2xl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop text-center">
          <Link
            to="/search-medicines"
            className="inline-flex items-center gap-2 h-12 px-space-xl rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-all shadow-md"
          >
            <MaterialSymbol name="manage_search" className="text-[20px]" />
            <span>Go to Medicine Search</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
