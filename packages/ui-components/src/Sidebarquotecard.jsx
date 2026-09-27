import { useIsMobile } from '@devStack/utils/useIsMobile'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const DEFAULT_QUOTES = [
  {
    text: 'The quieter you become, the more you are able to hear.',
    tag: 'We do not hack systems, we study them.',
  },
  {
    text: 'The best way to predict the future is to invent it.',
    tag: '— Alan Kay',
  },
  {
    text: 'Security is not a product, but a process.',
    tag: '— Bruce Schneier',
  },
]

const wrapStyle = {
  position: 'relative',
  margin: '36px 14px 16px 14px',
  padding: '42px 14px 14px 14px',
  borderRadius: 'var(--radius, 12px)',
  border: '1px solid var(--color-border, rgba(57, 255, 106, 0.2))',
  backdropFilter: 'blur(12px)',
  boxShadow:
    '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 1px 1px var(--color-border, rgba(57,255,106,0.15))',
  flexShrink: 0,
  minHeight: '160px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  textAlign: 'center',
}

const stickyAvatarWrapper = {
  position: 'absolute',
  top: '-28px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '56px',
  height: '56px',
  borderRadius: '14px',
  padding: '3px',
  background: 'linear-gradient(135deg, var(--color-primary, #39ff6a) 0%, #06120a 100%)',
  boxShadow: '0 0 16px var(--color-glow, rgba(57, 255, 106, 0.35))',
  zIndex: 2,
}

const imageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '11px',
  objectFit: 'cover',
  display: 'block',
  background: '#030905',
}

const quoteContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
}

const quoteTextStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: '11px',
  lineHeight: 1.55,
  color: 'var(--color-text, #d6ffe4)',
  letterSpacing: '0.2px',
  margin: 0,
}

const tagStyle = {
  fontFamily: 'var(--term-font, "JetBrains Mono", monospace)',
  fontSize: '10px',
  lineHeight: 1.4,
  color: 'var(--color-primary, #39ff6a)',
  opacity: 0.85,
  letterSpacing: '0.4px',
  margin: 0,
}

const dotContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '5px',
  marginTop: '12px',
}

const SidebarQuoteCard = ({
  quotes = DEFAULT_QUOTES,
  image = '/images/global/user_profile_2.png',
  intervalMs = 8000,
  collapsed = false,
}) => {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const preference = useSelector((state) => state.preference || {})

  const isMobile = useIsMobile()

  const isCollapsed = collapsed || preference.sidebarCollapsed || isMobile
  const isLight = preference.theme === 'light'

  useEffect(() => {
    if (isCollapsed || quotes.length <= 1) return

    const rotate = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % quotes.length)
        setVisible(true)
      }, 350)
    }, intervalMs)

    return () => clearInterval(rotate)
  }, [isCollapsed, quotes.length, intervalMs])

  if (isCollapsed) return null
  const current = quotes[index]

  // Conditionally apply gradient only when scheme is light
  const dynamicWrapStyle = {
    ...wrapStyle,
    ...(isLight && {
      background: 'linear-gradient(rgb(224 254 234 / 85%) 0%, rgb(125 188 146 / 95%) 100%)',
    }),
  }

  return (
    <div style={dynamicWrapStyle}>
      <div style={stickyAvatarWrapper}>
        <img src={image} alt="Agent Avatar" style={imageStyle} draggable={false} />
      </div>

      <div
        style={{
          ...quoteContentStyle,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(4px)',
        }}
      >
        <p style={quoteTextStyle}>&ldquo;{current.text}&rdquo;</p>
        <p style={tagStyle}>{current.tag}</p>
      </div>

      {quotes.length > 1 && (
        <div style={dotContainerStyle}>
          {quotes.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === index ? '14px' : '4px',
                height: '4px',
                borderRadius: '2px',
                background:
                  i === index ? 'var(--color-primary, #39ff6a)' : 'rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SidebarQuoteCard
