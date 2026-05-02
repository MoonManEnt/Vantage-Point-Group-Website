import { Button } from '@/components/ui/Button'

const ANNUAL_EVENTS = [
  { name: 'VPG Summit', detail: 'Q4 · Dallas TX' },
  { name: 'IPA Partner Summit', detail: 'Q2 · Dallas TX' },
]

export default function EventsSection() {
  return (
    <section
      id="events"
      aria-label="Events"
      className="py-16 px-6"
      style={{
        background: 'var(--bg-base)',
        borderTop: '1px solid rgba(91,63,168,0.25)',
        borderBottom: '1px solid rgba(91,63,168,0.25)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left — Power Hour */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: '#5B3FA8',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}
          >
            MONTHLY
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--color-parchment)',
              marginBottom: '10px',
            }}
          >
            VPG Power Hour
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(245,240,232,0.5)',
              lineHeight: 1.6,
              marginBottom: '16px',
            }}
          >
            Live monthly Q&A with the VPG team. Bring your business, credit, or partner questions.
          </p>
          <Button
            tier="tertiary"
            href="/events#power-hour"
            style={{ color: '#5B3FA8' }}
          >
            Register →
          </Button>
        </div>

        {/* Right — Annual */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: 'var(--color-orange)',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}
          >
            ANNUAL
          </p>
          <div style={{ marginBottom: '16px' }}>
            {ANNUAL_EVENTS.map((event) => (
              <div
                key={event.name}
                style={{
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-clash)',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'var(--color-parchment)',
                    marginBottom: '2px',
                  }}
                >
                  {event.name}
                </p>
                <p
                  style={{
                    fontSize: '9px',
                    color: 'rgba(245,240,232,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {event.detail}
                </p>
              </div>
            ))}
          </div>
          <Button
            tier="tertiary"
            href="/events"
            style={{ color: 'var(--color-orange)' }}
          >
            View All Events →
          </Button>
        </div>
      </div>
    </section>
  )
}
