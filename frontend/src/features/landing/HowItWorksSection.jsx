import MaterialSymbol from '../../components/layout/MaterialSymbol'
import DualPurposeCTA from './DualPurposeCTA'
import { STEPS } from './landingContent'

function StepCard({ step }) {
  return (
    <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex flex-col justify-between relative overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none flex items-start justify-end p-3 ${step.accentBg}`}
      >
        <span className={`font-headline-lg text-headline-lg font-bold ${step.numberClass}`}>
          {step.number}
        </span>
      </div>
      <div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-space-md ${step.iconWrap}`}
        >
          <MaterialSymbol name={step.icon} className="text-[24px]" />
        </div>
        <h3 className="font-headline-md text-headline-md text-primary font-bold mb-space-xs">
          {step.title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">{step.body}</p>
      </div>
      <div className="p-3 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-2">
        <MaterialSymbol name={step.note.icon} className="text-secondary text-[18px]" />
        <span>{step.note.text}</span>
      </div>
    </div>
  )
}

/** "How it works" 3-step flow plus the dual patient/pharmacist CTA block. */
function HowItWorksSection() {
  return (
    <section className="w-full py-space-3xl bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
        <div className="text-center max-w-3xl mx-auto mb-space-2xl">
          <span className="inline-flex items-center gap-1 px-space-sm py-space-2xs rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wide">
            Simple 3-Step Operation
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-space-xs tracking-tight">
            How MediFind LK Keeps Sri Lanka Moving
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
            Built for zero technical barrier for patients in distress, backed by lightweight digital
            registry workflows for local pharmacists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg mb-space-2xl">
          {STEPS.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>

        <DualPurposeCTA />
      </div>
    </section>
  )
}

export default HowItWorksSection
