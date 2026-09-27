const Loader = ({
  size = 24,
  thickness,
  color = 'var(--color-accent)',
  trackColor = 'var(--color-border-default)',
  label,
  labelColor = 'var(--color-text-secondary)',
  labelPosition = 'right',
  labelSize = 13,
  style = {},
  className = '',
}) => {
  const border = thickness ?? Math.max(2, Math.round(size / 8))

  const isRow = labelPosition === 'left' || labelPosition === 'right'
  const isReversed = labelPosition === 'top' || labelPosition === 'left'

  const spinner = (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${border}px solid ${trackColor}`,
        borderTopColor: color,
        animation: 'az-loader-spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  )

  const labelEl = label ? (
    <span
      style={{
        fontSize: labelSize,
        lineHeight: 1.3,
        color: labelColor,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  ) : null

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: isRow
          ? isReversed
            ? 'row-reverse'
            : 'row'
          : isReversed
            ? 'column-reverse'
            : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: label ? (isRow ? 8 : 6) : 0,
        ...style,
      }}
    >
      {spinner}
      {labelEl}

      <style>{`
        @keyframes az-loader-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  )
}

export default Loader
