import type { Metadata } from 'next'
import { KrakenDoctrine } from '@/components/about/KrakenDoctrine'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'The Kraken Method',
  description:
    'The proprietary operating philosophy behind every VPG engagement. Six principles. Seven decision filters. One organism.',
}

export default function KrakenMethodPage() {
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
            The Operating System
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
            The Kraken Method
          </h1>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 300,
              color: 'rgba(245,240,232,0.55)',
              maxWidth: '560px',
              lineHeight: 1.6,
            }}
          >
            The proprietary operating philosophy behind every VPG engagement. Six principles. Seven
            decision filters. One organism.
          </p>
        </div>
      </section>

      <KrakenDoctrine />

      <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: 'rgba(245,240,232,0.6)', marginBottom: '24px' }}>
            Find your ARM entry point.
          </p>
          <Button tier="primary" href="/quiz">
            Take the ARM Quiz →
          </Button>
        </div>
      </section>
    </>
  )
}
