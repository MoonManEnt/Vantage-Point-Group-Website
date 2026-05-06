import Link from 'next/link'
import type { Arm } from '@/lib/arm-data'

interface ArmIndexGridProps {
  arms: Arm[]
}

export function ArmIndexGrid({ arms }: ArmIndexGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
        gap: '16px',
      }}
    >
      {arms.map((arm) => (
        <div
          key={arm.id}
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            overflow: 'hidden',
            transition: 'border-color 200ms',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.2)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        >
          <div style={{ width: '3px', background: arm.color, flexShrink: 0 }} />

          <div style={{ padding: '24px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: arm.color,
                }}
              >
                ARM {arm.id.toString().padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: arm.color,
                  opacity: 0.7,
                }}
              >
                {arm.entity}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-clash)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--color-parchment)',
                marginBottom: '4px',
              }}
            >
              {arm.name}
            </h2>

            <p
              style={{
                fontSize: '12px',
                color: 'rgba(245,240,232,0.5)',
                marginBottom: '12px',
              }}
            >
              {arm.descriptor}
            </p>

            <p
              style={{
                fontSize: '13px',
                color: 'rgba(245,240,232,0.65)',
                lineHeight: 1.6,
                marginBottom: '16px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {arm.resultDescription}
            </p>

            <Link
              href={`/arms/${arm.slug}`}
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: arm.color,
                textDecoration: 'none',
              }}
            >
              Explore {arm.entity} →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
