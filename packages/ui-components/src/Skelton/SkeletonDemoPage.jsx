import {
  SkeletonCard,
  SkeletonProfileCard,
  SkeletonVideoCard,
  SkeletonImageGrid,
  SkeletonText,
} from './Skeleton'

export default function SkeletonDemoPage() {
  return (
    <div
      style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px', fontFamily: 'sans-serif' }}
    >
      <section style={{ marginBottom: 40 }}>
        <p style={sectionLabel}>Feed / Posts</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SkeletonCard showImage={true} />
          <SkeletonCard showImage={false} />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <p style={sectionLabel}>Image Grid (Instagram style)</p>
        <SkeletonImageGrid count={6} cols={3} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <p style={sectionLabel}>Profile Card</p>
        <SkeletonProfileCard />
      </section>

      <section style={{ marginBottom: 40 }}>
        <p style={sectionLabel}>Video Cards (YouTube style)</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
          }}
        >
          <SkeletonVideoCard />
          <SkeletonVideoCard />
          <SkeletonVideoCard />
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <p style={sectionLabel}>Article / Text Block</p>
        <SkeletonText lines={4} />
      </section>
    </div>
  )
}

const sectionLabel = {
  fontSize: 13,
  color: '#888',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  fontWeight: 500,
  margin: '0 0 14px',
}
