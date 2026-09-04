import MaterialSymbol from '../../components/layout/MaterialSymbol'

/** Bottom-of-page life-threatening-emergency hotline banner. */
function EmergencyBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary py-space-lg">
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-space-md text-center lg:text-left">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 shadow-md">
              <MaterialSymbol name="medical_services" className="text-[26px]" />
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-white font-bold">
                Facing an Immediate Life-Threatening Emergency?
              </h4>
              <p className="font-body-sm text-body-sm text-on-primary-container">
                Do not spend time traveling. Call National Emergency Services or proceed immediately
                to the nearest Government Base Hospital Casualty Ward.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-space-sm">
            <a
              className="px-space-md py-2.5 rounded-lg bg-error text-on-error font-label-lg text-label-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
              href="tel:1990"
            >
              <MaterialSymbol name="call" className="text-[18px]" />
              <span>Suwa Seriya 1990 (Free Ambulance)</span>
            </a>
            <a
              className="px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg flex items-center gap-1.5 shadow hover:bg-surface-container transition-colors"
              href="tel:1907"
            >
              <MaterialSymbol name="support_agent" className="text-[18px]" />
              <span>NMRA Drug Inquiries: 1907</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EmergencyBanner
