const EmptyState = ({
  variant = "default", // 'default' | 'search' | 'terminal' | 'compact' | 'error'
  size = "md", // 'sm' | 'md' | 'lg'
  title,
  description,
  query,
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  style,
  className = "",
}) => {
  // Default values based on variant
  const isSearch = variant === "search";
  const isTerminal = variant === "terminal";
  const isError = variant === "error";
  const isCompact = size === "sm" || variant === "compact";

  const resolvedTitle =
    title ||
    (isSearch
      ? query
        ? `No results for "${query}"`
        : "No matching records found"
      : isError
        ? "Failed to load data"
        : "No data available");

  const resolvedDesc =
    description ||
    (isSearch
      ? "Try checking for typos or searching for a different keyword."
      : isError
        ? "An unexpected error occurred while fetching vault records."
        : "Get started by creating your first entry.");

  // Size preset tokens
  const sizeStyles =
    {
      sm: {
        padding: "16px",
        minHeight: "100px",
        iconSize: 24,
        titleSize: 13,
        descSize: 11,
      },
      md: {
        padding: "36px 20px",
        minHeight: "220px",
        iconSize: 40,
        titleSize: 16,
        descSize: 13,
      },
      lg: {
        padding: "60px 24px",
        minHeight: "360px",
        iconSize: 60,
        titleSize: 20,
        descSize: 14,
      },
    }[size] || sizeStyles.md;

  // Terminal aesthetic layout
  if (isTerminal) {
    return (
      <div
        className={`empty-state-terminal ${className}`}
        style={{
          background: "rgba(10, 15, 12, 0.85)",
          border: "1px solid rgba(57, 255, 106, 0.25)",
          borderRadius: 8,
          padding: 20,
          fontFamily: "monospace",
          color: "#39ff6a",
          fontSize: 13,
          ...style,
        }}
      >
        <div>root@vault:~# find ./topics -name &quot;{query || "*"}&quot;</div>
        <div
          style={{ color: "#888", margin: "6px 0" }}
        >{`> 0 records returned in 0.002s`}</div>
        <div style={{ color: isError ? "#ff4d4f" : "#39ff6a" }}>
          {isError
            ? "[ERR_EMPTY_SET]: Query execution failed"
            : "[WARN]: Directory is currently empty"}
        </div>
        {actionText && (
          <button
            onClick={onAction}
            style={{
              marginTop: 12,
              background: "transparent",
              border: "1px solid #39ff6a",
              color: "#39ff6a",
              padding: "4px 12px",
              fontFamily: "inherit",
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            $ {actionText}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`empty-state-container ${className}`}
      style={{
        display: "flex",
        flexDirection: isCompact ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: isCompact ? "left" : "center",
        padding: sizeStyles.padding,
        minHeight: sizeStyles.minHeight,
        borderRadius: 12,
        border: "1px solid rgba(57, 255, 106, 0.2)",
        background: "rgba(156, 210, 169, 0.15)",
        gap: isCompact ? 12 : 10,
        fontFamily: "var(--term-font, monospace)",
        ...style,
      }}
    >
      {/* Visual / Icon */}
      <div
        style={{
          fontSize: sizeStyles.iconSize,
          color: isError ? "#ff4d4f" : "var(--color-primary, #39ff6a)",
          lineHeight: 1,
          opacity: 0.8,
        }}
      >
        {icon || (isSearch ? "🔍" : isError ? "⚠️" : "📂")}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 420 }}>
        <h4
          style={{
            margin: 0,
            fontSize: sizeStyles.titleSize,
            color: isError ? "#ff4d4f" : "var(--color-primary, #39ff6a)",
            fontWeight: 600,
          }}
        >
          {resolvedTitle}
        </h4>
        {resolvedDesc && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: sizeStyles.descSize,
              color: "var(--color-secondary, #888)",
              lineHeight: 1.4,
            }}
          >
            {resolvedDesc}
          </p>
        )}
      </div>

      {/* Actions */}
      {(actionText || secondaryActionText) && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: isCompact ? 0 : 8,
            marginLeft: isCompact ? "auto" : undefined,
          }}
        >
          {secondaryActionText && (
            <button
              type="button"
              onClick={onSecondaryAction}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#aaa",
                padding: isCompact ? "4px 8px" : "6px 14px",
                fontSize: sizeStyles.descSize,
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {secondaryActionText}
            </button>
          )}

          {actionText && (
            <button
              type="button"
              onClick={onAction}
              style={{
                background: "rgba(57, 255, 106, 0.1)",
                border: "1px solid var(--color-primary, #39ff6a)",
                color: "var(--color-primary, #39ff6a)",
                padding: isCompact ? "4px 10px" : "6px 16px",
                fontSize: sizeStyles.descSize,
                fontWeight: 600,
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              + {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
