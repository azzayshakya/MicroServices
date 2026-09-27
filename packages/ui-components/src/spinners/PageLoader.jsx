const PageLoader = ({
  label = 'INITIALIZING SYSTEM...',
  subLabel = 'Authenticating session & loading preferences',
  fullScreen = true,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: fullScreen ? '100vh' : '100%',
        minHeight: fullScreen ? '100vh' : '280px',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {/* Ambient Background Glow */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-bg-hover) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
          opacity: 0.7,
        }}
      />

      {/* Cybernetic Spinner Ring Unit */}
      <div
        style={{
          position: 'relative',
          width: '96px',
          height: '96px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          zIndex: 2,
        }}
      >
        {/* Outer Orbit Ring */}
        <div className="loader-outer-ring" />

        {/* Inner Counter-Orbit Ring */}
        <div className="loader-inner-ring" />

        {/* Center Pulsing Core */}
        <div className="loader-core">
          <span className="loader-core-symbol">⚡</span>
        </div>
      </div>

      {/* Label and Progress Bar Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            animation: 'loader-text-glow 2s ease-in-out infinite',
          }}
        >
          {label}
        </span>

        {subLabel && (
          <span
            style={{
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.4px',
              opacity: 0.85,
            }}
          >
            {subLabel}
          </span>
        )}

        <div className="loader-progress-track">
          <div className="loader-progress-bar" />
        </div>
      </div>

      <style>{`
        .loader-outer-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: var(--color-primary);
          border-right-color: var(--color-primary);
          animation: loader-spin-cw 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          filter: drop-shadow(var(--color-glow));
        }

        .loader-inner-ring {
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-bottom-color: var(--color-border);
          border-left-color: var(--color-border);
          animation: loader-spin-ccw 0.9s linear infinite;
        }

        .loader-core {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-bg-container);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--color-glow);
          animation: loader-pulse 1.8s ease-in-out infinite;
        }

        .loader-core-symbol {
          font-size: 16px;
          color: var(--color-primary);
        }

        .loader-progress-track {
          width: 150px;
          height: 3px;
          background: var(--color-border);
          border-radius: 4px;
          margin-top: 10px;
          overflow: hidden;
          position: relative;
        }

        .loader-progress-bar {
          position: absolute;
          height: 100%;
          width: 40%;
          background: var(--color-primary);
          box-shadow: var(--color-glow);
          border-radius: 4px;
          animation: loader-slide 1.4s ease-in-out infinite;
        }

        @keyframes loader-spin-cw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes loader-spin-ccw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes loader-pulse {
          0%, 100% { transform: scale(0.92); opacity: 0.85; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes loader-text-glow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes loader-slide {
          0% { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}

export default PageLoader
