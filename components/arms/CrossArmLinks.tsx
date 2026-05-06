import Link from 'next/link'
import { ARMS } from '@/lib/arm-data'

interface CrossArmLinksProps {
  currentSlug: string
}

export function CrossArmLinks({ currentSlug }: CrossArmLinksProps) {
  const siblings = ARMS.filter((a) => a.slug !== currentSlug)

  return (
    <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.4)',
            marginBottom: '24px',
          }}
        >
          Explore the Other Arms
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {siblings.map((arm) => (
            <Link
              key={arm.id}
              href={`/arms/${arm.slug}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: arm.color,
                  flexShrink: 0,
                  marginTop: '5px',
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-parchment)',
                    marginBottom: '2px',
                  }}
                >
                  {arm.name}
                </p>
                <p style={{ fontSize: '10px', color: 'rgba(245,240,232,0.4)' }}>
                  {arm.descriptor}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
