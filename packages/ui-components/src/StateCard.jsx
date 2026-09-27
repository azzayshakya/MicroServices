import { Skeleton } from './Skelton/Skeleton'

export const StatCard = ({ icon, label, value, color, loading }) => {
  const accentColor = color || 'var(--color-primary)'

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius, 10px)',
        padding: '14px 16px',
        background: 'var(--color-bg-container)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-sm, 8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          /* color-mix safely handles both Hex (#39ff6a) AND CSS variables (var(--color-primary)) */
          background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
          color: accentColor,
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        {loading ? (
          <Skeleton height={22} width={48} borderRadius={4} style={{ marginTop: 4 }} />
        ) : (
          <div
            style={{
              color: color || 'var(--color-text)',
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.2,
              marginTop: 2,
            }}
          >
            {value ?? '—'}
          </div>
        )}
      </div>
    </div>
  )
}
