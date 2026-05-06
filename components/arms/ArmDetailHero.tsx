import type { Arm } from '@/lib/arm-data'

interface ArmDetailHeroProps {
  arm: Arm
}

export function ArmDetailHero({ arm }: ArmDetailHeroProps) {
  return (
    <section style={{ background: 'var(--bg-base)', paddingBottom: '80px' }}>
      <div style={{ height: '4px', background: arm.color, width: '100%' }} />

      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '80px 24px 0' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: `${arm.color}26`,
            border: `1px solid ${arm.color}4D`,
            borderRadius: '4px',
            padding: '4px 10px',
            marginBottom: '24px',
          }}
        >
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
        </div>

        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: arm.color,
            marginBottom: '12px',
          }}
        >
          {arm.entity}
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-clash)',
            fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 52px)',
            color: 'var(--color-parchment)',
            marginBottom: '12px',
          }}
        >
          {arm.name}
        </h1>

        <p style={{ fontSize: '14px', color: 'rgba(245,240,232,0.55)', fontWeight: 300 }}>
          {arm.descriptor}
        </p>
      </div>
    </section>
  )
}
