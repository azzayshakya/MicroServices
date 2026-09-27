import { Theme } from '@devStack/constants/theme-constants'
import { resolveTheme } from '@devStack/utils/theme-utils'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const DefaultIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
)

const PageHeader = ({
  title,
  subtitle,
  icon,
  breadcrumb,
  extra,
  children,
  onBack,
  showBack = false,
  className = '',
  style = {},
}) => {
  const navigate = typeof useNavigate === 'function' ? useNavigate() : null
  const [isHovered, setIsHovered] = useState(false)

  // Resolve theme using existing Redux store state
  const theme = useSelector((s) => s?.preference?.theme)
  const isDark = resolveTheme(theme) === Theme.DARK

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack()
    } else if (navigate) {
      navigate(-1)
    } else {
      window.history.back()
    }
  }

  const isBackVisible = showBack || Boolean(onBack)
  const renderedIcon = icon !== undefined ? icon : <DefaultIcon />

  return (
    <div
      className={`page-wrapper-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 32px)',
        borderRadius: 10,
        border: isDark ? '1.5px solid var(--term-border)' : '1.5px solid #a7f3d0',
        background: isDark ? 'var(--term-bg-panel)' : '#ffffff',
        boxShadow: isDark
          ? '0 12px 36px rgba(0, 0, 0, 0.6), var(--term-glow)'
          : '0 12px 36px rgba(16, 185, 129, 0.08)',
        overflow: 'hidden',
        position: 'relative',
        margin: '0px auto',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--term-font, monospace)',
        ...style,
      }}
    >
      {/* Upper Terminal Banner */}
      <div
        style={{
          position: 'relative',
          padding: '24px 30px',
          background: isDark
            ? 'linear-gradient(135deg, #07190d 0%, #0d2816 50%, #04140a 100%)'
            : 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 45%, #34d399 100%)',
          borderBottom: isDark
            ? '1px solid var(--term-border)'
            : '1px solid rgba(16, 185, 129, 0.25)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Cyber / Circuit decorative lines */}
        <svg
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            height: '100%',
            width: '45%',
            opacity: isDark ? 0.35 : 0.28,
            pointerEvents: 'none',
          }}
          viewBox="0 0 450 120"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M 50 20 L 150 20 L 180 50 L 320 50 L 350 80 L 450 80"
            stroke={isDark ? 'var(--term-green)' : '#047857'}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 120 75 L 210 75 L 240 105 L 390 105"
            stroke={isDark ? 'var(--term-green)' : '#047857'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <rect
            x="180"
            y="46"
            width="22"
            height="8"
            rx="2"
            fill={isDark ? 'var(--term-green)' : '#047857'}
          />
          <rect
            x="240"
            y="101"
            width="24"
            height="8"
            rx="2"
            fill={isDark ? 'var(--term-green)' : '#047857'}
          />
          <rect
            x="350"
            y="76"
            width="20"
            height="8"
            rx="2"
            fill={isDark ? 'var(--term-green)' : '#047857'}
          />
        </svg>

        {breadcrumb && (
          <div
            style={{
              marginBottom: 12,
              opacity: 0.85,
              position: 'relative',
              zIndex: 2,
              color: isDark ? 'var(--term-text-muted)' : '#064e3b',
            }}
          >
            {breadcrumb}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {/* Left: Icon + Title & Subtitle Alignment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
            {renderedIcon && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: 10,
                  background: isDark ? 'rgba(57, 255, 106, 0.08)' : 'rgba(255, 255, 255, 0.35)',
                  border: isDark
                    ? '1px solid var(--term-border)'
                    : '1px solid rgba(6, 95, 70, 0.15)',
                  color: isDark ? 'var(--term-green)' : '#047857',
                  fontSize: 22,
                  backdropFilter: 'blur(4px)',
                }}
              >
                {renderedIcon}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {title && (
                <h1
                  style={{
                    margin: 0,
                    fontSize: 22,
                    lineHeight: 1.2,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    color: isDark ? 'var(--term-green)' : '#065f46',
                    textTransform: 'uppercase',
                  }}
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 13,
                    lineHeight: 1.3,
                    color: isDark ? 'var(--term-text)' : '#064e3b',
                    letterSpacing: 0.5,
                    fontWeight: 500,
                    opacity: 0.9,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: Extra Content & Back Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
            {extra && <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{extra}</div>}

            {isBackVisible && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: isDark
                    ? '1px solid var(--term-border)'
                    : '1px solid rgba(6, 95, 70, 0.25)',
                  background: isDark
                    ? isHovered
                      ? 'rgba(57, 255, 106, 0.16)'
                      : 'rgba(57, 255, 106, 0.06)'
                    : isHovered
                      ? 'rgba(255, 255, 255, 0.45)'
                      : 'rgba(255, 255, 255, 0.25)',
                  color: isDark ? 'var(--term-green)' : '#064e3b',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isHovered ? 'translateX(-2px)' : 'translateX(0)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Page Content Area */}
      <div
        style={{
          flex: 1,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          background: isDark ? 'var(--term-bg-panel)' : '#ffffff',
          color: 'var(--color-text)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default PageHeader
