import { useEffect } from 'react'

const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
`

let styleInjected = false
function injectShimmerStyle() {
  if (styleInjected) return
  const tag = document.createElement('style')
  tag.textContent = shimmerStyle
  document.head.appendChild(tag)
  styleInjected = true
}

/**
 * <Skeleton />  — base shimmer block (Theme Adaptive)
 *
 * Props:
 *   width        string | number   e.g. "100%", 120         default "100%"
 *   height       string | number   e.g. 14, "1rem"          default 14
 *   borderRadius string | number   e.g. "50%", 8            default 6
 *   style        object            extra inline styles      default {}
 */
export function Skeleton({ width = '100%', height = 14, borderRadius = 6, style = {} }) {
  useEffect(() => {
    injectShimmerStyle()
  }, [])

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background:
          'linear-gradient(90deg, var(--color-bg-hover) 25%, var(--color-border) 50%, var(--color-bg-hover) 75%)',
        backgroundSize: '600px 100%',
        animation: 'shimmer 3s infinite linear',
        ...style,
      }}
    />
  )
}

/**
 * <SkeletonText />  — stacked lines of text placeholder
 *
 * Props:
 *   lines   number   how many lines     default 3
 *   gap     number   gap in px          default 10
 */
export function SkeletonText({ lines = 3, gap = 10 }) {
  const widths = ['85%', '70%', '55%', '90%', '40%']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={12} width={widths[i % widths.length]} />
      ))}
    </div>
  )
}

/**
 * <SkeletonAvatar />  — circle avatar placeholder
 *
 * Props:
 *   size   number   diameter in px   default 44
 */
export function SkeletonAvatar({ size = 44 }) {
  return <Skeleton width={size} height={size} borderRadius="50%" />
}

/**
 * <SkeletonImage />  — rectangular image / thumbnail placeholder
 *
 * Props:
 *   width        string | number   default "100%"
 *   height       string | number   default 180
 *   borderRadius string | number   default 10
 */
export function SkeletonImage({ width = '100%', height = 180, borderRadius = 10 }) {
  return <Skeleton width={width} height={height} borderRadius={borderRadius} />
}

/**
 * <SkeletonCard />  — full post / feed card skeleton
 *
 * Props:
 *   showImage   bool   show image block   default true
 */
export function SkeletonCard({ showImage = true }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '0.5px solid #e5e5e5',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <SkeletonAvatar size={44} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton height={13} width="38%" />
        <Skeleton height={12} width="85%" />
        <Skeleton height={12} width="70%" />
        {showImage && <SkeletonImage height={180} style={{ marginTop: 4 }} />}
        <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
          <Skeleton height={11} width={50} />
          <Skeleton height={11} width={50} />
          <Skeleton height={11} width={50} />
        </div>
      </div>
    </div>
  )
}

/**
 * <SkeletonProfileCard />  — centered profile card placeholder
 */
export function SkeletonProfileCard() {
  return (
    <div
      style={{
        background: '#fff',
        border: '0.5px solid #e5e5e5',
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        maxWidth: 240,
      }}
    >
      <SkeletonAvatar size={72} />
      <Skeleton height={14} width="60%" />
      <Skeleton height={12} width="80%" />
      <Skeleton height={12} width="50%" />
      <Skeleton height={34} width="100%" borderRadius={8} style={{ marginTop: 4 }} />
    </div>
  )
}

/**
 * <SkeletonVideoCard />  — YouTube-style video thumbnail + info
 */
export function SkeletonVideoCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <SkeletonImage height={100} />
      <div style={{ display: 'flex', gap: 10 }}>
        <SkeletonAvatar size={32} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, paddingTop: 2 }}>
          <Skeleton height={12} width="90%" />
          <Skeleton height={11} width="65%" />
          <Skeleton height={11} width="45%" />
        </div>
      </div>
    </div>
  )
}

/**
 * <SkeletonImageGrid />  — IG-style square image grid
 *
 * Props:
 *   count   number   number of cells   default 6
 *   cols    number   columns           default 3
 */
export function SkeletonImageGrid({ count = 6, cols = 3 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 8,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 10 }}>
          <Skeleton width="100%" height="100%" borderRadius={10} />
        </div>
      ))}
    </div>
  )
}
