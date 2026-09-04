import MaterialSymbol from '../../components/layout/MaterialSymbol'
import { CHALLENGES } from './landingContent'

function ChallengeCard({ item }) {
  return (
    <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md hover:shadow-lg transition-all group">
      <div className="flex items-start gap-space-md">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${item.iconWrap}`}
        >
          <MaterialSymbol name={item.icon} className="text-[26px]" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`font-label-sm text-label-sm uppercase tracking-wider font-bold ${item.numberClass}`}
            >
              {item.number}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
              {item.tag}
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-primary font-bold">{item.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-2xs text-body-sm">
            <div className="p-3 rounded-lg bg-error-container/20 text-on-surface">
              <strong className="text-error flex items-center gap-1 font-label-sm text-label-sm mb-1">
                <MaterialSymbol name="close" className="text-[16px]" /> Without MediFind LK
              </strong>
              {item.without}
            </div>
            <div className="p-3 rounded-lg bg-secondary-container/20 text-on-surface">
              <strong className="text-secondary flex items-center gap-1 font-label-sm text-label-sm mb-1">
                <MaterialSymbol name="check_circle" className="text-[16px]" /> With MediFind LK
              </strong>
              {item.with}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** "Understanding medicine shortages" narrative + 3 challenge pillars. */
function MedicineCrisisSection() {
  return (
    <section className="w-full py-space-3xl bg-surface">
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
          <div className="lg:col-span-5 space-y-space-md">
            <div className="inline-flex items-center gap-1 px-space-sm py-space-2xs rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm uppercase tracking-wide">
              <MaterialSymbol name="vital_signs" className="text-[16px]" /> Healthcare Supply Context
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              Understanding Medicine Shortages in Sri Lanka &amp; How We Fix Information Gaps
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Sri Lanka's healthcare supply chain has navigated compounding pressures: foreign
              currency adjustments, worldwide shipping disruptions, and unpredictable import cycle
              delays. Yet the most agonizing bottleneck for a family in need is simply{' '}
              <em>not knowing</em> which neighborhood counter actually holds the critical drug.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              MediFind LK bridges this critical void. Instead of desperate WhatsApp group requests or
              hours spent burning fuel traveling blindly across town, our cloud-linked telemetry
              aggregates pharmacy shelf statuses into a unified public directory.
            </p>

            <div className="p-space-lg rounded-2xl bg-surface-container-low shadow-sm relative overflow-hidden mt-space-lg">
              <div className="flex items-start gap-space-md">
                <div className="w-16 h-16 rounded-xl bg-primary-container text-secondary-fixed flex items-center justify-center shrink-0 shadow-sm">
                  <MaterialSymbol name="local_pharmacy" className="text-[30px]" />
                </div>
                <div className="space-y-1">
                  <p className="font-body-sm text-body-sm text-on-surface italic">
                    &ldquo;A patient with diabetic ketoacidosis or acute hypertension cannot wait 6
                    hours while relatives cycle through eight pharmacies. Having verified live stock
                    visible island-wide is truly lifesaving.&rdquo;
                  </p>
                  <div className="pt-1">
                    <div className="font-label-md text-label-md text-primary">
                      Dr. K. Jayasuriya, B.Pharm
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Chief Dispenser, Kandy Community Health Care
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 gap-space-md">
            {CHALLENGES.map((item) => (
              <ChallengeCard key={item.number} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MedicineCrisisSection
