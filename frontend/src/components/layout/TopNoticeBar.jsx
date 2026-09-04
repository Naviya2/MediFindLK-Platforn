import MaterialSymbol from './MaterialSymbol'

/** Official-notice strip pinned above the site header. */
function TopNoticeBar() {
  return (
    <div className="w-full bg-primary-container text-on-primary border-b border-outline-variant/30 py-space-2xs px-gutter-mobile md:px-gutter-desktop text-center relative z-50">
      <div className="max-w-container-max mx-auto flex flex-wrap items-center justify-between gap-space-xs text-body-sm">
        <div className="flex items-center gap-space-xs">
          <MaterialSymbol name="verified" className="text-secondary-fixed text-[18px]" />
          <span className="font-label-sm uppercase tracking-wider text-secondary-fixed">
            Official Notice
          </span>
          <span className="hidden sm:inline text-on-primary-container">|</span>
          <span className="text-on-primary">
            Real-time medicine stocks verified under NMRA guidelines. Always confirm via phone prior
            to dispatch.
          </span>
        </div>
        <div className="flex items-center gap-space-sm font-label-sm">
          <a
            className="inline-flex items-center gap-1 text-secondary-fixed hover:text-white transition-colors"
            href="tel:1990"
          >
            <MaterialSymbol name="emergency" className="text-[16px]" /> Suwa Seriya 1990
          </a>
          <span className="text-on-primary-container">•</span>
          <a
            className="inline-flex items-center gap-1 text-on-primary hover:text-secondary-fixed transition-colors"
            href="tel:1907"
          >
            <MaterialSymbol name="call" className="text-[16px]" /> NMRA Hotline 1907
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopNoticeBar
