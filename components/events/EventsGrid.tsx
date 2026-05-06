const ANNUAL_EVENTS = [
  {
    name: 'VPG Summit',
    quarter: 'Q4',
    location: 'Dallas, TX',
    color: '#E8541A',
    description:
      'The annual operator summit. Two days of execution strategy, ARM deep-dives, and direct access to the VPG principals.',
  },
  {
    name: 'IPA Partner Summit',
    quarter: 'Q2',
    location: 'Dallas, TX',
    color: '#3B6D11',
    description:
      'The annual gathering for IPA Certified and Premier partners. Certification reviews, commission reviews, and new ARM previews.',
  },
]

export function EventsGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '20px',
      }}
    >
      {ANNUAL_EVENTS.map((event) => (
        <div
          key={event.name}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <div style={{ height: '4px', background: event.color }} />

          <div style={{ padding: '28px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-clash)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--color-parchment)',
                marginBottom: '10px',
              }}
            >
              {event.name}
            </h3>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                padding: '4px 10px',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 700, color: event.color, letterSpacing: '0.1em' }}>
                {event.quarter}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(245,240,232,0.5)' }}>
                · {event.location}
              </span>
            </div>

            <p
              style={{
                fontSize: '13px',
                color: 'rgba(245,240,232,0.6)',
                lineHeight: 1.65,
                marginBottom: '20px',
              }}
            >
              {event.description}
            </p>

            <a
              href="#"
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: event.color,
                textDecoration: 'none',
              }}
            >
              Notify Me →
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
