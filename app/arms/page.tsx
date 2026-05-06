import type { Metadata } from 'next'
import { ARMS } from '@/lib/arm-data'
import { ArmIndexGrid } from '@/components/arms/ArmIndexGrid'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'The Portfolio — 10 ARMs',
  description:
    'All ten Adaptive Reach Movements. Every ARM operates independently. Every ARM feeds the whole.',
}

export default function ArmsIndexPage() {
  return (
    <>
      <section style={{ background: 'var(--bg-base)', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '16px',
            }}
          >
            The Portfolio
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: 'var(--color-parchment)',
              marginBottom: '16px',
            }}
          >
            Ten Arms. One Body.
          </h1>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 300,
              color: 'rgba(245,240,232,0.55)',
              maxWidth: '560px',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            Every ARM operates independently. Every ARM feeds the whole. Find the one that fits
            your next move.
          </p>
          <Button tier="primary" href="/quiz">
            Find Your ARM →
          </Button>
        </div>
      </section>

      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <ArmIndexGrid arms={ARMS} />
        </div>
      </section>

      <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'rgba(245,240,232,0.5)', marginBottom: '20px' }}>
            Not sure which ARM fits?
          </p>
          <Button tier="secondary" href="/quiz">
            Take the ARM Quiz →
          </Button>
        </div>
      </section>
    </>
  )
}
