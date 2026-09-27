const terminalFrameStyle = {
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  background: 'var(--color-bg-container, var(--term-bg-panel, rgba(6, 14, 9, 0.6)))',
  border: '1px solid var(--term-border, var(--color-border, rgba(34, 224, 122, 0.2)))',
  borderRadius: 'var(--radius-sm, 6px)',
  boxShadow: 'var(--color-glow, none)',
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  color: 'var(--color-text)',
}

const cornerBaseStyle = {
  position: 'absolute',
  width: 10,
  height: 10,
  zIndex: 3,
  pointerEvents: 'none',
  animation: 'term-corner-pulse 3s ease-in-out infinite',
}

const scanlinesStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background:
    'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, var(--color-border, rgba(34, 224, 122, 0.1)) 3px)',
  opacity: 0.15,
  mixBlendMode: 'overlay',
}

const shimmerBaseStyle = {
  backgroundImage:
    'linear-gradient(90deg, var(--color-bg-hover, rgba(34, 224, 122, 0.05)) 25%, var(--color-border, rgba(34, 224, 122, 0.2)) 50%, var(--color-bg-hover, rgba(34, 224, 122, 0.05)) 75%)',
  backgroundSize: '300px 100%',
  animation: 'proj-shimmer-sweep 1.3s infinite linear',
  borderRadius: 4,
}

export function StatCardSkeletonDashboard({ index = 0 }) {
  return (
    <div
      style={{
        ...terminalFrameStyle,
        height: 96,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        animationDelay: `${index * 70}ms`,
      }}
    >
      {/* Corner Accents */}
      <span
        style={{
          ...cornerBaseStyle,
          top: -1,
          left: -1,
          borderTop: '2px solid var(--color-primary, #22e07a)',
          borderLeft: '2px solid var(--color-primary, #22e07a)',
        }}
      />
      <span
        style={{
          ...cornerBaseStyle,
          top: -1,
          right: -1,
          borderTop: '2px solid var(--color-primary, #22e07a)',
          borderRight: '2px solid var(--color-primary, #22e07a)',
        }}
      />
      <span
        style={{
          ...cornerBaseStyle,
          bottom: -1,
          left: -1,
          borderBottom: '2px solid var(--color-primary, #22e07a)',
          borderLeft: '2px solid var(--color-primary, #22e07a)',
        }}
      />
      <span
        style={{
          ...cornerBaseStyle,
          bottom: -1,
          right: -1,
          borderBottom: '2px solid var(--color-primary, #22e07a)',
          borderRight: '2px solid var(--color-primary, #22e07a)',
        }}
      />

      <span style={scanlinesStyle} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            ...shimmerBaseStyle,
            width: 14,
            height: 14,
            borderRadius: '50%',
          }}
        />
        <div style={{ ...shimmerBaseStyle, width: '45%', height: 12 }} />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justify: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <div style={{ ...shimmerBaseStyle, width: '60%', height: 22 }} />
          <div style={{ ...shimmerBaseStyle, width: '40%', height: 10 }} />
        </div>

        <div
          style={{
            ...shimmerBaseStyle,
            width: 64,
            height: 24,
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  )
}
