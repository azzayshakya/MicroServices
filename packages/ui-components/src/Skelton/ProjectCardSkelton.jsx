const terminalFrameStyle = {
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  background: 'var(--color-bg-container, var(--term-bg-panel))',
  border: '1px solid var(--color-border, var(--term-border))',
  borderRadius: 'var(--radius, 10px)',
  boxShadow: 'var(--color-glow)',
  fontFamily: 'var(--term-font, monospace)',
  color: 'var(--color-text)',
}

const cornerBaseStyle = {
  position: 'absolute',
  width: 14,
  height: 14,
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
    'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, var(--color-border) 3px)',
  opacity: 0.15,
  mixBlendMode: 'overlay',
}

const shimmerBaseStyle = {
  backgroundImage:
    'linear-gradient(90deg, var(--color-bg-hover) 25%, var(--color-border) 50%, var(--color-bg-hover) 75%)',
  backgroundSize: '300px 100%',
  animation: 'proj-shimmer-sweep 1.3s infinite linear',
  borderRadius: 4,
}

export function ProjectCardSkeleton({ index = 0 }) {
  return (
    <div
      style={{
        ...terminalFrameStyle,
        padding: 0,
        minHeight: 240,
        animationDelay: `${index * 70}ms`,
      }}
    >
      <span
        style={{
          ...cornerBaseStyle,
          top: -1,
          left: -1,
          borderTop: '2px solid var(--color-primary)',
          borderLeft: '2px solid var(--color-primary)',
        }}
      />
      <span
        style={{
          ...cornerBaseStyle,
          top: -1,
          right: -1,
          borderTop: '2px solid var(--color-primary)',
          borderRight: '2px solid var(--color-primary)',
        }}
      />
      <span
        style={{
          ...cornerBaseStyle,
          bottom: -1,
          left: -1,
          borderBottom: '2px solid var(--color-primary)',
          borderLeft: '2px solid var(--color-primary)',
        }}
      />
      <span
        style={{
          ...cornerBaseStyle,
          bottom: -1,
          right: -1,
          borderBottom: '2px solid var(--color-primary)',
          borderRight: '2px solid var(--color-primary)',
        }}
      />
      <span style={scanlinesStyle} />

      <div
        style={{
          minHeight: 240,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            ...shimmerBaseStyle,
            width: 50,
            height: 10,
            alignSelf: 'flex-end',
          }}
        />

        <div
          style={{
            ...shimmerBaseStyle,
            width: 70,
            height: 70,
            borderRadius: '50%',
          }}
        />

        <div
          style={{
            ...shimmerBaseStyle,
            width: '70%',
            height: 18,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <div style={{ ...shimmerBaseStyle, width: '90%', height: 10 }} />
          <div style={{ ...shimmerBaseStyle, width: '75%', height: 10 }} />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
          }}
        >
          <div
            style={{
              ...shimmerBaseStyle,
              width: 60,
              height: 20,
            }}
          />

          <div
            style={{
              ...shimmerBaseStyle,
              width: 60,
              height: 20,
            }}
          />
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div style={{ ...shimmerBaseStyle, width: 18, height: 18 }} />
          <div style={{ ...shimmerBaseStyle, width: 18, height: 18 }} />
          <div style={{ ...shimmerBaseStyle, width: 18, height: 18 }} />
        </div>
      </div>
    </div>
  )
}
