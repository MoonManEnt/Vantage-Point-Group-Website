import type { Metadata } from 'next'
import { EventsGrid } from '@/components/events/EventsGrid'
import { GhlFormPlaceholder } from '@/components/events/GhlFormPlaceholder'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Monthly Power Hours, the annual VPG Summit, and the IPA Partner Summit. Operator-only. Results-first.',
}

export default function EventsPage() {
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
              color: 'var(--color-violet)',
              marginBottom: '16px',
            }}
          >
            Events
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
            Where the Body Gathers
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
            Monthly Power Hours, the annual VPG Summit, and the IPA Partner Summit.
            Operator-only. Results-first.
          </p>
        </div>
      </section>

      <section id="power-hour" style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--color-violet)',
                color: '#fff',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '3px 10px',
                borderRadius: '3px',
                marginBottom: '16px',
              }}
            >
              Monthly
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-clash)',
                fontWeight: 700,
                fontSize: '28px',
                color: 'var(--color-parchment)',
                marginBottom: '8px',
              }}
            >
              VPG Power Hour
            </h2>

            <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.45)', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Virtual · First Thursday of Every Month
            </p>

            <p
              style={{
                fontSize: '14px',
                color: 'rgba(245,240,232,0.65)',
                lineHeight: 1.7,
                marginBottom: '24px',
                maxWidth: '460px',
              }}
            >
              One hour. One ARM in focus. Operators, partners, and VPG principals on the same
              call. No slides — just execution.
            </p>

            <Button tier="entity" entityColor="#5B3FA8" href="#power-hour">
              Register Below →
            </Button>
          </div>

          <GhlFormPlaceholder label="Reserve Your Spot" />
        </div>
      </section>

      <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-orange)',
              marginBottom: '32px',
            }}
          >
            Annual Events
          </p>
          <EventsGrid />
        </div>
      </section>

      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'rgba(245,240,232,0.5)', marginBottom: '20px' }}>
            Not sure which ARM to focus on?
          </p>
          <Button tier="primary" href="/quiz">
            Take the ARM Quiz →
          </Button>
        </div>
      </section>
    </>
  )
}
