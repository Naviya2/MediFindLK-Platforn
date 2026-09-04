import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { LIVE_STATS } from './landingContent'

/** Trust / telemetry metrics strip below the hero. */
function LiveStatsBar() {
  return (
    <section className="w-full bg-primary-container text-on-primary py-space-xl shadow-inner relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-lg text-center md:text-left">
          {LIVE_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col md:flex-row items-center gap-space-sm p-space-sm rounded-xl bg-primary/40 backdrop-blur"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary-fixed flex items-center justify-center shrink-0">
                <MaterialSymbol
                  name={stat.icon}
                  className="text-[28px]"
                  style={stat.spin ? { animation: 'spin 9s linear infinite' } : undefined}
                />
              </div>
              <div>
                <div
                  className={`font-headline-lg text-headline-lg font-bold tracking-tight leading-none ${
                    stat.accent ? 'text-secondary-fixed' : 'text-white'
                  }`}
                >
                  {stat.value}
                </div>
                <div className="font-label-sm text-label-sm text-on-primary-container mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-space-lg pt-space-md border-t border-outline-variant/10 flex flex-wrap items-center justify-between gap-space-sm text-body-sm text-on-primary-container">
          <div className="flex items-center gap-2">
            <MaterialSymbol name="gavel" className="text-secondary-fixed text-[18px]" />
            <span>
              Operating in coordination with the National Medicines Regulatory Authority (NMRA Act
              No. 05 of 2015)
            </span>
          </div>
          <div className="flex items-center gap-4 text-label-sm">
            <span className="inline-flex items-center gap-1 text-white">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed" /> SPC Rajya Osu Sala Linked
            </span>
            <span className="inline-flex items-center gap-1 text-white">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed" /> All Island Private
              Pharmacy Association
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveStatsBar
