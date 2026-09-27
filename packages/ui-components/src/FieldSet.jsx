export default function ModeFieldSet({
  title = "",
  children,
  className = "",
  style = {},
  legendStyle = {},
  borderColor = "#d9d9d9",
  borderWidth = "1px",
  borderStyle = "solid",
  required = false,
  size = "medium",
  ...restProps
}) {
  const fieldsetClassName =
    `mode-fieldset-alt mode-fieldset-alt-${size} ${className}`.trim();

  const containerStyles = {
    borderColor,
    borderWidth,
    borderStyle,
    ...style,
  };

  return (
    <div className={fieldsetClassName} style={containerStyles} {...restProps}>
      {title && (
        <div className="mode-fieldset-alt-legend" style={legendStyle}>
          <span className="mode-fieldset-alt-legend-text">
            {title}
            {required && <span className="mode-fieldset-alt-required">*</span>}
          </span>
        </div>
      )}
      <div className="mode-fieldset-alt-content">{children}</div>
    </div>
  );
}
