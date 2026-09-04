/**
 * Thin wrapper around the "Material Symbols Outlined" icon font.
 * Usage: <MaterialSymbol name="verified" className="text-[18px]" />
 */
function MaterialSymbol({ name, className = '', ...rest }) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} aria-hidden="true" {...rest}>
      {name}
    </span>
  )
}

export default MaterialSymbol
